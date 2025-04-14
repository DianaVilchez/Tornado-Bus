import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CitySelect } from "./CitySelect";
import { useState } from "react";
import PassengerModal, { PassengerCount } from "./PassengerModal";
// import { useNavigate } from "react-router-dom";
import { City } from "../services/cityService";
import { useNavigate } from "react-router-dom";
const today = new Date();
today.setHours(0, 0, 0, 0);
const searchSchema = Yup.object({
  originCity: Yup.string().required("La ciudad de origen es obligatoria"),
  destinationCity: Yup.string().required("La ciudad de destino es obligatoria"),
  travelDate: Yup.date()
    .min(today, "La fecha no debe ser menor a la de hoy")
    .required("La fecha de viaje es obligatoria"),
  passengers: Yup.number()
    .min(1, "Debe de seleccionar almenos un pasajero")
    .required("El numero de pasajero es obligatorio"),
});

export default function SearchForm() {
  const [origin, setOrigin] = useState<City | null>(null);
  const [, setDestination] = useState<City | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [passengerCount, setPassengerCount] = useState<PassengerCount>({
    total:1,
    byType: { adult: 1, child: 0/*, senior: 0 */},
      disabilityInfo : {
        totalDisabled: 0,
        byType: { adult: 0, child: 0 }
      }
     
  });

const fecha =new Date().toLocaleDateString("sv-SE");
console.log(fecha)
  const navigate = useNavigate();

  return (
    <>
      <Formik
        initialValues={{
          originCity: "",
          originCityName: "",
          destinationCity: "",
          destinationCityName: "",
          travelDate: "",
          passengers: 1,
        }}
        validationSchema={searchSchema}
        onSubmit={(values) => {
          const queryParams = new URLSearchParams({
            originCity: values.originCity,
            originCityName: values.originCityName,
            destinationCity: values.destinationCity,
            destinationCityName: values.destinationCityName,
            travelDate: values.travelDate,
            passengers: values.passengers.toString(),
            adult: (passengerCount.byType.adult || 1).toString(),
    children: (passengerCount.byType.child || 0).toString(), 
    disabledAdults: passengerCount.disabilityInfo.byType.adult.toString(),
    disabledChildren: passengerCount.disabilityInfo.byType.child.toString(), 
          }).toString();
          navigate(`/results?${queryParams}`);
          console.log(queryParams)
        }}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {(formikProps) => {
          console.log("Valores actuales:", formikProps.values);

          return (
            <Form className="form-container">
              <div className="form-options">
                <label> CIUDAD DE ORIGEN </label>
                <CitySelect
                  type="origin"
                  onChange={(city) => {
                    setOrigin(city);
                    formikProps.setFieldValue("originCity", city!.id); 
                    formikProps.setFieldValue("originCityName", city!.name); 
                    setDestination(null);
                  }}
                />
                <ErrorMessage name="destinationCity" />
              </div>

              <div className="form-options">
                <label> CIUDAD DE DESTINO</label>
                <CitySelect
                  key={origin?.id ?? "no-origin"}
                  type="destination"
                  originCityId={origin?.id}
                  onChange={(city) => {
                    setDestination(city);
                    formikProps.setFieldValue("destinationCity", city!.id);
                    formikProps.setFieldValue(
                      "destinationCityName",
                      city!.name
                    );
                  }}
                />

                <ErrorMessage name="destinationCity" />
              </div>

              <div className="form-options">
                <label> FECHA </label>
                <Field
                style={{borderRadius:"20px", fontSize:"17px",color:"#9B9595", padding:"7px",borderStyle: "solid",borderColor:"#9B9595",borderWidth:"0.8px", width:"auto"}}
                  type="date"
                  id="travelDate"
                  name="travelDate"
                  min={new Date().toLocaleDateString("sv-SE")}
                />
                <ErrorMessage name="travelDate" />
              </div>

              <div className="form-options"  >
                <label> PASAJEROS </label>
                <Field
                style={{borderRadius:"20px", fontSize:"17px",color:"#9B9595", padding:"7px",borderStyle: "solid",borderColor:"#9B9595",borderWidth:"0.8px"}}
                  type="number"
                  id="passengers"
                  name="passengers"
                  value={passengerCount.total}
                  onClick={() => setShowModal(true)}
                />
                <ErrorMessage name="passengers" />
              </div>
              {showModal && (
                <PassengerModal
                  open={showModal}
                  onClose={() => setShowModal(false)} 
                  onTotalChange={({total, byType,disabilityInfo}) => {
                    setPassengerCount({total, byType, disabilityInfo}); 
                    formikProps.setFieldValue("passengers", total);
                  }}
                />
              )}
              <button type="submit" className="button-search">
                Buscar
              </button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
