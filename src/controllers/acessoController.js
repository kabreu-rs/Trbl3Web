function pageAcesso(req, res) {
    const moduleMap = {
        financeiro: 'Financeiro',
        produtos: 'Produtos',
        relatorios: 'Relatórios',
        Usuario: 'Usuários',
        perfil: 'Perfil',
    };

    const module = moduleMap[req.query.module] || req.query.module;

    res.render('acesso', { module });
}

export {
    pageAcesso
};
