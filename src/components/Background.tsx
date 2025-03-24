import { ReactNode } from "react";

interface BackgroundWrapperProps {
  children: ReactNode;
  background: string; // Puede ser un color o una imagen
}

const BackgroundWrapper = ({ children, background }: BackgroundWrapperProps) => {
  const style: React.CSSProperties = {
    background: background.includes("url") ? background : background, // Si es una imagen, usa `url()`
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  };

  return <div style={style}>{children}</div>;
};

export default BackgroundWrapper;