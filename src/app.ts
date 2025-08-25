import express, {
	type Express,
	type Request,
	type Response,
	NextFunction,
} from 'express';
import mongoose from 'mongoose';
import {MongooseUserRepository} from './storage/mongo/MongooseUserRepository';
import {UserServiceImpl} from './application/adapter/UserServiceImpl';
import {UserRoutes} from './interfaces/api/routes/UserRoutes';
import {AuthServiceImpl} from "./application/adapter/AuthServiceImpl";
import {JWTService} from "./application/adapter/JWTService";
import {AuthRoutes} from "./interfaces/api/routes/AuthRoutes";

const PORT = process.env.PORT || 3000;
const MONGO_URI =
	process.env.MONGO_URI || 'mongodb://localhost:27017/userservice';

async function startApp(): Promise<void> {
	try {
		console.log('Starting User Service...');

		// Connect to MongoDB
		console.log('Connecting to MongoDB...');
		await mongoose.connect(MONGO_URI);
		console.log('Connected to MongoDB successfully');

		// Wire up dependencies
		const userRepository = new MongooseUserRepository();
		const userService = new UserServiceImpl(userRepository);

        const authService = new AuthServiceImpl(userRepository, new JWTService());

		// Create Express app
		const app: Express = express();

		// Middleware
		app.use(express.json());

		// Health endpoint
		app.get('/health', (request: Request, res: Response) => {
			res.json({
				status: 'OK',
				timestamp: new Date().toISOString(),
				service: 'Hexagonal Architecture User Service',
			});
		});

		// API routes
		app.use('/api/users', UserRoutes(userService, authService));
        app.use('/api/auth', AuthRoutes(authService));

		// Start server
		const server = app.listen(PORT, () => {
			console.log('Server is running!');
			console.log(`Listening on port ${PORT}`);
			console.log(`Health check: http://localhost:${PORT}/health`);
			console.log(`Users API: http://localhost:${PORT}/api/users`);
            console.log(`Users API: http://localhost:${PORT}/api/auth`);
		});

		// Graceful shutdown
		const shutdown = async (signal: string) => {
			console.log(`\nReceived ${signal}. Closing gracefully...`);
			server.close(async () => {
				await mongoose.disconnect();
				console.log('🗄️ Database disconnected');
				process.exit(0);
			});
		};

		process.on('SIGTERM', async () => shutdown('SIGTERM'));
		process.on('SIGINT', async () => shutdown('SIGINT'));
	} catch (error) {
		console.error('Failed to start app:', error);
		process.exit(1);
	}
}

// Start app
startApp();
