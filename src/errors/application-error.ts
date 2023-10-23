export class ApplicationError extends Error {
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApplicationError';
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  statusCode: number;
  status: string;
  isOperational: boolean;
}
