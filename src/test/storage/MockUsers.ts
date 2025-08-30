import {UserID} from "../../domain/UserID";
import {UserRole} from "../../domain/UserRole";
import {UserFactory} from "../../domain/UserFactory";
import * as bcrypt from "bcrypt";
import {UserServiceImpl} from "../../application/adapter/UserServiceImpl";

export const mockAdminUser = {
    id: new UserID(""),
    username: 'admin',
    password: 'admin',
    role: UserRole.ADMIN
};

export const mockHouseholdUserMarco = new UserFactory().createHouseholdUser('marco', 'password')

export const mockHouseholdUserDavide = new UserFactory().createHouseholdUser('davide', 'password')