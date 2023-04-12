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

const RegistrarPlanta = () => {
  const { username, isManager, isAdmin } = useAuth();
  const {
    data: plants,
    isLoading,
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
    { isSuccess: addissuccess, isError: addiserror, error: adderror },
  ] = useAddNewPlantMutation();

  const [plantName, setPlantname] = useState("");
  const [desc, setDesc] = useState("");
  const [variety, setVary] = useState("");
  const [plantFrame, setPlantFrame] = useState("");

  const onSavePlantClicked = async (e) => {
    e.preventDefault();

    await addNewPlant({ plantName, desc, variety, plantFrame });
  };

  const onPlantNameChanged = (e) => setPlantname(e.target.value);
  const onPlantDescChanged = (e) => setDesc(e.target.value);
  const onPlantVaryChanged = (e) => setVary(e.target.value);
  const onPlantFrameChanged = (e) => setPlantFrame(e.target.value);
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
    console.log(error?.data?.message);
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
          <form className="container col-12 col-sm-11 col-lg-9 bg-light">
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
                  placeholder="Fruta X"
                  value={plantName}
                  onChange={onPlantNameChanged}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="nombre_cultivo" className="text-center">
                  Variedad
                </label>
                <input
                  type="text"
                  maxLength={20}
                  className="form-control"
                  id="nombre_cultivo"
                  value={variety}
                  onChange={onPlantVaryChanged}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="nombre_cultivo" className="text-center">
                  Marco de Plantación
                </label>
                <input
                  type="text"
                  maxLength={15}
                  className="form-control"
                  id="nombre_cultivo"
                  value={plantFrame}
                  onChange={onPlantFrameChanged}
                />
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
                  value={desc}
                  onChange={onPlantDescChanged}
                />
              </div>
            </div>
            <div className="cultivos_button-section">
              <button
                className="btn btn-sm btn-success"
                onClick={onSavePlantClicked}
                type="submit"
              >
                Agregar
              </button>
              <button className="btn btn-sm btn-danger" type="reset">
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
