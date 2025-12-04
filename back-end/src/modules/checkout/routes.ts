import { Router } from 'express';
import { checkoutConfirmController, checkoutCreateController } from './controllers';

const checkoutRoutes: Router = Router();

checkoutRoutes.post('/create-intent', checkoutCreateController);
checkoutRoutes.post('/confirm', checkoutConfirmController); // via websocket Stripe

export default checkoutRoutes;
