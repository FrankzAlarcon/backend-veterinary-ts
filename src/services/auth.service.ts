import { PrismaClient } from "@prisma/client";
import EmailService from "../libs/Emails";
import boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import { CreateVeterinarian } from "../types/veterinarian";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const emailService = new EmailService();

class AuthService {
  async register(data: CreateVeterinarian): Promise<string> {
    const {name,email, password}= data;
    const user = await prisma.veterinarian.findUnique({where: { email }});
    if(user) {
      throw boom.badRequest('Usuario ya registrado')
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({email}, process.env.JWT_EMAIL_SECRET ?? 'mysupersecretkey', {expiresIn: '15m'})
    await prisma.veterinarian.create({data: {
      ...data,
      password: encryptedPassword,
      token
    }})
    // Enviar correo para verificar cuenta
    await emailService.verifyAccount({
      name, email, token
    });
    return 'Usuario creado correctamente. Revisa tu email para verificar tu cuenta';
  }

  async confirmAccount(token:string): Promise<void> {
    const isTokenVerified = jwt.verify(token, process.env.JWT_EMAIL_SECRET ?? 'mysupersecretkey');
    if(!isTokenVerified) {
      throw boom.forbidden('Tu token ha expirado, vuelve a solicitar tu confirmacion')
    }
    const user = await prisma.veterinarian.findFirst({where: {token}});
    if(!user) {

    }
  }
}

export default AuthService;