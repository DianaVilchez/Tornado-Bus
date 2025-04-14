import AsyncSelect from "react-select/async";
import { City, cityService } from "../services/cityService";

type CitySelect = {
  type: "origin" | "destination";
  originCityId?: number;
  onChange: (value: City | null ) => void; 
}
export const CitySelect = ({
  type,
  originCityId,
  onChange,
}: CitySelect) => {
const loadOptions = async (inputValue: string) => {
      const response = await cityService({query:inputValue, type, cityInitId:originCityId});
  return response.map((city) => ({label: city.name, value: city.id}));
}
return (
  <AsyncSelect
  styles={{control: (baseStyles) => ({
    ...baseStyles,
    borderColor:'#9B9595',
    borderRadius:'80px',
    padding:'0px',
  })}}
  defaultOptions={true}
  loadOptions={loadOptions}
  onChange={(option) => {
          if (option) {
            onChange({ id: option.value, name: option.label });
          } else {
            onChange(null);
          }
        }}
        isDisabled={type === "destination" && !originCityId}
    placeholder={type === "origin" ? "Selecciona origen" : "Selecciona destino"}
  />
)
}
