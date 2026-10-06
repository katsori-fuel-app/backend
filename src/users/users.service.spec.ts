import { getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { UserModel } from '../model';
import { USER_ROLE } from './constants';
import { UsersService } from './users.service';

describe('UsersService.findProfileById', () => {
    const userModel = { findByPk: jest.fn() };
    let service: UsersService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [UsersService, { provide: getModelToken(UserModel), useValue: userModel }],
        }).compile();
        service = module.get(UsersService);
    });

    beforeEach(() => {
        userModel.findByPk.mockReset();
    });

    it('returns only public fields and omits missing optional fields from JSON', async () => {
        userModel.findByPk.mockResolvedValue({
            uuid: 'own-id',
            email: 'me@example.com',
            role: USER_ROLE.REGULAR,
            passwordHash: 'private',
            login: null,
            lastName: 'Smith',
            firstName: null,
            middleName: null,
            birthDate: null,
            phone: null,
        });

        const profile = await service.findProfileById('own-id');

        expect(userModel.findByPk).toHaveBeenCalledWith('own-id', {
            attributes: [
                'uuid',
                'email',
                'role',
                'login',
                'lastName',
                'firstName',
                'middleName',
                'birthDate',
                'phone',
            ],
        });
        expect(JSON.parse(JSON.stringify(profile))).toEqual({
            uuid: 'own-id',
            email: 'me@example.com',
            role: 'regular',
            lastName: 'Smith',
        });
    });

    it('returns null if the user has been removed', async () => {
        userModel.findByPk.mockResolvedValue(null);
        await expect(service.findProfileById('deleted-id')).resolves.toBeNull();
    });
});
