import { Router } from 'express';
import { categoriesController } from './controllers.js';

const categoryRoutes: Router = Router();

categoryRoutes.get('/', categoriesController);

export default categoryRoutes;