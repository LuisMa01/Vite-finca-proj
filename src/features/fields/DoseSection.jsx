import React from "react";
import "../../styles/nav_cultivos.css";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import "../../styles/item-section.css";
import { useGetDosesQuery, useAddNewDoseMutation } from "./redux/doseApiSlice";

import { useState, useEffect } from "react";
import Dose from "../../components/Dose";


const DoseSection = () => {
  const {
    data: doses,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetDosesQuery("dosesList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
 

  const [
    addNewDose,
    { isSuccess: addissuccess, isError: addiserror, error: adderror },
  ] = useAddNewDoseMutation();

  const [doseName, seDoseName] = useState("");
  const [desc, setDesc] = useState("");
  const [doseUnit, setDoseUnit] = useState("");
  
  

  //doseName, desc, doseUnit

  const onSaveDoseClicked = async (e) => {
    e.preventDefault();

    await addNewDose({ doseName, desc, doseUnit });
  };

  const onDoseNameChanged = (e) => seDoseName(e.target.value);
  const onItemDescChanged = (e) => setDesc(e.target.value);
  const onDoseUnitChanged = (e) => setDoseUnit(e.target.value);
  const handleClearClick = (e) => {
    e.preventDefault()
    seDoseName("");
      setDesc("");
      setDoseUnit("");
  };
  useEffect(() => {
    if (addissuccess) {
      seDoseName("");
      setDesc("");
      setDoseUnit("");
    }
  }, [addissuccess]);

  
  let content;
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
    console.log(error?.data?.message);
  }

  if (doses) {
    const { ids } = doses;

    let tableContent =
      ids?.length && ids.map((Id) => <Dose key={Id} doseId={Id} />);

    content = (
      <div className="ventana_plantillas">
        <p className="font-weight-bold subheader">Lista de dosis existentes</p>
        <div className="table-container-1">
          <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-loyola">
              <th className="align-middle" scope="col">
                Dosis
              </th>
              <th className="align-middle" scope="col">
                Unidad
              </th>
              <th className="align-middle" scope="col">
                Estatus
              </th>
              <th className="align-middle" scope="col">
                Eliminar
              </th>
            </thead>
            <tbody>{tableContent}</tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="item-section_titulo">Dosis y Unidad</h1>
      <div className="container centered-form">
        <form className="col-12 col-lg-9  justify-content-center needs-validation">
         <p className="font-weight-bold subheader">Agregar dosis</p>
          <div className="form-row bg-light">
            <div className="col-md-3 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Ej: hora/hombre"
                value={doseName}
                onChange={onDoseNameChanged}
                required
              />
            </div>
            <div className="col-12 col-md-3 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Unidad"
                value={doseUnit}
                onChange={onDoseUnitChanged}
              />
            </div>
            <div className="col-12 col-md-6 mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Descripción"
                value={desc}
                onChange={onItemDescChanged}
              />
            </div>
          </div>  
        
          <div className="form-row cultivos_button-section">
            <button
              className="btn btn-success"
              onClick={onSaveDoseClicked}
              type="submit"
            >
              Guardar
            </button>
            
              <button className="btn btn-danger" onClick={handleClearClick}>Limpiar</button>
            
          </div>
        </form>
      </div>
      <hr />
      {content}
    </>
  );
};

export default DoseSection;
