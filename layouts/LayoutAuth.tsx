import "./tailwind.css";

import React from "react";
import "@fontsource/poppins";

export default function LayoutAuth({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-center h-screen">{children}</div>;
}
