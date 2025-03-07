import React from "react";
import { cn } from "@/src/lib/utils";
import logoUrl from "@/assets/logo.svg";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex-1", className)}>
      <a href="/" className="flex gap-2">
        <img src={logoUrl} height={32} width={32} alt="logo" />
        <span className="font-bold text-lg text-violet-900">MeroCMS</span>
      </a>
    </div>
  );
};

export const LogoSvg = ({ size, className }: { size: number; className?: string }) => {
  return <img src={logoUrl} height={size} width={size} alt="logo" className={className} />;
};
