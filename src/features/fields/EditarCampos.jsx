import React from "react";
import ReImage from "../../images/return.svg";
import "../../styles/editar-campos.css";
import { Link } from "react-router-dom";
import RemoveImg from "../../images/remove.svg";

import Swal from "sweetalert2";
import {
  useGetCampsQuery,
  useAddNewCampMutation,
} from "../fields/redux/campApiSlice";
import Camp from "../../components/Camp";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";

const EditarCampos = () => {
  const { username, isManager, isAdmin } = useAuth();
  const {
    data: camps,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCampsQuery("campsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [
    addNewCamp,
    { isSuccess: addissuccess, isError: addiserror, error: adderror },
  ] = useAddNewCampMutation();

  const [campName, setCampname] = useState("");
  const [area, setArea] = useState("");
  const [estado, setEstado] = useState("");

  const searchEstado = (e) => {
    e.preventDefault();
    setEstado(e.target.value);
  };

  const onSaveCampClicked = async (e) => {
    e.preventDefault();

    await addNewCamp({ campName, area });
  };

  const onCampNameChanged = (e) => setCampname(e.target.value);
  const onCampAreaChanged = (e) => setArea(e.target.value);
  useEffect(() => {
    if (addissuccess) {
      setCampname("");
      setArea("");
      setEstado("");
    }
  }, [addissuccess]);

  let tableContent;
  if (isError) {
    tableContent = <p className="errmsg">{error?.data?.message}</p>;
    console.log(error?.data?.message);
  }
  if (isSuccess) {
    const { ids, entities } = camps;

    const results = !estado
      ? ids
      : ids.filter((dato) => `${entities[dato].camp_status}` == estado);

    tableContent =
      results?.length &&
      results.map((Id) => <Camp key={Id} campId={Id} Lista={"Lista1"} />);
  }

  return (
    <>
      <p className="editar_campos_description">
        Editar lista de campos existentes{" "}
      </p>
      {isAdmin && (
        <form className="container myform col-6 needs-validation">
          <div className="form-row bg-light">
            <div className="col-12 col-md-6 mb-2">
              <label htmlFor="nombre_cultivo">Nombre del campo</label>
              <input
                type="text"
                maxLength={20}
                className="form-control"
                id="nombre_cultivo"
                placeholder="Campo X"
                pattern="^([A-ZÑ]{1})([a-zñ\d]{0,20})(-?\s?([\wñ\d]{0,20})?){0,5}"
                value={campName}
                onChange={onCampNameChanged}
                required
              />
              <div className="error-message">
                <p>Formato incorrecto. ej: Campo X</p>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-2">
              <label htmlFor="variedad_cultivo">Área (tareas)</label>
              <input
                type="number"
                step="any"
                min={0}
                max={1000}
                className="form-control"
                id="variedad_cultivo"
                value={area}
                onChange={onCampAreaChanged}
              />
            </div>
          </div>
          <div className="edit-campo-button-section_parent">
            <button
              type="submit"
              className="btn btn-outline-primary limpiar"
              onClick={onSaveCampClicked}
            >
              Añadir campo
            </button>
            <button type="reset" className="btn btn-outline-danger limpiar">
              Limpiar
            </button>
          </div>
        </form>
      )}

      <div className="seccion_campos_checkbox-div">
        <div className="col-6">
          <select
            className="form-control "
            value={estado}
            onChange={searchEstado}
          >
            <option value={""}>Todos</option>
            <option value={true}>Activos</option>
            <option value={false}>Inactivos</option>
          </select>
        </div>
      </div>
      <div className=" container col-12 col-md-9 col-lg-6 edit_table-container">
        <table className="table table-hover table-sm table-striped table-bordered">
          <thead className="thead-loyola">
            <tr>
              <th className="align-middle" scope="col">
                Campo
              </th>
              <th className="align-middle" scope="col">
                area
              </th>
              {(isManager || isAdmin) && (
                <th className="align-middle" scope="col">
                  Habilitar
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
    </>
  );
};

export default EditarCampos;
