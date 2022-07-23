import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import boom from '@hapi/boom';

const prisma = new PrismaClient();

declare module "express" {
  export interface Request {
    user?: {id: number, name: string, email: string}
  }
}

export async function checkAuthHandler(req: Request, _res: Response, next: NextFunction) {
  try {
    const {authorization} = req.headers;
    if (authorization && authorization.startsWith('Bearer')) {
      const token = authorization.split(' ')[1];
      const decoded:any = jwt.verify(token, process.env.JWT_AUTH_SECRET ?? 'mysupersecretkey');
      if(!decoded) {
        throw boom.unauthorized('Token no valido')
      }
      const user = await prisma.veterinarian.findUnique({
        where: {id: decoded.id},
        select: {
          id:true, name: true, email: true
        }
      });
      if(!user) {
        throw boom.unauthorized('Token no valido')
      }
      req.user = user;
      next();
    }
  } catch (error) {
    next(error);
  }
}

export async function checkVeterinarianToDelete(req: Request, _res: Response, next: NextFunction) {
  const {id} = req.params;  
  const appoinment = await prisma.appointment.findUnique({where: {id: Number(id)}});
  if (!appoinment) {
    next(boom.badRequest('No existe la cita ingresada'));
  } else {
    const veterinarianId = req.user?.id;
    if(appoinment.veterinarianId === veterinarianId) {
      next()
    } else {
      next(boom.forbidden('Solo puedes acceder o modificar datos tu usuario'));
    }
  }
}

export function checkGetOneAppointment(veterinarianId: number, req: Request) {
  if(veterinarianId === req.user?.id) {
    return true;
  }
  return false;
}