import React from "react";
import { type CustomPartialBlock } from "@/components/admin/Blocknote";
import { EditorPreview } from "@/components/admin/Blocknote";

interface PostPreviewProps {
  initialContent: CustomPartialBlock[] | undefined | "loading";
}

const PostPreview = ({ initialContent }: PostPreviewProps) => {
  return <EditorPreview initialContent={initialContent} />;
};

export default PostPreview;
