function pageAcesso(req, res) {
    // Mapeamento dos módulos com nomes legíveis
    const moduleMap = {
        financeiro: 'Financeiro',
        produtos: 'Produtos',
        relatorios: 'Relatórios',
        Usuario: 'Usuários',
        perfil: 'Perfil',
    };

    // Busca o módulo no mapa, ou mantém o valor original caso não encontrado
    const module = moduleMap[req.query.module] || req.query.module;

    // Renderiza a página de acesso negado com o módulo correspondente
    res.render('acesso', { module });
}

export {
    pageAcesso
};
