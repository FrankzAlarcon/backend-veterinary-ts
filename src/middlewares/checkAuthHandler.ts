import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import boom from '@hapi/boom';

const prisma = new PrismaClient();

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
          name: true, email: true
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