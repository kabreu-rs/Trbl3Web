import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

// Página do módulo perfil
async function pagePerfil(req, res) {
    try {
        const id = parseInt(req.session.user.id);

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return res.status(404).send("Usuário não encontrado.");
        }

        res.render('perfil', { user });
    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        res.status(500).send("Erro interno do servidor.");
    }
}

// Alterar foto do perfil
async function alterarFoto(req, res) {
    try {
        if (!req.file || !req.file.filename) {
            return res.status(400).send("foto não foi enviada.");
        }

        const fileName = req.file.filename;
        const id = parseInt(req.session.user.id);

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { ImageId: fileName },
        });

        if (!updatedUser) {
            return res.status(404).send("Usuário não encontrado.");
        }

        res.redirect("/users");
    } catch (error) {
        console.error("Erro ao alterar a foto:", error);
        res.status(500).send("Erro interno do servidor.");
    }
}

export {
    pagePerfil,
    alterarFoto,
};
