import {type Request, type Response} from 'express';
import {type UserService} from '../../../domain/ports/UserService';
import {UserMapper} from '../../../presentation/UserMapper';
import {UserID} from '../../../domain/UserID';

export class UserController {
	constructor(private readonly userService: UserService) {}

	async createUser(request: Request, res: Response): Promise<void> {
		try {
			const {username, password} = request.body;

			if (!username || !password) {
				res.status(400).json({error: 'Username and password are required'});
				return;
			}

			const user = await this.userService.createUser(username, password);

			const userDTO = UserMapper.toDTO(user);

			res.status(201).json(userDTO);
		} catch (error) {
			res.status(401).json({error});
		}
	}

	async getUser(request: Request, res: Response): Promise<void> {
		try {
			const {id} = request.params;
			const userID = new UserID(id);

			const user = await this.userService.getUser(userID);

			console.log(user);

			if (!user) {
				res.status(404).json({error: 'User not found'});
				return;
			}

			console.log(user.id.value.toString());

			res.json(UserMapper.toDTO(user));
		} catch {
			// Res.status(401).json({'error': error.message});
		}
	}

	async updateUsername(request: Request, res: Response): Promise<void> {
		try {
			const {id} = request.params;
			const {username} = request.body;

			if (!username) {
				res.status(400).json({error: 'Username is required'});
				return;
			}

			const userID = new UserID(id);
			const updatedUser = await this.userService.updateUsername(
				userID,
				username,
			);
			const userDTO = UserMapper.toDTO(updatedUser);

			res.json(userDTO);
		} catch {}
	}

	async updatePassword(request: Request, res: Response): Promise<void> {
		try {
			const {id} = request.params;
			const {password} = request.body;

			if (!password) {
				res.status(400).json({error: 'Password is required'});
				return;
			}

			const userID = new UserID(id);
			await this.userService.updatePassword(userID, password);

			res.status(204).send();
		} catch {}
	}

	async deleteUser(request: Request, res: Response): Promise<void> {
		try {
			const {id} = request.params;
			const userID = new UserID(id);

			// await this.userService.deleteUser(userID);
			res.status(206).send({
                'response': 'User deleted'
            });
		} catch {}
	}
}
