import React from "react";
import "./style.css";

interface PreloaderProps {
  children: React.ReactNode;
}

const Preloader = ({ children }: PreloaderProps) => {
  return (
    <div className="spinner">
      <div className="half-spinner"></div>
      <span>{children}</span>
    </div>
  );
};

export default Preloader;
