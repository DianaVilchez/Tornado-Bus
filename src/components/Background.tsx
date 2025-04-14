import { ReactNode } from "react";
import styled from "styled-components";

interface BackgroundWrapperProps {
  children: ReactNode;
  background: string;
}

const StyledBackgroundWrapper = styled.div<{ $backgroung: string }>`
    background : ${(props) => props.$backgroung};
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",`;

const BackgroundWrapper = ({
  children,
  background,
}: BackgroundWrapperProps) => {

  return( 
  <StyledBackgroundWrapper $backgroung={background}>
  {children}
  </StyledBackgroundWrapper>
)};

export default BackgroundWrapper;
