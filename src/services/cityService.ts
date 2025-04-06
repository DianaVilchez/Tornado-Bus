import axios from "axios";

export type City = {
  name: string;
  id: number;
};
export type FetchCityParams = {
  type: "origin" | "destination";
  query: string;
  cityInitId?: number;
};

export const cityService = async ({
  query,
  type,
  cityInitId,
}: FetchCityParams): Promise<City[]> => {
    const shouldFetch =
    (type === "origin" && (query.length === 0 || query.length >= 3)) ||
    (type === "destination" && cityInitId); 
  
  if (!shouldFetch) return [];
    try {
      let endpoint = "";
      if (type === "origin") {
        endpoint = "https://discovery.local.onroadts.com/v1/web/select/origin";
        console.log("cityid",cityInitId)  
    } else if (type === "destination") {
        console.log(cityInitId)
        endpoint = `https://discovery.local.onroadts.com/v1/web/select/destiny/${cityInitId}`;
      }
      console.log(query)
      const response = await axios.post(endpoint, { value: query });
      const data = response.data.data.map((item: {name:string, id: number}) => ({
        name: item.name,
        id: item.id,
      }));
      console.log(data)
      console.log("cityid",cityInitId)
      console.log("hola")
      return data;
    } catch (error) {
      console.error("Error al obtener las ciudades", error);
    }
  
  return [];
};
