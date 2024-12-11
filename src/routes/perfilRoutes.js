import { Router } from 'express';
import { pagePerfil, alterarFoto } from '../controllers/perfilController.js'
import { isAuth } from '../middleware/is-auth.js';
import { verificaPermissao } from '../middleware/verificaPermissao.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.get('/', isAuth, verificaPermissao, pagePerfil);
router.post('/', isAuth, verificaPermissao, upload.single('file'), alterarFoto);

export default router;