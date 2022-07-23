import nodemailer, { Transporter } from 'nodemailer';
import { VerifyVeterinarianAccount } from '../types/veterinarian';

class EmailService {
  private transport: Transporter;
  constructor() {
    this.transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async verifyAccount(data: VerifyVeterinarianAccount): Promise<void> {
    const {name, email, token} = data;

    await this.transport.sendMail({
      from: '"Veterinary App - Administra tu veterinaria" <cuentas@veterinaryapp.com>',
      to: email,
      subject: 'Veterinary App - Confirma tu cuenta',
      text: 'Verifica tu cuenta en Veterinary App',
      html: `<p>Hola: ${name}. Comprueba tu cuenta en Veterinary App.</p>
      <p>Tu cuenta ya está casi lista, solo debes confirmarla en el siguiente enlace: </p>
      <a href="${process.env.FRONTEND_URL}/confirm/${token}" target="_blank">Comprobar cuenta</a>
      <p>Si tu no creaste esta cuenta puedes ignorar el mensaje</p>
      `
    });
  }

  async recoveryPassword(data: VerifyVeterinarianAccount): Promise<void> {
    const {email, name, token} = data;

    await this.transport.sendMail({
      from: '"Veterinary App - Administra tu veterinaria" <cuentas@veterinaryapp.com>',
      to: email,
      subject: 'Veterinary App - Reestablece tu contraseña',
      text: 'Reestablece tu contraseña en Veterinary App',
      html: `<p>Hola: ${name}. Has solicitado reestablecer tu contraseña.</p>
      <p>Sigue el siguiente enlace para crear una nueva contraseña:</p>
      <a href="${process.env.FRONTEND_URL}/recovery-password/${token}" target="_blank">Reestablecer contraseña</a>
      <p>Si tu no solicitaste el cambio de contraseña puedes ignorar el mensaje</p>
      `
    })
  }
}

export default EmailService;