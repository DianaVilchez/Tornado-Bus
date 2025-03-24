import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const searchParams = location.state;
  const navigate = useNavigate();
  console.log("Datos recibidos", searchParams);

  const [data, setData] = useState<TravelData[]>([]);
  
  const handleClick = (item: TravelData) => {
    navigate("/detalle", { state: { selectedTravel: item } }); 
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
    <BackgroundWrapper background="#EFEFEF">
      <Navbar />
      <section>
        <div className="container-summary">
          <div className="summary-search">
            <div>
              <p> {searchParams.originCityName.toUpperCase()}</p>
              <p> {searchParams.travelDate}</p>
            </div>
            <div>
              <img src={arrow} alt="Logo" width="60vw" height="50" />
            </div>
            <div>
              <p>{searchParams.destinationCityName.toUpperCase()}</p>
            </div>
            <img src={person} alt="Logo" width="80vw" height="50" />
            <p>{searchParams.passengers}</p>
          </div>
        </div>
        <h2>Resultados de búsqueda</h2>
        <div>
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
        </div>
      </section>
    </BackgroundWrapper>
  );
}
