import React from "react";
import "@fontsource/poppins";
import "./style.css";

export default function LayoutAuth({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-center h-screen">{children}</div>;
}
