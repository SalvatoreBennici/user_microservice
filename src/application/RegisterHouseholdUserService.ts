import {RegisterHouseholdUserPort} from "../domain/ports/RegisterHouseholdUserPort";
import {UserRepository} from "../domain/ports/repositories/UserRepository";
import {PasswordHasher} from "../domain/ports/PasswordHasher";
import {UserFactory} from "../domain/factories/UserFactory";

export class RegisterHouseholdUserService implements RegisterHouseholdUserPort {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordGenerator: PasswordHasher
    ) {}

    async register(username: string, password: string): Promise<void> {
        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser) {
            throw new Error('Username is already taken.');
        }
        const passwordHash = await this.passwordGenerator.hash(password);
        const newUser = UserFactory.createHouseholdUser(username, passwordHash);
        await this.userRepository.save(newUser);
    }
}