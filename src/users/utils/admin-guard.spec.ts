import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AdminGuard } from './admin-guard';
import { UsersService } from '../users.service';
import { USER_ROLE } from '../constants';

describe('AdminGuard', () => {
    const usersService = { findById: jest.fn() };
    let guard: AdminGuard;

    function context(userId?: string): ExecutionContext {
        return {
            switchToHttp: () => ({
                getRequest: () => ({ session: { userId } }),
            }),
        } as ExecutionContext;
    }

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [AdminGuard, { provide: UsersService, useValue: usersService }],
        }).compile();
        guard = module.get(AdminGuard);
    });

    beforeEach(() => {
        usersService.findById.mockReset();
    });

    it('rejects requests without a logged-in user', async () => {
        await expect(guard.canActivate(context())).rejects.toThrow(UnauthorizedException);
        expect(usersService.findById).not.toHaveBeenCalled();
    });

    it('rejects sessions whose user no longer exists', async () => {
        usersService.findById.mockResolvedValue(null);
        await expect(guard.canActivate(context('removed'))).rejects.toThrow(UnauthorizedException);
    });

    it('denies regular users', async () => {
        usersService.findById.mockResolvedValue({ role: USER_ROLE.REGULAR });
        await expect(guard.canActivate(context('regular-id'))).rejects.toThrow(ForbiddenException);
        expect(usersService.findById).toHaveBeenCalledWith('regular-id');
    });

    it('allows the current admin role from the database', async () => {
        usersService.findById.mockResolvedValue({ role: USER_ROLE.ADMIN });
        await expect(guard.canActivate(context('admin-id'))).resolves.toBe(true);
        expect(usersService.findById).toHaveBeenCalledWith('admin-id');
    });
});
