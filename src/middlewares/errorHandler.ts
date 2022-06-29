import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientRustPanicError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
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

type PrismaError  = PrismaClientInitializationError | PrismaClientKnownRequestError | PrismaClientUnknownRequestError | PrismaClientValidationError | PrismaClientRustPanicError;

export function prismaErrorHandler(error: PrismaError, _req: Request, res: Response, next: NextFunction) {
  if(error instanceof PrismaClientInitializationError) {
    const {name, message} = error;
    res.status(500).json({error: {name, message}, body: ''});
  } else if(error instanceof PrismaClientKnownRequestError) {
    const {meta, message} = error;
    res.status(409).json({error: {message, meta}, body: ''});
  } else if (error instanceof PrismaClientUnknownRequestError) {
    const {message} = error;
    res.status(500).json({error: message, body: ''});
  } else if (error instanceof PrismaClientRustPanicError) {
    const {message} = error;
    res.status(502).json({error: message, body: ''});
  } else if (error instanceof PrismaClientValidationError) {
    const {message} = error;
    res.status(409).json({error: message, body: ''});
  }
  next(error);
}