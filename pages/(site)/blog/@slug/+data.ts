// https://vike.dev/data

import type { PageContextServer } from "vike/types";
import { useConfig } from "vike-react/useConfig";
import { render } from "vike/abort";
import { NOT_FOUND } from "@/constants/http";
import type { PostDtoType } from "@/lib/types";

export type Data = Awaited<ReturnType<typeof data>>;

export const data = async (pageContext: PageContextServer) => {
  // https://vike.dev/useConfig
  const config = useConfig();

  const response = await fetch(`http://localhost:3000/api/site/blog/${pageContext.routeParams.slug}`);
  const post = (await response.json()) as PostDtoType;

  const { title, excerpt, slug, author, categories, coverImage: image, documentHtml, updatedAt } = post;

  if (!title) throw render(NOT_FOUND, "Post Not Found");

  config({
    // Set <title>
    title: title,
    description: excerpt,
    image: image.secure_url,
  });

  const coverImage = {
    url: image.secure_url,
    width: image.width,
    height: image.height,
  };

  return { title, slug, author, categories, coverImage, documentHtml, updatedAt };
};
