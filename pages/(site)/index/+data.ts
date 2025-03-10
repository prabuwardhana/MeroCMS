// https://vike.dev/data

import type { PageContextServer } from "vike/types";
import { useConfig } from "vike-react/useConfig";
import { render } from "vike/abort";
import { NOT_FOUND } from "@/core/constants/http";
import type { PageDtoType } from "@/core/lib/types";

export type Data = Awaited<ReturnType<typeof data>>;

export const data = async (_pageContext: PageContextServer) => {
  // https://vike.dev/useConfig
  const config = useConfig();

  const response = await fetch("http://localhost:3000/api/site/page/home");
  const page = (await response.json()) as PageDtoType;

  const { title, excerpt, coverImageUrl, content } = page;
  if (!title) throw render(NOT_FOUND, "Page Not Found");

  config({
    // Set <title>
    title: "MeroCMS - Build Faster. Deploy Smarter. Stay in Control.",
    description: excerpt,
    image: coverImageUrl,
  });

  return { coverImageUrl, content: JSON.parse(content) };
};
