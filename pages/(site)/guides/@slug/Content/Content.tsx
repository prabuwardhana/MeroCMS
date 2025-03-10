import React from "react";

const BlogPost = ({ documentHtml }: { documentHtml: string }) => {
  return (
    <div className="bn-container text-slate-600" dangerouslySetInnerHTML={{ __html: documentHtml as string }}></div>
  );
};

export default BlogPost;
