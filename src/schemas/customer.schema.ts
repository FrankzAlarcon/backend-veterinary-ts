import Joi from "joi";

const id = Joi.string().uuid();
const name = Joi.string().min(3);
const email = Joi.string().email();


const animalType = Joi.string().min(3);

const getIdSchema = Joi.object({
  id: id.required(),
})

const createPetSchema = Joi.object({
  petName: name.required(),
  animalType: animalType.required()
});

const createCustomerSchema = Joi.object({
  name: name.required(),
  email: email.required(),
  pets: Joi.array().items(createPetSchema)
});

const updateCustomerSchema = Joi.object({
  name,
  email,
  pets: Joi.array().items(createPetSchema)
});

const updatePetSchema = Joi.object({
  petName: name,
  animalType
});

export {
  createCustomerSchema,
  createPetSchema,
  getIdSchema,
  updateCustomerSchema,
  updatePetSchema
}

