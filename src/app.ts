import express from 'express';
import swaggerUi from 'swagger-ui-express';
import {swaggerSpec} from './swagger-config';
import {InMemoryUserRepository} from './storage/database/in-memory-user-repository';
import {BcryptPasswordHasher} from './storage/adapters/bcrypt-password-hasher';
import {RegisterHouseholdUserService} from './application/register-household-user-service';
import {UserController} from './interfaces/restful/user-controller';
import {DeleteHouseholdUserService} from './application/delete-household-user-service';

// Composition Root
const userRepository = new InMemoryUserRepository();
const passwordHasher = new BcryptPasswordHasher();
const registrationService = new RegisterHouseholdUserService(
	userRepository,
	passwordHasher,
);
const deleteHouseholdUserService = new DeleteHouseholdUserService(
	userRepository,
);

// App Setup
const app = express();
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
const userController = new UserController(
	registrationService,
	deleteHouseholdUserService,
);
app.use('/user', userController.router);

// Start
const port = 3000;
app.listen(port, () => {
	console.log(`Server on http://localhost:${port}`);
	console.log(`API docs on http://localhost:${port}/api-docs`);
});
