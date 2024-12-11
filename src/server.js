import express, {query} from 'express';
import { dir } from './dirroot.js';
import path from 'path';

import session from 'express-session';

import bcrypt from 'bcrypt';

import usersRouter from './routes/usersRoutes.js';
import authRouter from './routes/authRoutes.js';
import financeiroRouter from './routes/financeiroRoutes.js';
import relatoriosRouter from './routes/relatoriosRoutes.js';
import produtosRouter from './routes/produtosRoutes.js';
import perfilRouter from './routes/perfilRoutes.js';
import usuarioRouter from './routes/usuarioRoutes.js';
import acessoRouter from './routes/acessoRoutes.js';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

import dotenv from 'dotenv';
const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'development') {
    console.log("Running in development mode");
    dotenv.config({ path: '.env.development' });
} else if (NODE_ENV === 'production') {
    console.log("Running in production mode");
    dotenv.config({ path: '.env.production' });
}

console.log({
    ENV: process.env.NODE_ENV,
    APP_SECRET: process.env.APP_SECRET,
    HASH_SECRET: process.env.HASH_SECRET,
});

const app = express();
const pathViews = path.join(dir, '/view');
app.set('view engine', 'ejs');
app.set('views', pathViews);

app.use(express.static('uploads')); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Rotas básicas
app.get('/healthcheck', (req, res) => res.send('OK'));
app.get('/', (req, res) => res.redirect('/home'));
app.get('/home', (req, res) => {
    res.render('home', { user: req.session.user });
});

app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/financeiro', financeiroRouter);
app.use('/relatorios', relatoriosRouter);
app.use('/produtos', produtosRouter);
app.use('/perfil', perfilRouter);
app.use('/usuario', usuarioRouter);
app.use('/acesso', acessoRouter);

(async () => {
    const user = await prisma.user.findMany({ where: { role: 'SuperUsuário' } });

    if (user.length === 0) {
        await prisma.module.createMany({
            data: [
                { name: 'todos' },
                { name: 'financeiro' },
                { name: 'relatorios' },
                { name: 'produtos' },
            ],
        });

        const hashedPassword = bcrypt.hashSync(process.env.HASH_SECRET + "admin", 10);
        await prisma.user.create({
            data: {
                id : 1,
                name: 'admin',
                email: 'admin@gmail.com',
                role: 'SuperUsuário',
                password: hashedPassword,
            },
        });

        await prisma.userPermission.create({
            data: { userId: 1, moduleId: 1 },
        });
    }
})();

app.listen(3000, () => console.log(`Server iniciou na porta 3000`));
