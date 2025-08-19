import {DeleteHouseholdUserPort} from "../domain/ports/DeleteHouseholdUserPort";
import {UserRepository} from "../domain/ports/repositories/UserRepository";
import {UserRole} from "../domain/model/value-objects/UserRole.vo";

export class DeleteHouseholdUserService implements DeleteHouseholdUserPort {
    constructor(private readonly userRepository: UserRepository) {
    }

    async delete(username: string): Promise<void> {

        let user = await this.userRepository.findByUsername(username);

        if (!user) {
            throw new Error("User not found");
        }

        if (user.role !== UserRole.HOUSEHOLD) {
            throw new Error("User is not a household user");
        }

        await this.userRepository.delete(user.id);
    }
}
