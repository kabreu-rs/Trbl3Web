import { Router } from 'express';
import { pageRelatorios } from '../controllers/relatoriosController.js'
import { isAuth } from '../middleware/is-auth.js';
import { verificaPermissao } from '../middleware/verificaPermissao.js';

const router = Router();

router.get('/', isAuth, verificaPermissao, pageRelatorios);

export default router;