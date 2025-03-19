import React from "react";
import { useData } from "vike-react/useData";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { Element } from "hast";
import type { Data } from "./+data.js";
import { slugify } from "@/core/utils/slugify.js";

export default function Page() {
  const page = useData<Data>();

  const content = unified()
    .use(rehypeParse, {
      fragment: true,
    })
    .use(() => {
      return (tree) => {
        visit(tree, "element", function (node: Element) {
          if (node.tagName === "h2") {
            node.children.forEach((children) => {
              // Workaround to make TypeScript happy.
              // children is of type ElementContent (no value property).
              // HTMLHeadingElement also has no value property.
              const value = (children as HTMLInputElement).value;
              const id = slugify(value);
              node.properties.id = id;
              node.properties.class = "anchor";
            });
          }
        });
        return;
      };
    })
    .use(rehypeStringify)
    .processSync(page.content["Rich-Text-Content-0"]["content"])
    .toString();

  return (
    <>
      <section className="flex justify-center py-10 px-10 md:py-24 md:px-0 prose-neutral">
        <div
          dangerouslySetInnerHTML={{ __html: content as string }}
          className="prose prose-p:prose-strong:text-slate-600 prose-p:text-slate-600 lg:prose-base prose-headings:text-slate-600 prose-headings:my-0 prose-a:text-violet-800 hover:prose-a:text-violet-500"
        ></div>
      </section>
    </>
  );
}
