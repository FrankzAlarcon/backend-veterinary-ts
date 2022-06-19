import Joi from 'joi';


const id = Joi.string();
const name = Joi.string().min(3);
const email = Joi.string().email();
const password = Joi.string().min(6);

export const veterinarianIdSchema = Joi.object({
  id: id.required()
})

export const createVeterinarianSchema = Joi.object({
  name: name.required(),
  email: email.required(),
  password: password.required()
});

export const updateVeterinarianSchema = Joi.object({
  name,
  email,
  password
});

