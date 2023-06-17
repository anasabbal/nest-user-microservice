import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';


const configService = new ConfigService();
export class MongoConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: configService.get('MONGO_URI'),
    };
  }
}