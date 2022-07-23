import { Router } from "express";
import boom from '@hapi/boom';
import Response from "../libs/Response";
import { checkGetOneAppointment/*, checkVeterinarianToDelete*/ } from "../middlewares/checkAuthHandler";
import { checkVeterinarianInAppointment } from "../middlewares/checkUserHandler";
import { validationHandler } from "../middlewares/validationHandler";
import { appointmentIdSchema, createAppointmentSchema, updateAppointmentSchema } from "../schemas/appointment.schema";
import AppointmentService from "../services/appointment.service";

const router = Router();
const response = new Response();
const appointmentService = new AppointmentService;

/**get all appointments */
/*router.get('/', async (_req, res, next) => {
  try {
    const appointments = await appointmentService.getAll();
    response.success(res, appointments);
  } catch (error) {
    next(error);
  }
});*/
/**get an appointment by id */
router.get('/:id', validationHandler(appointmentIdSchema, 'params'), async (req, res, next) => {
  try {
    const {id} = req.params;    
    const appointment = await appointmentService.getOne(Number(id)); 
    const belongToVet = checkGetOneAppointment(appointment.veterinarianId, req);
    if(belongToVet) {
      response.success(res, appointment);
    } else {
      next(boom.forbidden('Ha ocurrido un error'));
    }
  } catch (error) {
    next(error);
  }
});
/**Create an appointment */
router.post('/',validationHandler(createAppointmentSchema, 'body'), checkVeterinarianInAppointment, async (req, res, next) => {
  try {
    const {body} = req;
    const appointment = await appointmentService.create(body);
    response.success(res, appointment);
  } catch (error) {
    next(error);
  }
});
/**Update an appoinment */
router.patch(
  '/:id',
  validationHandler(appointmentIdSchema, 'params'),
  validationHandler(updateAppointmentSchema, 'body'),
  async (req, res, next) => {
    try {
      const {id} = req.params;
      const {body} = req;
      const appoinment = await appointmentService.update(Number(id), body);
      response.success(res, appoinment);
    } catch (error) {
      next(error);
    }
})

/*router.delete('/:id', validationHandler(appointmentIdSchema, 'params'), checkVeterinarianToDelete, async (req, res, next) => {
  try {
    const {id} = req.params;
    const message = await appointmentService.delete(Number(id));
    response.success(res, message);
  } catch (error) {
    next(error);
  }
})*/

export default router;