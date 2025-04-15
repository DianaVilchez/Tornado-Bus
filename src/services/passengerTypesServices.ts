import axios from "axios";

export interface Passenger {
    id: number;
    disabled: boolean;
  }
export interface PassengerType {
    id: number;
    name: string;
    ageMin: number;
    ageMax: number;
    passenger: Passenger[];
  }

export const getPassengerTypes = async (): Promise<PassengerType[]> => {
    try{
      const response = await axios.get("https://api.local.onroadts.com/v1/web/select/type");
      const data = response.data.data;
      console.log("Datos API", response.data.data);

      const formatted = data.map((type: PassengerType) => ({
        id: type.id,
        name: type.name,
        ageMin: type.ageMin,
        ageMax: type.ageMax,
        passenger: [],
      }));
      return(formatted);
}
  catch(error){
    console.error("Error obteniendo tipos de pasajero", error);
    throw error;
  }
}