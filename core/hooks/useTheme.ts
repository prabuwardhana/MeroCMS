import { useContext } from "react";
import { ThemeProviderContext } from "@/core/theme/themeContext";

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
