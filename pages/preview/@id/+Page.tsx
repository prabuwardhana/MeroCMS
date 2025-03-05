import React from "react";
import { withFallback } from "vike-react-query";
import { usePageContext } from "vike-react/usePageContext";
import { usePosts } from "@/src/hooks/api/usePosts.js";
import type { PostDtoType } from "@/src/lib/types.js";
import Preloader from "@/components/Preloader/index.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import PostPreview from "../PostPreview.jsx";

import { RotateCcw } from "lucide-react";

import "@blocknote/shadcn/style.css";
import "@/components/admin/Blocknote/style.css";

const Page = withFallback(
  () => {
    const { routeParams } = usePageContext();
    const { postPreviewQuery } = usePosts(routeParams.id);
    const post = postPreviewQuery?.data as PostDtoType;
    return (
      <div className="space-y-4 max-w-screen-md py-12">
        {post.coverImage.secure_url && (
          <img
            width={post.coverImage.width}
            height={post.coverImage.height}
            src={post.coverImage.secure_url}
            alt=""
            className="h-80 w-full object-cover rounded-md"
          />
        )}
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
        <PostPreview initialContent={JSON.parse(post.documentJson as string)} />
      </div>
    );
  },
  () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-[calc(10px + 2vmin)]">
      <Preloader>Preparing Post Preview...</Preloader>
    </div>
  ),
  ({ retry, error }) => (
    <div>
      <div>Failed to load Post: {error.message}</div>
      <Button variant="destructive" onClick={() => retry()}>
        <RotateCcw />
        Retry
      </Button>
    </div>
  ),
);

export default Page;
