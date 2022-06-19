import { Router, Express } from "express";
import veterinariansRouter from '../controllers/veterinarian.controller';

const router = Router();

function setRoutes(app: Express): void {
  app.use('/api/v1', router);
  router.use('/veterinarian', veterinariansRouter)
}

export default setRoutes;