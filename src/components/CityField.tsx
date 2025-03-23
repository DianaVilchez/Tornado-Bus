import axios from "axios";
import { FieldProps } from "formik";
import { useEffect, useState } from "react";

export interface City {
  id: number;
  name: string;
}
interface CityFieldProps extends FieldProps {
  type: "origin" | "destination";
  cityInitId?: number;
  onSelectCity?: (city: City) => void; 
}
const CityField: React.FC<CityFieldProps> = ({
  field,
  form,
  type,
  cityInitId,
  onSelectCity,
}) => {
    const {  value  } = field;
  const [query, setQuery] = useState<string>(
    typeof value === "string" ? value : value?.name || ""
  );
  const [suggestions, setSuggestions] = useState<City[]>([]);

  useEffect(() => {
    const fetchCity = async () => {
      if (query.length === 0 || query.length >= 3) {
        try {
          let endpoint = "";
          if (type === "origin") {
            endpoint =
              "https://discovery.local.onroadts.com/v1/web/select/origin";
          } else if (type === "destination") {
            if (!cityInitId) {
              console.log("No se proporcionó cityInitId para el campo destino");
              return;
            }
            endpoint = `https://discovery.local.onroadts.com/v1/web/select/destiny/${cityInitId}`;
          }
          const response = await axios.post(endpoint, { value: query });
          setSuggestions(response.data.data);
        } catch (error) {
          console.error("Error al optener la ciudad", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };
    fetchCity();
  }, [query, type, cityInitId]);

  const handleSelect = (city: City) => {
    setQuery(city.name);
    form.setFieldValue(field.name, city);
    setSuggestions([]);
    if (onSelectCity) {
        onSelectCity(city);
      }
  };
  return (
    <div className="field-city">
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((city) => (
            <li key={city.id} onClick={() => handleSelect(city)}>
              {city.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityField;
