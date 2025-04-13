import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import arrow from "../assets/arrow.svg";
import person from "../assets/person.svg";
import SeatIcon from "@mui/icons-material/Weekend";
import Person4Icon from "@mui/icons-material/Person4";
import StairsIcon from "@mui/icons-material/Stairs";
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
interface Seat {
  id: number;
  row: number;
  column: number;
  seat: number;
  status: string;
  icon: string;
}

export default function TravelDetails() {
  const [searchParams] = useSearchParams();
  console.log("Datos recibidos", searchParams);
  const travelId = searchParams.get("travelId");
  const cityInitId = searchParams.get("originCity");
  const cityInit = searchParams.get("originCityName") || "";
  const cityEndId = searchParams.get("destinationCity");
  const cityEnd = searchParams.get("destinationCityName") || "";
  const travelDate = searchParams.get("travelDate");
  const passengers = searchParams.get("passengers");

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

    const maxSelectedCount = Number(passengers);
    console.log("maximo de pasajeros",maxSelectedCount)
    console.log("aientos seleccionados",selectedCount)

    if (selectedCount > maxSelectedCount) {
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
        // Actualizar el estado local con los nuevos datos
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

  return (
    <BackgroundWrapper background="#EFEFEF">
      <Navbar />

      <div className="container-summary">
        <div className="summary-search">
          <div>
            <p> {cityInit.toUpperCase()}</p>
            <p> {travelDate}</p>
          </div>
          <div>
            <img src={arrow} alt="Logo" width="60vw" height="50" />
          </div>
          <div>
            <p>{cityEnd.toUpperCase()}</p>
          </div>
          <img src={person} alt="Logo" width="80vw" height="50" />
          <p>{passengers}</p>
        </div>
      </div>

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
                        .sort((a, b) => a.column - b.column) // Ordenar por columna
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
                            ) : (
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

        <div style={{ display: "flex", flexDirection: "column" }}>
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
          <button className="button-search">continuar</button>
        </div>
      </section>
    </BackgroundWrapper>
  );
}
