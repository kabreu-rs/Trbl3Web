import { Router } from 'express';
import { isAuth } from '../middleware/is-auth.js';
import { verificaPermissao } from '../middleware/verificaPermissao.js';
import { login, pageLogin, logout } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.get('/login', pageLogin);
router.get('/logout', isAuth, verificaPermissao, logout);

export default router;