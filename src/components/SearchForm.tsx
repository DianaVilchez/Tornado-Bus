import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import CityField from "./CityField";
import { useState } from "react";
import PassengerModal from "./PassengerModal";

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
  const [cityInitId, setCityInitId] = useState<number |  undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  return (
    <Formik
      initialValues={{
        originCity: "",
        destinationCity: "",
        travelDate: "",
        passengerCount: 1,
      }}
      validationSchema={searchSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {(formikProps) => (
        
        <Form className="form-container">
          <div className="form-options">
            <label> Ciudad de Origen:</label>
            <Field name="originCity">
              {({ field, form, meta }: FieldProps) => (
                <CityField
                  field={field}
                  form={form}
                  meta={meta}
                  type="origin"
                  cityInitId={cityInitId}
                  onSelectCity={(city) => {
                    setCityInitId(city.id);
                    formikProps.setFieldValue("originCity", city);
                  }}
                />
              )}
            </Field>
            <ErrorMessage name="originCity" />
          </div>

          <div className="form-options">
            <label> Ciudad de Destino:</label>
            <Field name="destinationCity">
              {({ field, form, meta }: FieldProps) => (
                <CityField
                  field={field}
                  form={form}
                  meta={meta}
                  type="destination"
                  cityInitId={cityInitId} 
                  onSelectCity={(city: { id: number; name: string }) => {
                    setCityInitId(city.id);
                    form.setFieldValue("destinationCity", city);
                  }}
                />
              )}
            </Field>

            <ErrorMessage name="destinationCity" />
          </div>

          <div className="form-options">
            <label> Fecha de Viaje:</label>
            <Field type="date" id="travelDate" name="travelDate" min={new Date().toLocaleDateString("sv-SE")}  />
            <ErrorMessage name="travelDate" />
          </div>

          <div className="form-options">
            <label> Pasajeros:</label>
            <Field type="number" id="passengers" name="passengers" 
            value={`${passengerCount}`}
            onClick= {() => setShowModal(true)}/>
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

          <button type="submit">Buscar</button>
        </Form>
      )}
    </Formik>
  );
}
