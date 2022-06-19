import { Response as ResponseExpress } from "express";

class Response {
  success(res: ResponseExpress, message: any, statusCode = 200): void {
    res.status(statusCode).json({error: '', body: message});
  }
}

export default Response;