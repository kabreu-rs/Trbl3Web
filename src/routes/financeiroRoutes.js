import { Router } from 'express';
import { pageFinanceiro } from '../controllers/financeiroController.js'
import { isAuth } from '../middleware/is-auth.js';
import { verificaPermissao } from '../middleware/verificaPermissao.js';

const router = Router();

router.get('/', isAuth, verificaPermissao, pageFinanceiro);

export default router;