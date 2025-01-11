import "./tailwind.css";

import React from "react";

export default function LayoutAuth({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-center h-screen">{children}</div>;
}
