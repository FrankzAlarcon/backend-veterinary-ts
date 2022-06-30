import Joi from "joi";

const id = Joi.number();
const date = Joi.date();
const symptoms = Joi.string();
const prescription = Joi.string().allow("");
const isCompleted = Joi.boolean();
const price = Joi.number();
// const veterinarianId = Joi.number();
// const customerId = Joi.number();

export const createAppointmentSchema = Joi.object({
  date: date.required(),
  symptoms: symptoms.required(),
  prescription: prescription.required(),
  isCompleted: isCompleted.required(),
  price,
  veterinarianId: id.required(),
  customerId: id.required(),
  petId: id.required(),
});

export const appointmentIdSchema = Joi.object({
  id: id.required()
});

export const updateAppointmentSchema = Joi.object({
  date,
  symptoms,
  prescription,
  isCompleted,
  price,
  veterinarianId: id,
  customerId: id,
  petId: id
})

