import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserCommand } from './command/user.command';
import { UserDto } from './dto/user.dto';

interface UpdateResult<T> {
}

@Injectable()
export class AppService {
  constructor(@InjectModel('User') private readonly userModel: Model<UserCommand>) {
  }

  public async createUser(user: UserCommand): Promise<UserCommand>{
    const userModel = new this.userModel(user);
    return await userModel.save();
  }
  public async findUserById(userId: string): Promise<UserDto>{
    return this.userModel.findById(userId);
  }
  public async updateUserById(id: string,
                              userParams: { is_confirmed: boolean },
                              ): Promise<UserDto> {
    await this.userModel.updateOne({ _id: id }, userParams).exec();
    return  await this.userModel.findById(id).exec();
  }
  public async findUserByEmail(userEmail: { email: string }): Promise<UserDto[]>{
    return this.userModel.find(userEmail).exec();
  }
}
