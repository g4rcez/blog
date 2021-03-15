---
useFolks: true
subjects: ["tricks", "typescript", "regex"]
title: "Expressões regulares"
language: "pt-br"
translations: ["pt-br"]
date: "2021-03-15T18:33:00.000Z"
description: "Se você tem um problema, usando regex você têm dois problemas"
---

[Expressões regulares ou `regex`](https://en.wikipedia.org/wiki/Regular_expression) são uma sequência de caracteres que nos dão o poder de identificar padrões em strings. Costumam ser uma dor de cabeça pra qualquer um, mas tem um poder para resolver problemas com apenas uma linha de código (que dependendo, vai ser mais complicado de ler do que 10 linhas de código).

O problema de regex é que não são human friendly, e isso atrapalha o entendimento. Mas sem problemas, hoje eu vou tentar ajudar com isso.

### Meta caracteres

São os caracteres que possuem _super poderes_ dentro da nossa regex, apesar de serem caracteres normais, eles trazem consigo uma regra para casar os padrões. Se liga em quais são:

| Meta carácter | Regra                                                                |
| ------------- | -------------------------------------------------------------------- |
| .             | Qualquer carácter                                                    |
| ^             | Comece com                                                           |
| $             | Termine com                                                          |
| +             | Um ou mais caracteres                                                |
| \*            | Pelo menos um carácter                                               |
| \d            | Qualquer dígito de zero até nove                                     |
| [A-Z]         | Caracteres de A até Z, apenas maiúsculos                             |
| [b-e]         | Caracteres de b até e, apenas minúsculos                             |
| [1-5]         | Números de 1 até 5                                                   |
| ()            | Grupo de captura                                                     |
| {1,2}         | Intervalo de caracteres, similar a notação de intervalos matemáticos |
| .\*           | Case tudo, ou carácter guloso                                        |

Esses são alguns meta caracteres interessantes para começarmos nossa brincadeira. Um bom lugar para treinar regex é no [regex101](https://regex101.com). Lá você pode escrever a sua regex e visualizar o resultados dos casamentos com suas strings de teste.

Sem mais delongas, vamos pegar alguns valores para fazermos validações usando regex

### Máscara de CPF

Sabemos para validar CPF, precisamos do algoritmo de CPF e caso queira garantir, a string deve estar no formato que já conhecemos muito bem `000.000.000-00`. Você pode validar de diversas maneiras, mas usando regex, temos a seguinte

```tsx
const cpfRegex = /^(\d{3}\.){2}\d{3}-\d{2}$/;
```

Moleza né? Brincadeira. Vamos analisar essa regex por passos:

- `^`: Comece com. O chapéu nos ajuda nesse caso pois queremos validar estritamente a string
- `(\d{3}\.)`: Um grupo de 3 dígitos seguido de ponto literal `\.`. O ponto literal é escrito assim, sendo necessário escapar com contra barra. Caso não fosse escapado, o casamento seria com qualquer string.
- `(\d{3}\.){2}`: continuando a explicação acima, temos o grupo com a regra para casar duas vezes. Ou seja, encontrar 2 grupos com o padrão `(\d{3}\.)`
- `\d{3}`: Essa é moleza, 3 dígitos seguidos
- `-`: Essa nem precisa falar, como não está dentro de um colchetes, o traço realmente significa um traço
- `\d{2}$`: Como a nossa validação é estrita, temos o final de dois dígitos e o dólar($), dizendo termine com `\d{2}`.

Assim não parece tão difícil, é só ter calma para entender os símbolos.

### Usando regex para replace de código malicioso

Regex também pode nos ajudar a enfrentar alguns inputs maliciosos, afinal de contas, tudo o que vem do usuário é errado.

> All User Input Equals Error - [Elon Musk](https://twitter.com/elonmusk/status/1248142916918349825?lang=en)

Nesse caso, vamos tratar as chamadas de eventos e chamadas de src maliciosos. Primeiro vamos fomentar a regra:

- Remover todos os eventos da tag (o padrão é onALGUMACOISA="" ou onALGUMACOISA=alert(1))
- Remover `src=javascript://`

Com isso, nossa regex fica

```tsx
const removeMaliciousCode = /(on[a-z]+="[\S\s]*?"|src="javascript:\S+")/gi
```

Nessa regex já tem coisa que não tínhamos visto antes. Mas para dar nome aos novos padrões

- `\s`: espaços em branco
- `\S`: tudo o que não for espaço em branco

> E pera aí, o que é o `gi` no final da nossa regex do JS?

Esse `gi` são parâmetros que passamos para nossa regex, o `g` é global, ou seja, casar com todos os padrões encontrados. Já o `i` é para ser insensitive, não fazendo distinção se o padrão é maiúsculo ou minusculo.

Ainda temos a presença do `|`, entre os parenteses de grupo. Esse pipe significa `OU`, ou case o primeiro padrão ou case o próximo padrão do grupo.

- `on[a-z]+=`: Pattern responsável por pegar todos os eventos Javascript que podem ser passados na tag, como dito anteriormente, o padrão é `onALGUMACOISA`, podendo ser tudo maiúsculo ou minusculo.
- `"[\S\s]*?"`: Case tudo o que estiver dentro de aspas duplas, tendo pelo menos um carácter no padrão
- `src="javascript:\S+"`: O nosso segundo casamento de padrões é `src=javascript:` que irá barrar qualquer `src` que tentar utilizar javascript na URL.

Claro que essa regex possui alguns problemas de segurança ainda, mas que graça teria se eu passasse a regex final? Você não ia ficar curioso e tentar resolver.

### Conclusão

Com estes 2 casos já foi possível explicar algumas das artimanhas de regex e demonstrar como pode ser mais tranquilo estudar regex. É um estudo que exige paciência e que trás uma ferramenta absurda para você utilizar na hora de resolver os seus problemas. 

Espero que com isso você possa se aventurar mais com regex sem que tenha tanta dor de cabeça

EOF