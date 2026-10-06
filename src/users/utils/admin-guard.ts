import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from '../users.service';
import { USER_ROLE } from '../constants';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const userId = request.session?.userId;

        if (!userId) {
            throw new UnauthorizedException();
        }

        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new UnauthorizedException();
        }

        if (user.role !== USER_ROLE.ADMIN) {
            throw new ForbiddenException();
        }

        return true;
    }
}
