import { AuthService } from "../../domain/ports/AuthService";
import { UserRepository } from "../../domain/ports/UserRepository";
import { Promise } from "mongoose";
import { User } from "../../domain/User";
import { compare as comparePassword } from "bcrypt";
import { TokenService } from "../port/TokenService";
import { AccessToken } from "../../domain/AccessToken";
import { AccessTokenPayload } from "../port/AccessTokenPayload";
import { InvalidCredentials } from "../../domain/errors/InvalidCredentials";

export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}





  async login(username: string, password: string): Promise<AccessToken> {
    const user = await this.userRepository.findUserByUsername(
      username.toLowerCase(),
    );

    console.log("ciao 2 x 2");

    if (!user) {
      throw new InvalidCredentials();
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new InvalidCredentials();
    }

    const userPayload: AccessTokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken =
      await this.tokenService.generateAccessToken(userPayload);
    const refreshToken =
      await this.tokenService.generateRefreshToken(userPayload);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async logout(username: string): Promise<void> {
    const payload = await this.tokenService.verifyToken(username);

    if (!payload) {
      throw new Error("Invalid refresh token");
    }
    const userPayload: AccessTokenPayload = {
      id: payload.id,
      username: payload.username,
      role: payload.role,
    };
    const user = await this.userRepository.findUserByUsername(
      userPayload.username,
    );
    if (!user) {
      throw new Error("User not found");
    }
  }

  async refresh(token: string): Promise<AccessToken> {
    const payload = await this.tokenService.verifyToken(token);

    if (!payload) {
      throw new Error("Invalid refresh token");
    }

    const userPayload: AccessTokenPayload = {
      id: payload.id,
      username: payload.username,
      role: payload.role,
    };

    const accessToken =
      await this.tokenService.generateAccessToken(userPayload);
    const refreshToken =
      await this.tokenService.generateRefreshToken(userPayload);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async verify(token: string): Promise<User | null> {
    const payload = await this.tokenService.verifyToken(token);
    if (!payload) return null;

    const user = await this.userRepository.findUserById(payload.id);
    return user || null;
  }
}
