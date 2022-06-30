import { Router, Express } from "express";
import veterinariansRouter from '../controllers/veterinarian.controller';
import customersRouter from '../controllers/customer.controller';
import appointmentRouter from '../controllers/appointment.controller';

const router = Router();

function setRoutes(app: Express): void {
  app.use('/api/v1', router);
  router.use('/veterinarians', veterinariansRouter);
  router.use('/customers', customersRouter);
  router.use('/appointments', appointmentRouter)
}

export default setRoutes;