import { Router } from 'express';
import {
  productAttController,
  productDeleteController,
  productsAddController,
  productsController,
  productsGetController,
  productsSearchController,
} from './controllers';

const productsRoutes: Router = Router();

productsRoutes.get('/', productsController);
// productsRoutes.get('/:id', productsGetController);
// productsRoutes.post('/', adminMiddleware, productsAddController);
// productsRoutes.put('/:id', adminMiddleware, productAttController);
// productsRoutes.delete('/:id', adminMiddleware, productDeleteController);
productsRoutes.get('/search', productsSearchController);

export default productsRoutes;
