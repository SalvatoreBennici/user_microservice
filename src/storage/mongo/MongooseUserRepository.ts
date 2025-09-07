import { v4 as uuidv4, validate } from "uuid";
import { type UserRepository } from "../../domain/ports/UserRepository";
import { type User } from "../../domain/User";
import { UserID } from "../../domain/UserID";
import { UserModel } from "./mongoose/UserSchema";
import { type UserDocument } from "./mongoose/UserDocument";
import { UserRole } from "../../domain/UserRole";
import { ConflictError } from "../../domain/errors/ConflictError";
import { NotFoundError } from "../../domain/errors/NotFoundError";
import { MongoError } from "mongodb";

export class MongooseUserRepository implements UserRepository {
  async getHouseholdUsers(): Promise<User[]> {
    const userDocuments = await UserModel.find({ role: UserRole.HOUSEHOLD })
      .lean()
      .exec();
    return userDocuments.map((userDoc) =>
      this.mapUserDocumentToDomain(userDoc),
    );
  }

  async findUserByUsername(username: string): Promise<User | null> {
    try {
      const userDocument = await UserModel.findOne({ username }).exec();
      return userDocument ? this.mapUserDocumentToDomain(userDocument) : null;
    } catch {
      return null;
    }
  }

  async addNewHouseholdUser(user: User): Promise<User> {
    const id = uuidv4();

    // if (user.role != UserRole.HOUSEHOLD) {
    //     throw new ForbiddenError('Cannot create user')
    // }

    const userDocument = new UserModel({
      _id: id,
      username: user.username,
      password: user.password,
      role: user.role,
    });

    try {
      return this.mapUserDocumentToDomain(await userDocument.save());
    } catch (error) {
      if ((error as MongoError).code === 11000) {
        throw new ConflictError(
          "Username " + user.username + " already exists",
        );
      }
      throw error;
    }
  }

  async findUserById(id: UserID): Promise<User | null> {
    this.validateUserID(id.value);

    const userDocument = await UserModel.findById(id.value).lean().exec();

    if (!userDocument) {
      return null;
    }

    return this.mapUserDocumentToDomain(userDocument);
  }

  async updateUser(user: User): Promise<User> {
    this.validateUserID(user.id.value);

    const updatedDocument = await UserModel.findByIdAndUpdate(
      user.id.value,
      {
        username: user.username,
        password: user.password,
      },
      { new: true, runValidators: true },
    ).exec();

    if (!updatedDocument) {
      throw new NotFoundError("User not found for update");
    }

    return this.mapUserDocumentToDomain(updatedDocument);
  }

  async removeUser(user: User): Promise<void> {
    this.validateUserID(user.id.value);

    const result = await UserModel.findByIdAndDelete(user.id.value).exec();
    if (!result) {
      throw new NotFoundError("User not found for deletion");
    }
  }

  private mapUserDocumentToDomain(document: UserDocument): User {
    return {
      id: new UserID(document._id),
      username: document.username,
      password: document.password,
      role: document.role,
    };
  }

  private validateUserID(value: string) {
    if (!validate(value)) {
      throw new Error(`Invalid user ID format: ${value}`);
    }
  }
}
