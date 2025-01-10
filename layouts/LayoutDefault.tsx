import React from "react";

import "./tailwind.css";

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  return <div id="App">{children}</div>;
}
