import React from "react";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import "../../styles/registrar-actividad.css";

import RemoveImg from "../../images/remove.svg";
import Swal from "sweetalert2";
import Act from "../../components/Act";
import { useGetActsQuery, useAddNewActMutation } from "./redux/actApiSlice";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";

const registrarActividad = () => {
  const { username, isManager, isAdmin } = useAuth();
  const {
    data: acts,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetActsQuery("actsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const [
    addNewAct,
    { isSuccess: addissuccess, isError: addiserror, error: adderror },
  ] = useAddNewActMutation();

  const [actName, setActname] = useState("");
  const [desc, setDesc] = useState("");

  const onSaveActClicked = async (e) => {
    e.preventDefault();

    await addNewAct({ actName, desc });
  };

  const onActNameChanged = (e) => setActname(e.target.value);
  const onActDescChanged = (e) => setDesc(e.target.value);
  useEffect(() => {
    if (addissuccess) {
      setActname("");
      setDesc("");
    }
  }, [addissuccess]);

  let content;
  let tableContent;
  if (isError) {
    tableContent = <p className="errmsg">{error?.data?.message}</p>;
    console.log(error?.data?.message);
  }
  if (isSuccess) {
    const { ids } = acts;

    tableContent = ids?.length && ids.map((Id) => <Act key={Id} actId={Id} />);

    content = (
      <>
        <div className=" container col-12 col-md-9 col-lg-6 edit_table-container">
          <table className="table table-hover table-sm table-striped table-bordered">
            <thead className="thead-loyola">
              <tr>
              <th className="align-middle" scope="col">
                Actividad
              </th>
              <th className="align-middle" scope="col">
                Descripción
              </th>
              {(isManager || isAdmin) && <th className="align-middle" scope="col">
                Habilitar
              </th>}
              {(isAdmin) && <th className="align-middle" scope="col">
                Eliminar
              </th>}
              {(isAdmin) && <th className="align-middle" scope="col">
                Editar
              </th>}
              </tr>
            </thead>
            <tbody>{tableContent}</tbody>
          </table>
        </div>
      </>
    );
  }
  const cabeza = (
    <>
      
      <p className="titulo_tipos-de-actividades font-weight-bold">Actividades de cultivo</p>
      <p className="tipos_description">
        <i>
          Esta seccion es para la administración de la base de datos de las
          actividades estandarizadas que se pueden realizar a los cultivos, de
          esta manera se eficientiza el sistema.
        </i>
      </p>

      {(isAdmin) && <form className="container myform col-6 needs-validation">
        <div className="form-row bg-light">
          <div className="col-12 col-md-6 mb-2">
            <label htmlFor="nombre_actividad">Nombre de actividad</label>
            <input
              type="text"
              className="form-control"
              placeholder="Actividad X"
              value={actName}
              onChange={onActNameChanged}
              required
            />
          </div>
          <div className="col-12 col-md-6 mb-2">
            <label htmlFor="descripcion_actividad">Descripción (opcional)</label>
            <textarea
              className="form-control rounded-1"
              rows="1"
              placeholder="Esta actividad consiste en..."
              value={desc}
              onChange={onActDescChanged}
            ></textarea>
          </div>
        </div>
        <div className="edit-campo-button-section_parent">
          <button
            type="submit"
            onClick={onSaveActClicked}
            className="btn btn-outline-primary limpiar"
          >
            Añadir actividad
          </button>
          <button type="reset" className="btn btn-outline-danger limpiar">
            Limpiar
          </button>
        </div>
      </form>}

      <div className="seccion_campos_checkbox-div">
        <div>
          <input type="checkBox" defaultChecked />
          <span>Actividades habilitadas</span>
        </div>
        <div>
          <input type="checkBox" />
          <span>Actividades inhabilitadas</span>
        </div>
      </div>
    </>
  );
  return (
    <>
      {cabeza}
      {content}
    </>
  );
};

export default registrarActividad;
