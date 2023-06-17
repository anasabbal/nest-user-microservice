import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, TcpOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule, {
      logger: ['error', 'warn', 'log'],
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 8080,
      },
    });
  await app.listen();
}
bootstrap();
