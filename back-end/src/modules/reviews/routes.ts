import { Router } from 'express';
import { auth } from '../../auth/middleware.js';
import { reviewGetAllController, reviewGetController, reviewPostController, reviewDeleteController } from './controllers.js';
import requireAdmin from '../../common/middleware/requireAdmin.js';

const reviewRoutes = Router();

reviewRoutes.get('/reviews', requireAdmin, reviewGetAllController); // adm
reviewRoutes.get('/:id/review', reviewGetController);
reviewRoutes.post('/:id/review', auth, reviewPostController);
reviewRoutes.delete('/:reviewId/review', requireAdmin, reviewDeleteController); // adm

export default reviewRoutes;