import { Client, isFullPage } from "@notionhq/client";
import {
  GetPagePropertyResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import memo from "memoizee";
import { Strings } from "./strings";

namespace Properties {
  export type Number = {
    type: "number";
    number: { format: any };
    id: string;
    name: string;
  };

  export type SelectItem = { id: string; name: string; color: string };

  export type Select = {
    type: "select";
    id: string;
    name: string;
    select: { options: SelectItem[] };
  };

  export type Selected = {
    type: "select";
    id: string;
    name: string;
    select: SelectItem;
  };

  export type MultiSelect = {
    id: string;
    name: string;
    type: "multi_select";
    multi_select: { options: SelectItem[] };
  };

  export type Title = {
    type: "title";
    title: never;
    id: string;
    name: string;
  };

  export type CreatedBy = {
    type: "created_by";
    id: string;
    name: string;
    created_by: {
      object: "user";
      id: string;
      name: string;
      avatar_url: string;
      type: "person";
    };
  };

  export type All = (
    | Title
    | MultiSelect
    | Select
    | Number
    | Selected
    | CreatedBy
  ) & { name: string };

  export const isProperty = <
    T extends All,
    Type extends All["type"] = All["type"]
  >(
    a: All,
    type: Type
  ): a is T => a.type === type;

  export const isTitle = (a: any): a is Title => isProperty<Title>(a, "title");
  export const isMultiSelect = (a: any): a is MultiSelect =>
    isProperty<MultiSelect>(a, "multi_select");
  export const isSelect = (a: any): a is Select =>
    isProperty<Select>(a, "select");
  export const isSelected = (a: any): a is Selected =>
    isProperty<Selected>(a, "select");
  export const isNumber = (a: any): a is Number =>
    isProperty<Number>(a, "number");

  export const isCreatedBy = (a: any): a is CreatedBy =>
    isProperty<CreatedBy>(a, "created_by");
  export type Dict = Record<string, All>;
  export type Maps = Map<string, Properties.All>;
}

export namespace Notion {
  const tokens = {
    auth: process.env.NOTION_TOKEN ?? "",
    database: process.env.NOTION_DATABASE_ID ?? "",
    configPage: process.env.NOTION_CONFIG_PAGE_ID ?? "",
  };

  const notion = new Client({ auth: tokens.auth });

  type Posts = Awaited<ReturnType<typeof notion.databases.query>>["results"];

  const personalFilters = {
    typePost: "Post",
    typeConfig: "Config",
    doneStatusPost: "Done",
  };

  const filterOnlyPosts = (posts: Posts) =>
    posts.filter((post) => Strings.onlyHex(post.id) !== tokens.configPage);

  const fetchProperties = memo(
    async (): Promise<Properties.Maps> => {
      const info = await notion.databases.retrieve({
        database_id: tokens.database,
      });
      const map = new Map<string, Properties.All>();
      for (const key in info.properties) {
        const item = info.properties[key];
        map.set(item.id, item as never);
      }
      return map;
    },
    {
      length: 0,
      async: true,
      maxAge: 60000,
      resolvers: [],
      primitive: true,
    }
  );

  const getAllPostProperties = memo(
    async (id: string, page: PageObjectResponse) => {
      return await Promise.all(
        Object.keys(page.properties).map(
          async (
            key
          ): Promise<
            | (GetPagePropertyResponse & { propertyId: string; name: string })
            | null
          > => {
            if (!Object.prototype.hasOwnProperty.call(page.properties, key)) {
              return null;
            }
            const element = page.properties[key];
            const result = await notion.pages.properties.retrieve({
              page_id: id,
              page_size: 1,
              property_id: element.id,
            });
            return { ...result, propertyId: element.id, name: result.type };
          }
        )
      );
    },
    {
      async: true,
      maxAge: 60000,
      resolvers: [String, Object.create],
    }
  );

  const getCoverSrc = (cover: any) => {
    if (cover.type === "external") return cover.external?.url ?? "";
    return "";
  };

  type BaseProperty<T extends {}> = T & {
    id: string;
    name: string;
  };

  type FullPageProperties = {
    Title: BaseProperty<{ title: string }>;
    Summary: BaseProperty<{ text: string }>;
    CreatedBy: BaseProperty<{ personName: string; avatar: string }>;
    Status: BaseProperty<{ select: BaseProperty<{ color: string }> }>;
    Language: BaseProperty<{ select: BaseProperty<{ color: string }> }>;
    Topics: BaseProperty<{ options: Array<BaseProperty<{ color: string }>> }>;
  };

  export const getFullPage = memo(
    async (id: string, map: Properties.Maps) => {
      const page = await notion.pages.retrieve({ page_id: id });
      if (!isFullPage(page)) throw new Error("Not Full Page");
      const properties = await getAllPostProperties(id, page);
      const reduceProperties = properties.reduce<FullPageProperties>(
        (acc, el) => {
          if (!el) return acc;
          if (el.type === "select") {
            const mapper = map.get(el.id)!;
            if (mapper.name === "Type") return acc;
            return {
              ...acc,
              [mapper.name]: {
                id: el.id,
                name: "select",
                select: {
                  id: el.select!.id,
                  name: el.select!.name,
                  color: el.select!.color,
                },
              },
            };
          }
          if (el.type === "multi_select") {
            const mapper = map.get(el.id)!;
            return {
              ...acc,
              [mapper.name]: {
                name: mapper.name,
                options: el.multi_select,
                id: el.id,
              },
            };
          }
          if (Properties.isCreatedBy(el)) {
            const mapper = map.get(el.id)!;
            return {
              ...acc,
              [Strings.fullTrim(mapper.name)]: {
                id: el.id,
                name: mapper.name,
                personName: el.created_by?.name ?? "",
                avatar: el.created_by?.avatar_url ?? "",
              },
            };
          }
          if (el.object === "list") {
            if (el.propertyId === "title") {
              return {
                ...acc,
                Title: {
                  id: el.propertyId,
                  name: "title",
                  title: el.results
                    .reduce(
                      (acc, x) =>
                        x.type === "title"
                          ? `${acc}${x.title.plain_text} `
                          : "",
                      ""
                    )
                    .trim(),
                },
              };
            }
            const summary = el.results.reduce(
              (acc, el) =>
                el.type === "rich_text" && el.rich_text.type === "text"
                  ? `${acc} ${el.rich_text.text.content}`
                  : "",
              ""
            );
            if (summary === "") return acc;
            return {
              ...acc,
              Summary: {
                name: "summary",
                id: el.propertyId,
                text: summary.trim(),
              },
            };
          }
          return acc;
        },
        {} as any
      );
      return {
        id: page.id,
        title: reduceProperties.Title?.title ?? "",
        createdAt: new Date(page.created_time).toISOString(),
        updatedAt: new Date(page.last_edited_time).toISOString(),
        createdBy: page.created_by.id,
        coverSrc: getCoverSrc(page.cover),
        properties: reduceProperties,
      };
    },
    {
      maxAge: 60000,
    }
  );

  export type Post = Awaited<ReturnType<typeof getPosts>>;

  export const getPosts = memo(
    async () => {
      const pages = await notion.databases.query({
        archived: false,
        auth: tokens.auth,
        database_id: tokens.database,
        sorts: [{ timestamp: "created_time", direction: "descending" }],
      });
      const onlyPosts = filterOnlyPosts(pages.results);
      const properties = await fetchProperties();
      const posts = await Promise.all(
        onlyPosts.map((page) => getFullPage(page.id, properties))
      );
      return posts.sort(
        (a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
      );
    },
    { maxAge: 60000, async: true, resolvers: [] }
  );
}
