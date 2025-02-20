import React from "react";
import "@blocknote/shadcn/style.css";
import { usePosts } from "@/hooks/api/usePosts.js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import PostPreview from "../PostPreview.jsx";
import { usePageContext } from "vike-react/usePageContext";
import { PostDtoType } from "@/lib/types.js";

export default function Page() {
  const { routeParams } = usePageContext();
  const { postPreviewQuery } = usePosts(routeParams.id);
  const post = postPreviewQuery?.data as PostDtoType;
  return (
    <div className="space-y-4">
      <img
        width={post.coverImage.width}
        height={post.coverImage.height}
        src={post.coverImage.secure_url}
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
      <PostPreview initialContent={post.editorContent} />
    </div>
  );
}
