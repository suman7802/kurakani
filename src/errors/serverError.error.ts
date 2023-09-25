export class serverError extends Error {
  constructor(message: string, status: number) {
    super(message);
    this.name = 'serverError';
    this.status = status;
    Error.captureStackTrace(this, serverError);
  }
  status: number;
}
