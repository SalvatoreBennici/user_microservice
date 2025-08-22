import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import {InMemoryUserRepository} from './storage/in-memory-user-repository';
import {BcryptPasswordHasher} from './storage/bcrypt-password-hasher';
import {RegisterHouseholdUserUseCase} from './application/register-household-user-use-case';
import {UserController} from './interfaces/restful/user-controller';
import {DeleteHouseholdUseCase} from './application/delete-household-use-case';
import {LoginUserUseCase} from './application/login-user-use-case';
import {LogoutUserUseCase} from './application/logout-user-use-case';
import {ChangePasswordUseCase} from './application/change-password-use-case';
import {ChangeUsernameUseCase} from './application/change-username-use-case';
import {ResetAdminPasswordUseCase} from './application/reset-admin-password-use-case';
import {JwtTokenService} from './storage/jwt-token-service';

// Composition Root
const userRepository = new InMemoryUserRepository();
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();

const registrationService = new RegisterHouseholdUserUseCase(
	userRepository,
	passwordHasher,
);
const deleteHouseholdUserService = new DeleteHouseholdUseCase(userRepository);
const loginService = new LoginUserUseCase(
	userRepository,
	passwordHasher,
	tokenService,
);
const logoutService = new LogoutUserUseCase(tokenService);
const changePasswordService = new ChangePasswordUseCase(
	userRepository,
	passwordHasher,
);
const changeUsernameService = new ChangeUsernameUseCase(userRepository);
const resetPasswordService = new ResetAdminPasswordUseCase(
	userRepository,
	passwordHasher,
);

// App Setup
const app = express();
app.use(express.json());

const swaggerDocument = YAML.load(
	'./src/interfaces/restful/openapi.yaml',
) as Record<string, unknown>;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
const userController = new UserController(
	registrationService,
	deleteHouseholdUserService,
	loginService,
	logoutService,
	changePasswordService,
	changeUsernameService,
	resetPasswordService,
);
app.use('/user', userController.router);

// Start
const port = 3000;
app.listen(port, () => {
	console.log(`Server on http://localhost:${port}`);
	console.log(`API docs on http://localhost:${port}/api-docs`);
});
