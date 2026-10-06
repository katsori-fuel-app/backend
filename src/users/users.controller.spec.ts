import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { GUARDS_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Request } from 'express';
import supertest from 'supertest';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AdminGuard } from './utils';

describe('UsersController', () => {
    const usersService = { findProfileById: jest.fn() };
    let controller: UsersController;
    let app: INestApplication;

    function request(userId?: string): Request {
        return { session: { userId } } as Request;
    }

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                { provide: UsersService, useValue: usersService },
                { provide: AdminGuard, useValue: { canActivate: () => true } },
            ],
        }).compile();
        controller = module.get(UsersController);
        app = module.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        usersService.findProfileById.mockReset();
    });

    it('registers /users/me before the UUID route', () => {
        expect(Reflect.getMetadata(PATH_METADATA, UsersController.prototype.getMe)).toBe('me');
    });

    it('rejects a missing session user', async () => {
        await expect(controller.getMe(request())).rejects.toThrow(UnauthorizedException);
        expect(usersService.findProfileById).not.toHaveBeenCalled();
    });

    it('rejects a session whose user no longer exists', async () => {
        usersService.findProfileById.mockResolvedValue(null);
        await expect(controller.getMe(request('deleted-id'))).rejects.toThrow(
            UnauthorizedException,
        );
    });

    it('returns the profile belonging to the active session', async () => {
        const profile = { uuid: 'own-id', email: 'me@example.com', role: 'regular' };
        usersService.findProfileById.mockResolvedValue(profile);

        await expect(controller.getMe(request('own-id'))).resolves.toEqual(profile);
        expect(usersService.findProfileById).toHaveBeenCalledWith('own-id');
    });

    it('protects /users/all but exposes the UUID route publicly', () => {
        expect(Reflect.getMetadata(PATH_METADATA, UsersController.prototype.getAll)).toBe('all');
        expect(Reflect.getMetadata(GUARDS_METADATA, UsersController.prototype.getAll)).toEqual([
            AdminGuard,
        ]);
        expect(Reflect.getMetadata(PATH_METADATA, UsersController.prototype.getById)).toBe(':uuid');
        expect(
            Reflect.getMetadata(GUARDS_METADATA, UsersController.prototype.getById),
        ).toBeUndefined();
    });

    it('returns the requested user profile without a session', async () => {
        const profile = { uuid: 'other-id', email: 'other@example.com', role: 'regular' };
        usersService.findProfileById.mockResolvedValue(profile);

        await expect(controller.getById('other-id')).resolves.toEqual(profile);
        expect(usersService.findProfileById).toHaveBeenCalledWith('other-id');
    });

    it('returns 404 for an unknown UUID', async () => {
        usersService.findProfileById.mockResolvedValue(null);
        await expect(controller.getById('unknown-id')).rejects.toThrow(NotFoundException);
    });

    it('serves the full profile by UUID over HTTP without a session', async () => {
        const uuid = 'ef4b1432-52bc-4e62-9265-d8b5721508e4';
        const profile = {
            uuid,
            email: 'other@example.com',
            role: 'regular',
            phone: '+12025550123',
        };
        usersService.findProfileById.mockResolvedValue(profile);

        await supertest(app.getHttpServer()).get(`/users/${uuid}`).expect(200, profile);
        expect(usersService.findProfileById).toHaveBeenCalledWith(uuid);
        await supertest(app.getHttpServer()).get('/users/not-a-uuid').expect(400);
        await supertest(app.getHttpServer()).get('/users/me').expect(401);
    });
});
