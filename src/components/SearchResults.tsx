import { useLocation } from "react-router-dom";

export default function SearchResults() {
    const location = useLocation();
    const searchParams = location.state;
    console.log("Datos recibidos",searchParams);

 return(
    <div>
        <h1>Resultados de búsqueda</h1>
      <p>Ciudad de origen: {searchParams.originCityName}</p>
      <p>Ciudad de destino: {searchParams.destinationCityName}</p>
      <p>Fecha de viaje: {searchParams.travelDate}</p>
      <p>Pasajeros: {searchParams.passengers}</p>
    </div>
 )
}