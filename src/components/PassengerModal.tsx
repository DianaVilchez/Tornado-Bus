// import React from 'react';
import { Dialog, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { getPassengerTypes, PassengerType } from "../services/passengerTypesServices";

const label = { inputProps: { "aria-label": "Switch demo" } };

export type PassengerCount = {
  total: number;
  byType: Record<string, number>;
  disabilityInfo: {
    totalDisabled: number;
    byType: Record<string, number>;
  };
}
interface PassengerModalProps {
  open: boolean;
  onClose: () => void;
  onTotalChange: ({ total, byType, disabilityInfo }: PassengerCount) => void;
}

export default function PassengerModal({
  open,
  onClose,
  onTotalChange,
}: PassengerModalProps) {
  const [types, setTypes] = useState<PassengerType[]>([]);

  useEffect(() => {
    const fetchPassengerTypes = async () => {
      try {
        const passengerTypes = await getPassengerTypes();
        setTypes(passengerTypes);
      } catch (error) {
        console.error("Error cargando tipos de pasajero", error);
      }
    };

    fetchPassengerTypes();
  }, []);

  const addPassenger = (typeIndex: number) => {
    setTypes((prev) => {
      const newPassenger = prev.map((type, i) =>
        i === typeIndex
          ? {
            ...type,
            passenger: [
              ...type.passenger,
              { id: type.passenger.length + 1, disabled: false },
            ],
          }
          : type
      );
      console.log("🚀 Pasajero agregado:", newPassenger);
      return newPassenger;
    });
  };

  const removePassenger = (typeIndex: number) => {
    setTypes((prev) => {
      const lessPassenger = prev.map((type, i) =>
        i === typeIndex
          ? { ...type, passenger: type.passenger.slice(0, -1) }
          : type
      );
      console.log("🚀 Pasajero quitado:", lessPassenger);
      return lessPassenger;
    });
  };

  const toggleDisabled = (typeIndex: number, passengerId: number) => {
    setTypes((prev) => {
      const disabled = prev.map((type, i) =>
        i === typeIndex
          ? {
            ...type,
            passenger: type.passenger.map((p) =>
              p.id === passengerId ? { ...p, disabled: !p.disabled } : p
            ),
          }
          : type
      );
      console.log("🚀 Pasajero con Discapacidad:", disabled);
      return disabled;
    });
  };
  const handleContinue = () => {
    const result = {
      total: 0,
      byType: {} as Record<string, number>,
      disabilityInfo: {
        totalDisabled: 0,
        byType: {} as Record<string, number>
      }
    };
    types.forEach((type) => {
      let typeKey: string;
      switch(true) {
        case type.name.includes("Adulto"):
        typeKey = "adult";  
        break;
        case type.name.includes("Niño"):
          typeKey = "child";
          break;
          case type.name.includes("Senior"):
            typeKey = "senior";
            break;
            default:
              typeKey = "other";
      }
    
  result.byType[typeKey] = type.passenger.length;
  result.total += type.passenger.length;

  const disabledCount = type.passenger.filter(p => p.disabled).length;
    result.disabilityInfo.byType[typeKey] = disabledCount;
    result.disabilityInfo.totalDisabled += disabledCount;
});

console.log(`${result.total} pasajeros`);

onTotalChange(result);
onClose();
  };
return (
  <Dialog open={open} onClose={onClose}>
    <section className="modal-Passengers">
      <button style={{ right: "0" }} onClick={onClose}>x</button>
      {types.map((type, typeIndex) => (
        <div key={type.id}>
          <div className="count-typePassenger">
            <div>
              <h2
                style={{
                  fontFamily: "'Martel Sans',sans-serif",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                {type.name.toUpperCase()}
              </h2>
              <h3>
                De {type.ageMin} a {type.ageMax} años{" "}
              </h3>
            </div>
            <div>
              <button
                style={{ backgroundColor: "#FB8A00" }}
                onClick={() => addPassenger(typeIndex)}
              >
                {" "}
                +{" "}
              </button>
              <button
                style={{ backgroundColor: "#FB8A00", marginLeft: "20px" }}
                onClick={() => removePassenger(typeIndex)}
              >
                {" "}
                -{" "}
              </button>
            </div>
          </div>
          <div>
            {type.passenger.map((passenger) => (
              <div key={passenger.id}>
                {type.name.toUpperCase()} {passenger.id}
                <Switch
                  {...label}
                  // checked={passenger.disabled}
                  onChange={() => toggleDisabled(typeIndex, passenger.id)}
                />
                ♿
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* <p>{total}</p> */}
      <button className="button-search" onClick={handleContinue}> Continuar </button>
    </section>
  </Dialog>
);
}
