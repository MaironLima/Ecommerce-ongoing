import { Router } from 'express';
import {
  productAttController,
  productDeleteController,
  productsAddController,
  productsController,
  productsGetController,
  productsSearchController,
} from './controllers';
import { uploadMiddleware, uploadMiddlewareNotMandatory } from '../../../common/middleware/uploads';
import requireAdmin from '../../../common/middleware/requireAdmin';

const productsRoutes: Router = Router();

productsRoutes.get('/', productsController);
productsRoutes.get('/:id', productsGetController);
productsRoutes.get('/search', productsSearchController);
productsRoutes.post('/', uploadMiddleware, productsAddController); // adm
productsRoutes.put('/:id', uploadMiddlewareNotMandatory, productAttController); // adm
productsRoutes.delete('/:id', productDeleteController); // adm


export default productsRoutes;
