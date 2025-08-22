import express, {type Request, type Response, type Router} from 'express';
import {type RegisterHouseholdUserPort} from '../../domain/ports/register-household-user-port';
import {type DeleteHouseholdUserPort} from '../../domain/ports/delete-household-user-port';
import {type LoginUserPort} from '../../domain/ports/login-user-port';
import {type LogoutUserPort} from '../../domain/ports/logout-user-port';
import {type ChangePasswordPort} from '../../domain/ports/change-password-port';
import {type ChangeUsernamePort} from '../../domain/ports/change-username-port';
import {type ResetAdminPasswordPort} from '../../domain/ports/reset-admin-password-port';

export class UserController {
	public readonly router: Router;
	// eslint-disable-next-line max-params
	constructor(
		private readonly registrationUseCase: RegisterHouseholdUserPort,
		private readonly deleteHouseholdUserUseCase: DeleteHouseholdUserPort,
		private readonly loginUseCase: LoginUserPort,
		private readonly logoutUseCase: LogoutUserPort,
		private readonly changePasswordUseCase: ChangePasswordPort,
		private readonly changeUsernameUseCase: ChangeUsernamePort,
		private readonly resetPasswordUseCase: ResetAdminPasswordPort,
	) {
		// eslint-disable-next-line new-cap
		this.router = express.Router();
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.post('/register', this.register.bind(this));
		this.router.post('/login', this.login.bind(this));
		this.router.post('/logout', this.logout.bind(this));
		this.router.post('/change-password', this.changePassword.bind(this));
		this.router.post('/change-username', this.changeUsername.bind(this));
		this.router.post('/admin/reset-password', this.resetPassword.bind(this));
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

	private async login(request: Request, response: Response): Promise<Response> {
		try {
			const {username, password} = request.body as Record<string, string>;
			const {token} = await this.loginUseCase.login(username, password);
			return response.status(200).json({token});
		} catch (error: unknown) {
			const error_ = error as Error;
			if (error_.message === 'Invalid credentials') {
				return response.status(401).json({message: 'Invalid credentials'});
			}

			return response.status(500).json({message: 'Internal server error'});
		}
	}

	private async logout(
		request: Request,
		response: Response,
	): Promise<Response> {
		try {
			const {token} = request.body as Record<string, string>;
			await this.logoutUseCase.logout(token);
			return response.status(204).send();
		} catch {
			return response.status(500).json({message: 'Internal server error'});
		}
	}

	private async changePassword(
		request: Request,
		response: Response,
	): Promise<Response> {
		try {
			const {username, oldPassword, newPassword} = request.body as Record<
				string,
				string
			>;
			await this.changePasswordUseCase.changePassword(
				username,
				oldPassword,
				newPassword,
			);
			return response.status(204).send();
		} catch (error: unknown) {
			const error_ = error as Error;
			if (error_.message === 'User not found') {
				return response.status(404).json({message: error_.message});
			}

			if (error_.message === 'Invalid credentials') {
				return response.status(401).json({message: error_.message});
			}

			return response.status(500).json({message: 'Internal server error'});
		}
	}

	private async changeUsername(
		request: Request,
		response: Response,
	): Promise<Response> {
		try {
			const {currentUsername, newUsername} = request.body as Record<
				string,
				string
			>;
			await this.changeUsernameUseCase.changeUsername(
				currentUsername,
				newUsername,
			);
			return response.status(204).send();
		} catch (error: unknown) {
			const error_ = error as Error;
			if (error_.message === 'User not found') {
				return response.status(404).json({message: error_.message});
			}

			if (error_.message === 'Username is already taken.') {
				return response.status(409).json({message: error_.message});
			}

			return response.status(500).json({message: 'Internal server error'});
		}
	}

	private async resetPassword(
		request: Request,
		response: Response,
	): Promise<Response> {
		try {
			const {username, newPassword} = request.body as Record<string, string>;
			await this.resetPasswordUseCase.resetPassword(username, newPassword);
			return response.status(204).send();
		} catch (error: unknown) {
			const error_ = error as Error;
			if (error_.message === 'User not found') {
				return response.status(404).json({message: error_.message});
			}

			return response.status(500).json({message: 'Internal server error'});
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
