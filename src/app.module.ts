import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfigService } from './config/mongo-config';
import { UserSchema } from './schema/user.schema';
import { UserValidationImplementation } from './validation/user.validation.implementation';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
        collection: 'users',
      }
    ])
  ],
  controllers: [AppController],
  providers: [AppService, UserValidationImplementation],
})
export class AppModule {}