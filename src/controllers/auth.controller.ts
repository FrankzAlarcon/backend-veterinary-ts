import { Router } from "express";
import Response from "../libs/Response";
import { validationHandler } from "../middlewares/validationHandler";
import { createUserSchema, emailSchema, loginSchema, recoveryPasswordSchema, tokenSchema } from "../schemas/auth.schema";
import AuthService from "../services/auth.service";
import jwt from 'jsonwebtoken';
import boom from '@hapi/boom';
import { checkAuthHandler } from "../middlewares/checkAuthHandler";

const router = Router();
const response = new Response();
const authService = new AuthService();

/**
 * Flujo para registro de usuario
 * endpoint post para registro de veterinario, 
 * endpoint para confirmar cuenta, controlar errores por expiracion de token
 * endopoint para generar un nuevo token y enviar al correo el link
 */

router.post('/register', validationHandler(createUserSchema, 'body'), async (req, res, next) => {
  try {
    const {body} = req;
    const message = await authService.register(body);
    response.success(res, message, 201);
  } catch (error) {
    next(error);
  }
})

router.get('/confirm-account/:token',validationHandler(tokenSchema, 'params'), async (req, res , next) => {
  try {
    const {token} = req.params;
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET ?? 'mysupersecretkey');
    if (!decoded) {
      throw boom.badRequest('Tu token ha expirado');
    }
    const message = await authService.confirmAccount(token);
    response.success(res, message);
  } catch (error) {
    next(error);
  }
})

router.post('/resend-email/:type', validationHandler(emailSchema, 'body'), async (req, res, next) => {
  try {
    const {type} = req.params;
    const {body} = req;
    if(type === 'verify') {
      const message = await authService.resendEmail(body, type);
      response.success(res, message);
    } else if (type === 'recovery-password') {
      const message = await authService.resendEmail(body, type);
      response.success(res, message);
    }    
  } catch (error) {
    next(error);
  }
});

/**Login */
router.post('/login', validationHandler(loginSchema, 'body'), async (req, res, next) => {
  try {
    const {body} = req;
    const user = await authService.login(body);
    response.success(res, user)
  } catch (error) {
    next(error);
  }
})

/**
 * Flujo Recuperar contraseña
 *  Envío, en una peticion post, un email con el link para que pueda restaurar su contraseña
 *  Verificación de que el link abierto tiene el token correcto
 *  Realizar una peticion post con la nueva contraseña
 */
router.post('/recovery-password', validationHandler(emailSchema, 'body'), async (req, res, next) => {
  try {
    const {body} = req;
    const message = await authService.recoveryPassword(body);
    response.success(res, message);
  } catch (error) {
    next(error);
  }
});

router.get('/recovery-password/:token', validationHandler(tokenSchema, 'params'), async (req, res, next) => {
  try {
    const {token} = req.params;
    const data = jwt.verify(token, process.env.JWT_EMAIL_SECRET ?? 'mysupersecretkey');
    if(!data) {
      throw boom.forbidden('Tu token a expirado');
    }
    const message = await authService.checkToken(token);
    response.success(res, message);
  } catch (error) {
    next(error);
  }
});

router.post('/recovery-password/:token',validationHandler(tokenSchema, 'params'), validationHandler(recoveryPasswordSchema, 'body'), async (req, res, next) => {
  try {
    const {token} = req.params;
    const {body} = req;
    const message = await authService.setNewPassword(token, body);
    response.success(res, message);
  } catch (error) {
    next(error);
  }
});

router.get('/profile', checkAuthHandler, async (req, res, next) => {
  try {
    const { user } = req;    
    response.success(res, user);
  } catch (error) {
    next(error);
  }
});

export default router;

