import { Router } from "express";
import Response from "../libs/Response";
import CustomerService from "../services/customer.service";
import { createCustomerSchema, createPetSchema, customerAndPetIdSchema, getIdSchema, updateCustomerSchema, updatePetSchema } from "../schemas/customer.schema";
import { validationHandler } from "../middlewares/validationHandler";

const router = Router();
const customerService = new CustomerService();
const response = new Response();

/**get all customers */
router.get('/', async (_req, res, next) => {
  try {
    const customers = await customerService.getAll();
    response.success(res, customers);
  } catch (error) {
    next(error);
  }
});
/**Get a customer by id */
router.get('/:id', validationHandler(getIdSchema, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await customerService.getOne(Number(id));
    response.success(res, customer);
  } catch (error) {
    next(error);
  }
});
/**Create a customer */
router.post('/', validationHandler(createCustomerSchema, 'body'), async (req, res, next) => {
  try {
    const {body} = req;
    const customer = await customerService.create(body);
    response.success(res, customer);
  } catch (error) {
    next(error);
  }
});
/**create a pet of a customer */
router.post(
  '/:id/pets',
  validationHandler(getIdSchema, 'params'),
  validationHandler(createPetSchema, 'body'),
  async (req, res, next) => {
  try {
    const {id} = req.params;
    const {body} = req;
    const pet = await customerService.addPet(Number(id), body);
    response.success(res, pet);
  } catch (error) {
    next(error);
  }
});
/**update a customer, all data */
router.put(
  '/:id', validationHandler(getIdSchema, 'params'),
  validationHandler(createCustomerSchema, 'body'),
  async (req, res, next) => {
  try {
    const {id} = req.params;
    const {body} = req;
    const updatedCustomer = await customerService.totalUpdate(Number(id), body);
    response.success(res, updatedCustomer);
  } catch (error) {
    next(error);
  }
});
/**update a customer, partial data */
router.patch(
  '/:id',
  validationHandler(getIdSchema, 'params'),
  validationHandler(updateCustomerSchema, 'body'),
  async (req, res, next) => {
  try {
    const {id} = req.params;
    const {body} = req;
    const updatedCustomer = await customerService.partialUpdate(Number(id), body);
    response.success(res, updatedCustomer);
  } catch (error) {
    next(error);
  }
});
/**Update a pet */
router.patch(
  '/:customerId/pets/:petId',
  validationHandler(customerAndPetIdSchema, 'params'),
  validationHandler(updatePetSchema, 'body'),
  async (req, res, next) => {
  try {
    const {petId, customerId} = req.params;
    const {body} = req;
    const pet = await customerService.updatePet(Number(customerId), Number(petId), body);
    response.success(res, pet);
  } catch (error) {
    next(error);
  }
})

/**Delete a customer */
router.delete('/:id', validationHandler(getIdSchema, 'params'), async (req, res, next) => {
  try {
    const {id} = req.params;
    const message = await customerService.deleteOne(Number(id));
    response.success(res, message);
  } catch (error) {
    next(error);
  }
});
/**Delete a pet */
router.delete('/:customerId/pets/:petId', async (req, res, next) => {
  try {
    const {customerId, petId} = req.params;
    const message = await customerService.deletePet(Number(customerId), Number(petId));
    response.success(res, message);
  } catch (error) {
    next(error);
  }
})

export default router;

