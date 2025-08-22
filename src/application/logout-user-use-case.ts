import {type LogoutUserPort} from '../domain/ports/logout-user-port';
import {type TokenService} from '../domain/ports/out_/token-service';

export class LogoutUserUseCase implements LogoutUserPort {
	constructor(private readonly tokenService: TokenService) {}

	async logout(token: string): Promise<void> {
		await this.tokenService.revokeToken(token);
	}
}
