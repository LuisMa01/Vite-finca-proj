import React from "react";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import "../../styles/registrar-actividad.css";

import RemoveImg from "../../images/remove.svg";
import Swal from "sweetalert2";
import Act from "../../components/Act";
import { useGetActsQuery, useAddNewActMutation } from "./redux/actApiSlice";
import { useEffect, useReducer } from "react";
import useAuth from "../../hooks/useAuth";

const ACTION = {
  ACTIVITY_NAME: "actName",
  ACTIVITY_DESC: "actDesc",
};
const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.ACTIVITY_NAME:
      return { ...state, actName: action.payload };
    case ACTION.ACTIVITY_DESC:
      return { ...state, desc: action.payload };
    case ACTION.CLEAR:
      return { actName: "", desc: "" };
    default:
      throw new Error();
  }
};

const registrarActividad = () => {
  const { username, isManager, isAdmin } = useAuth();
  const [state, dispatch] = useReducer(reducer, { actName: "", desc: "" });
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

  const onSaveActClicked = async (e) => {
    e.preventDefault();

    await addNewAct({ actName: state.actName, desc: state.desc });
  };
  
  useEffect(() => {
    if (addissuccess) {
      dispatch({ type: ACTION.CLEAR })
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
  }
  const cabeza = (
    <>
      <p className="titulo_tipos-de-actividades font-weight-bold">
        Actividades de cultivo
      </p>
      <p className="tipos_description">
        <i>
          Esta seccion es para la administración de la base de datos de las
          actividades estandarizadas que se pueden realizar a los cultivos, de
          esta manera se eficientiza el sistema.
        </i>
      </p>

      {isAdmin && (
        <form className="container myform col-6 needs-validation">
          <div className="form-row bg-light">
            <div className="col-12 col-md-6 mb-2">
              <label htmlFor="nombre_actividad">Nombre de actividad</label>
              <input
                type="text"
                className="form-control"
                placeholder="Actividad X"
                value={state.actName}
                onChange={(e) => dispatch({ type: ACTION.ACTIVITY_NAME, payload: e.target.value })}
                required
              />
            </div>
            <div className="col-12 col-md-6 mb-2">
              <label htmlFor="descripcion_actividad">
                Descripción (opcional)
              </label>
              <textarea
                className="form-control rounded-1"
                rows="1"
                placeholder="Esta actividad consiste en..."
                value={state.desc}
                onChange={(e) => dispatch({ type: ACTION.ACTIVITY_DESC, payload: e.target.value })}
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
            <button type="reset" className="btn btn-outline-danger limpiar" onClick={(e)=>dispatch({ type: ACTION.CLEAR })}>
              Limpiar
            </button>
          </div>
        </form>
      )}

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
