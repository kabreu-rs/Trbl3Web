import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function getUsers(req, res) {
    try {
        const users = await prisma.user.findMany({
            include: {
                permissions: {
                    include: {
                        module: true, 
                    },
                },
            },
        });

        res.render('listagem', { data: { users } });
    } catch (error) {
        console.error("Erro a procurar usuários:", error);
        res.status(500).send("Erro ao carregar a lista.");
    }
}

export {
    getUsers,
};
