import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((res) => this.responseHandler(res, context)),
      catchError((err) => throwError(() => this.errorHandler(err, context))),
    );
  }

  errorHandler(exception: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorMessage =
      exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error';

    response.status(status).json({
      executedSuccessfully: false,
      statusCode: status,
      error: errorMessage,
      data: null,
    });
    this.logger.error(errorMessage);
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    const statusCode = response.statusCode;

    const responseData = {
      executedSuccessfully: true,
      statusCode,
      data: res,
      error: null,
    };
    return responseData;
  }
}
