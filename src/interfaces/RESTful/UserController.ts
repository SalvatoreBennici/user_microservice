import { Request, Response, Router } from 'express';
import { RegisterHouseholdUserPort } from '../../domain/ports/RegisterHouseholdUserPort';
import { DeleteHouseholdUserPort } from '../../domain/ports/DeleteHouseholdUserPort';

export class UserController {
    public readonly router: Router;

    constructor(
        private readonly registrationUseCase: RegisterHouseholdUserPort,
        private readonly deleteHouseholdUserUseCase: DeleteHouseholdUserPort
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        /**
         * @swagger
         * /user/register:
         *   post:
         *     tags:
         *       - Authentication
         *     summary: Register a new user
         *     description: Creates a new user account in the system using a username and password.
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               username:
         *                 type: string
         *                 example: mario.rossi
         *               password:
         *                 type: string
         *                 example: password123
         *     responses:
         *       201:
         *         description: User successfully registered.
         *       500:
         *         description: Internal server error.
         */
        this.router.post('/register', this.register.bind(this));

        /**
         * @swagger
         * /user/test:
         *   get:
         *     tags:
         *       - Testing
         *     summary: Test endpoint
         *     description: Returns a success message to verify that the service is up and running.
         *     responses:
         *       201:
         *         description: Test executed successfully.
         *         content:
         *           text/plain:
         *             schema:
         *               type: string
         *               example: Test successfully
         *       500:
         *         description: Internal server error.
         */
        this.router.get('/test', this.test.bind(this));

        /**
         * @swagger
         * /user/{username}:
         *   delete:
         *     tags:
         *       - Admin
         *     summary: Delete a household user
         *     parameters:
         *       - in: path
         *         name: username
         *         required: true
         *         schema:
         *           type: string
         *         description: Username of the household user to delete
         *     responses:
         *       204:
         *         description: User successfully deleted.
         *       404:
         *         description: User not found.
         *       400:
         *         description: Bad request.
         *       500:
         *         description: Internal server error.
         */
        this.router.delete('/:username', this.deleteHouseholdUser.bind(this));
    }

    private async register(req: Request, res: Response): Promise<Response> {
        try {
            const { username, password } = req.body;
            await this.registrationUseCase.register(username, password);
            return res.status(201).json({ message: 'User registered successfully' });
        } catch (error: any) {
            return res.status(500).json({ message: 'An internal server error occurred.' });
        }
    }

    private async test(req: Request, res: Response): Promise<Response> {
        try {
            return res.status(201).send('Test successfully');
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    private async deleteHouseholdUser(req: Request, res: Response): Promise<Response> {
        try {
            const username = req.params.username;
            await this.deleteHouseholdUserUseCase.delete(username);
            return res.status(204).send();
        } catch (error: any) {
            if (error.message === 'User not found') {
                return res.status(404).json({ message: error.message });
            }
            if (error.message === 'User is not a household user') {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
