import React, { ReactNode } from "react";

interface ContainerProps {
  children?: ReactNode;
  className?: string;
}

const Container = ({ children, className = "" }: ContainerProps) => {
  return <div className={`w-full my-0 mx-auto px-0 ${className}`}>{children}</div>;
};

export default Container;
