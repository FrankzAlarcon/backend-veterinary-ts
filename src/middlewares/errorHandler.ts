import {Response, Request, NextFunction} from 'express';

export function logError(error: any, _req: Request, _res: Response, next: NextFunction): void {
  console.log(error);
  next(error);
}

export function errorHandler(error: any, _req: Request, res: Response, _next: NextFunction): void {
  res.status(500).json({error: error.message, body: ''});
}

export function boomErrorHandler(error: any, _req: Request, res: Response, next: NextFunction):void {
  if(error.isBoom) {
    const { output } = error;
    res.status(output.statusCode).json(output.payload);
  }
  next(error);
}