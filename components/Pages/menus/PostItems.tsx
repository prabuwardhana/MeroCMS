import React, { useCallback, useState } from "react";

import { usePosts } from "@/core/hooks/api/usePosts";
import type { PostType } from "@/core/lib/types";

import { useNestableItemsContext } from "@/components/NestableList/providers/useNestableItemsContext";
import { Item } from "@/components/NestableList/libs/types";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Accordion from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const PostItems = () => {
  const { postsQuery } = usePosts();

  const [selectedPosts, setSelectedPosts] = useState<Array<PostType>>([]);
  const { items, addItem } = useNestableItemsContext();

  const findItem = useCallback(
    (id: string, items: Item[]): boolean => {
      const result = items.some((item) => {
        if (item["id"].includes(id)) {
          return true;
        } else if (item["children"]) {
          return findItem(id, item["children"]);
        }
      });

      return result;
    },
    [items],
  );

  return (
    <Accordion className="border-b text-sm" title="Posts">
      <Card className="mb-4 border">
        <CardContent className="p-4 h-60 overflow-y-auto">
          {postsQuery.data.map((post) => {
            const isChecked = selectedPosts.find((item) => item.title === post.title) ? true : false;
            const isAdded = findItem(post._id as string, items);
            return (
              <div key={post.title} className="flex items-center space-x-2 [&:not(:last-child)]:mb-3">
                <Checkbox
                  id={post.title}
                  checked={isChecked || isAdded}
                  onCheckedChange={(checked: boolean) => {
                    setSelectedPosts((prev) => {
                      if (checked) {
                        return Array.from(new Set([...(prev || []), post]));
                      } else {
                        return prev.filter((id) => id !== post);
                      }
                    });
                  }}
                  disabled={isAdded}
                />
                <label
                  htmlFor={post.title}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {post.title}
                </label>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <div className="flex flex-col items-end">
        <Button
          size={"sm"}
          onClick={() => {
            selectedPosts.forEach((selectedPost) => {
              addItem({
                id: selectedPost._id?.toString(),
                type: "post-item",
                name: selectedPost.title,
                url: `/${selectedPost.slug}`,
              });
            });
            setSelectedPosts([]);
          }}
        >
          Add to Menu
        </Button>
      </div>
    </Accordion>
  );
};

export default PostItems;
