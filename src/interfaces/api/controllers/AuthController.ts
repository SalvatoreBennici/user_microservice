import {type Request, type Response} from 'express';

import {AuthService} from "../../../domain/ports/AuthService";
import {AccessTokenMapper} from "../../../presentation/AccessTokenMapper";

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    async login(request: Request, res: Response): Promise<void> {
        try {
            const {username} = request.body;
            const {password} = request.body;

            if (!username) {
                res.status(400).json({error: 'Username is required'});
                return;
            }

            if (!password) {
                res.status(400).json({error: 'Password is required'});
                return;
            }

            const token = await this.authService.login(username, password);

            res.status(200).json(AccessTokenMapper.toDTO(token));

        } catch {
            res.status(400).json({error: 'Invalid request'});
        }
    }

    async logout(request: Request, res: Response): Promise<void> {
        const authHeader = request.headers.authorization;
        const token = authHeader?.split(' ')[1]; // Extract token from "Bearer <token>"

        if (!token) {
            res.status(400).json({
                error: 'Token is required'
            });
            return;
        }

        await this.authService.logout(token);

        res.status(200).json({
            message: 'Logout successful'
        });
    }

    async refresh(request: Request, res: Response): Promise<void> {
        try {
            const { refreshToken } = request.body;

            console.log(refreshToken)


            if (!refreshToken) {
                res.status(400).json({ error: "Refresh token is required" });
                return;
            }

            const token = await this.authService.refresh(refreshToken);

            res.status(200).json(AccessTokenMapper.toDTO(token));
        }
        catch (error) {
            res.status(400).json({error});
        }

    }

    async whoami(request: Request, res: Response): Promise<void> {
        const user = (request as any).user

        if (!user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }

        res.status(200).json({
            message: 'hello',
            user: {
                id: user.id.value,
                username: user.username,
                role: user.role
            }
        });

    }

}