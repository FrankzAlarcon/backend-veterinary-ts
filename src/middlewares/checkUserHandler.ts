import { Request, Response, NextFunction } from "express";
import boom from '@hapi/boom';

declare module "express" {
  export interface Request {
    user?: {id: number, name: string, email: string}
  }
}

export async function checkUserHandler(req: Request, _res: Response, next: NextFunction) {
  const { id } = req.params;
  if(id) {
    if(req.user?.id === Number(id)) {
      next()
    } else {
      next(boom.forbidden('Solo puedes acceder o modificar datos tu usuario'));
    }
  } else {
    next();
  }
}

export async function checkVeterinarianHandler(req: Request, _res: Response, next: NextFunction) {
  const { veterinarianId } = req.params;
  //if(veterinarianId) {
    if(req.user?.id === Number(veterinarianId)) {
      next()
    } else {
      next(boom.forbidden('Solo puedes acceder o modificar datos tu usuario'));
    }
  //} else {
    //next();
 // }
}

export async function checkVeterinarianInAppointment(req: Request, _res: Response, next: NextFunction) {
  const {veterinarianId} = req.body;
  if(req.user?.id === Number(veterinarianId)) {
    next()
  }else {
    next(boom.forbidden('Solo puedes acceder o modificar datos tu usuario'));
  }
}