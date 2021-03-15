---
useFolks: true
subjects: ["javascript", "tricks", "typescript", "react", "hooks", "context"]
title: "Blog V2"
language: "pt-br"
translations: ["pt-br"]
date: "2020-10-05T23:59:59.100Z"
description: "A construção por trás da nova versão do blog"
---

Olá galera, quanto tempo. Todo mundo estudando bastante? Espero que sim.

Há tempos eu queria fazer um template de blog, totalmente do zero e sem ficar usando coisas como [Jekyll](https://jekyllrb.com/) ou [GatsbyJs](https://www.gatsbyjs.com/) para gerenciar. Apesar de serem tecnologias simples, acho que não nos dão a liberdade desejada e existem toneladas de *bloat dependencies* no projeto, o que acaba impactando na hora de fazer alguma nova feature.

Sem contar que você precisa estudar a tecnologia base + tecnologia high level que gerencia o conteúdo. Não que seja preguiça de estudar, mas estudar algo só para fazer um blog que eu tenho condições de fazer de forma diferenciada, não vale a pena.

Foco no ***forma diferenciada***, pois fiz essa nova versão do zero, sem nenhum backend servindo os posts, eles são apenas arquivos `markdown.md` estáticos. Tomará que isso tenha te causado curiosidade sobre como é feito, por que é essa curiosidade que você vai matar enquanto lê esse post.

### Tecnologias usadas

- [React](https://reactjs.org/)
- [PostCSS](https://postcss.org/)
- [Tailwind](tailwindcss.com)
- [use-typed-reducer](https://github.com/g4rcez/use-typed-reducer)
- [storage-manager-js](https://github.com/g4rcez/storage-manager-js)
- [linq](https://github.com/g4rcez/linq)
- [ramda](http://ramdajs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [react-codemirror2](https://scniro.github.io/react-codemirror2/)
- [the-mask-input](https://github.com/g4rcez/the-mask-input)
- [react-icons](https://react-icons.netlify.com/)
- [react-router](https://reactrouter.com/)

### Preferências

Eu sempre quis implementar um sistema de preferências no blog, permitindo flexibilidade na escolha das cores (já implementado, você pode ver em [settings](/settings)). Nesse menu, você poderá escolher as suas cores que serão aplicadas no blog, assim você pode definir cores que ficam melhores para a sua leitura.

Mas como isso foi implementado? 

> Para compartilhar as cores entre todo o site, seria necessário usar CSS vars para que as mudanças possam ser aplicadas a todas as classes que compartilham tal cor, assim como os styles inline aplicados diretamente no HTML. E para poder usarmos no Javascript/React, basta aplicar isso numa [ContextAPI](https://reactjs.org/docs/context.html) e teremos um estado compartilhado.

A implementação da **ContextAPI** foi feita no arquivo `src/global/settings.store.tsx`. Vamos dar uma olhada em parte do código deste arquivo. Farei os comentários no código para facilitar a leitura do mesmo

```typescript
// apenas um utilitário para fazer deep merge de objetos 
// e atualizar a dom com as novas variáveis CSS
const mergeAndSet = pipe(merge, setAllColors);

// Nosso estado inicial
const defaultState = {
  // Aqui é buscado por LOCALE_KEY no seu localStorage
  // para isso, utilizei a biblioteca storage-manager-js
  locale: getDefaultLanguage(),
  colors: mergeAndSet(DarkTheme, Storage.getStorageColors()),
  // Vamos buscar o usuário git que está configurado no blog
  user: null as GithubUser | null,
  // Também iremos buscar os repositórios dele
  repositories: [] as GithubRepository[]
};

// Para evitar de escrever o tipo e sincronizar com o código,
// apenas delegamos para o Typescript sincronizar por nós
type State = typeof defaultState;

// Aqui nós temos os reducers da nossa ContextAPI, para utilizar
// o useReducer dessa forma, você pode pesquisar por
// use-typed-reducer e entender melhor seu funcionamento
const reducers = {
  setColors: (c: typeof DarkTheme) => (state: State): State => ({
    ...state,
    colors: Storage.setStorageColors(setAllColors(c))
  }),
  setLocale: (locale: string) => (state: State): State => ({ ...state, locale }),
  setUser: (user: GithubUser) => (state: State): State => ({ ...state, user }),
  setRepositories: (repositories: GithubRepository[]) => (state: State): State => ({ ...state, repositories })
};

// Criação da context aplicando nossos states e dispatchers
export const SettingsStore = createContext({
  state: defaultState,
  dispatch: reducers
});

export const Settings: React.FC = ({ children }) => {
  // declaração do use-typed-reducer
  const [state, dispatch] = useReducer(defaultState, reducers);

  // um useEffect para executar apenas quando o site for carregado, pegando
  // todas as informações necessárias para preencher a página. Listando
  // usuário + repositório
  useEffect(() => {
    const userRequest = async () => {
      // GET na API do github para retornar os dados do usuário
	  const response = await fetch(`https://api.github.com/users/${Config.github}`, { cache: "force-cache" });
	  // uso comum do fetch, você deve conhecer ou utilizar o axios
	  const user: GithubUser = await response.json();
	  // atualizando o usuário no estado
	  dispatch.setUser(user);
	  // fazendo o request dos repositórios
      await repositoriesRequest(user.login, user.public_repos);
    };
    const repositoriesRequest = async (user: string, repoCount: number) => {
	  // GET para retornar todos os repositórios do usuário
      const url = `https://api.github.com/users/${user}/repos?per_page=${repoCount}`;
      const response = await fetch(url, { cache: "no-cache" });
	  const repos: GithubRepository[] = await response.json();
	  // atualizando a lista de repositórios
      dispatch.setRepositories(repos.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
	};
	// Chamando a função async para evitar escrever com .then().catch
	userRequest();
  // executando somente quando montar a página
  }, []);

  // Aplicação do Provider da nossa context, permitindo compartilhar a context
  // com todo o sistema
  return <SettingsStore.Provider children={children} value={{ state, dispatch }} />;
};
```

Como você pode observar, nosso usuário no git vem de um objeto `Config.github`. Porta de entrada pro nosso próximo tópico. Mas antes vamos dar uma olhada em `src/blog-settings/blog-settings.view.tsx`. Para entender como é feita atualização das cores


```typescript
// Esse método é chamado no onBlur do nosso <Input />, para
// atualizar nossa context. `assocPath` é um método da 
// famosa biblioteca ramda (https://ramdajs.com/docs/#assocPath)
const changeColor = (path: string[], color: string) => {
    const newColors = assocPath(path, color, colors);
    context.dispatch.setColors(newColors)
}

const InputInfo = ({ x, main }: { x: any, main:any }) => {
    const [color, setColor] = useState(x.color);
    return (
            <Input 
                containerClassName="mt-8"
                value={color}
                type="color"
                onBlur={() => changeColor([main.name, x.name], color)} 
                onChange={(e) => setColor(e.target.value)}
                placeholder={`${main.name}.${x.name}`} 
                name={`${main.name}.${x.name}`} 
            />
    );
}
```

O código fala por si só, em todo onBlur dos inputs da tela de [settings](/settings) (referentes a cor) irão atualizar nosso estado com as novas cores e gravar no seu localStorage, simulando as suas preferências globais (por ser localStorage, é ligada ao browser utilizado).

Apesar de parecer algo difícil, notamos que não é. Apenas trabalhoso por precisar de uma context e compartilhar um estado global, atualizar o html em toda mudança de estado, salvar no localStorage. E sem contar pegar o estado inicial a partir do que está gravado no localStorage.


### Github e redes sociais

Uma outra feature que eu sempre quis fazer no meu blog era a integração com o github. É bem frustrante não ter uma integração com o meu git no blog (a versão passada não tinha). Pois assim fica chato nas alterações de foto, bio e criação dos novos repositórios. 

Algumas pessoas também sentem essa necessidade, e também possuem a necessidade de ter outras redes sociais disponíveis para serem compartilhadas, tais como Twitter, Facebook, LinkedIn, Medium...Eu não sou uma delas haha mas achei que seria legal implementar isso.

A integração das redes sociais é bem clear, basta visitar `src/global/config.ts` e para os nicks de cada rede social ali listada. Deixei disponível no arquivo `src/components/footer.tsx` os ícones para as redes sociais contidas no nosso arquivo `src/global/config.ts`. Caso queira alguma outra rede social, você pode [criar uma issue](https://github.com/g4rcez/blog/issues) ou implementar o seu próprio ícone da rede social que quiser.

Como a única integração que bate em alguma API é a do Github e ela já foi mostrada de tabela no nosso caso anterior, creio que não seja necessário abordar mais sobre. Se tiver alguma dúvida, você pode buscar abrigo na [documentação oficial da API do Github](https://docs.github.com/en/free-pro-team@latest/rest).

### Posts

Esse desafio foi legal, pois não teria backend para gerenciar o meu conteúdo de forma dinâmica, então adotei alguns passos para o gerenciamento:

1. Rodar o arquivo `scripts/build.js` antes de executar o build de fato
1. Parsear o JSON `src/posts/posts.json` para listar os posts
1. Fazer um request para `public/posts/{POST}/index.md`
1. Parsear o Markdown para criar o estilo da página

Quando você lê parsear, já imagina que o problema pode ser complexo...mas vamos com calma...

1. O build.js é um arquivo que lista todos os diretórios em `public/posts` e pega seus respectivos arquivos `index.md` para que ele possa construir o nosso arquivo `src/posts/posts.json`. Sim, amigo. Todo build este arquivo é recriado para atualizar os posts, sem que você precise se preocupar com nada, somente escrever e ser feliz com seu template.
1. Parsear o arquivo `src/posts/posts.json` é basicamente fazer um `.find` de acordo com os parâmetros da nossa rota, assim podemos escolher o arquivo correto para a leitura do post. 
1. Utilizamos o `fetch` para pegar o arquivo `index.md` encontrado no passo anterior.
1. Com as bibliotecas [marked](https://marked.js.org/) e [prismjs](https://prismjs.com/) damos vida ao post, sendo a marked para estilização do markdown e a prismjs exclusivamente para as demonstrações de código, como você já viu nesse post.

### ToDo - Implement Future

Ainda existem algumas funcionalidades que passarei a implementar pós essa data do post. E irei comentar sobre a motivação + implementação de cada uma delas nos posts, conforme forem criadas. Mas por hora, uma pequena lista:

- Text search nos posts do blog
- Barra de busca global (item flutuante)
- Atalhos para o uso do blog (vim mode)

### Conclusão

Foi uma experiência bem divertida criar essa versão 2, e bastante coisa que estava afim de fazer foi feita, tudo isso para tentar fazer com que você sinta mais interesse em ler meus posts e se inspirar para programar em Typescript/Javascript + React. Espero que tenha gostado, até a próxima. **Isso é tudo pessoal**