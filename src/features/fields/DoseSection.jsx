import React from "react";
import "../../styles/nav_cultivos.css";
import ReImage from "../../images/return.svg";
import "../../styles/item-section.css";
import { useGetDosesQuery, useAddNewDoseMutation } from "./redux/doseApiSlice";

import { useState, useEffect } from "react";
import Dose from "../../components/Dose";
import useAuth from "../../hooks/useAuth";

const DOSE_REGEX =
  /^([A-ZÑ\d]{1})([\wñÑ\d]{0,20})(\/?\s?-?([\wñÑ\d]{1,20}?)){0,4}/;
const UNIT_REGEX = /^([\wñÑ\d]{0,20})((\/?\s?-?)([\wñÑ\d]{1,20}?)){0,4}$/;
const DoseSection = () => {
  const { username, isManager, isAdmin } = useAuth();
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
    {
      isSuccess: addissuccess,
      isLoading: isLoad,
      isError: addiserror,
      error: adderror,
    },
  ] = useAddNewDoseMutation();

  const [doseName, setDoseName] = useState("");
  const [desc, setDesc] = useState("");
  const [doseUnit, setDoseUnit] = useState("");
  const [validDose, setValidDose] = useState(false);
  const [validUnit, setValidUnit] = useState(false);

  useEffect(() => {
    setValidUnit(UNIT_REGEX.test(doseUnit));
  }, [doseUnit]);
  useEffect(() => {
    setValidDose(DOSE_REGEX.test(doseName));
  }, [doseName]);

  const canSave = [validDose, validUnit].every(Boolean) && !isLoad;

  const onSaveDoseClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewDose({ doseName, desc, doseUnit });
    }
  };

  const onDoseNameChanged = (e) => setDoseName(e.target.value);
  const onItemDescChanged = (e) => setDesc(e.target.value);
  const onDoseUnitChanged = (e) => setDoseUnit(e.target.value);
  const handleClearClick = (e) => {
    e.preventDefault();
    setDoseName("");
    setDesc("");
    setDoseUnit("");
  };
  useEffect(() => {
    if (addissuccess) {
      setDoseName("");
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
      ids?.length &&
      ids.map((Id) => {
        return <Dose key={Id} doseId={Id} />;
      });

    content = (
      <div className="ventana_plantillas">
        <p className="font-weight-bold subheader">Lista de dosis existentes</p>
        <div className="table-container-1">
          <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-loyola">
              <tr>
                <th className="align-middle" scope="col">
                  Dosis
                </th>
                <th className="align-middle" scope="col">
                  Unidad
                </th>
                <th className="align-middle" scope="col">
                  Descripción
                </th>
                {(isManager || isAdmin) && (
                  <th className="align-middle" scope="col">
                    Estatus
                  </th>
                )}
                {isAdmin && (
                  <th className="align-middle" scope="col">
                    Eliminar
                  </th>
                )}
                {isAdmin && (
                  <th className="align-middle" scope="col">
                    Editar
                  </th>
                )}
              </tr>
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
        {isAdmin && (
          <form
            className="col-12 col-lg-9  justify-content-center needs-validation"
            onSubmit={onSaveDoseClicked}
          >
            <p className="font-weight-bold subheader">Agregar dosis</p>
            <div className="form-row bg-light">
              <div className="col-md-3 mb-3">
                <input
                  type="text"
                  maxLength={20}
                  className="form-control"
                  placeholder="Ej: hora/hombre"
                  pattern="^([A-ZÑ\d]{1})([\wñÑ\d]{0,20})(\/?-?([\wñÑ\d]{1,20}?)){0,4}"
                  value={doseName}
                  onChange={onDoseNameChanged}
                  required
                />
                <div className="error-message">
                  <p>Formato incorrecto. Ej: [hora/hombre]</p>
                </div>
              </div>
              <div className="col-12 col-md-3 mb-2">
                <input
                  type="text"
                  maxLength={20}
                  className="form-control"
                  placeholder="Unidad"
                  pattern="^([\wñÑ\d]{0,20})((\/?\s?-?)([\wñÑ\d]{1,20}?)){0,4}$"
                  value={doseUnit}
                  onChange={onDoseUnitChanged}
                />
                <div className="error-message">
                  <p>Formato incorrecto. Ej: [hora]</p>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <input
                  type="text"
                  maxLength={200}
                  className="form-control"
                  placeholder="Descripción"
                  value={desc}
                  onChange={onItemDescChanged}
                />
              </div>
            </div>

            <div className="form-row cultivos_button-section">
              <button
                className="btn btn-success"
                type="submit"
                disabled={!canSave}
              >
                Guardar
              </button>

              <button className="btn btn-danger" onClick={handleClearClick}>
                Limpiar
              </button>
            </div>
          </form>
        )}
      </div>
      <hr />
      {content}
    </>
  );
};

export default DoseSection;
