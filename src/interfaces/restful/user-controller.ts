import {type Request, type Response} from 'express';
import {type LoginUserPort} from '../../domain/ports/login-user-port';
import {type ChangePasswordPort} from '../../domain/ports/change-password-port';
import {type ChangeUsernamePort} from '../../domain/ports/change-username-port';

export class UserController {
	constructor(
		private readonly loginUseCase: LoginUserPort,
		private readonly changePasswordUseCase: ChangePasswordPort,
		private readonly changeUsernameUseCase: ChangeUsernamePort,
	) {}

	async login(request: Request, response: Response): Promise<Response> {
		try {
			const {username, password} = request.body as Record<string, string>;
			const {token} = await this.loginUseCase.login(username, password);
			return response.status(200).json({token});
		} catch (error: unknown) {
			const error_ = error as Error;
			if (error_.message === 'Invalid credentials') {
				return response.status(401).json({message: error_.message});
			}

			return response.status(500).json({message: 'Internal server error'});
		}
	}


	async changePassword(
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

	async changeUsername(
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
}
