import { Router } from 'express';
import { pageProdutos } from '../controllers/produtosController.js'
import { isAuth } from '../middleware/is-auth.js';
import { verificaPermissao } from '../middleware/verificaPermissao.js';

const router = Router();

router.get('/', isAuth, verificaPermissao, pageProdutos);

export default router;