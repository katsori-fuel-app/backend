import type { UserRole } from '../type';

export class UserDto {
    uuid: string;
    email: string;
    role: UserRole;
    login?: string;
    lastName?: string;
    firstName?: string;
    middleName?: string;
    birthDate?: string;
    phone?: string;
}
