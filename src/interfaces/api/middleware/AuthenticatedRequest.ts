import {User} from "../../../domain/User";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user: User
}