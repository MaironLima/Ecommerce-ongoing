import { Router } from 'express';
import { auth } from '../../auth/middleware.js';
import { ordersListController, orderGetController, orderCancelController } from './controllers.js';

const ordersRoutes: Router = Router();

ordersRoutes.use(auth);

ordersRoutes.get('/', ordersListController);
ordersRoutes.get('/:id', orderGetController);
ordersRoutes.post('/:id/cancel', orderCancelController);

export default ordersRoutes;