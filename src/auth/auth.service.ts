import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { UniqueConstraintError } from 'sequelize';
import { AuthLoginDto, AuthRegisterDto } from './dto';
import { UsersService } from '../users/users.service';
import { UserProfile } from '../users/type';

const SCRYPT_COST = 32_768;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const PASSWORD_SALT_BYTES = 16;
const PASSWORD_KEY_BYTES = 64;
const SCRYPT_MAX_MEMORY_BYTES = 64 * 1024 * 1024;

function derivePasswordKey(password: string, salt: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        scrypt(
            password,
            salt,
            PASSWORD_KEY_BYTES,
            {
                N: SCRYPT_COST,
                r: SCRYPT_BLOCK_SIZE,
                p: SCRYPT_PARALLELIZATION,
                maxmem: SCRYPT_MAX_MEMORY_BYTES,
            },
            (error, key) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(key);
            },
        );
    });
}

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    async register(authRegisterDto: AuthRegisterDto): Promise<UserProfile> {
        const email = authRegisterDto.email.trim().toLowerCase();
        const existingUser = await this.usersService.findByEmail(email);

        if (existingUser) {
            throw new ConflictException('Email is already registered');
        }

        const passwordHash = await this.hashPassword(authRegisterDto.password);

        try {
            const user = await this.usersService.create({ passwordHash, email });

            return { uuid: user.uuid, email: user.email };
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new ConflictException('Email is already registered');
            }

            throw error;
        }
    }

    async login(authLoginDto: AuthLoginDto): Promise<UserProfile> {
        const email = authLoginDto.email.trim().toLowerCase();
        const user = await this.usersService.findByEmail(email);

        if (!user || !(await this.verifyPassword(authLoginDto.password, user.passwordHash))) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return { uuid: user.uuid, email: user.email };
    }

    // TODO: Implement forgot-password tokens, email delivery, expiry, and single-use validation.
    private async hashPassword(password: string): Promise<string> {
        const salt = randomBytes(PASSWORD_SALT_BYTES).toString('hex');
        const key = await derivePasswordKey(password, salt);

        return [
            'scrypt',
            SCRYPT_COST,
            SCRYPT_BLOCK_SIZE,
            SCRYPT_PARALLELIZATION,
            salt,
            key.toString('hex'),
        ].join('$');
    }

    private async verifyPassword(password: string, storedHash: string): Promise<boolean> {
        const [algorithm, cost, blockSize, parallelization, salt, hash] = storedHash.split('$');

        if (
            algorithm !== 'scrypt' ||
            cost !== String(SCRYPT_COST) ||
            blockSize !== String(SCRYPT_BLOCK_SIZE) ||
            parallelization !== String(SCRYPT_PARALLELIZATION) ||
            !/^[a-f0-9]{32}$/i.test(salt ?? '') ||
            !/^[a-f0-9]{128}$/i.test(hash ?? '')
        ) {
            return false;
        }

        const expectedKey = Buffer.from(hash, 'hex');
        const actualKey = await derivePasswordKey(password, salt);

        return timingSafeEqual(expectedKey, actualKey);
    }
}
