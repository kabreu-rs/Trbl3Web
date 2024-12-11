import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function pageUsuario(req, res) {
    const role = req.session.user.role;
    const whereClause = role === 'SuperUsuário'
        ? { OR: [{ role: 'Administrador' }, { role: 'Usuário' }] }
        : role === 'Administrador'
        ? { role: 'Usuário' }
        : {};

    const users = await prisma.user.findMany({ where: whereClause });
    res.render('usuario', { users });
}

function pageAddUser(req, res) {
    const data = {
        title: "Novo Usuário",
        role: req.session.user.role,
    };
    res.render('formulario', { data });
}

async function addUser(req, res) {
    const { name, email, password, role } = req.body;

    const hashedPassword = bcrypt.hashSync(process.env.HASH_SECRET + password, 10);

    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role },
    });

    // Adicionar permissão ao módulo se for Administrador
    if (user.role === 'Administrador') {
        await prisma.userPermission.create({
            data: { userId: user.id, moduleId: 1 },
        });
    }

    res.redirect("/usuario");
}

async function pagealteracaoPermissao(req, res) {
    const id = parseInt(req.params.id);

    const user = await prisma.user.findUnique({ where: { id } });
    const permissions = await prisma.userPermission.findMany({ where: { userId: id } });

    const data = {
        user,
        permissions: permissions.map((p) => p.moduleId),
    };

    res.render('alteracaopermissao', { data });
}

async function alteracaoPermissao(req, res) {
    const id = parseInt(req.params.id);
    const { permissions = [] } = req.body;

    await prisma.userPermission.deleteMany({ where: { userId: id } });

    if (permissions.includes("2") && permissions.includes("3") && permissions.includes("4")) {
        await prisma.userPermission.create({ data: { userId: id, moduleId: 1 } });
    } else {
        const newPermissions = permissions.map((moduleId) => ({
            userId: id,
            moduleId: parseInt(moduleId),
        }));
        await prisma.userPermission.createMany({ data: newPermissions });
    }

    res.redirect("/usuario");
}

async function deleteUser(req, res) {
    const id = parseInt(req.params.id);

    await prisma.userPermission.deleteMany({ where: { userId: id } });
    await prisma.log.deleteMany({ where: { userId: id } });

    await prisma.user.delete({ where: { id } });

    res.sendStatus(200);
}

export {
    pageUsuario,
    pageAddUser,
    addUser,
    pagealteracaoPermissao,
    alteracaoPermissao,
    deleteUser,
};
