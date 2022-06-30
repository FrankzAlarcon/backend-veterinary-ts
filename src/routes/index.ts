import { Router, Express } from "express";
import veterinariansRouter from '../controllers/veterinarian.controller';
import customersRouter from '../controllers/customer.controller';
import appointmentRouter from '../controllers/appointment.controller';
import authRouter from '../controllers/auth.controller';
import { checkAuthHandler } from "../middlewares/checkAuthHandler";

const router = Router();

function setRoutes(app: Express): void {
  app.use('/api/v1', router);
  router.use('/veterinarians', checkAuthHandler, veterinariansRouter);
  router.use('/customers', checkAuthHandler, customersRouter);
  router.use('/appointments', checkAuthHandler, appointmentRouter);
  router.use('/auth', authRouter);
}

export default setRoutes;