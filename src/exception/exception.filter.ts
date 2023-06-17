import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus, ExceptionFilter, Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';



@Catch()
export class ExceptionFilterImpl implements ExceptionFilter{
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: any, host: ArgumentsHost): any {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const logger = new Logger();
    logger.error(exception['message']);
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    httpAdapter.reply(ctx.getResponse(), exception['response'], httpStatus);
  }
}