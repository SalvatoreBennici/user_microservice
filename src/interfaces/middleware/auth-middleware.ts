import {type NextFunction, type Request, type Response} from 'express';
import {type TokenPayload} from "../../domain/ports/out_/token-service";
import {JwtTokenService} from "../../storage/jwt-token-service";
import {UserRole} from "../../domain/user-role";

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

const tokenService = new JwtTokenService();

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Access token is required' });
    }

    try {
        req.user = await tokenService.verifyToken(token);
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
    }
};


export const authorizeRole = (...requiredRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.role || requiredRoles.length === 0) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }

        if (!requiredRoles.includes(req.user.role as UserRole)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }

        next();
    };
};