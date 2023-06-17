import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { IUserSearchResponse } from './interface/user-search-response';
import { UserCommand } from './command/user.command';
import { IUserCreateResponse } from './interface/user-create-response';
import { MessagePattern } from '@nestjs/microservices';
import { UserValidationImplementation } from './validation/user.validation.implementation';
import { UserService } from './service/user.service';


@Controller('user')
export class AppController implements UserService{

  constructor(
    private readonly userValidator: UserValidationImplementation,
    private readonly appService: AppService) {}



  async getUserById(id: string): Promise<IUserSearchResponse> {
    if (!id) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'user_get_by_id_bad_request',
        user: null,
      };
    }

    const user = await this.appService.findUserById(id);

    if (user) {
      return {
        status: HttpStatus.OK,
        message: 'user_get_by_id_success',
        user,
      };
    } else {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'user_get_by_id_not_found',
        user: null,
      };
    }
  }
  async findUserByCredentials(searchParams: { email: string; password: string }): Promise<IUserSearchResponse> {
    if (!searchParams.email || !searchParams.password) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'user_search_by_credentials_not_found',
        user: null,
      };
    }

    const user = await this.appService.findUserByEmail({ email: searchParams.email });

    if (user && user[0] && (await user[0].compareEncryptedPassword(searchParams.password))) {
      return {
        status: HttpStatus.OK,
        message: 'user_search_by_credentials_success',
        user: user[0],
      };
    } else {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'user_search_by_credentials_not_match',
        user: null,
      };
    }
  }
  @MessagePattern('user-create')
  async createUser(userParams: UserCommand): Promise<IUserCreateResponse> {
    await this.userValidator.validate(userParams);

    try {
      userParams.is_confirmed = false;
      const createdUser = await this.appService.createUser(userParams);
      console.log(createdUser.toJSON());
      delete createdUser.password;
      return {
        status: HttpStatus.CREATED,
        message: 'user_create_success',
        user: createdUser,
        errors: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        message: 'user_create_precondition_failed',
        user: null,
        errors: e.errors,
      };
    }
  }
}
