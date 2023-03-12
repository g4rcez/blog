export namespace SEO {
  export const author = {
    twitter: "@garcez_allan",
    name: "Allan Garcez",
  };

  export const base = "https://garcez.dev";

  export const dynamic = <T extends `/${string}`>(url: T) =>
    `https://garcez.dev${url}`;

  export const title = "Blog do Garcez";

  export const description =
    "Bem-vindo ao Blog do Garcez - o lugar onde compartilho minhas ideias e pensamentos em frontend, React, Typescript, CSS, JavaScript, e Node. Este blog é meu lugar de rascunho, onde escrevo sobre minhas experiências e aprendizados em minha jornada como desenvolvedor. Acredito que compartilhar conhecimentos e opiniões é a chave para o crescimento pessoal e profissional, por isso espero que você encontre valor em meus posts e contribua com suas próprias ideias e pensamentos. Acompanhe-me nesta jornada de aprendizado e descubra como melhorar suas habilidades em frontend.";

  export const keywords = [
    "Javascript",
    "Typescript",
    "CSS",
    "ReactJS",
    "React",
    "HTML",
    "HTML5",
    "Node",
    "Frontend",
    "Programação web",
    "Desenvolvimento web",
    "Web",
    "Browser",
    "Responsividade",
    "SEO",
  ].join(",");
}
