import Joi from "joi";

const id = Joi.string();
const name = Joi.string().min(3);
const email = Joi.string().email();


const animalType = Joi.string().min(3);

const getIdSchema = Joi.object({
  id: id.required(),
})

const createPetSchema = Joi.object({
  name: name.required(),
  animalType: animalType.required()
});

const createCustomerSchema = Joi.object({
  name: name.required(),
  email: email.required()
});

const updateCustomerSchema = Joi.object({
  name,
  email
});

const updatePetSchema = Joi.object({
  name,
  animalType
});

const customerAndPetIdSchema = Joi.object({
  customerId: id.required(),
  petId: id.required(),
})

export {
  createCustomerSchema,
  createPetSchema,
  getIdSchema,
  updateCustomerSchema,
  updatePetSchema,
  customerAndPetIdSchema
}

