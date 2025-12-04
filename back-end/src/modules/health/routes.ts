import { Router } from 'express';
import { pingController } from './controllers.js';

const pingRoutes: Router = Router();

pingRoutes.get('/', pingController);

export default pingRoutes;
