import Joi from 'joi';

/**Veterinarian */
const id = Joi.string();
const name = Joi.string().min(3);
const email = Joi.string().email();
const password = Joi.string().min(6);

/**Task */
const text = Joi.string().min(3);
const priority = Joi.string().pattern(/^HIGH$|^MEDIUM$|^LOW$/)

export const veterinarianIdSchema = Joi.object({
  id: id.required()
});

export const taskAndVeterinarianIdSchema = Joi.object({
  veterinarianId: id.required(),
  taskId: id.required()
})

export const createVeterinarianSchema = Joi.object({
  name: name.required(),
  email: email.required(),
  password: password.required()
});

export const totalUpdateVeterinarianSchema = Joi.object({
  name: name.required(),
  email: email.required(),
});

export const updateVeterinarianSchema = Joi.object({
  name,
  email,
});

export const createTaskSchema = Joi.object({
  text: text.required(),
  priority: priority.required()
});

export const updateTaskSchema = Joi.object({
  text,
  priority
});