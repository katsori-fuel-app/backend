import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthSessionStore } from './auth-session.store';

@Module({
    imports: [UsersModule],
    controllers: [AuthController],
    providers: [AuthService, AuthSessionStore],
})
export class AuthModule {}
