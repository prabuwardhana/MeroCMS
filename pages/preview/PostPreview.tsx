import React from "react";
import EditorPreview from "@/components/blocknote/preview";
import { CustomPartialBlock } from "@/lib/types";

interface PostPreviewProps {
  initialContent: CustomPartialBlock[] | undefined | "loading";
}

const PostPreview = ({ initialContent }: PostPreviewProps) => {
  return <EditorPreview initialContent={initialContent} />;
};

export default PostPreview;
