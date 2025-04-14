import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import SeatIcon from "@mui/icons-material/Weekend";
import Person4Icon from "@mui/icons-material/Person4";
import StairsIcon from "@mui/icons-material/Stairs";
import AccessibleIcon from '@mui/icons-material/Accessible';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import BackgroundWrapper from "./Background";
import Navbar from "./Navbar";
import { ContainerSummary } from "./containerSummary";
import ButtonModal from "./buttonModal";
interface Seat {
  id: number;
  row: number;
  column: number;
  seat: number;
  status: string;
  icon: string;
}

export default function TravelDetails() {

  const location = useLocation();
  const paramsState = location.state;
  const [searchParams] = useSearchParams();
  console.log("Datos recibidos", searchParams);
  const travelId = searchParams.get("travelId");
  const cityInitId = searchParams.get("originCity");
  const cityInit = searchParams.get("originCityName") || "";
  const cityEndId = searchParams.get("destinationCity");
  const cityEnd = searchParams.get("destinationCityName") || "";
  // const disabledAdults = searchParams.get("disabledAdults");
  // const disabledChildren = searchParams.get("disabledChildren");
  const travelDateEnd = paramsState.selectedTravel.dateEndFormat;
  const passengers = searchParams.get("passengers");
  const numberPassengers = Number(passengers);
  const hourInitFormat = paramsState.selectedTravel.HourInitFormat;
  console.log('hourInitFormat',hourInitFormat)
  const hourEndFormat = paramsState.selectedTravel.HourEndFormat;
  const dateInitFormat = paramsState.selectedTravel.dateInitFormat;
  

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedCount, setSelectedCount] = useState(1);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.local.onroadts.com/v1/web/list/seats/${travelId}/${cityInitId}/${cityEndId}`
      );
      console.log("dataapi", response);

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
      setSeats(formattedSeats);
      console.log("data.data", response.data.data);
      console.log("formatdata", formattedSeats);
    } catch (error) {
      console.error("Error al obtener los detalles del viaje:", error);
    }
  };
  useEffect(() => {
    console.log("Valores antes de la llamada API:", {
      travelId,
      cityInitId,
      cityEndId,
    });

    fetchData();
  }, [travelId, cityInitId, cityEndId]);

  const getSeatColor = (status: string, icon: string) => {
    if (icon === "chofer") {
      return "black";
    } else if (icon === "escalera") {
      return "black";
    }
    switch (status) {
      case "Disponible":
        return "#00269D";
      case "Seleccionado":
        return "#F29D38";
      case "Ocupado":
        return "#F29D38";
      default:
        return "white";
    }
  };
  const maxSelectedCount = Number(passengers) ;
 const disabledPassengers = Number(searchParams.get("disabledAdults")) + 
                             Number(searchParams.get("disabledChildren"));
 const passengerRegular = numberPassengers - disabledPassengers;
 const currentDisabledSelections = seats.filter(s => 
  s.icon === "discapacitados" && s.status === "Seleccionado"
).length;
const currentRegularSelections = seats.filter(s => 
  s.icon === "asiento" && s.status === "Seleccionado"
).length;
console.log('currentRegularSelections',currentRegularSelections)
console.log('seats',seats)
console.log('seats',seats)

  const handleSelection = async (seatId: number) => {
    const dataFetchSelection = {
      tickeTypeID: 219,
      ticketSessionId: null,
      cityInitID: cityInitId,
      cityEndID: cityEndId,
      itineraryID: travelId,
      busPlaceID: [seatId],
      tempTicketId: null,
      ticketRef: null,
      idMulti: null,
      isReturn: false,
      currencyID: 567,
      mDestiny: null,
      mOrigin: null,
      mRow: null,
      timeZone: "America/Lima",
      externalInitID: null,
      externalEndID: null,
    };
    const seat = seats.find(s => s.id === seatId);
    if (seat?.icon === "asiento") {
      

      if (currentRegularSelections >= passengerRegular) {
        alert(`Ya ha seleccionado el máximo de ${passengerRegular} asientos regulares`);
        return;
      }
    }
  if (seat?.icon === "discapacitados") {
    if (disabledPassengers === 0) {
      alert("No ha registrado pasajeros con discapacidad en su búsqueda");
      return;
    }
    
    
    
    if (currentDisabledSelections >= disabledPassengers) {
      alert(`Ya ha seleccionado el máximo de ${disabledPassengers} asientos para discapacitados`);
      return;
    }
  }
  const totalSelected = seats.filter(s => s.status === "Seleccionado").length;
    
    console.log("maximo de pasajeros",maxSelectedCount)
    console.log("aientos seleccionados",selectedCount)

    if (totalSelected >= maxSelectedCount) {
      alert(`Ya has seleccionado el máximo de ${maxSelectedCount} asientos`);
      return;
    }
    try {
      const response = await axios.put(
        "https://api.local.onroadts.com/v1/web/list/seats/mark",
        dataFetchSelection
      );
      console.log("resultado", response);
      console.log("asiento seleccionado");
      await fetchData();

      const selectedSeat = seats.find(seat => seat.id === seatId);
      if (selectedSeat?.status === "Disponible") {
        setSelectedCount(prev => prev + 1);
      }

      await fetchData();
      
      const updatedSeatsResponse = response.data.data.busSketch[0].seats
      
      if (updatedSeatsResponse) {
        const updatedSeats = seats.map((seat) => {
          const updatedSeat = updatedSeatsResponse.find(
            (s: any) => s.id === seat.id
          );
          return updatedSeat
            ? {
                ...seat,
                status: updatedSeat.status,
              }
            : seat;
        });

        setSeats(updatedSeats);
      }
    } catch (error) {
      console.error("Error al obtener los detalles del viaje:", error);
    }
  };
  console.log('asientos seleccionados:',currentRegularSelections + currentDisabledSelections)

  return (
    <BackgroundWrapper background="#EFEFEF">
      <Navbar />

      <ContainerSummary
  originCityName={cityInit}
  destinationCityName={cityEnd}
  passengers={passengers}
  showHours={true}
  departureTime={hourInitFormat}
  arrivalTime={hourEndFormat}
  travelDateEnd = {travelDateEnd}
  dateInitFormat ={dateInitFormat}
/>

      <h2>Detalles del viaje</h2>
      <section className="details-content">
        <div>
          <TableContainer
            component={Paper}
            style={{ width: "350px", overflowX: "auto" }}
          >
            <Table width="200px">
              <TableBody>
                {Array.from(new Set(seats.map((s) => s.column))).map(
                  (column) => (
                    <TableRow key={column}>
                      {seats
                        .filter((seat) => seat.column === column)
                        .sort((a, b) => a.column - b.column)
                        .map((seat) => (
                          <TableCell
                            key={seat.id}
                            style={{ textAlign: "center", padding: 8 }}
                          >
                            {seat.icon === "chofer" ? (
                              <Person4Icon
                                sx={{
                                  fontSize: 40,
                                  color: getSeatColor(seat.status, seat.icon),
                                  cursor: "pointer",
                                }}
                              />
                            ) : seat.icon === "escalera" ? (
                              <StairsIcon
                                sx={{
                                  fontSize: 40,
                                  color: getSeatColor(seat.status, seat.icon),
                                  cursor: "pointer",
                                }}
                              />
                            ) : seat.icon === "discapacitados" ? (
                              <AccessibleIcon
                              onClick={() => handleSelection(seat.id)}
                                sx={{
                                  fontSize: 40,
                                  color: getSeatColor(seat.status, seat.icon),
                                  cursor: "pointer",
                                  
                                }}
                              />
                            ): (
                              <SeatIcon
                                onClick={() => handleSelection(seat.id)}
                                sx={{
                                  fontSize: 40,
                                  color: getSeatColor(seat.status, seat.icon),
                                  cursor: "pointer",
                                }}
                              />
                            )}{" "}
                          </TableCell>
                        ))}
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems:"center"}}>
          <h3>Estado de asientos</h3>
          <div
            className="seat-status"
            style={{
              backgroundColor: "white",
              display: "flex",
              flexDirection: "row",
              padding: "2px 10px",
              borderRadius: "15px",
              margin: "20px 6px",
              gap: "15px",
              justifyContent: "center",
            }}
          >
            <SeatIcon
              sx={{ fontSize: 40, color: "#00269D", cursor: "pointer" }}
            />
            <p>Disponible</p>
            <SeatIcon
              sx={{ fontSize: 40, color: "#F29D38", cursor: "pointer" }}
            />
            <p>Ocupado</p>
          </div>
          
          <div>
            
          <h3>Asientos por seleccionar</h3>
          <div className="total-passengers">
            <div>
          <h4> ASIENTOS REGULAR </h4>
          <div> {passengerRegular} sitios</div>
          </div>
          <div>
          <h4> ACCESIBILIDAD </h4>
          <div> {disabledPassengers} sitios </div>
          </div>
          </div>
        </div>
        <ButtonModal 
  totalSelected={currentRegularSelections + currentDisabledSelections}
  totalRequired={maxSelectedCount}
/>
        </div>
        
      </section>
    </BackgroundWrapper>
  );
}
