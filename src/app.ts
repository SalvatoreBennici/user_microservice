import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './SwaggerConfig';

import { InMemoryUserRepository } from './storage/database/InMemoryUserRepository';
import { BcryptPasswordHasher } from './storage/adapters/BcryptPasswordHasher';
import { RegisterHouseholdUserService } from './application/RegisterHouseholdUserService';

import {UserController} from "./interfaces/RESTful/UserController";
import {DeleteHouseholdUserService} from "./application/DeleteHouseholdUserService";

// Composition Root
const userRepository = new InMemoryUserRepository();
const passwordHasher = new BcryptPasswordHasher();
const registrationService = new RegisterHouseholdUserService(userRepository, passwordHasher);
const deleteHouseholdUserService = new DeleteHouseholdUserService(userRepository);

// App Setup
const app = express();
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
const userController = new UserController(registrationService, deleteHouseholdUserService)
app.use('/user', userController.router);

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server on http://localhost:${PORT}`);
    console.log(`API docs on http://localhost:${PORT}/api-docs`);
});
