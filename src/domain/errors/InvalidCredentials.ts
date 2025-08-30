export class InvalidCredentials extends Error {
    constructor(message: string = 'Invalid credentials') {
        super(message);
    }
}