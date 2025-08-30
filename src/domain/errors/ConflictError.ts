export class ConflictError extends Error {
    constructor(message: string = 'Conflict') {
        super(message);
    }
}