import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type TravelData = {
  id: number;
  dateInitFormat: string;
  HourInitFormat: string;
  dateEndFormat: string;
  HourEndFormat: string;
  travelTime: string;
  cityInitID: number;
  cityInit: string;
  cityEndID: number;
  cityEnd: string;
  addressInit: string;
  totalSeats: number;
  totalNivel: number;
  amount: string;
  companyName: string;
  companyLogo: string;
  currencyID: number;
  currency: string;
};
export default function SearchResults() {
  const location = useLocation();
  const searchParams = location.state;
  console.log("Datos recibidos", searchParams);

  const [data, setData] = useState<TravelData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://discovery.local.onroadts.com/v1/web/list/departure-travels?isMultiRoute=true&isReturn=false",
          {
            limit: 25,
            page: 1,
            filters: {
              date: searchParams.travelDate,
              city: [searchParams.originCity, searchParams.destinationCity],
              passengerNumber: 1,
              passengerDisabilityNumber: 0,
              orderTravel: 1060,
              orderMaxMinTravel: 1,
              isPoint: false,
              currencyID: 567,
              externalInitId: 0,
              externalEndId: 0,
              routeID: null,
              _rowId: null,
            },
          }
        );

        console.log("Respuesta del servidor:", response.data);
        setData(response.data.data);
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
    if (searchParams) fetchData();
  }, [searchParams]);

  return (
    <div>
      <p>Ciudad de origen: {searchParams.originCityName}</p>
      <p>Ciudad de destino: {searchParams.destinationCityName}</p>
      <p>Fecha de viaje: {searchParams.travelDate}</p>
      <p>Pasajeros: {searchParams.passengers}</p>

      <h1>Resultados de búsqueda</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.HourInitFormat}
            {item.dateInitFormat}
          </li>
          
        ))}
      </ul>
    </div>
  );
}
