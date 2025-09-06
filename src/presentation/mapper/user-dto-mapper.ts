import { type User } from "../../domain/user";
import { type UserDto } from "../dto/user-dto";

export function toUserDto(user: User): UserDto {
  return {
    id: user.id.value,
    username: user.username,
    role: user.role.toString(),
  };
}
