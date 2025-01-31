import React, { ReactNode } from "react";

const PageTitle = ({ children }: { children: ReactNode }) => {
  return <span className="text-2xl">{children}</span>;
};

export default PageTitle;
