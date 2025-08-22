import {User} from '../../domain/user';
import {UserDto} from '../dto/user-dto';

export function toUserDto(user: User): UserDto {
    return {
        id: user.id.value,
        username: user.username,
        role: user.role.toString(),
    };
}
