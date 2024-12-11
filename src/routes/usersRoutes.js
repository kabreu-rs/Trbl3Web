import { Router } from 'express';
import { isAuth } from '../middleware/is-auth.js';
import { verificaPermissao } from '../middleware/verificaPermissao.js';
import { getUsers } from '../controllers/usersController.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.get('/', isAuth, verificaPermissao, getUsers);

export default router;