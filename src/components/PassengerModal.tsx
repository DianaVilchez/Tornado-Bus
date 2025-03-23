import { Dialog, Switch } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const label = { inputProps: { 'aria-label': 'Switch demo' } };

interface Passenger {
  id: number;
  disabled: boolean;
}
interface PassengerType {
  id: number;
  name: string;
  ageMin: number;
  ageMax: number;
  passenger: Passenger[];
}
interface PassengerModalProps {
  open:boolean;
  onClose: () => void;
  onTotalChange: (total: number) => void;
}

export default function PassengerModal({ open ,onClose, onTotalChange }: PassengerModalProps) {
  const [types, setTypes] = useState<PassengerType[]>([]);
  
  useEffect(() => {
    axios
      .get("https://api.local.onroadts.com/v1/web/select/type")
      .then((res) => {
        const data = res.data.data;
        console.log("Datos API", res.data.data);

        const formatted = data.map((type: any) => ({
          id: type.id,
          name: type.name,
          ageMin: type.ageMin,
          ageMax: type.ageMax,
          passenger: [],
        }));
        setTypes(formatted);
      })
      .catch((error) => console.error("Error obteniendo datos", error));
  }, []);
  
  const addPassenger = (typeIndex: number) => {
    setTypes((prev) => {
      const newPassenger = prev.map((type, i) => 
      i === typeIndex 
        ? {...type, passenger : [...type.passenger, {id: type.passenger.length +1, disabled: false }]}
        :type
    );
    console.log("🚀 Pasajero agregado:", newPassenger);
    return newPassenger;
  });
  }

  const removePassenger = (typeIndex: number) => {
    setTypes((prev) => {
      const lessPassenger = prev.map((type, i) => 
      i === typeIndex
      ? {...type, passenger : type.passenger.slice(0,-1)}
      :type
    );
    console.log("🚀 Pasajero quitado:", lessPassenger);
    return lessPassenger;
  })
  }

  const toggleDisabled = (typeIndex:number, passengerId:number) => {
    setTypes((prev) => {
      const disabled = prev.map((type, i) => 
      i === typeIndex
      ? {...type, 
      passenger : type.passenger.map((p) => 
        p.id === passengerId ?
        {...p, disabled: !p.disabled} : p
      ),
    }
    :type
  )
  console.log("🚀 Pasajero con Discapacidad:", disabled)
  return disabled
}
);
}
const handleContinue = () => {
  let totalPassengers = 0;

  types.forEach((type) => {
    totalPassengers += type.passenger.length;
  });
  console.log(`${totalPassengers} pasajeros`);

  onTotalChange(totalPassengers);
  onClose();

};
  return (
    <Dialog open={open} onClose={onClose}>
    <section>
      <button onClick={onClose}>x</button>
      {types.map((type, typeIndex) => (
        <div key={type.id}>
          <h2>{type.name}</h2>
          <h3>De {type.ageMin} a {type.ageMax} años </h3>
          <button onClick={() => addPassenger(typeIndex)}> + </button>
          <button onClick={() => removePassenger(typeIndex)}> - </button>
          <div>
            {type.passenger.map((passenger) => (
              <div key={passenger.id}>
                {type.name} {passenger.id}
                <Switch {...label}
                // checked={passenger.disabled}
                onChange={() => toggleDisabled(typeIndex, passenger.id)}
                />♿
              </div>
            ))}
            
          </div>
        </div>
        
      ))}
      {/* <p>{total}</p> */}
      <button onClick={handleContinue} > Continuar </button>
    </section>
    </Dialog>
  );
}
