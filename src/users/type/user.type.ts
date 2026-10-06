import { USER_ROLE } from '../constants';

export type User = {
    passwordHash: string;
    email: string;
};

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export type UserProfile = {
    uuid: string;
    email: string;
};
