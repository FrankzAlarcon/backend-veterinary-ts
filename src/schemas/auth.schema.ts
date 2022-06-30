import Joi from "joi";

const name = Joi.string().min(3)
const email = Joi.string().email();
const password = Joi.string().min(8);
const token = Joi.string();

export const createUserSchema = Joi.object({
  name: name.required(),
  email: email.required(),
  password: password.required()
});

export const tokenSchema = Joi.object({
  token: token.required()
});

export const loginSchema = Joi.object({
  email: email.required(),
  password: password.required()
})

export const emailSchema = Joi.object({
  email: email.required()
})

export const recoveryPasswordSchema = Joi.object({
  password: password.required()
})