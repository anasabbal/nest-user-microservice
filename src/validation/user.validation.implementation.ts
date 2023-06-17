import { AppService } from '../app.service';
import { UserCommand } from '../command/user.command';
import { Injectable } from '@nestjs/common';
import { UserValidation } from './user-validation.interface';



@Injectable()
export class UserValidationImplementation implements UserValidation{
  private appService: AppService;

  constructor(appService: AppService) {
    this.appService = appService;
  }

  async validate(userParams: UserCommand): Promise<boolean> {
    if (!userParams) {
      throw new Error('Invalid user parameters');
    }
    const usersWithEmail = await this.appService.findUserByEmail({
      email: userParams.email,
    });

    if (usersWithEmail && usersWithEmail.length > 0) {
      throw new Error('Email already exists');
    }

    return true;
  }
}