import { Router } from 'express';
import {
  loginController,
  logoutController,
  recoverCodeController,
  recoverEmailController,
  recoverPasswordController,
  refreshController,
  registerController,
} from './controllers.js';
import { jwtMiddleware } from '../../common/middleware/validate.js';
import { auth } from '../../auth/middleware.js';

const userRoutes: Router = Router();

userRoutes.post('/register', registerController);
userRoutes.post('/login', loginController);
userRoutes.post('/logout', logoutController);
userRoutes.post('/refresh', refreshController);
userRoutes.post('/recover-email', recoverEmailController);
userRoutes.post('/recover-code', recoverCodeController);
userRoutes.patch('/recover-password', auth, recoverPasswordController);

export default userRoutes;
