import 'dotenv/config'
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import routes from './interfaces/routes/routes';
import mongoose from "mongoose";
import {MongoUserRepository} from "./storage/mongodb-user-repository";

const app = express();
app.use(express.json());

const startServer = async () => {
    try {
        if (!process.env.MONGO_URL) {
            console.error('Failed to start server: MONGO_URL is not defined in the environment.');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB.');
        await MongoUserRepository.initializeAdminUser();

        // Load Swagger documentation and set up routes and server listener
        const swaggerDocument = YAML.load(
            './src/interfaces/restful/openapi.yaml',
        ) as Record<string, unknown>;
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        app.use(routes);

        app.listen(process.env.PORT, () => {
            console.log(`Server on http://localhost:${process.env.PORT}`);
            console.log(`API docs on http://localhost:${process.env.PORT}/api-docs`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
