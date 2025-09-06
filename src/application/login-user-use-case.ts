import { type LoginUserPort } from "../domain/ports/login-user-port";
import { type UserRepository } from "../domain/ports/out_/user-repository";
import { type PasswordHasher } from "../domain/ports/out_/password-hasher";
import { type TokenService } from "../domain/ports/out_/token-service";
import { InvalidCredentialsError } from "../domain/errors/errors";

export class LoginUserUseCase implements LoginUserPort {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async login(username: string, password: string): Promise<{ token: string }> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValid = await this.passwordHasher.compare(
      password,
      user.passwordHash,
    );
    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    const token = await this.tokenService.issueToken({
      userId: user.id.value,
      role: user.role,
    });
    return { token };
  }
}
