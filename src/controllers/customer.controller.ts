import { Router } from "express";
import Response from "../libs/Response";
import CustomerService from "../services/customer.service";
import { createCustomerSchema, createPetSchema, getIdSchema, updateCustomerSchema } from "../schemas/customer.schema";
import { validationHandler } from "../middlewares/validationHandler";

const router = Router();
const customerService = new CustomerService();
const response = new Response();

router.get('/', (_req, res, next) => {
  try {
    const customers = customerService.getAll();
    response.success(res, customers);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', validationHandler(getIdSchema, 'params'), (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = customerService.getOne(id);
    response.success(res, customer);
  } catch (error) {
    next(error);
  }
});

router.post('/', validationHandler(createCustomerSchema, 'body'), (req, res, next) => {
  try {
    const {body} = req;
    const customer = customerService.create(body);
    response.success(res, customer);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/pet', validationHandler(getIdSchema, 'params'), validationHandler(createPetSchema, 'body'), (req, res, next) => {
  try {
    const {id} = req.params;
    const {body} = req;
    const pet = customerService.addPet(id, body);
    response.success(res, pet);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validationHandler(getIdSchema, 'params'), validationHandler(createCustomerSchema, 'body'), (req, res, next) => {
  try {
    const {id} = req.params;
    const {body} = req;
    const updatedCustomer =  customerService.totalUpdate(id, body);
    response.success(res, updatedCustomer);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', validationHandler(getIdSchema, 'params'), validationHandler(updateCustomerSchema, 'body'), (req, res, next) => {
  try {
    const {id} = req.params;
    const {body} = req;
    const updatedCustomer = customerService.partialUpdate(id, body);
    response.success(res, updatedCustomer);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', validationHandler(getIdSchema, 'params'), (req, res, next) => {
  try {
    const {id} = req.params;
    const message = customerService.deleteOne(id);
    response.success(res, message);
  } catch (error) {
    next(error);
  }
})

export default router;

