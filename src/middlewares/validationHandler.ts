import boom from '@hapi/boom';
import {ObjectSchema} from "joi";
import {Request, Response, NextFunction} from 'express';

export function validationHandler(schema: ObjectSchema, property: 'params' | 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const data = req[property];
    const { error } = schema.validate(data, {abortEarly: false});
    if(error) {
      next(boom.badRequest(error.message));
    }
    next();
  }
}