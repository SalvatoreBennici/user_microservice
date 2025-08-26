import {InMemoryUserRepository} from '../storage/in-memory-user-repository';
import {BcryptPasswordHasher} from '../storage/bcrypt-password-hasher';
import {JwtTokenService} from '../storage/jwt-token-service';
import {RegisterHouseholdUserUseCase} from '../application/register-household-user-use-case';
import {DeleteHouseholdUserUseCase} from '../application/delete-household-user-use-case';
import {LoginUserUseCase} from '../application/login-user-use-case';
import {ChangePasswordUseCase} from '../application/change-password-use-case';
import {ChangeUsernameUseCase} from '../application/change-username-use-case';
import {ResetAdminPasswordUseCase} from '../application/reset-admin-password-use-case';

export const userRepository = new InMemoryUserRepository();
export const passwordHasher = new BcryptPasswordHasher();
export const tokenService = new JwtTokenService();

export const registerHouseholdUserUseCase = new RegisterHouseholdUserUseCase(
	userRepository,
	passwordHasher,
);

export const deleteHouseholdUserUseCase = new DeleteHouseholdUserUseCase(
	userRepository,
);

export const loginUserUseCase = new LoginUserUseCase(
	userRepository,
	passwordHasher,
	tokenService,
);


export const changePasswordUseCase = new ChangePasswordUseCase(
	userRepository,
	passwordHasher,
);

export const changeUsernameUseCase = new ChangeUsernameUseCase(userRepository);

export const resetAdminPasswordUseCase = new ResetAdminPasswordUseCase(
	userRepository,
	passwordHasher,
);
