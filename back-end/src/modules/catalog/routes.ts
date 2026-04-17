import { Router } from 'express';
import { categoryController } from './controllers';
const catalogRoutes: Router = Router();

catalogRoutes.get('/category', categoryController);

export default catalogRoutes;
