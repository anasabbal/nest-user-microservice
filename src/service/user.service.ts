import { UserCommand } from '../command/user.command';
import { IUserCreateResponse } from '../interface/user-create-response';
import { IUserSearchResponse } from '../interface/user-search-response';

export interface UserService{
  createUser(userParams: UserCommand): Promise<IUserCreateResponse>;
  findUserByCredentials(searchParams: { email: string; password: string; }): Promise<IUserSearchResponse>;
  getUserById(id: string): Promise<IUserSearchResponse>;
}