import React from "react";
import { useData } from "vike-react/useData";
import type { Data } from "./+data.js";

import BlogPost from "./Content/Content.jsx";

import "@blocknote/shadcn/style.css";
import "@/components/Blocknote/style.css";

export default function Page() {
  const post = useData<Data>();

  return (
    <div className="space-y-4 max-w-screen-md py-8">
      <BlogPost documentHtml={post.documentHtml as string} />
    </div>
  );
}
