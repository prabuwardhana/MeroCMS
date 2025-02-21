import React from "react";
import { CustomPartialBlock } from "@/lib/types";
import { EditorPreview } from "@/components/admin/Blocknote";

interface PostPreviewProps {
  initialContent: CustomPartialBlock[] | undefined | "loading";
}

const PostPreview = ({ initialContent }: PostPreviewProps) => {
  return <EditorPreview initialContent={initialContent} />;
};

export default PostPreview;
