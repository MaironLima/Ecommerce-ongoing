import { Router } from 'express';
import {
  cartAddController,
  cartAttController,
  cartController,
  cartDeleteController,
} from '../catalog/controllers';

const cartRoutes: Router = Router();

cartRoutes.get('/', cartController);
cartRoutes.post('/items', cartAddController);
cartRoutes.put('/items/:id', cartAttController);
cartRoutes.delete('/items/:id', cartDeleteController);

export default cartRoutes;
