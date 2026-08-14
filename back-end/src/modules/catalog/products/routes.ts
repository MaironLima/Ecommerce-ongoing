import { Router } from 'express';
import {
  productAttController,
  productDeleteAllController,
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
productsRoutes.get('/search', productsSearchController);
productsRoutes.get('/:id', productsGetController);
productsRoutes.post('/', requireAdmin, uploadMiddleware, productsAddController); // adm
productsRoutes.put('/:id', requireAdmin, uploadMiddlewareNotMandatory, productAttController); // adm
productsRoutes.delete('/all', requireAdmin, productDeleteAllController); // adm
productsRoutes.delete('/:id', requireAdmin, productDeleteController); // adm


export default productsRoutes;
