import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import arrow from "../assets/arrow.svg";
import person from "../assets/person.svg";
import BackgroundWrapper from "./Background";
import Navbar from "./Navbar";

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

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  console.log("Datos recibidos", searchParams);
  const newSearchParams = new URLSearchParams(searchParams.toString());
  
  const handleClick = (item: TravelData) => {
    newSearchParams.set('travelId', item.id.toString());
    navigate(`/details?${newSearchParams}`); 
  };

  const [data, setData] = useState<TravelData[]>([]);

  const searchData = {
    originCity: searchParams.get('originCity') || '',
    originCityName: searchParams.get('originCityName') || '',
    destinationCity: searchParams.get('destinationCity') || '',
    destinationCityName: searchParams.get('destinationCityName') || '',
    travelDate: searchParams.get('travelDate') || '',
    passengers: parseInt(searchParams.get('passengers') || '1')
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const response = await axios.post(
          "https://discovery.local.onroadts.com/v1/web/list/departure-travels?isMultiRoute=true&isReturn=false",
          {
            limit: 25,
            page: 1,
            filters: {
              date: searchData.travelDate,
              city: [Number(searchData.originCity), Number(searchData.destinationCity)],
              passengerNumber: searchData.passengers,
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
        if (axios.isAxiosError(error)) {
          console.error("Error detallado:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });
        } else {
          console.error("Error inesperado:", error);
        }
      }
    };
    if (searchData) fetchData();
  }, [searchParams]);

  return (
    <BackgroundWrapper background="#EFEFEF">
      <Navbar />
      <section style={{display:"flex", flexDirection:"column",alignItems:"center"}}>
        <div className="container-summary">
          <div className="summary-search">
            <div>
              <p> {searchData.originCityName.toUpperCase()}</p>
              <p> {searchData.travelDate}</p>
            </div>
            <div>
              <img src={arrow} alt="Logo" width="60vw" height="50" />
            </div>
            <div>
              <p>{searchData.destinationCityName.toUpperCase()}</p>
            </div>
            <img src={person} alt="Logo" width="80vw" height="50" />
            <p>{searchData.passengers}</p>
          </div>
        </div>
        <h2>Resultados de búsqueda</h2>
        { data.length >0 ? (<div>
          {data.map((item) => (
            <div className="option" key={item.id} onClick={() => handleClick(item)}>
              <div className="tripOptions">
                <div className="dataOptions">
                  <p>{item.HourInitFormat}</p>
                  <p>{item.cityInit.toUpperCase()}</p>
                </div>
                <div className="dataOptions">
                <img src={arrow} alt="Logo" width="60vw" height="50" />
                <p>{item.travelTime}</p>
                </div>
                <div className="dataOptions">
                  <p>{item.HourEndFormat}</p>
                  <p>{item.cityEnd.toUpperCase()}</p>
                </div>
              </div>
              <p>
                Por persona{" "}
                <span style={{ color: "#FD971A", fontWeight: "bolder", fontSize:"20px" }}>
                  {item.currencyID}
                </span>
              </p>
            </div>
          ))}
        </div>) : <h3>No se encontraron viajes disponibles</h3>}
      </section>
    </BackgroundWrapper>
  );
}
