import styled from "styled-components";
import logo from "../assets/logo.svg";

const Nav = styled.nav`
display: flex;
padding: 1rem;
align-items: left;
`
export default function Navbar (){
    return(
        <Nav>
            <img src={logo} alt="Logo" width="100" height="100"/>
        </Nav>
    )
}