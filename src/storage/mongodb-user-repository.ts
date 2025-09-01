import mongoose, { Schema, Document, Model } from 'mongoose';
import { UserRepository } from '../domain/ports/out_/user-repository';
import { UserId } from '../domain/user-id';
import { User } from '../domain/user';
import { UserRole } from '../domain/user-role';
import bcrypt from 'bcrypt';

// Interface per il documento MongoDB
interface IUserDocument extends Document {
    _id: string;
    username: string;
    passwordHash: string;
    role: UserRole;
}

// Schema MongoDB
const userSchema = new Schema<IUserDocument>({
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        required: true
    }
}, {
    collection: 'users',
    versionKey: false
});

// Modello MongoDB
const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>('User', userSchema);

export class MongoUserRepository implements UserRepository {

    // Removed constructor logic
    constructor() {}

    // Now an async static method
    public static async initializeAdminUser(): Promise<void> {
        try {
            const existingAdmin = await UserModel.findOne({ username: 'admin' }).exec(); // Corrected with await and .exec()

            if (!existingAdmin) {
                const id = UserId.create();
                const hash = bcrypt.hashSync('admin', 10);

                const adminUserDoc = new UserModel({
                    _id: id.value,
                    username: 'admin',
                    passwordHash: hash,
                    role: UserRole.ADMIN
                });

                await adminUserDoc.save(); // Added await
                console.log('Admin user initialized successfully.');
            } else {
                console.log('Admin user already exists.');
            }
        } catch (error) {
            console.error('Error initializing admin user:', error);
        }
    }

    async save(user: User): Promise<void> {
        try {
            await UserModel.findOneAndUpdate(
                {
                    $or: [
                        { _id: user.id.value },
                        { username: user.username }
                    ]
                },
                {
                    _id: user.id.value,
                    username: user.username,
                    passwordHash: user.passwordHash,
                    role: user.role
                },
                {
                    upsert: true,
                    new: true,
                    runValidators: true
                }
            );
        } catch (error) {
            throw new Error(`Failed to save user: ${error}`);
        }
    }

    async delete(id: UserId): Promise<void> {
        try {
            await UserModel.deleteOne({ _id: id.value });
        } catch (error) {
            throw new Error(`Failed to delete user: ${error}`);
        }
    }

    async findById(id: UserId): Promise<User | undefined> {
        try {
            const userDoc = await UserModel.findById(id.value);
            return userDoc ? this.documentToDomainUser(userDoc) : undefined;
        } catch (error) {
            throw new Error(`Failed to find user by id: ${error}`);
        }
    }

    async findByUsername(username: string): Promise<User | undefined> {
        try {
            const userDoc = await UserModel.findOne({ username });
            return userDoc ? this.documentToDomainUser(userDoc) : undefined;
        } catch (error) {
            throw new Error(`Failed to find user by username: ${error}`);
        }
    }

    private documentToDomainUser(userDoc: IUserDocument): User {
        const userId = UserId.from(userDoc._id);
        return new User(
            userId,
            userDoc.username,
            userDoc.passwordHash,
            userDoc.role
        );
    }
}