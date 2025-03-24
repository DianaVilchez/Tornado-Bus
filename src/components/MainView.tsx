import Navbar from "./Navbar";
import SearchForm from "./SearchForm";
import headerImage from "../assets/header-image.jpg";
import footerImage from "../assets/about-us-footer.jpg";

export default function MainView () {
    return (
        <>
        <Navbar/>
        <div className="container-body">
        <img src={headerImage} className="header-Image"/>
        <h1 className="headline">Busca tu proximo viaje</h1>
        <SearchForm/>
        </div>
        <img src={footerImage} className="footer-Image"/>
        

        </>
    )
}