import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

const isAuth = async (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: req.session.user.email,
            },
            select: {
                id: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        req.session.user = user;

        next();
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};

export { isAuth };
