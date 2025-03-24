import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import CityField from "./CityField";
import { useState } from "react";
import PassengerModal from "./PassengerModal";
import { useNavigate } from "react-router-dom";

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
  const [cityInitId, setCityInitId] = useState<number | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [showCityField, setShowCityField] = useState(false);
  const [showDestinationCityField, setShowDestinationCityField] = useState(false);

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
              <Field name="originCity">
                {({ field, form, meta }: FieldProps) => (
                  <>
                    <div
                      className="city-input"
                      onClick={() => setShowCityField(true)}
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        cursor: "pointer",
                      }}
                    >
                      {form.values.originCityName || "Saliendo Desde..."}
                    </div>

                    {showCityField && (
                      <CityField
                        field={field}
                        form={form}
                        meta={meta}
                        type="origin"
                        cityInitId={cityInitId}
                        onSelectCity={(city) => {
                          setCityInitId(city.id);
                          form.setFieldValue("originCity", city.id);
                          form.setFieldValue("originCityName", city.name);
                          setShowCityField(false); // Oculta CityField tras selección
                        }}
                      />
                    )}
                    <ErrorMessage name="originCity" />
                  </>
                )}
              </Field>
              <ErrorMessage name="originCity" />
            </div>

            <div className="form-options">
              <label> CIUDAD DE DESTINO</label>
              <Field name="destinationCity">
                {({ field, form, meta }: FieldProps) => (
                    <>
                    <div
                      className="city-input"
                      onClick={() => setShowDestinationCityField(true)}
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        cursor: "pointer",
                      }}
                    >
                        {form.values.destinationCityName || "Hacia..."}
                    </div>
                    {showDestinationCityField && (
                  <CityField
                    field={field}
                    form={form}
                    meta={meta}
                    type="destination"
                    cityInitId={cityInitId}
                    onSelectCity={(city: { id: number; name: string }) => {
                      setCityInitId(city.id);
                      form.setFieldValue("destinationCity", city.id);
                      form.setFieldValue("destinationCityName", city.name);
                      setShowDestinationCityField(false);
                    }}
                  />
                )}
                <ErrorMessage name="destinationCity" />
                </>
                )}
              </Field>

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
                onClose={() => setShowModal(false)} // Cierra el modal
                onTotalChange={(total) => {
                  setPassengerCount(total); // Actualiza el número de pasajeros
                  formikProps.setFieldValue("passengers", total); // Actualiza Formik
                }}
              />
            )}
            <button type="submit" className="button-search">Buscar</button>
          </Form>
        );
      }}
    </Formik>
    </>
  );
}
