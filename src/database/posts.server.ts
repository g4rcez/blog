import { randomUUID } from "crypto";
import { Db } from ".";
import { Strings } from "../lib/strings";

export namespace Posts {
  export type TPostTitle = Awaited<ReturnType<typeof getAll>>[0];

  export type CreatePost = {
    content: string;
    title: string;
    description: string;
  } & Partial<PostDetailed>;

  export type PostDetailed = Awaited<ReturnType<typeof findOne>>;

  export const create = async ({ title, content, description }: CreatePost) => {
    const postId = randomUUID();
    return Db.post.create({
      data: {
        postId,
        title,
        content,
        description,
        visitors: 0,
        published: false,
        language: "pt-br",
        createdAt: new Date(),
        slug: Strings.slugify(title),
        readingTime: Math.ceil(content.split(" ").length / 250),
        author: {
          connect: {
            userId: "ff8c9651-cbcc-4231-a9ba-4aa3b4bfa958",
          },
        },
      },
    });
  };

  type UpdateBody = { content: string; postId: string; description: string; published: boolean; title: string; tags: string[] };

  export const update = async (post: UpdateBody) => {
    await Db.post.update({
      where: { postId: post.postId },
      data: {
        content: post.content,
        description: post.description,
        title: post.title,
        slug: Strings.slugify(post.title),
        published: post.published,
        updatedAt: new Date(),
        tags: {
          connect: post.tags.map((tag) => ({
            postId_tagId: {
              postId: post.postId,
              tagId: tag,
            },
          })),
        },
      },
    });
    return post;
  };

  export const findOne = async (slug: string) => {
    const posts = await Db.post.findMany({
      where: {
        slug,
        originalId: null,
      },
      select: {
        postId: true,
        tags: true,
        slug: true,
        title: true,
        content: true,
        language: true,
        published: true,
        updatedAt: true,
        createdAt: true,
        description: true,
        readingTime: true,
      },
    });
    const post = posts[0];
    if (post) return post;
    return null;
  };

  export const getAll = async (tag?: string) => {
    const whereCondition: any = { published: true };
    if (tag) {
      whereCondition.tags = {
        some: {
          tag: {
            label: tag,
          },
        },
      };
    }
    return Db.post.findMany({
      orderBy: [{ createdAt: "desc" }],
      where: whereCondition,
      select: {
        postId: true,
        createdAt: true,
        updatedAt: true,
        title: true,
        description: true,
        slug: true,
        visitors: true,
        author: {
          select: {
            name: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                label: true,
              },
            },
          },
        },
      },
    });
  };
}
