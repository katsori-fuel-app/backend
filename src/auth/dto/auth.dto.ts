import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthRegisterDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    password!: string;
}

export class AuthLoginDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;
}
