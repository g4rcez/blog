---
useFolks: true
subjects: ["frontend"]
title: "Criando projetos escaláveis"
language: "pt-br"
translations: ["pt-br"]
date: "2019-10-19T23:59:59.999Z"
description: "Muito além de /components e /pages"
---

> Apesar de utilizar estruturas de pastas do React, esse arquivo vai servir pra qualquer projeto e em qualquer linguagem, tire proveito do mindset e faça bom proveito das dicas :heart:

Bom, como comentado no meu post ["Construindo um frontend flexível"](https://blog.garcez.now.sh/custom-react/), estou com uma experiência em aplicações multitenants. Chega num ponto em que cada projeto seu já está com umas 72~80k linhas de código e você não sabe onde está cada coisa porque sua estrutura inicial não favorecia a ser algo escalar.

Isso é um problema absurdo, por que acaba-se andando muito entre diretórios e você não sabe onde achar ou sabe onde achar e demora bastante para andar entre seus arquivos. A própria estrutura padrão de `src/{components,pages,redux,actions,helpers,utils,hooks}` acaba não lhe favorecendo a escalar e saber onde está cada coisa

Entre conversas, leituras do DDD (Domain Driven Design) e podcasts, acabei adotando uma estrutura de projeto um pouco diferente do comum, mas que faz muito sentido. Talvez você possa fazer alguma associação com ducks (se vier da comunidade React), mas acho que a parada é um pouco diferente. Um nome que ouvi bastante para isso foi `Scope named packages`. Se liga numa estrutura básica

```bash
├── build
├── docs
├── package.json
├── public
├── scripts
└── src
    ├── clientes
    │   ├── components
    │   │   └── HomeClient.tsx
    │   ├── DeleteClient.ts
    │   ├── GetClients.ts
    │   ├── hooks
    │   │   └── useClients.ts
    │   ├── SaveClient.ts
    │   └── UpdateClient.ts
    ├── colaboradores
    ├── dashboard
    ├── helpers
    ├── produtos
    └── store
```

Nesse modelo, cada entidade do seu projeto será um diretório, e dentro dele você terá tudo que for refente a essa entidade. Ações de top level e classes de modelo são colocadas na raiz de cada diretório referente a entidade. Ações caracterizadas como `utils/helpers` e `components/pages` são colocados em sub diretórios, como mostrado na árvore acima.

Caso você use Redux, uma particularidade que decidi adotar:

> Cada ação top level (ações compartilhadas por mais de um componente ou função, ações do reducer e o próprio reducer) fica no mesmo arquivo do seu reducer, assim facilitando o controle de estado daquele fluxo. Exemplo:

```typescript
// GetClients.ts
// Padrão utilizando redux-sagas

export const GetClients = () => ({ type: Actions.Client.GetAll });

const initialState = { clients: [], loading: false };

type State = typeof initialState;

function Action(action:){
    const response = yield call(fetch, "https://api.awesomeapi.io/");
    if (response.status === 200) {
        const clients = await response.json();
        yield put({ type: Actions.Client.GetAllSagas, clients })
    } else if (response.status === 404) {
        Notification("Mensagem de não existe pro usuário");
    }
}

type SagasAction = {
    clients: Client[]
}

const Reducer = CreateReducer(initialState,  {
    [Actions.Client.GetAllSagas]: (state: State, action: SagasAction) => ({
        ...state, clients: action.clients
    })
});

export default { Reducer, Action };
```

[_Você pode conferir o CreateReducer aqui_](https://gist.github.com/g4rcez/4005a4258842d3543ee1663b28c79108)

Esse foi um pequeno exemplo de como você pode organizar seus reducers.

### Helpers e Componentes

Lógico que nem tudo irá ficar somente contido dentro de pacotes nomeados por suas entidades, as vezes algumas funções, componentes, tipos, classes de modelo e outros serão reutilizados. Mas para ter uma estrutura escalar é importante tentar manter *a altura da árvore de diretórios* de até 2. Pode parecer bobeira, mas você vai me agradecer por se manter nessa regra.

Uma outra prática que não é muito interessante é criar uma pasta para um componente e nessa pasta ter somente o index.{jsx?,tsx?}. Nesses casos, melhor criar o arquivo com o nome do componente fora da pasta. 

### Modularizar quando necessário

Um erro que acabei cometendo por falta de tempo e recurso foi manter a minha biblioteca de componentes dentro do projeto, o que aumentou demais a codebase, e sem necessidade. Agora com um pouco mais de tempo livre estou quebrando partes do código que poderão ser reaproveitadas por outros projetos. Com isso, reduzo o tamanho da minha codebase e posso dividir melhor a equipe para trabalhar em repositórios separados.

Um projeto para o uso de clientes e empresas foi quebrado da seguinte maneira

```
                   SUPER-PROJETO-GIGANTE
            _|               |               |_
        cliente            shared            empresa
        ____________________|||_____________________
        componentes     model       services-hooks-actions         
```

Um grande projeto maior foi quebrado em 3, uma área de clientes, uma de empresa e a área para cadastro e faq de ambos. Somente com essa quebra, o bundle size pode ser reduzido de 620KB para 2 bundles de ~340KB (isso porque tive que ter uma replicação de código para evitar a quebra de alguns pacotes). Quebrando ainda mais a lógica e componentes, conseguimos uma redução para 290KB (eliminando código duplicado, actions não usadas, simplificando a lógica e reescrevendo alguns componentes que ainda utilizávamos de outras bibliotecas). O projeto que possuia ~80k linhas agora está com ~42K linhas. **FUCKING REDUÇÃO**.

Óbviamente essa redução tem seus "mistérios", pois parte da lógica foi abstraída para outros repositórios, mas o projeto principal se tornou mais fácil de manter, e os subprojetos agora podem ser mantidos por uma pessoa sem muita dificuldade.

### Prós e Contras desse modelo

Óbvio que isso não é uma estrutura que serve para qualquer coisa, é algo situacional que poderá ou não vir a calhar para você. Listando meus prós e contras dessa arquitetura

#### Contras

- A lógica fica separada em outros projetos, sendo necessário abrir issues em repositórios para a manutenção e tracking/documentação dos erros encontrados
- Você deve manter a estrutura de build de N projetos. Claro que criando um, você irá pode replicar para todos os outros. Mas talvez não seja a melhor estrutura dependendo do que você fornece em um repositório
- A separação em um projeto já existente pode ocasionar em bugs. Faça estando consciente.
- Como dito no primeiro item, os bugs podem estar espalhados em diversos lugares, dificultando a identificação de alguns erros e aumentando a necessidade de testes mais bem escritos
- Quanto mais arquivos, mais demora a indexação do seu projeto e até mesmo o build.

#### Prós

- A escalabilidade tende a ser alta. Talvez não tão alta se o seu projeto for mega super gigante, aí será preciso analisar outras possibilidades.
- A lógica fica contida na sua entidade, facilitando o encontro do código e não possuindo lógica de negócio espalhada em diversos trechos do código
- A quebra em N repositórios pode facilitar o trabalho da equipe quando há uma feature que envolve mais do que um repositório, evitando problemas de merge e alterações erradas.
- Mantendo a regra de altura 2, você irá rodar menos até achar algo e tenderá a não se perder tanto na estrutura do projeto.

Isso tudo que foi falado não é um padrão, não irá gerar tendência, é apenas uma forma que deu certo em um projeto grande e quis compartilhar com você.

**Sim, eu disse você, a única pessoa que lê o meu blog :heart:**

E como de costume...