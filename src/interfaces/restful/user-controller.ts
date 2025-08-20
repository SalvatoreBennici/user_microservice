import express, {type Request, type Response, type Router} from 'express';
import {type RegisterHouseholdUserPort} from '../../domain/ports/register-household-user-port';
import {type DeleteHouseholdUserPort} from '../../domain/ports/delete-household-user-port';

export class UserController {
	public readonly router: Router;

	constructor(
		private readonly registrationUseCase: RegisterHouseholdUserPort,
		private readonly deleteHouseholdUserUseCase: DeleteHouseholdUserPort,
	) {
		// eslint-disable-next-line new-cap
		this.router = express.Router();
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.post('/register', this.register.bind(this));
		this.router.get('/test', this.test.bind(this));
		this.router.delete('/:username', this.deleteHouseholdUser.bind(this));
	}

	private async register(
		request: Request,
		response: Response,
	): Promise<Response> {
		try {
			const {username, password} = request.body as Record<string, string>;
			await this.registrationUseCase.register(username, password);
			return response
				.status(201)
				.json({message: 'User registered successfully'});
		} catch {
			return response
				.status(500)
				.json({message: 'An internal server error occurred.'});
		}
	}

	private async test(request: Request, response: Response): Promise<Response> {
		try {
			return response.status(201).send('Test successfully');
		} catch (error) {
			console.error(error);
			return response.status(500).json({error: 'Internal server error'});
		}
	}

	private async deleteHouseholdUser(
		request: Request,
		response: Response,
	): Promise<Response> {
		try {
			const {username} = request.params as Record<string, string>;
			await this.deleteHouseholdUserUseCase.delete(username);
			return response.status(204).send();
		} catch (error: unknown) {
			const error_ = error as Error;
			if (error_.message === 'User not found') {
				return response.status(404).json({message: error_.message});
			}

			if (error_.message === 'User is not a household user') {
				return response.status(400).json({message: error_.message});
			}

			return response.status(500).json({message: 'Internal server error'});
		}
	}
}
