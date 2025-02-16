import React from "react";
import { useData } from "vike-react/useData";
import type { Data } from "./+data.js";
import "@blocknote/shadcn/style.css";

export default function Page() {
  const post = useData<Data>();
  return (
    <>
      <h1>{post.title}</h1>
      <img src={post.coverImageUrl} alt="" />
      <h1>{post.author.name}</h1>
      <ul>
        {post.categories.map((category) => (
          <li key={category}>{category}</li>
        ))}
      </ul>
      <div className="" dangerouslySetInnerHTML={{ __html: post.htmlContent }}></div>
    </>
  );
}
