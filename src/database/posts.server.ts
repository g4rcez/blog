import { randomUUID } from "crypto";
import { Db } from ".";
import { Strings } from "../lib/strings";

export namespace Posts {
  export type TPostTitle = Awaited<ReturnType<typeof getAll>>[0];

  export type CreatePost = {
    content: string;
    title: string;
    description: string;
    userId: string;
  } & Partial<PostDetailed>;

  export type PostDetailed = Awaited<ReturnType<typeof findOne>>;

  export const create = async ({ title, content, description, userId }: CreatePost) => {
    const postId = randomUUID();
    return Db.posts.create({
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
            id: userId,
          },
        },
      },
    });
  };

  type UpdateBody = { content: string; postId: string; description: string; published: boolean; title: string; tags: string[] };

  export const update = async (post: UpdateBody) => {
    const now = new Date();
    const slug = Strings.slugify(post.title);
    await Db.posts.update({
      where: { postId: post.postId },
      data: {
        content: post.content,
        description: post.description,
        title: post.title,
        slug,
        published: post.published,
        updatedAt: now,
      },
    });
    await Db.postTags.createMany({
      skipDuplicates: true,
      data: post.tags.map((tag) => ({
        tagId: tag,
        postId: post.postId,
        assignedAt: new Date(),
      })),
    });
    return { ...post, slug };
  };

  export const findOne = async (slug: string) => {
    const posts = await Db.posts.findMany({
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
    return Db.posts.findMany({
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
