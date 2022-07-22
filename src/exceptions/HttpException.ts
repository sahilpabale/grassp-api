export class HttpException extends Error {
  public status: number;
  public message: string;
  public data: any;

  constructor(status: number, message: string, data: any) {
    super(message);
    this.data = data;
    this.status = status;
    this.message = message;
  }
}
