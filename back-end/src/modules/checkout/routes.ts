import { Router } from 'express';
import { auth } from '../../auth/middleware.js';
import { checkoutCreateController, checkoutStatusController } from './controllers.js';

const checkoutRoutes: Router = Router();

checkoutRoutes.use(auth);

checkoutRoutes.post('/session', checkoutCreateController);
checkoutRoutes.get('/:orderId/status', checkoutStatusController);

export default checkoutRoutes;