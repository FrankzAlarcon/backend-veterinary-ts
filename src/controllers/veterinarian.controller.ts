import { Router } from "express";
import Response from "../libs/Response";
import { checkUserHandler, checkVeterinarianHandler } from "../middlewares/checkUserHandler";
import { validationHandler } from "../middlewares/validationHandler";
import {
  createVeterinarianSchema,
  updateVeterinarianSchema,
  veterinarianIdSchema,
  createTaskSchema,
  taskAndVeterinarianIdSchema,
  updateTaskSchema,
  customerAndVeterinarianIdSchema,
} from "../schemas/veterinarian.schema";
import VeterinarianService from "../services/veterinarian.service";

const router = Router();
const response = new Response();
const veterinarianService = new VeterinarianService();

/**get all veterinarians */
/*router.get("/", async (_req, res, next) => {
  try {
    const vets = await veterinarianService.getAll();
    response.success(res, vets);
  } catch (error) {
    next(error);
  }
});*/

/**get a veterinarian by id */
/*router.get(
  "/:id",
  validationHandler(veterinarianIdSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const vet = await veterinarianService.getOne(Number(id));
      response.success(res, vet);
    } catch (error) {
      next(error);
    }
  }
);*/

router.get(
  "/:id/customers",
  validationHandler(veterinarianIdSchema, "params"),
  checkUserHandler,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const customersInfo: any = await veterinarianService.getCustomerInfo(
        Number(id)
      );
      response.success(res, customersInfo);
    } catch (error) {
      next(error);
    }
  }
);

/**get all tasks of a veterinarian */
router.get(
  "/:id/tasks",
  validationHandler(veterinarianIdSchema, "params"),
  checkUserHandler,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const tasks = await veterinarianService.getAllTasks(Number(id));
      response.success(res, tasks);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id/appointments",
  validationHandler(veterinarianIdSchema, "params"),
  checkUserHandler,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const appointments = await veterinarianService.getAllAppointments(
        Number(id)
      );
      response.success(res, appointments);
    } catch (error) {
      next(error);
    }
  }
);
/**create a veterinarian */
router.post(
  "/",
  validationHandler(createVeterinarianSchema, "body"),
  async (req, res, next) => {
    try {
      const { body } = req;
      const newVet = await veterinarianService.create(body);
      response.success(res, newVet);
    } catch (error) {
      next(error);
    }
  }
);
/**create a task for a veterinary, it needs a valid veterinarian id */
router.post(
  "/:id/tasks",
  validationHandler(veterinarianIdSchema, "params"),
  validationHandler(createTaskSchema, "body"),
  checkUserHandler,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { body } = req;
      const task = await veterinarianService.createTask(Number(id), body);
      response.success(res, task);
    } catch (error) {
      next(error);
    }
  }
);

/**total update of a veterinarian, it needs id and changes */
/*router.put(
  '/:id',
  validationHandler(veterinarianIdSchema, 'params'),
  validationHandler(totalUpdateVeterinarianSchema, 'body'),
  async (req, res, next) => {
  try {
    const {id} = req.params;
    const {body} = req; 
    const updatedVet = await veterinarianService.totalUpdate(Number(id), body);
    response.success(res, updatedVet);
  } catch (error) {
    next(error);
  }
});*/

/**Patial update of a veterinarian */
router.patch(
  "/:id",
  validationHandler(veterinarianIdSchema, "params"),
  validationHandler(updateVeterinarianSchema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { body } = req;
      const updatedVet = await veterinarianService.partialUpdate(
        Number(id),
        body
      );
      response.success(res, updatedVet);
    } catch (error) {
      next(error);
    }
  }
);
/**Partial update of a task */
router.patch(
  "/:veterinarianId/tasks/:taskId",
  validationHandler(taskAndVeterinarianIdSchema, "params"),
  validationHandler(updateTaskSchema, "body"),
  async (req, res, next) => {
    try {
      const { taskId, veterinarianId } = req.params;
      const { body } = req;
      const task = await veterinarianService.updateTask(
        Number(veterinarianId),
        Number(taskId),
        body
      );
      response.success(res, task);
    } catch (error) {
      next(error);
    }
  }
);
/**Delete a veterinarian */
/*router.delete(
  "/:id",
  validationHandler(veterinarianIdSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const message = await veterinarianService.delete(Number(id));
      response.success(res, message);
    } catch (error) {
      next(error);
    }
  }
);*/

/**Delete a task */
router.delete(
  "/:veterinarianId/tasks/:taskId",
  validationHandler(taskAndVeterinarianIdSchema, "params"),
  async (req, res, next) => {
    try {
      const { veterinarianId, taskId } = req.params;
      const message = await veterinarianService.deleteTask(
        Number(veterinarianId),
        Number(taskId)
      );
      response.success(res, message);
    } catch (error) {
      next(error);
    }
  }
);

/**Delete all apointments of a veterinarian */
router.delete(
  "/:veterinarianId/appointments/:customerId",
  validationHandler(customerAndVeterinarianIdSchema, "params"),
  checkVeterinarianHandler,
  async (req, res, next) => {
    try {      
      const { veterinarianId, customerId } = req.params;
      const message = await veterinarianService.deleteAllAppointments(
        Number(veterinarianId),
        Number(customerId)
      );
      response.success(res, message);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
