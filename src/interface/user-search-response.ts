import { UserDto } from '../dto/user.dto';

export interface IUserSearchResponse {
  status: number;
  message: string;
  user: UserDto | null;
}