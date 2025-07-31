const ptBR = {
    navigation: {
        topics: "Assuntos",
        projects: "Projetos",
    },
    hero: {
        title: "Ideias e códigos através de posts",
        subtitle: "Posts, relatos e experiências do ponto de vista de um desenvolvedor",
        github: "Github",
        linkedin: "LinkedIn",
        twitter: "Twitter",
    },
    terminal: {
        initialMessage: "Digite 'help' para ver todos os comandos disponíveis",
        commands: {
            clear: {
                description: "Limpar histórico",
            },
            whoami: {
                description: "Nome do usuário",
            },
            ls: {
                description: "Listar meus projetos",
            },
            help: {
                description: "Mostrar todos os comandos disponíveis",
            },
        },
    },
    theme: {
        label: "Tema",
        light: "Claro",
        dark: "Escuro",
        system: "Sistema",
    },
    common: {
        home: "Página inicial",
        loading: "Carregando...",
        search: "Buscar",
        readMore: "Ler mais",
        backToTop: "Voltar ao topo",
        emptyPosts: "Sem posts na categoria..."
    },
    callout: {
        note: "Nota",
        warning: "Aviso",
    },
    blog: {
        readTime: "min de leitura",
        publishedOn: "Publicado em",
        lastUpdated: "Última atualização em",
        tableOfContents: "Índice",
        relatedPosts: "Posts relacionados",
    },
};

export type BlogTranslations = typeof ptBR;

export default ptBR;
