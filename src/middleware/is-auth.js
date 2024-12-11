import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

// Middleware para autenticação
const isAuth = async (req, res, next) => {
    try {
        // Verifica se o usuário está autenticado na sessão
        if (!req.session.user) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        // Atualiza os dados do usuário na sessão com informações do banco
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

        // Substitui os dados na sessão com os mais recentes do banco
        req.session.user = user;

        // Continua para o próximo middleware ou rota
        next();
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};

export { isAuth };
