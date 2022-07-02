import { PrismaClient } from "@prisma/client";
import EmailService from "../libs/Emails";
import boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import { CreateVeterinarian, LoginVeterinarian } from "../types/veterinarian";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const emailService = new EmailService();

class AuthService {

  /**
   * Flujo
   * Me registro y creo el usuario en la base de datos asignadole un token, con un flag de usuario no confirmado
   * Envío un email con un link para que confirme su usuario
   * Verifico que el link es correcto verificando el token de la base de datos, 
   *  si es correcto -> isConfirmed = true
   *  no es correcto -> excepcion token no valido
   */
  async register(data: CreateVeterinarian): Promise<string> {
    const {name,email, password}= data;
    const user = await prisma.veterinarian.findUnique({where: { email }});
    if(user) {
      throw boom.badRequest('Ya existe un usuario con ese email')
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({email}, process.env.JWT_EMAIL_SECRET ?? 'mysupersecretkey', {expiresIn: '15m', algorithm: 'HS256'})
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

  async confirmAccount(token:string): Promise<boolean> {
    //* Token ya verificado
    const user = await prisma.veterinarian.findFirst({where: {token}});
    if(!user) {
      throw boom.notFound('Token invalido');
    }
    const data = user.email;
    await prisma.veterinarian.update({where: {email: data}, data: {token: null, isConfirmed: true}});
    return true;
  }

  async resendEmail(email: string, type: 'verify' | 'recovery-password'): Promise<string> {
    const user = await prisma.veterinarian.findUnique({where: {email}});
    if(!user) {
      throw boom.notFound('No existe usuario con el email ingresado');
    }
    const token = jwt.sign({id: user.id}, process.env.JWT_EMAIL_SECRET ?? 'mysupersecretkey', {expiresIn: '15m', algorithm: 'HS256'});
    await prisma.veterinarian.update({where: {email}, data: {token}});
    if(type === 'verify') {
      emailService.verifyAccount({
        name: user.name,
        email: user.email,
        token
      });
      return 'Revisa tu email para verificar tu cuenta';
    } else {
      emailService.recoveryPassword({
        name: user.name,
        email: user.email,
        token
      });
      return `Hemos enviado un email con las instrucciones a: ${email}`
    }
  }

  async login(credentials: LoginVeterinarian) {
    const {email, password} = credentials;
    const user = await prisma.veterinarian.findUnique({where: {email}});
    if (!user) {
      throw boom.notFound('Email o contraseña incorrectos');
    }
    if(!user.isConfirmed) {
      throw boom.forbidden('El usuario no está confirmado');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect) {
      throw boom.forbidden('Email o contraseña incorrectos')
    }
    const token = jwt.sign({id: user.id}, process.env.JWT_AUTH_SECRET ?? 'mysupersecretkey', {expiresIn: '30d', algorithm: 'HS256'});
    //Lo que le paso al frontend
    const authedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      token
    }
    return authedUser;
  }
  /**
   * Flujo Recuperar contraseña
   *  Envío, en una peticion post, un email con el link para que pueda restaurar su contraseña
   *  Verificación de que el link abierto tiene el token correcto
   *  Realizar una peticion post con la nueva contraseña
   */
  async recoveryPassword(email: string): Promise<string> {
    const user = await prisma.veterinarian.findUnique({where: {email}});
    if (!user) {
      throw boom.notFound('No existe un usuario con el email ingresado');
    }
    const token = jwt.sign({email}, process.env.JWT_EMAIL_SECRET ?? 'mysupersecretkey', {expiresIn: '15m', algorithm: 'HS256'})
    await prisma.veterinarian.update({where: {email}, data: {token}})
    emailService.recoveryPassword({
      name: user.name,
      email: user.email,
      token
    });
    return `Hemos enviado un email con las instrucciones a: ${email}`;
  }

  async checkToken(token: string): Promise<boolean> {
    const user = await prisma.veterinarian.findFirst({where: {token}});
    if(!user) {
      throw boom.notFound('Token inválido')
    }
    return true;
  }

  async setNewPassword(token: string, password: string): Promise<string> {
    const user = await prisma.veterinarian.findFirst({where: {token}});
    if (!user) {
      throw boom.notFound('Token no válido');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.veterinarian.update({where: {email: user.email}, data: {token: null, password: hashedPassword}});
    return 'Contraseña cambiada correctamente';
  }
}

export default AuthService;