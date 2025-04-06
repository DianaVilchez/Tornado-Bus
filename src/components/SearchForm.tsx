import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CitySelect } from "./CitySelect";
import { useState } from "react";
import PassengerModal from "./PassengerModal";
import { useNavigate } from "react-router-dom";
import { City } from "../services/cityService";

const searchSchema = Yup.object({
  originCity: Yup.string().required("La ciudad de origen es obligatoria"),
  destinationCity: Yup.string().required("La ciudad de destino es obligatoria"),
  travelDate: Yup.date()
    .min(new Date(), "La fecha no debe ser menor a la de hoy")
    .required("La fecha de viaje es obligatoria"),
  passengers: Yup.number()
    .min(1, "Debe de seleccionar almenos un pasajero")
    .required("El numero de pasajero es obligatorio"),
});

export default function SearchForm() {
  const [origin, setOrigin] = useState<City | null>(null);
  const [destination, setDestination] = useState<City | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);


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
          passengerDefault: 1,
        }}
        validationSchema={searchSchema}
        onSubmit={(values) => {
          console.log("Valores enviados al navegar:", values);
          navigate("/results", { state: values });
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
                  type="date"
                  id="travelDate"
                  name="travelDate"
                  min={new Date().toLocaleDateString("sv-SE")}
                />
                <ErrorMessage name="travelDate" />
              </div>

              <div className="form-options">
                <label> PASAJEROS </label>
                <Field
                  type="number"
                  id="passengers"
                  name="passengers"
                  value={`${passengerCount}`}
                  onClick={() => setShowModal(true)}
                />
                <ErrorMessage name="passengers" />
              </div>
              {showModal && (
                <PassengerModal
                  open={showModal}
                  onClose={() => setShowModal(false)} 
                  onTotalChange={(total) => {
                    setPassengerCount(total); 
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
