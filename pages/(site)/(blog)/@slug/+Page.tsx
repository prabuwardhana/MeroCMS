import React from "react";
import { useData } from "vike-react/useData";
import type { Data } from "./+data.js";
import "@blocknote/shadcn/style.css";
import { Badge } from "@/components/ui/badge.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";

export default function Page() {
  const post = useData<Data>();
  return (
    <>
      <div className="space-y-4">
        <img
          width={post.coverImage.width}
          height={post.coverImage.height}
          src={post.coverImage.url}
          alt=""
          className="h-80 w-full object-cover rounded-md"
        />
        <h1 className="text-5xl leading-snug font-bold text-center">{post.title}</h1>
        <div className="w-full flex justify-center">
          <ul className="m-0 p-0 flex">
            {post.categories.map((category) => (
              <li key={category}>
                <Badge variant="outline">{category}</Badge>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={post.author.avatarUrl} className="object-cover" />
            <AvatarFallback className="text-black">BT</AvatarFallback>
          </Avatar>
          <div className="flex items-center">
            by&nbsp;<span className="font-bold">{post.author.name}</span>
          </div>
        </div>
        <div className="" dangerouslySetInnerHTML={{ __html: post.htmlContent }}></div>
      </div>
    </>
  );
}
