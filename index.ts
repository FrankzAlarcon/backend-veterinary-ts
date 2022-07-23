import express from 'express';
import cors from 'cors';
import boom from '@hapi/boom';
import setRoutes from './src/routes';
import { boomErrorHandler, errorHandler, jwtErrorHandler, logError, prismaErrorHandler } from './src/middlewares/errorHandler';
import { config } from 'dotenv';

config();
const app = express();
const PORT = process.env.PORT ?? 3100;

const whiteList = [process.env.FRONTEND_URL]

const corsOptions = {
  origin: (origin: string | undefined, next: any) => {
    if(whiteList.includes(origin) || !origin) {
      next(null, true);
    } else {
      next(boom.unauthorized('Cors Error'));
    }
  } 
}

app.use(cors(corsOptions));
app.use(express.json());

setRoutes(app);

app.use(logError);
app.use(prismaErrorHandler);
app.use(jwtErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Server running on port: ' + PORT)
})