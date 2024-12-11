import { Router } from 'express';
import { isAuth } from '../middleware/is-auth.js';
import { pageAcesso } from '../controllers/acessoController.js'

const router = Router();

router.get('/', isAuth, pageAcesso);

export default router;