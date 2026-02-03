import { Router } from 'express';
import {
  productAttController,
  productDeleteController,
  productsAddController,
  productsController,
  productsGetController,
  productsSearchController,
} from './controllers';
import { uploadMiddleware } from '../../../common/middleware/uploads';

const productsRoutes: Router = Router();

productsRoutes.get('/', productsController);
productsRoutes.get('/:id', productsGetController);
productsRoutes.get('/search', productsSearchController);
productsRoutes.post('/', uploadMiddleware, productsAddController); // adm
productsRoutes.put('/:id', uploadMiddleware, productAttController); // adm
productsRoutes.delete('/:id', productDeleteController); // adm


export default productsRoutes;
