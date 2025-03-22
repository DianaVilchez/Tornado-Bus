import axios from "axios";
import { useEffect, useState } from "react";

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

export default function PassengerModal() {
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
  return (
    <section>
      {types.map((type) => (
        <div key={type.id}>
          <h2>{type.name}</h2>
          <h3>De {type.ageMin} a {type.ageMax} años </h3>
        </div>
      ))}
    </section>
  );
}
