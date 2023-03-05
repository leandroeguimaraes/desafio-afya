import { HttpException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from './http-exception.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
  });

  it('should handle HttpException', () => {
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const host = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => response,
        getRequest: () => ({
          url: null,
        }),
      }),
    };
    const exception = new HttpException(
      {
        message: 'Error message',
        error: 'Error',
      },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, host as any);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({
      timestamp: expect.any(String),
      path: null,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Error message',
      error: 'Error',
    });
  });

  it('should handle unknown exception', () => {
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const host = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => response,
        getRequest: () => ({ url: null }),
      }),
    };
    const exception = new Error('Unknown error');

    filter.catch(exception, host as any);

    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });
});
