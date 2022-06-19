import express from 'express';
import cors from 'cors';
import setRoutes from './src/routes';
import { boomErrorHandler, errorHandler, logError } from './src/middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT ?? 3100;

app.use(cors());
app.use(express.json());

setRoutes(app);

app.use(logError);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Server running on port: ' + PORT)
})