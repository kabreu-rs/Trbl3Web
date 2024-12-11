import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

// Função para buscar e listar usuários com permissões e módulos
async function getUsers(req, res) {
    try {
        const users = await prisma.user.findMany({
            include: {
                permissions: {
                    include: {
                        module: true, // Inclui informações do módulo associado à permissão
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
