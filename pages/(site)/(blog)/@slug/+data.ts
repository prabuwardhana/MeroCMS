// https://vike.dev/data

import type { PageContextServer } from "vike/types";
import { useConfig } from "vike-react/useConfig";
import { render } from "vike/abort";
import { ServerBlockNoteEditor } from "@blocknote/server-util";
import { Block } from "@blocknote/core";
import { NOT_FOUND } from "@/server/constants/http";
import { PostDtoType, UserProfile } from "@/lib/types";
import { schema } from "@/components/admin/blocknote/custom-schemas";

export type Data = Awaited<ReturnType<typeof data>>;

export const data = async (pageContext: PageContextServer) => {
  // https://vike.dev/useConfig
  const config = useConfig();

  const response = await fetch(`http://localhost:3000/api/site/blog/${pageContext.routeParams.slug}`);
  const post = (await response.json()) as PostDtoType;

  if (!post.title) throw render(NOT_FOUND, "Post Not Found");

  config({
    // Set <title>
    title: post.title,
    description: post.excerpt,
  });

  return await createResponse(post);
};

async function createResponse(post: PostDtoType): Promise<{
  title: string;
  slug: string;
  author: UserProfile;
  categories: string[];
  coverImage: {
    url: string;
    width: number;
    height: number;
  };
  htmlContent: string;
  updatedAt: Date | null;
}> {
  const { title, slug, author, categories, coverImage: image, editorContent, updatedAt } = post;

  const editor = ServerBlockNoteEditor.create({ schema });
  const htmlContent = await editor.blocksToFullHTML(editorContent as Block[]);

  const coverImage = {
    url: image.secure_url,
    width: image.width,
    height: image.height,
  };

  return Promise.resolve({ title, slug, author, categories, coverImage, htmlContent, updatedAt });
}
