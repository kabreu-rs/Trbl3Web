import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

async function login(req, res) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const isValid = bcrypt.compareSync(process.env.HASH_SECRET + password, user.password);
    if (!isValid) {
        return res.status(400).json({ error: 'Credenciais não encontrada' });
    }

    const userSession = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
    req.session.user = userSession

    res.redirect('/users');
}

function pageLogin(req, res) {
    res.render('login');
}

function logout(req, res) {
    req.session.destroy();
    res.redirect('/');
}

export {
    login,
    pageLogin,
    logout
};