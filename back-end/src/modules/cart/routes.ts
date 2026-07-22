import { Router } from 'express';
import { auth } from '../../auth/middleware.js';
import { cartAddController, cartGetController, cartDeleteController, cartPutController } from './controllers.js';

const cartRoutes: Router = Router();

cartRoutes.use(auth);

cartRoutes.post('/', cartAddController);
cartRoutes.get('/', cartGetController);
cartRoutes.put('/:id', cartPutController);
cartRoutes.delete('/:id', cartDeleteController);


export default cartRoutes;