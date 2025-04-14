import { styled } from "styled-components";
import arrow from "../assets/arrow.svg";
import person from "../assets/person.svg";

interface TravelSummaryProps {
  originCityName: string;
  destinationCityName: string;
  passengers: string | null;
  showHours?: boolean;
  departureTime?: string;
  arrivalTime?: string;
  travelDateEnd?: string;
  dateInitFormat?: string;
}
const StyledContainerSummary = styled.div`
  padding: 0.05vw 1vw;
  background-color: #fffcf1;
  display: flex;
  width: 100%;
  box-shadow: -1px 6px 16px -6px rgba(145, 136, 145, 0.68),
    inset -36px 100px 16px -93px rgba(145, 136, 145, 0.68);
`;

export const ContainerSummary = ({
  originCityName,
  destinationCityName,
  passengers,
  showHours = false,
  departureTime,
  arrivalTime,
  travelDateEnd,
  dateInitFormat,
}: TravelSummaryProps) => {
  return (
    <StyledContainerSummary>
      <div className="summary-search">
        <div>
          <p> {originCityName.toUpperCase()}</p>
          <p
            style={{
              fontFamily: "Marvel",
              fontStyle: "italic",
              fontSize: "19px",
            }}
          >
            {" "}
            {dateInitFormat}
          </p>
          {showHours && departureTime && <p>{departureTime}</p>}
        </div>
        <div>
          <img src={arrow} alt="Logo" width="30vw" height="50" />
        </div>
        <div>
          <p>{destinationCityName.toUpperCase()}</p>
          <p
            style={{
              fontFamily: "Marvel",
              fontStyle: "italic",
              fontSize: "19px",
            }}
          >
            {travelDateEnd}
          </p>
          {showHours && arrivalTime && <p>{arrivalTime}</p>}
        </div>
        <img src={person} alt="Logo" width="30vw" height="50" />
        <p>{passengers}</p>
      </div>
    </StyledContainerSummary>
  );
};
