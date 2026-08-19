import { Router } from 'express';
import requireAdmin from '../../../common/middleware/requireAdmin';
import { variantAddController, variantAttController, variantGetController } from './controllers';
import upload from '../../../config/multer';

export const variantsRoutes: Router = Router();

variantsRoutes.get('/:id',  variantGetController); // adm
variantsRoutes.post('/:id', requireAdmin, upload.none(), variantAddController); // adm
variantsRoutes.put('/:id', requireAdmin, upload.none(), variantAttController); // adm