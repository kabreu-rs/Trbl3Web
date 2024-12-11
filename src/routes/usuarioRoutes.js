import { Router } from 'express';
import { pageUsuario, pageAddUser, addUser, deleteUser, pagealteracaoPermissao, alteracaoPermissao } from '../controllers/usuarioController.js'
import { isAuth } from '../middleware/is-auth.js';
import { verificaPermissao } from '../middleware/verificaPermissao.js';

const router = Router();

router.get('/', isAuth, verificaPermissao, pageUsuario);

router.get('/add', isAuth, verificaPermissao, pageAddUser);

router.post('/add', isAuth, verificaPermissao, addUser);

router.get('/alteracaoPermissao/:id', isAuth, verificaPermissao, pagealteracaoPermissao);

router.post('/alteracaoPermissao/:id', isAuth, verificaPermissao, alteracaoPermissao);

router.delete('/delete/:id', isAuth, verificaPermissao, deleteUser);

export default router;
