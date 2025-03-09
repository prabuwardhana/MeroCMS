import React from "react";
import { usePageContext } from "vike-react/usePageContext";

export const Link = ({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const isActive = href ? (href === "/" ? urlPathname === href : urlPathname.startsWith(href)) : false;
  return (
    <a href={href} className={isActive && className ? className : undefined}>
      {children}
    </a>
  );
};
