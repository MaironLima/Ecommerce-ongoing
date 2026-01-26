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

productsRoutes.get('/products', productsController);
productsRoutes.get('/products/:id', productsGetController);
productsRoutes.get('/search', productsSearchController);
productsRoutes.post('/products', productsAddController); // adm
productsRoutes.put('/products/:id', productAttController); // adm
productsRoutes.delete('/products/:id', productDeleteController); // adm

export default productsRoutes;
