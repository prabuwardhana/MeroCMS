import React, { ReactNode } from "react";

const PageTitle = ({ children }: { children: ReactNode }) => {
  return <div className="flex items-center text-2xl">{children}</div>;
};

export default PageTitle;
