import React from "react";
import { type CustomPartialBlock } from "@/components/Blocknote";
import { EditorPreview } from "@/components/Blocknote";

interface PostPreviewProps {
  initialContent: CustomPartialBlock[] | undefined | "loading";
}

const PostPreview = ({ initialContent }: PostPreviewProps) => {
  return <EditorPreview initialContent={initialContent} />;
};

export default PostPreview;
