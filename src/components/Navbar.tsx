import styled from "styled-components";
import logo from "../assets/logo.svg";

const Nav = styled.nav`
display: flex;
padding: 1rem 6vw;
align-items: center;
background: white;
height: 3.5vw;
box-shadow: 0px 5px 16px 0px rgba(145,136,145,1);
@media (max-width: 768px) {
    height: 60px;
    align-items: flex-end;
    padding: 3px 6vw;
  }
`;
const Logo = styled.img`
  height: 20;
  width: 17vw;

  @media (max-width: 768px) {
    width: fit-content;
    height: 25px;
  }
`;
export default function Navbar() {
  return (
    <Nav>
      <Logo src={logo} alt="Logo" />
    </Nav>
  );
}
