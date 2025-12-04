import { Router } from 'express';
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
} from './controllers.js';

const userRoutes: Router = Router();

userRoutes.post('/register', registerController);
userRoutes.post('/login', loginController);
userRoutes.post('/logout', logoutController);
userRoutes.post('/refresh', refreshController);

export default userRoutes;
