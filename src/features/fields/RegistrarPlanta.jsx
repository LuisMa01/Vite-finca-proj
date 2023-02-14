import React from "react";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import "../../styles/registrar-plantilla.css";
import LasActividades from "../jsons/plantilla-maiz.json";
import MisActividades from "../jsons/tipos-actividades.json";
import {
  useGetPlantsQuery,
  useAddNewPlantMutation,
} from "./redux/plantApiSlice";
import { useState, useEffect } from "react";
import Plant from "../../components/Plant";
 

const RegistrarPlanta = () => {
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

  const onSavePlantClicked = async (e) => {
    e.preventDefault();

    await addNewPlant({ plantName, desc, variety });
  };

  const onPlantNameChanged = (e) => setPlantname(e.target.value);
  const onPlantDescChanged = (e) => setDesc(e.target.value);
  const onPlantVaryChanged = (e) => setVary(e.target.value);
  useEffect(() => {
    if (addissuccess) {
      setPlantname("");
      setDesc("");
      setVary("");
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
      <div className="return-div">
        <Link to={"/dash/cultivos"}>
          <div className="return-button">
            <img className="return-button-img" src={ReImage} alt="Atrás" />
          </div>
        </Link>
      </div>
      <h1 className="titulo_nueva-plantilla">Planta</h1>
      <div className="ventana_plantillas">
        {/* <form className="container col-12 col-md-10 col-lg-8 col-xl-6 col col needs-validation" novalidate>   */}
        <form>
          <div className="form-row justify-content-center">
            <div className="col-md-4 mb-3">
              <label for="nombre_cultivo" className="text-center">
                Nombre de planta
              </label>
              <input
                type="text"
                className="form-control"
                id="nombre_cultivo"
                placeholder="Fruta X"
                value={plantName}
                onChange={onPlantNameChanged}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label for="nombre_cultivo" className="text-center">
                Variedad
              </label>
              <input
                type="text"
                className="form-control"
                id="nombre_cultivo"
                value={variety}
                onChange={onPlantVaryChanged}
              />
            </div>
          </div>

          <div className="form-row justify-content-center">
            <div className="col-md-4 mb-3">
              <label for="responsable">Descripcion</label>
              <input type="text" className="form-control" id="responsable" value={desc} onChange={onPlantDescChanged} />
            </div>
          </div>
          <div className="cultivos_button-section">
            <button class="btn btn-sm btn-success" onClick={onSavePlantClicked} type="submit">
              Agregar
            </button>
            <button className="btn btn-sm btn-danger" type="reset">
              Limpiar
            </button>
          </div>
        </form>
        <hr />
        <p className="subheader">Plantas</p>
        <div className="table-container-1">
          <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-blue">
              <th className="align-middle" scope="col">
                Plantas
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
    </>
  );
};

export default RegistrarPlanta;
