import { BlogConfig } from "@/blog.config";
import type { Locale } from "./dictionary";
import type { PortfolioSection } from "./portfolio-routes";

export { homePath, portfolioPath, portfolioRoutes } from "./portfolio-routes";
export type { PortfolioSection } from "./portfolio-routes";

export type Localized<T> = Record<Locale, T>;

export const localized = <T>(value: Localized<T>, locale: Locale): T => value[locale];

const githubProject = (repository: string) => `${BlogConfig.github}/${repository}`;

export const portfolioCopy = {
    "en-US": {
        hero: {
            role: "Senior Software Engineer",
            focus: "Product Engineering · Frontend Architecture · AI Tooling",
            statement:
                "I help teams turn complex product problems into systems that are simple to ship, safe to change, and easy to use.",
            supporting:
                "I have spent 10 years building products and engineering platforms in fintech, payments, global payroll, developer experience, and AI.",
            actions: {
                work: "View selected work",
                writing: "Read writing",
                github: "GitHub",
            },
        },
        impact: {
            eyebrow: "Selected outcomes",
            title: "Changes that made products easier to ship and use",
            metrics: [
                { value: "45 min → 2 min", label: "Build and delivery time" },
                { value: "46 applications", label: "Applications using the Design System" },
                { value: "108 engineers", label: "Engineers reached" },
                { value: "~1,600/day", label: "Fewer support calls per day" },
            ],
        },
        work: {
            eyebrow: "Selected work",
            title: "Product problems, architecture choices, and measurable results.",
            description:
                "A few systems I built for users, teams, and the business.",
            viewAll: "View all work",
            readCaseStudy: "Read case study",
            caseStudiesHeading: "Case studies",
            detail: { back: "Back to selected work", breadcrumb: "Breadcrumb" },
        },
        writing: {
            eyebrow: "Writing",
            title: "Notes on products and engineering systems.",
            description:
                "I write about product engineering, architecture, frontend systems, developer experience, and AI-assisted software development.",
            viewAll: "Read the full archive",
            recent: "Recent writing",
            searchResults: "Search results",
        },
        openSource: {
            eyebrow: "Open source",
            title: "Tools and products built for users and engineers.",
            description:
                "I turn lessons from product work into libraries, editors, and developer environments.",
            viewAll: "Explore open source",
            viewProject: "View project",
            projectsHeading: "Projects",
        },
        projects: {
            openSource: "Open source",
            problem: "Problem",
            demonstrates: "Demonstrates",
            technologies: "Technologies",
        },
        about: {
            eyebrow: "About",
            title: "Senior software engineer with product judgment and frontend depth.",
            statement:
                "I help teams turn complex product problems into systems that are simple to ship, safe to change, and easy to use.",
            intro: "I have spent 10 years building products and engineering platforms in fintech, payments, and global payroll. My deepest experience is in frontend architecture, but my work also covers product decisions, system design, developer experience, and technical leadership.",
            strengthsTitle: "Where I contribute",
            strengths: [
                "Product engineering and product judgment",
                "Frontend architecture with React and TypeScript",
                "System design, migrations, and multi-tenant platforms",
                "Design systems, performance, and accessibility",
                "Developer experience and engineering enablement",
                "AI tooling, MCP servers, and MCP tools",
            ],
            experienceTitle: "Experience in practice",
            experience: [
                {
                    title: "Stone Payments",
                    body: "I led a frontend architecture migration for a core application used by 108 engineers across 14 teams. The build and delivery cycle fell from 45 minutes to 2 minutes, and we finished the migration in about a month.",
                },
                {
                    title: "Onboarding",
                    body: "I worked on a self-service onboarding platform for approximately 5 million users. The team simplified the UX while accounting for operational and infrastructure costs, reducing support demand by approximately 1,600 calls per day.",
                },
                {
                    title: "Design systems and enablement",
                    body: "I built a 32-component design system used across 46 web and mobile applications by approximately 108 engineers. I also created review standards, mentorship programs, migration tooling, and documentation to help teams adopt stronger engineering practices.",
                },
                {
                    title: "Multi-tenant architecture",
                    body: "I designed multi-tenant and Server-Driven UI architectures for projects at Stone, Pagar.me, and Ton. I helped teams centralize customer-lifecycle agreements in a dedicated API with dynamic, versioned schemas that could serve different products safely.",
                },
                {
                    title: "Engineering enablement",
                    body: "I raised code-review standards to reduce bugs, mentored engineers, and promoted AI-assisted workflows through Pi and Oh My Pi. Repeated engineering tasks became shared, documented practices.",
                },
                {
                    title: "Deel",
                    body: "At Deel, I work on AI-driven internal products, MCP server and tool implementations, and performance-sensitive Global Payroll reporting for around 1,000 customers.",
                },
            ],
            openSource: "In open source, I explore product ideas, API design, and developer tooling in public.",
            learnMore: "Learn more about my work",
            labels: {
                name: "NAME",
                manual: "PERSONAL SITE MANUAL",
                synopsis: "SYNOPSIS",
                description: "DESCRIPTION",
                practice: "AREAS OF PRACTICE",
                history: "HISTORY",
                seeAlso: "SEE ALSO",
                work: "View selected work",
                openSource: "Explore open source",
            },
        },
        pages: {
            work: {
                eyebrow: "Selected work",
                title: "Systems that made complex products easier to ship.",
                description:
                    "Case studies from payments, onboarding, design systems, and AI tooling. Company-sensitive details remain intentionally abstract."
            },
            writing: {
                eyebrow: "Writing",
                title: "Writing about product engineering.",
                description:
                    "Technical notes on architecture, frontend systems, developer experience, AI-assisted development, and the tools behind reliable products."
            },
            openSource: {
                eyebrow: "Open source",
                title: "Tools and products built in public.",
                description:
                    "I build products and tools for users and engineers, from AI editors to typed libraries and developer environments."
            },
            about: {
                eyebrow: "About Allan",
                title: "Product engineering with frontend depth.",
                description:
                    "A concise view of the problems I solve, the systems I build, and the engineering practices I help teams adopt."
            },
        },
    },
    "pt-BR": {
        hero: {
            role: "Senior Software Engineer",
            focus: "Engenharia de Produto · Arquitetura Frontend · Ferramentas de IA",
            statement:
                "Ajudo equipes a transformar problemas complexos de produto em sistemas simples de entregar, seguros para mudar e fáceis de usar.",
            supporting:
                "Há 10 anos construo produtos e plataformas de engenharia em fintech, pagamentos, folha de pagamento global, experiência do desenvolvedor e IA.",
            actions: {
                work: "Ver trabalhos selecionados",
                writing: "Ler textos",
                github: "GitHub",
            },
        },
        impact: {
            eyebrow: "Resultados selecionados",
            title: "Mudanças que tornaram os produtos mais fáceis de entregar e usar",
            metrics: [
                { value: "45 min → 2 min", label: "Tempo de build e entrega" },
                { value: "46 aplicações", label: "Aplicações que usam o Design System" },
                { value: "108 engenheiros", label: "Engenheiros alcançados" },
                { value: "~1.600/dia", label: "Chamadas de suporte a menos por dia" },
            ],
        },
        work: {
            eyebrow: "Trabalhos selecionados",
            title: "Problemas de produto, decisões de arquitetura e resultados mensuráveis.",
            description:
                "Alguns sistemas que construí para usuários, equipes e o negócio.",
            viewAll: "Ver todos os trabalhos",
            readCaseStudy: "Ler estudo de caso",
            caseStudiesHeading: "Estudos de caso",
            detail: { back: "Voltar para trabalhos selecionados", breadcrumb: "Navegação estrutural" },
        },
        writing: {
            eyebrow: "Textos",
            title: "Textos sobre produtos e sistemas de engenharia.",
            description:
                "Escrevo sobre engenharia de produto, arquitetura, sistemas frontend, experiência do desenvolvedor e desenvolvimento de software com apoio de IA.",
            viewAll: "Ler o arquivo completo",
            recent: "Textos recentes",
            searchResults: "Resultados da busca",
        },
        openSource: {
            eyebrow: "Código aberto",
            title: "Ferramentas e produtos construídos para usuários e engenheiros.",
            description:
                "Transformo aprendizados de produto em bibliotecas, editores e ambientes de desenvolvimento.",
            viewAll: "Explorar código aberto",
            viewProject: "Ver projeto",
            projectsHeading: "Projetos",
        },
        projects: {
            openSource: "Código aberto",
            problem: "Problema",
            demonstrates: "Demonstra",
            technologies: "Tecnologias",
        },
        about: {
            eyebrow: "Sobre",
            title: "Engenheiro de software sênior com visão de produto e experiência em frontend.",
            statement:
                "Ajudo equipes a transformar problemas complexos de produto em sistemas simples de entregar, seguros para mudar e fáceis de usar.",
            intro: "Tenho 10 anos de experiência construindo produtos e plataformas de engenharia em fintech, pagamentos e folha de pagamento global. Minha experiência é mais profunda em arquitetura frontend, mas meu trabalho também envolve decisões de produto, design de sistemas, experiência do desenvolvedor e liderança técnica.",
            strengthsTitle: "Onde posso contribuir",
            strengths: [
                "Engenharia de produto e decisões de produto",
                "Arquitetura frontend com React e TypeScript",
                "Design de sistemas, migrações e plataformas multi-tenant",
                "Design systems, performance e acessibilidade",
                "Experiência do desenvolvedor e melhoria dos fluxos de engenharia",
                "Ferramentas de IA, servidores e ferramentas MCP",
            ],
            experienceTitle: "Experiência na prática",
            experience: [
                {
                    title: "Stone Payments",
                    body: "Na Stone Payments, liderei uma migração de arquitetura frontend para uma aplicação central usada por 108 engenheiros em 14 equipes. O ciclo de build e entrega caiu de 45 minutos para 2 minutos, e concluímos a migração em cerca de um mês."
                },
                {
                    title: "Onboarding",
                    body: "Trabalhei em uma plataforma de onboarding self-service para aproximadamente 5 milhões de usuários. A equipe simplificou a UX sem perder de vista os custos operacionais e de infraestrutura, reduzindo a demanda de suporte em aproximadamente 1.600 chamadas por dia."
                },
                {
                    title: "Design Systems e enablement",
                    body: "Criei um Design System com 32 componentes, usado em 46 aplicações web e mobile por aproximadamente 108 engenheiros. Também criei padrões de revisão, programas de mentoria, ferramentas de migração e documentação para ajudar as equipes a adotar práticas de engenharia mais consistentes."
                },
                {
                    title: "Arquitetura multi-tenant",
                    body: "Projetei arquiteturas multi-tenant e de Server-Driven UI em projetos para Stone, Pagar.me e Ton. Ajudei as equipes a centralizar acordos do ciclo de vida do cliente em uma API dedicada, com schemas dinâmicos e versionados para atender diferentes produtos com segurança."
                },
                {
                    title: "Enablement de engenharia",
                    body: "Aprimorei os padrões de code review para reduzir bugs, mentorei engenheiros e promovi fluxos de trabalho com apoio de IA usando Pi e Oh My Pi. Tarefas repetidas se tornaram práticas compartilhadas e documentadas."
                },
                {
                    title: "Deel",
                    body: "Na Deel, trabalho em produtos internos orientados por IA, implementações de servidores e ferramentas MCP e relatórios de Global Payroll sensíveis a performance para cerca de 1.000 clientes."
                },
            ],
            openSource:
                "No código aberto, exploro ideias de produto, design de APIs e ferramentas para desenvolvedores em público.",
            learnMore: "Conheça meu trabalho",
            labels: {
                name: "NOME",
                manual: "MANUAL DE PERFIL",
                synopsis: "SINOPSE",
                description: "DESCRIÇÃO",
                practice: "ÁREAS DE ATUAÇÃO",
                history: "HISTÓRICO",
                seeAlso: "VEJA TAMBÉM",
                work: "Ver trabalhos selecionados",
                openSource: "Explorar código aberto",
            },
        },
        pages: {
            work: {
                eyebrow: "Trabalhos selecionados",
                title: "Sistemas que tornaram produtos complexos mais fáceis de entregar.",
                description:
                    "Estudos de caso sobre pagamentos, onboarding, design systems e ferramentas de IA. Detalhes sensíveis das empresas permanecem intencionalmente abstratos."
            },
            writing: {
                eyebrow: "Textos",
                title: "Textos sobre engenharia de produto.",
                description:
                    "Notas técnicas sobre arquitetura, sistemas frontend, experiência do desenvolvedor, desenvolvimento com apoio de IA e as ferramentas por trás de produtos confiáveis."
            },
            openSource: {
                eyebrow: "Código aberto",
                title: "Ferramentas e produtos construídos em público.",
                description:
                    "Construo produtos e ferramentas para usuários e engenheiros, de editores com IA a bibliotecas tipadas e ambientes de desenvolvimento."
            },
            about: {
                eyebrow: "Sobre Allan",
                title: "Engenharia de produto com experiência em frontend.",
                description:
                    "Uma visão concisa dos problemas que resolvo, dos sistemas que construo e das práticas de engenharia que ajudo as equipes a adotar."
            },
        },
    },
} satisfies Localized<{
    hero: {
        role: string;
        focus: string;
        statement: string;
        supporting: string;
        actions: { work: string; writing: string; github: string };
    };
    impact: {
        eyebrow: string;
        title: string;
        metrics: Array<{ value: string; label: string }>;
    };
    work: {
        eyebrow: string;
        title: string;
        description: string;
        viewAll: string;
        readCaseStudy: string;
        caseStudiesHeading: string;
        detail: { back: string; breadcrumb: string };
    };
    writing: {
        eyebrow: string;
        title: string;
        description: string;
        viewAll: string;
        recent: string;
        searchResults: string;
    };
    openSource: {
        eyebrow: string;
        title: string;
        description: string;
        viewAll: string;
        viewProject: string;
        projectsHeading: string;
    };
    projects: { openSource: string; problem: string; demonstrates: string; technologies: string };
    about: {
        eyebrow: string;
        title: string;
        statement: string;
        intro: string;
        strengthsTitle: string;
        strengths: string[];
        experienceTitle: string;
        experience: Array<{ title: string; body: string }>;
        openSource: string;
        learnMore: string;
        labels: {
            name: string;
            manual: string;
            synopsis: string;
            description: string;
            practice: string;
            history: string;
            seeAlso: string;
            work: string;
            openSource: string;
        };
    };
    pages: Record<PortfolioSection, { eyebrow: string; title: string; description: string }>;
}>;

export type CaseStudy = {
    slug: string;
    company: string;
    title: Localized<string>;
    summary: Localized<string>;
    metric: Localized<{ value: string; label: string }>;
    tags: string[];
    sections: Array<{ heading: Localized<string>; body: Localized<string> }>;
};

export const caseStudies = [
    {
        slug: "frontend-delivery",
        company: "Stone Payments",
        title: {
            "en-US": "45 → 2 minutes: Rethinking frontend delivery at scale",
            "pt-BR": "45 → 2 minutos: Repensando a entrega frontend em escala",
        },
        summary: {
            "en-US":
                "A focused architecture migration changed how a core application was delivered for 108 engineers across 14 teams.",
            "pt-BR":
                "Uma migração de arquitetura focada mudou a forma como uma aplicação central era entregue para 108 engenheiros em 14 equipes.",
        },
        metric: {
            "en-US": { value: "45 min → 2 min", label: "Build & delivery" },
            "pt-BR": { value: "45 min → 2 min", label: "Build e entrega" },
        },
        tags: [
            "Frontend architecture",
            "108 engineers",
            "14 teams",
            "Migration strategy",
            "postMessage",
            "CDN versioning",
            "Developer experience",
        ],
        sections: [
            {
                heading: { "en-US": "Problem", "pt-BR": "Problema" },
                body: {
                    "en-US":
                        "A core Stone Payments application used by 108 engineers across 14 teams had a 45-minute build and delivery cycle. That delay slowed feedback for every team working in the application.",
                    "pt-BR":
                        "Uma aplicação central da Stone Payments, usada por 108 engenheiros em 14 equipes, tinha um ciclo de build e entrega de 45 minutos. Essa demora atrasava o feedback de todas as equipes que trabalhavam na aplicação.",
                },
            },
            {
                heading: { "en-US": "Constraints", "pt-BR": "Restrições" },
                body: {
                    "en-US":
                        "The application was a shared, high-risk part of the product. Teams were wary of breaking it, which created organisational resistance to change. The migration also needed to avoid a larger rewrite without a clear product or engineering benefit.",
                    "pt-BR":
                        "A aplicação era uma parte compartilhada e de alto risco do produto. As equipes tinham receio de quebrá-la, o que gerou resistência organizacional à mudança. A migração também precisava evitar uma reescrita maior sem um benefício claro para o produto ou para a engenharia.",
                },
            },
            {
                heading: { "en-US": "Decision and implementation", "pt-BR": "Decisão e implementação" },
                body: {
                    "en-US":
                        "I led a frontend architecture migration that finished in about a month instead of pursuing an unnecessary full Next.js → Vite migration. The architecture used the browser's postMessage communication, and dependencies loaded from correctly versioned CDN URLs so boundaries and versions stayed explicit.",
                    "pt-BR":
                        "Liderei uma migração de arquitetura frontend concluída em cerca de um mês, em vez de buscar uma migração completa e desnecessária de Next.js para Vite. A arquitetura usava a comunicação postMessage do navegador, e as dependências eram carregadas por URLs de CDN versionadas corretamente para manter limites e versões explícitos.",
                },
            },
            {
                heading: { "en-US": "Trade-off", "pt-BR": "Trade-off" },
                body: {
                    "en-US":
                        "The approach favoured a smaller, safer migration over a clean-slate framework change. It required careful versioning, communication, and support for the teams working in the shared application.",
                    "pt-BR":
                        "A abordagem priorizou uma migração menor e mais segura em vez de uma mudança de framework começando do zero. Ela exigiu versionamento, comunicação e suporte cuidadosos às equipes que trabalhavam na aplicação compartilhada.",
                },
            },
            {
                heading: { "en-US": "Impact and lesson", "pt-BR": "Impacto e aprendizado" },
                body: {
                    "en-US":
                        "Build and delivery time dropped from 45 minutes to 2 minutes. At this scale, migration strategy and trust are part of the architecture: a focused change can create more value than a broader rewrite.",
                    "pt-BR":
                        "O tempo de build e entrega caiu de 45 minutos para 2 minutos. Nessa escala, a estratégia de migração e a confiança fazem parte da arquitetura: uma mudança focada pode gerar mais valor do que uma reescrita ampla.",
                },
            },
        ],
    },
    {
        slug: "onboarding",
        company: "Onboarding",
        title: {
            "en-US": "Designing onboarding for nearly 5 million users",
            "pt-BR": "Desenhando onboarding para quase 5 milhões de usuários",
        },
        summary: {
            "en-US":
                "Simplifying a self-service onboarding platform meant treating UX, operations, and infrastructure costs as one product problem.",
            "pt-BR":
                "Simplificar uma plataforma de onboarding self-service significou tratar UX, operação e custos de infraestrutura como um único problema de produto.",
        },
        metric: {
            "en-US": { value: "~1,600/day", label: "Fewer support calls" },
            "pt-BR": { value: "~1.600/dia", label: "Menos chamadas de suporte" },
        },
        tags: ["Product engineering", "UX simplification", "Operational cost", "Infrastructure", "Product judgment"],
        sections: [
            {
                heading: { "en-US": "Problem", "pt-BR": "Problema" },
                body: {
                    "en-US":
                        "The self-service onboarding platform served approximately 5 million users. Complex flows made it harder to complete onboarding without help and created avoidable support demand.",
                    "pt-BR":
                        "A plataforma de onboarding self-service atendia aproximadamente 5 milhões de usuários. Fluxos complexos dificultavam concluir o onboarding sem ajuda e geravam uma demanda de suporte que poderia ser evitada.",
                },
            },
            {
                heading: { "en-US": "Constraints", "pt-BR": "Restrições" },
                body: {
                    "en-US":
                        "Code quality alone was not enough to judge the right decision. UX clarity, operational cost, and infrastructure constraints all affected the product outcome.",
                    "pt-BR":
                        "A qualidade do código, sozinha, não bastava para avaliar a decisão certa. A clareza da UX, o custo operacional e as restrições de infraestrutura também afetavam o resultado do produto.",
                },
            },
            {
                heading: { "en-US": "Decision and implementation", "pt-BR": "Decisão e implementação" },
                body: {
                    "en-US":
                        "I worked on simplifying the product flows around the questions users needed to answer and the decisions they needed to make. We evaluated architecture and product choices together, treating operating and infrastructure costs as part of the design.",
                    "pt-BR":
                        "Trabalhei na simplificação dos fluxos de produto a partir das perguntas que os usuários precisavam responder e das decisões que precisavam tomar. Avaliamos as escolhas de arquitetura e produto em conjunto, tratando os custos operacionais e de infraestrutura como parte do design.",
                },
            },
            {
                heading: { "en-US": "Trade-off", "pt-BR": "Trade-off" },
                body: {
                    "en-US":
                        "The work favoured simpler paths that reduced user confusion and support demand instead of technically elegant changes that would add operational burden.",
                    "pt-BR":
                        "O trabalho priorizou caminhos mais simples, que reduziam a confusão dos usuários e a demanda de suporte, em vez de mudanças tecnicamente elegantes que aumentariam o custo operacional.",
                },
            },
            {
                heading: { "en-US": "Impact and lesson", "pt-BR": "Impacto e aprendizado" },
                body: {
                    "en-US":
                        "Support demand fell by approximately 1,600 calls per day. Product engineering means owning the cost of a confusing experience, along with the quality of the implementation behind it.",
                    "pt-BR":
                        "A demanda de suporte caiu em aproximadamente 1.600 chamadas por dia. Engenharia de produto significa assumir o custo de uma experiência confusa e a qualidade da implementação por trás dela.",
                },
            },
        ],
    },
    {
        slug: "design-system",
        company: "Design System",
        title: {
            "en-US": "Building a Design System for 46 applications",
            "pt-BR": "Construindo um Design System para 46 aplicações",
        },
        summary: {
            "en-US":
                "A shared component and token system gave web and mobile teams a safer way to stay consistent and evolve.",
            "pt-BR":
                "Um sistema compartilhado de componentes e tokens deu às equipes web e mobile uma forma mais segura de manter a consistência e evoluir.",
        },
        metric: {
            "en-US": { value: "32 components", label: "Across 46 applications" },
            "pt-BR": { value: "32 componentes", label: "Em 46 aplicações" },
        },
        tags: ["32 components", "46 applications", "Web + mobile", "Style Dictionary", "WCAG AAA", "Codemods"],
        sections: [
            {
                heading: { "en-US": "Problem", "pt-BR": "Problema" },
                body: {
                    "en-US":
                        "Multiple web and mobile applications needed a shared foundation that approximately 108 engineers could adopt without making consistency a bottleneck.",
                    "pt-BR":
                        "Múltiplas aplicações web e mobile precisavam de uma base compartilhada que aproximadamente 108 engenheiros pudessem adotar sem transformar a consistência em um gargalo.",
                },
            },
            {
                heading: { "en-US": "Constraints", "pt-BR": "Restrições" },
                body: {
                    "en-US":
                        "The system had to support 32 components, meet WCAG AAA colour contrast, and provide visual regression testing and semantic versioning across 46 applications.",
                    "pt-BR":
                        "O sistema precisava oferecer 32 componentes, atender ao contraste de cores WCAG AAA e fornecer testes de regressão visual e versionamento semântico para 46 aplicações.",
                },
            },
            {
                heading: { "en-US": "Decision and implementation", "pt-BR": "Decisão e implementação" },
                body: {
                    "en-US":
                        "The Design System used Style Dictionary for design tokens, visual regression testing for confidence in the UI, and semantic versioning to define release boundaries. Migration codemods built with jscodeshift handled repetitive changes, while documentation, tooling, support, and AI skills helped teams adopt the system.",
                    "pt-BR":
                        "O Design System usava Style Dictionary para tokens de design, testes de regressão visual para dar confiança à UI e versionamento semântico para definir os limites das releases. Codemods de migração feitos com jscodeshift cuidavam das mudanças repetitivas, enquanto documentação, ferramentas, suporte e skills de IA ajudavam as equipes a adotar o sistema.",
                },
            },
            {
                heading: { "en-US": "Trade-off", "pt-BR": "Trade-off" },
                body: {
                    "en-US":
                        "Standardisation only works when teams have a migration path. Codemods and explicit versions reduced the cost of change instead of asking every application to migrate by hand.",
                    "pt-BR":
                        "A padronização só funciona quando as equipes têm um caminho de migração. Codemods e versões explícitas reduziram o custo da mudança, sem exigir que cada aplicação migrasse manualmente.",
                },
            },
            {
                heading: { "en-US": "Impact and lesson", "pt-BR": "Impacto e aprendizado" },
                body: {
                    "en-US":
                        "The 32-component system was used across 46 web and mobile applications by approximately 108 engineers. A Design System is also an enablement product: adoption depends on the tools and support around the components.",
                    "pt-BR":
                        "O sistema com 32 componentes era usado em 46 aplicações web e mobile por aproximadamente 108 engenheiros. Um Design System também é um produto de enablement: a adoção depende das ferramentas e do suporte ao redor dos componentes.",
                },
            },
        ],
    },
    {
        slug: "mcp-tooling",
        company: "Deel",
        title: {
            "en-US": "Building AI tooling around MCP",
            "pt-BR": "Construindo ferramentas de IA com MCP",
        },
        summary: {
            "en-US":
                "MCP server and tool design connected AI-assisted internal products to useful context while keeping product and engineering judgment in the loop.",
            "pt-BR":
                "O design de um servidor e de ferramentas MCP conectou produtos internos apoiados por IA a contexto útil, mantendo o julgamento de produto e engenharia no processo.",
        },
        metric: {
            "en-US": { value: "~1,000 customers", label: "Global Payroll reporting" },
            "pt-BR": { value: "~1.000 clientes", label: "Relatórios de Global Payroll" },
        },
        tags: ["MCP server", "MCP tools", "AI products", "Tool contracts", "Context design", "Performance"],
        sections: [
            {
                heading: { "en-US": "Problem", "pt-BR": "Problema" },
                body: {
                    "en-US":
                        "At Deel, internal teams needed AI-driven products and tools that could analyse data across customers and internal services. The goal was to give workers and teams useful context without exposing confidential implementation details.",
                    "pt-BR":
                        "Na Deel, equipes internas precisavam de produtos e ferramentas orientados por IA capazes de analisar dados entre clientes e serviços internos. O objetivo era oferecer contexto útil a trabalhadores e equipes sem expor detalhes confidenciais de implementação.",
                },
            },
            {
                heading: { "en-US": "Constraints", "pt-BR": "Restrições" },
                body: {
                    "en-US":
                        "Global Payroll reporting involves complex financial and payroll data, large frontend datasets, and comparison workflows for around 1,000 customers. The interfaces must remain responsive, and the product work aims to reduce direct customer support.",
                    "pt-BR":
                        "Relatórios de Global Payroll envolvem dados financeiros e de folha de pagamento complexos, grandes conjuntos de dados no frontend e fluxos de comparação para cerca de 1.000 clientes. As interfaces precisam continuar responsivas, e o trabalho de produto busca reduzir o suporte direto ao cliente.",
                },
            },
            {
                heading: { "en-US": "Decision and implementation", "pt-BR": "Decisão e implementação" },
                body: {
                    "en-US":
                        "I implemented an MCP server and tools used by internal teams, shaping their contracts and context around real analysis workflows. The work sits alongside AI-driven internal products, performance-sensitive frontend interfaces, and close collaboration with Product, Design, and customers.",
                    "pt-BR":
                        "Implementei um servidor MCP e ferramentas usados por equipes internas, definindo seus contratos e contexto a partir de fluxos reais de análise. O trabalho acontece junto a produtos internos orientados por IA, interfaces frontend sensíveis a performance e colaboração próxima com Produto, Design e clientes.",
                },
            },
            {
                heading: { "en-US": "Trade-off", "pt-BR": "Trade-off" },
                body: {
                    "en-US":
                        "AI tooling is only as dependable as its contracts and context. Performance work, production debugging, and incident investigation still require engineers to reason about the system instead of delegating judgment to a tool.",
                    "pt-BR":
                        "Ferramentas de IA só são confiáveis na medida da qualidade de seus contratos e contexto. Trabalho de performance, debugging em produção e investigação de incidentes ainda exigem que engenheiros raciocinem sobre o sistema, em vez de delegar o julgamento a uma ferramenta.",
                },
            },
            {
                heading: { "en-US": "Impact and lesson", "pt-BR": "Impacto e aprendizado" },
                body: {
                    "en-US":
                        "The MCP server and tools became internal developer products for analysing data across services. Code review and production investigation remain part of the workflow: I have identified regression causes even when AI-assisted debugging did not find them.",
                    "pt-BR":
                        "O servidor e as ferramentas MCP se tornaram produtos internos para desenvolvedores analisarem dados entre serviços. Code review e investigação em produção continuam fazendo parte do fluxo: já identifiquei causas de regressões mesmo quando o debugging apoiado por IA não as encontrou.",
                },
            },
        ],
    },
] satisfies CaseStudy[];

export const getCaseStudy = (slug: string) => caseStudies.find((caseStudy) => caseStudy.slug === slug);

export type Project = {
    slug: string;
    name: string;
    description: Localized<string>;
    problem: Localized<string>;
    technologies: string[];
    demonstrates: Localized<string>;
    links: Array<{ label: string; href: string }>;
};

export const projects = [
    {
        slug: "writeme-editor",
        name: "WriteMe",
        description: {
            "en-US": "An AI-assisted editor built as a desktop product.",
            "pt-BR": "Um editor com IA desenvolvido como um produto desktop.",
        },
        problem: {
            "en-US":
                "Writing and editing products need a clear boundary between rich text, code and AI-assisted workflows.",
            "pt-BR":
                "Produtos de escrita e edição precisam de uma fronteira clara entre rich text, código e fluxos apoiados por IA.",
        },
        technologies: ["React", "TypeScript", "Electron", "Tiptap", "CodeMirror"],
        demonstrates: {
            "en-US":
                "AI product development, editor architecture, rich-text and code editing, and desktop product decisions.",
            "pt-BR":
                "Desenvolvimento de produtos com IA, arquitetura de editores, edição de rich text e código e decisões de produto desktop.",
        },
        links: [
            { label: "GitHub", href: githubProject("writeme-editor") },
            { label: "Open app", href: "https://app.writeme.dev" },
        ],
    },
    {
        slug: "brouther",
        name: "Brouther",
        description: {
            "en-US": "A strongly typed React router distributed as a library.",
            "pt-BR": "Um router para React, fortemente tipado e distribuído como biblioteca.",
        },
        problem: {
            "en-US":
                "Routes, links, and redirects should share one type-safe contract instead of spreading navigation assumptions through an application.",
            "pt-BR":
                "Rotas, links e redirecionamentos devem compartilhar um único contrato type-safe, em vez de espalhar suposições de navegação pela aplicação.",
        },
        technologies: ["TypeScript", "React"],
        demonstrates: {
            "en-US":
                "API design, TypeScript type systems, strongly typed navigation, library maintenance, and developer experience.",
            "pt-BR":
                "Design de APIs, sistemas de tipos do TypeScript, navegação fortemente tipada, manutenção de bibliotecas e experiência do desenvolvedor.",
        },
        links: [
            { label: "GitHub", href: githubProject("brouther") },
            { label: "Website", href: "https://brouther.vercel.app" },
        ],
    },
    {
        slug: "dotfiles",
        name: "dotfiles",
        description: {
            "en-US": "A Linux and macOS development environment built around the CLI and daily tools.",
            "pt-BR": "Um ambiente de desenvolvimento para Linux e macOS baseado na CLI e nas ferramentas do dia a dia.",
        },
        problem: {
            "en-US":
                "A reliable engineering workflow starts with a repeatable environment for the tools used every day.",
            "pt-BR":
                "Um fluxo de engenharia confiável começa com um ambiente repetível para as ferramentas usadas todos os dias.",
        },
        technologies: ["Linux", "macOS", "CLI", "Shell"],
        demonstrates: {
            "en-US":
                "Developer experience, automation, and the small systems that make engineering work more consistent.",
            "pt-BR":
                "Experiência do desenvolvedor, automação e os pequenos sistemas que tornam o trabalho de engenharia mais consistente.",
        },
        links: [
            { label: "GitHub", href: githubProject("dotfiles") },
            { label: "Project notes", href: "/dotfiles" },
        ],
    },
    {
        slug: "the-mask-input",
        name: "the-mask-input",
        description: {
            "en-US": "A lightweight React input-mask library for reusable form behavior.",
            "pt-BR":
                "Uma biblioteca leve de máscaras de input para React, criada para reutilizar comportamentos de formulário.",
        },
        problem: {
            "en-US": "Forms need input formatting that stays small, composable, and useful across common data formats.",
            "pt-BR":
                "Formulários precisam de uma formatação de input pequena, componível e útil para formatos de dados comuns.",
        },
        technologies: ["React", "TypeScript", "npm"],
        demonstrates: {
            "en-US":
                "Library API design, reusable component behavior, package maintenance, and attention to product details in forms.",
            "pt-BR":
                "Design de API de biblioteca, comportamento reutilizável de componentes, manutenção de pacote e atenção aos detalhes de produto em formulários.",
        },
        links: [
            { label: "Project page", href: "/projects/the-mask-input" },
            { label: "GitHub", href: githubProject("the-mask-input") },
            { label: "npm", href: "https://www.npmjs.com/package/the-mask-input" },
        ],
    },
    {
        slug: "racha-ai",
        name: "Racha Aí",
        description: {
            "en-US": "An independent product developed outside a company context.",
            "pt-BR": "Um produto independente desenvolvido fora do contexto de uma empresa.",
        },
        problem: {
            "en-US": "Independent products turn a product idea into a working experience from first framing to iteration.",
            "pt-BR":
                "Produtos independentes permitem levar uma ideia da definição inicial até uma experiência que funciona.",
        },
        technologies: ["Independent product work"],
        demonstrates: {
            "en-US":
                "Product framing, iteration, and end-to-end ownership. This project is intentionally described at the product level here.",
            "pt-BR":
                "Definição de produto, iteração e responsabilidade de ponta a ponta. Aqui, descrevo o projeto intencionalmente no nível do produto.",
        },
        links: [{ label: "GitHub", href: githubProject("racha-ai") }],
    },
] satisfies Project[];

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
