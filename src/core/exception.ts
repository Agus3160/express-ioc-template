export class Exception extends Error {
  public status: number;
  public errors: string[] | undefined;
  constructor(message: string, status: number = 500, errors?: string[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
