import { Body, Controller, Post, Req, Res, ValidationPipe } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthSessionStore } from './auth-session.store';
import { AUTH_SESSION_COOKIE } from './auth.constants';
import { AuthLoginDto, AuthRegisterDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly authSessionStore: AuthSessionStore,
    ) {}

    @Post('register')
    register(@Body(new ValidationPipe({ transform: true })) authRegisterDto: AuthRegisterDto) {
        return this.authService.register(authRegisterDto);
    }

    @Post('login')
    async login(
        @Body(new ValidationPipe({ transform: true })) authLoginDto: AuthLoginDto,
        @Req() request: Request,
    ) {
        const user = await this.authService.login(authLoginDto);

        await new Promise<void>((resolve, reject) => {
            request.session.regenerate((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });

        request.session.userId = user.uuid;

        await new Promise<void>((resolve, reject) => {
            request.session.save((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });

        return user;
    }

    @Post('logout')
    async logout(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ): Promise<{ loggedOut: true }> {
        await new Promise<void>((resolve, reject) => {
            request.session.destroy((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });

        response.clearCookie(AUTH_SESSION_COOKIE, { path: '/' });
        return { loggedOut: true };
    }
}
