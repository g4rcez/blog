import Linq from "linq-arrays";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Post } from "./blog/post";
import { Body } from "./components/body";
import { Container } from "./components/container";
import { Img } from "./components/img";
import { Loader } from "./components/pacman-loader";
import { Star } from "./components/star";
import { Paragraph, SubTitle } from "./components/typography";
import { GithubRepository } from "./global/github.types";
import { useFormatLocaleDate, useGitUser, useRepositories } from "./global/settings.store";
import { useClassNames } from "./hooks/use-classnames";
import { Strings } from "./lib/strings";
import POSTS from "./posts/posts.json";

type LangProps = {
  value?: string;
  onClick: (str: string) => void;
  className?: string;
};

const Lang: React.FC<LangProps> = ({ value = "", className = "bg-primary hover:bg-primary-light", ...props }) => (
  <span
    role="button"
    onClick={() => props.onClick(value)}
    className={`cursor-pointer mb-2 py-1 mr-4 px-2 bg-animate text-center rounded ${className}`}
  >
    {props.children}
  </span>
);

const Repo = (props: {
  repo: GithubRepository;
  active: GithubRepository | null;
  set: (repo: GithubRepository) => void;
}) => {
  const repoClassName = useClassNames(
    [props.repo, props.active],
    "text-animate hover:underline hover:text-info-light",
    { "text-info font-bold": props.repo.name === props.active?.name }
  );
  return (
    <div role="button" onClick={() => props.set(props.repo)} className="flex-inline pr-4 text-lg mb-2 leading-relaxed">
      <span className={repoClassName}>{props.repo.name}</span>
    </div>
  );
};

const App = () => {
  const user = useGitUser();
  const dateFormat = useFormatLocaleDate();
  const ref = useRef<HTMLDivElement>(null);

  const repositories = useRepositories();
  const [repository, setRepository] = useState<GithubRepository | null>(null);
  const [language, setLanguage] = useState("");

  const repoFilter = useMemo(() => {
    if (language === "") {
      return repositories;
    }
    return Linq.Where(repositories, "language", "===", language);
  }, [repositories, language]);

  const languages = useMemo(() => {
    const langs = repositories.reduce((acc, el) => acc.concat(el.language ?? ""), [] as string[]);
    return [...new Set(langs).values()].filter(Boolean).sort(Strings.sort);
  }, [repositories]);

  useLayoutEffect(() => {
    if (repository !== null) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [repository]);

  if (user === null) {
    return (
      <Body className="flex-col w-full">
        <div className="justify-center w-full flex flex-col items-center m-auto">
          <Loader />
        </div>
      </Body>
    );
  }

  return (
    <Body className="flex-col w-full p-2">
      <div className="w-full flex flex-row h-fit">
        <div className="w-fit justify-center content-center items-center flex-row">
          <a href={user.html_url}>
            <Img className="w-32 rounded-full" alt={user.login} src={user.avatar_url} />
          </a>
        </div>
        <div className="ml-6 flex-col h-fit">
          <SubTitle size="text-3xl" className="font-bold hover:underline text-animate hover:text-info-light">
            <a target="_blank" rel="noopener noreferrer" href={user.html_url}>
              {user.login}
            </a>
          </SubTitle>
          <Paragraph>{user.bio}</Paragraph>
          <Paragraph>Location: {user.location || "Localhost"}</Paragraph>
          <Paragraph>
            {user.followers} followers · {user.following} following
          </Paragraph>
        </div>
      </div>
      <Container className="mt-12">
        <Container>
          <SubTitle className="font-bold">Recent Posts</SubTitle>
        </Container>
        <Container className="my-8">
          {POSTS.slice(0, 3).map((x) => (
            <Post dateFormat={dateFormat} post={x} key={x.url} />
          ))}
        </Container>
      </Container>
      <Container className="mt-4">
        <Container>
          <SubTitle className="font-bold">Repositories - {repositories.length}</SubTitle>
        </Container>
        <div className="my-8 w-full flex flex-wrap">
          {languages.map((x) => (
            <Lang key={x} onClick={setLanguage} value={x}>
              {x}
            </Lang>
          ))}
          {languages.length > 0 && (
            <Lang className="bg-danger hover:bg-danger-dark font-bold" onClick={setLanguage}>
              Clear &times;
            </Lang>
          )}
        </div>
        <div className="w-full flex-wrap md:flex-no-wrap grid grid-flow-col-dense grid-col-2 items-start">
          {repository !== null && (
            <div ref={ref} className="mb-8 flex mr-4 max-w-full w-full text-default relative">
              <SubTitle className="font-bold">
                <a
                  className="text-animate hover:underline hover:text-info-light items-center flex"
                  href={repository.html_url}
                >
                  {repository.name} <wbr />- {repository.language}
                </a>
                {(!!repository.description && <Paragraph>{repository.description}</Paragraph>) || (
                  <Paragraph className="italic">No description</Paragraph>
                )}
                <Paragraph className="italic flex items-center">
                  <span>
                    <Star className="inline-block text-pacman-body mr-2" height="16" width="16" fill="yellow" />
                    {repository.stargazers_count}
                  </span>
                  <span className="ml-4">{repository.license?.key || <span className="italic">No License</span>}</span>
                  <span className="ml-4"></span>
                </Paragraph>
              </SubTitle>
              <div className="text-right absolute top-0 right-0 -mt-4 mr-1">
                <span className="text-2xl hover:text-danger" role="button" onClick={() => setRepository(null)}>
                  &times;
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-start place-items-start h-fit">
            {repoFilter.map((repo) => (
              <Repo key={repo.html_url} active={repository} repo={repo} set={setRepository} />
            ))}
          </div>
        </div>
      </Container>
    </Body>
  );
};

export default App;
