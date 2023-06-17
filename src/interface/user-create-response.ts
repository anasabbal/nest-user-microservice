import { UserDto } from '../dto/user.dto';

export interface IUserCreateResponse {
  status: number;
  message: string;
  user: UserDto | null;
  errors: { [key: string]: any } | null;
}