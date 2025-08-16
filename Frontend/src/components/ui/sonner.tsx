import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster backdrop-blur"
      style={
        {
          "--normal-text": "white",
          "--normal-border": "white",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
