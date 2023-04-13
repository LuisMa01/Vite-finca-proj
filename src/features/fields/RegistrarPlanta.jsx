import React from "react";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import "../../styles/registrar-plantilla.css";

import {
  useGetPlantsQuery,
  useAddNewPlantMutation,
} from "./redux/plantApiSlice";
import { useState, useEffect } from "react";
import Plant from "../../components/Plant";
import useAuth from "../../hooks/useAuth";

const PLANT_REGEX =
  /^([A-Z]{1})([a-z0-9]{4,20})(([- ]{1}?)([a-zA-Z0-9]{1,20}?)){0,3}$/;
const VARY_REGEX = /^([A-Z]{1})([a-z-0-9]{2,20})$/;
const FRAME_REGEX = /^((\d{1,3})(\.?)(\d{0,2}))[X-x]((\d{1,3})(\.?)(\d{0,2}))/;

const RegistrarPlanta = () => {
  const { username, isManager, isAdmin } = useAuth();
  const {
    data: plants,

    isSuccess,
    isError,
    error,
  } = useGetPlantsQuery("plantsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const [
    addNewPlant,
    {
      isLoading,
      isSuccess: addissuccess,
      isError: addiserror,
      error: adderror,
    },
  ] = useAddNewPlantMutation();

  const [plantName, setPlantname] = useState("");
  const [desc, setDesc] = useState("");
  const [variety, setVary] = useState("");
  const [plantFrame, setPlantFrame] = useState("");
  const [validPlantName, setValidPlantName] = useState(false);
  const [validVary, setValidVary] = useState(false);
  const [validFrame, setValidFrame] = useState(false);

  useEffect(() => {
    setValidPlantName(PLANT_REGEX.test(plantName));
  }, [plantName]);
  useEffect(() => {
    setValidVary(VARY_REGEX.test(variety));
  }, [variety]);
  useEffect(() => {
    setValidFrame(FRAME_REGEX.test(plantFrame));
  }, [plantFrame]);

  const canSave =
    [
      validPlantName,
      variety ? validVary : true,
      plantFrame ? validFrame : true,
    ].every(Boolean) && !isLoading;

  const onSavePlantClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewPlant({ plantName, desc, variety, plantFrame });
    }
  };

  const onPlantNameChanged = (e) => setPlantname(e.target.value);
  const onPlantDescChanged = (e) => setDesc(e.target.value);
  const onPlantVaryChanged = (e) => setVary(e.target.value);
  const onPlantFrameChanged = (e) => setPlantFrame(e.target.value);
  const onClickClear = (e) => {
    e.preventDefault();
    setPlantname("");
    setDesc("");
    setVary("");
    setPlantFrame("");
  };
  useEffect(() => {
    if (addissuccess) {
      setPlantname("");
      setDesc("");
      setVary("");
      setPlantFrame("");
    }
  }, [addissuccess]);

  let tableContent;
  if (isError) {
    tableContent = <p className="errmsg">{error?.data?.message}</p>;
  }
  if (isSuccess) {
    const { ids } = plants;

    tableContent =
      ids?.length && ids.map((Id) => <Plant key={Id} plantId={Id} />);
  }

  return (
    <>
      {isAdmin && (
        <h1 className="titulo_nueva-plantilla font-weight-bold">Planta</h1>
      )}
      <div className="ventana_plantillas">
        {isAdmin && (
          <form
            className="container col-12 col-sm-11 col-lg-9 bg-light"
            onSubmit={onSavePlantClicked}
          >
            <div className="form-row justify-content-center">
              <div className="col-md-4 mb-3">
                <label htmlFor="nombre_cultivo" className="text-center">
                  Nombre de planta
                </label>
                <input
                  type="text"
                  maxLength={20}
                  className="form-control"
                  id="nombre_cultivo"
                  placeholder="Ej: Fruta X o Fruta-X"
                  pattern="^([A-Z]{1})([a-z0-9]{4,20})(([- ]{1}?)([a-zA-Z0-9]{1,20}?)){0,3}$"
                  value={plantName}
                  onChange={onPlantNameChanged}
                  required="campo requerido"
                />
                <div className="error-message">
                  <p>Formato incorrecto</p>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="nombre_cultivo" className="text-center">
                  Variedad
                </label>
                <input
                  type="text"
                  maxLength={20}
                  className="form-control"
                  pattern="^([A-Z]{1})([a-z-0-9]{2,20})$"
                  id="nombre_cultivo"
                  placeholder="Herbáceas"
                  value={variety}
                  onChange={onPlantVaryChanged}
                />
                <div className="error-message">
                  <p>Formato incorrecto</p>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="nombre_cultivo" className="text-center">
                  Marco de Plantación
                </label>
                <input
                  type="text"
                  maxLength={12}
                  className="form-control"
                  id="nombre_cultivo"
                  pattern="^((\d{1,3})(\.?)(\d{0,2}))[X-x]((\d{1,3})(\.?)(\d{0,2}))"
                  value={plantFrame}
                  placeholder="ej: 1.1X2.2"
                  onChange={onPlantFrameChanged}
                />
                <div className="error-message">
                  <p>Formato incorrecto</p>
                </div>
              </div>
            </div>

            <div className="form-row justify-content-center">
              <div className="col-12 mb-3">
                <label htmlFor="responsable">Descripción</label>
                <input
                  type="text"
                  maxLength={200}
                  className="form-control"
                  id="responsable"
                  pattern="^[a-zA-Z-0-9-., ]*$"
                  value={desc}
                  onChange={onPlantDescChanged}
                />
                <div className="error-message">
                  <p>No se admiten caracteres especiales, solo [.] [-] [,]</p>
                </div>
              </div>
            </div>
            <div className="cultivos_button-section">
              <button
                className="btn btn-sm btn-success"
                type="submit"
                disabled={!canSave}
              >
                Agregar
              </button>
              <button className="btn btn-sm btn-danger" onClick={onClickClear}>
                Limpiar
              </button>
            </div>
          </form>
        )}
        <hr />
        <p className="subheader extra-margin font-weight-bold">Plantas</p>
        <div className="table-container-1">
          <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-loyola">
              <tr>
                <th className="align-middle" scope="col">
                  Plantas
                </th>
                <th className="align-middle" scope="col">
                  Variedad
                </th>
                <th className="align-middle" scope="col">
                  Marco de Plantación
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
    </>
  );
};

export default RegistrarPlanta;
