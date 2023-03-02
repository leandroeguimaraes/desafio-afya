import {
    Catch,
    ExceptionFilter,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const resp =
            exception instanceof HttpException ? exception.getResponse() : exception;

        this.logger.error(
            `Http Status: ${status} Error Message: ${JSON.stringify(resp)} `,
        );
        response.status(status).json({
            timestamp: new Date().toISOString(),
            path: request.url,
            statusCode: status ? status : 500,
            message: resp['message'] ? resp['message'] : 'Erro Interno',
            error: resp['error'] ? resp['error'] : 'Erro interno',
            details: status == 500 ? resp : undefined,
        });
    }
}