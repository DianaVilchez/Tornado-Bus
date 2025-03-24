import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import arrow from "../assets/arrow.svg";
import person from "../assets/person.svg";
import SeatIcon from '@mui/icons-material/Weekend';
import Person4Icon from '@mui/icons-material/Person4';
import StairsIcon from '@mui/icons-material/Stairs';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";
import BackgroundWrapper from "./Background";
import Navbar from "./Navbar";
interface Seat {
  id: number;
  row: number;
  column: number;
  seat: number;
  status: string;
  icon:string;
}

export default function TravelDetails() {
  const location = useLocation();
  const searchParams = location.state;
  console.log("Datos recibidos", searchParams);
  const dataTravel = searchParams.selectedTravel;
  const travelId = dataTravel.id;
  const cityInitId = dataTravel.cityInitID;
  const cityInit = dataTravel.cityInit;
  const cityEndId = dataTravel.cityEndID;
  console.log(searchParams)
  console.log(cityInitId);
  console.log(cityInit);
  console.log(cityEndId);
  console.log(travelId);
  console.log(dataTravel);

  // const [details, setDetails] = React.useState(null);
  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    console.log("Valores antes de la llamada API:", {
      travelId,
      cityInitId,
      cityEndId,
    });
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.local.onroadts.com/v1/web/list/seats/${travelId}/${cityInitId}/${cityEndId}`
        );
        console.log("dataapi", response);
        // const data = response.data.data;
        if (response.data?.data) {
          const formattedSeats = response.data.data.flatMap((level: any) =>
            level.seats.map((seat: any) => ({
              icon: seat.icon,
              id: seat.id,
              row: seat.row,
              column: seat.column,
              seat: seat.seat,
              status: seat.status,
            }))
          );
        // console.log("data", data);
        console.log("data1", formattedSeats);
        
        setSeats(formattedSeats);
        }
      } catch (error) {
        console.error("Error al obtener los detalles del viaje:", error);
      }
    };
    fetchData();
  }, [travelId, cityInitId, cityEndId]);
  const getSeatColor = (status: string, icon: string) => {
    if (icon === "chofer") {
      return "black"; // Color para el chofer, o el color que prefieras
    } else if (icon === "escalera") {
      return "black"; // Color para la escalera, o el color que prefieras
    }
    switch (status) {
      case "Disponible":
        return "#00269D"; 
      case "Ocupado":
        return "#F29D38"; 
      case "":
        return "white";
    }
  };
  return (
    
    <BackgroundWrapper background="#EFEFEF">
      <Navbar/>
    
      <div className="container-summary">
      <div className="summary-search">
        <div>
          <p> {dataTravel.cityInit.toUpperCase()}</p>
          <p> {dataTravel.travelDate}</p>
        </div>
        <div>
          <img src={arrow} alt="Logo" width="60vw" height="50" />
        </div>
        <div>
          <p>{dataTravel.cityEnd.toUpperCase()}</p>
        </div>
        <img src={person} alt="Logo" width="80vw" height="50" />
        <p>{dataTravel.passengers}</p>
      </div>
      </div>

      <h2>Detalles del viaje</h2>
      <section className="details-content">
        <div>
      <TableContainer component={Paper} style={{ width: "350px", overflowX: "auto" }}>
      <Table width="200px">
        <TableBody>
          {Array.from(new Set(seats.map((s) => s.column))).map((column) => (
            <TableRow key={column}>
              {seats
                .filter((seat) => seat.column === column)
                .sort((a, b) => a.column - b.column) // Ordenar por columna
                .map((seat) => (
                  <TableCell key={seat.id} style={{ textAlign: "center", padding: 8 }}>
                       {seat.icon === "chofer" ? (
                        <Person4Icon sx={{ fontSize: 40, color: getSeatColor(seat.status,seat.icon), cursor: "pointer" }} />
                      
                      ) : seat.icon === "escalera" ? (
                        <StairsIcon sx={{ fontSize: 40, color: getSeatColor(seat.status, seat.icon), cursor: "pointer" }} />
                      ) : (
                        <SeatIcon sx={{ fontSize: 40, color: getSeatColor(seat.status,seat.icon), cursor: "pointer" }} />
                      )}                  </TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  
    <div style={{display:"flex",flexDirection:"column"}}>
      
      <h3>Estado de asientos</h3>
      <div className="seat-status" style={{backgroundColor:"white",display:"flex", flexDirection:"row", padding: "2px 10px",
    borderRadius: "15px", margin:"20px 6px", gap:"15px", justifyContent:"center" , }}>
      <SeatIcon sx={{ fontSize: 40, color:"#00269D" , cursor: "pointer" }} /><p>Disponible</p>
      <SeatIcon sx={{ fontSize: 40, color:"#F29D38" , cursor: "pointer" }} /><p>Ocupado</p>
      </div>
      <button className="button-search">continuar</button>
    </div>
    </section>
    
    
    </BackgroundWrapper>
  );
}
