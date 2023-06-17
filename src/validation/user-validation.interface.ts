import { UserCommand } from '../command/user.command';
import { Injectable } from '@nestjs/common';




export interface UserValidation{
  validate(userParams: UserCommand): Promise<boolean>;
}