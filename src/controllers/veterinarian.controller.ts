import { Router } from "express";
import Response from "../libs/Response";
import { validationHandler } from "../middlewares/validationHandler";
import { createVeterinarianSchema, updateVeterinarianSchema, veterinarianIdSchema } from "../schemas/veterinarian.schema";
import VeterinarianService from "../services/veterinarian.service";

const router = Router();
const response = new Response();
const veterinarianService = new VeterinarianService();

router.get('/', (_req, res, next) => {
  try {
    const vets = veterinarianService.getAll();
    response.success(res, vets)
  } catch (error) {
    next(error)
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const {id} = req.params;
    const vet = veterinarianService.getOne(id)
    response.success(res, vet)
  } catch (error) {
    next(error);
  }
});

router.post('/',validationHandler(createVeterinarianSchema, 'body'), (req, res, next) => {
  try {
    const { body } = req;
    const newVet = veterinarianService.create(body)
    response.success(res, newVet)
  } catch (error) {
    next(error)
  }
});

router.put('/:id', validationHandler(veterinarianIdSchema, 'params'), validationHandler(updateVeterinarianSchema, 'body'), (req, res, next) => {
  try {
    const {id} = req.params;
    const {body} = req; 
    const updatedVet = veterinarianService.totalUpdate(id, body);
    response.success(res, updatedVet);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', validationHandler(veterinarianIdSchema, 'params'), validationHandler(updateVeterinarianSchema, 'body'), (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const updatedVet = veterinarianService.partialUpdate(id, body);
    response.success(res, updatedVet);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', validationHandler(veterinarianIdSchema, 'params'), (req, res, next) => {
  try {
    const {id} = req.params;
    const message = veterinarianService.delete(id);
    response.success(res, message)
  } catch (error) {
    next(error);
  }
})

export default router;