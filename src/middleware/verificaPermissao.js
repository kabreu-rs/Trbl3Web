import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

const verificaPermissao = async (req, res, next) => {
    try {
        const path = req.originalUrl.split('/')[1];
        const { email } = req.session.user;

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                permissions: {
                    include: { module: true },
                },
            },
        });

        if (!user) {
            return res.status(403).send("Usuário não encontrado.");
        }

        let hasPermission = false;

        if (['financeiro', 'produtos', 'relatorios'].includes(path)) {
            hasPermission = user.permissions.some(
                (permission) => permission.module.name === path || permission.module.name === 'todos'
            );
        }

        if (path === 'Usuario' && ['Administrador', 'SuperUsuário'].includes(user.role)) {
            hasPermission = true;
        }

        if (['users', 'perfil', 'auth'].includes(path)) {
            hasPermission = true;
        }

        const logDescription = `Rota: '${req.originalUrl}' Teve seu acesso: ${
            hasPermission ? 'Liberado' : 'Negado'
        }`;

        await prisma.log.create({
            data: {
                userId: user.id,
                description: logDescription,
            },
        });

        if (hasPermission) {
            next();
        } else {
            res.redirect(`/acesso?module=${path}`);
        }
    } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        res.status(500).send("Erro interno do servidor.");
    }
};

export { verificaPermissao };
