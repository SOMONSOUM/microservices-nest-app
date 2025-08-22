import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ZodError } from 'zod';

interface ErrorResponse {
  success: false;
  status: number;
  message: string;
  errors?: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface HttpExceptionResponse {
  message?: string;
  errors?: ValidationError[];
}

@Catch()
export class AllRpcExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllRpcExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const contextType = host.getType();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: ValidationError[] | undefined;

    // 1. Handle RpcException
    if (exception instanceof RpcException) {
      const rpcError = exception.getError();
      if (typeof rpcError === 'object' && rpcError !== null) {
        throw exception; // let Nest handle it
      }
      message = typeof rpcError === 'string' ? rpcError : 'RPC error occurred';
    }

    // 2. Handle Zod validation errors
    else if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation failed';
      errors = exception.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));
    }

    // 3. Handle standard HttpException
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;

      const response = exception.getResponse();
      if (response && typeof response === 'object' && 'errors' in response) {
        const res = response as HttpExceptionResponse;
        message = res.message || message;
        errors = res.errors;
      }
    }

    // 4. Handle NotFoundException
    else if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    // 5. Handle unhandled errors
    else {
      const errorMessage = (exception as Error)?.message;

      if (
        errorMessage?.includes('Connection closed') ||
        errorMessage?.includes('ECONNREFUSED')
      ) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = 'Service temporarily unavailable. Please try again later.';
      } else {
        message = errorMessage || message;
      }

      this.logger.error(
        `Unhandled exception: ${errorMessage}`,
        (exception as Error)?.stack,
      );
    }

    const responseBody: ErrorResponse = {
      success: false,
      status,
      message,
      ...(errors && { errors }),
    };

    // Return response based on context (HTTP or RPC)
    if (contextType === 'http') {
      const ctx = host.switchToHttp();
      ctx.getResponse().status(status).json(responseBody);
    } else if (contextType === 'rpc') {
      return responseBody;
    }

    return responseBody;
  }
}
