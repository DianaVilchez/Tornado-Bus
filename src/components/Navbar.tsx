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
    height: 80px;
    padding: 1px 6vw;
  }
`
export default function Navbar (){
    return(
        <Nav>
            <img src={logo} alt="Logo" width="200vw" height="50"/>
        </Nav>
    )
}