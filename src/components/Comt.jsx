//import { useNavigate } from 'react-router-dom'
import "../../src/styles/registrar-actividad.css";
import { useGetDatesQuery } from "../features/fields/redux/appApiSlice";
import { useGetItemsQuery } from "../features/fields/redux/itemApiSlice";
import { useGetDosesQuery } from "../features/fields/redux/doseApiSlice";
import { useEffect, useState } from "react";
import { useGetActsQuery } from "../features/fields/redux/actApiSlice";
import { useGetUsersQuery } from "../features/fields/redux/usersApiSlice";
import {
  useGetCostsQuery,
  useUpdateCostMutation,
  useDeleteCostMutation,
} from "../features/fields/redux/costApiSlice";
import {
  useGetComtsQuery,
  useUpdateComtMutation,
  useDeleteComtMutation,
} from "../features/fields/redux/comtApiSlice";
import { memo } from "react";
import { Link } from "react-router-dom";
import RemoveImg from "../images/remove.svg";
import Swal from "sweetalert2";
import { ROLES } from "../config/roles";
import Modal from "react-modal";
import useAuth from "../hooks/useAuth";

Modal.setAppElement("#root");

const Act = ({ actId }) => {
  const { act } = useGetActsQuery("actsList", {
    selectFromResult: ({ data }) => ({
      act: data?.entities[actId],
    }),
  });

  if (act) {
    return <>{act.act_name ? act.act_name : "sin nombre"}</>;
  }
};

const Comt = ({ comtId, Lista }) => {
  const { username, isManager, isAdmin } = useAuth();
  const { comt } = useGetComtsQuery("comtsList", {
    selectFromResult: ({ data }) => ({
      comt: data?.entities[comtId],
    }),
  });
  const [desc, setComtDesc] = useState(comt.comt_desc);
  const [comtDate, setComtDate] = useState(comt.comt_date);
  const [comtDateKey, setComtDateKey] = useState(comt.comt_date_key);
  const [comtDateActKey, setComtDateActKey] = useState(comt.date_act_key);
  const [comtUserKey, setComtUserKey] = useState(comt.comt_user_key);
  const [isOpen, setIsOpen] = useState(false);

  const [updateComt, { isLoading, isSuccess, isError, error }] =
    useUpdateComtMutation();

  const [
    deleteComt,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteComtMutation();

  const onComtDescChange = (e) => {
    e.preventDefault();
    setComtDesc(e.target.value);
  };

  const handleClearClick = (e) => {
    e.preventDefault();
    setComtDesc(comt.comt_desc);
  };
  const onComtChanged = async (e) => {
    e.preventDefault();
    await updateComt({
      id: comtId,
      desc,
      comtDateKey,
    });
    setIsOpen(false);
  };
  //
  const onDeleteComtClicked = async () => {
    Swal.fire({
      title: "¿Seguro de eliminar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteComt({ id: comt.comt_id });
        if (isDelSuccess) {
          Swal.fire(
            "¡Eliminada!",
            "Este comentario ha sido eliminada.",
            "success"
          );
        }
        if (isDelError) {
          Swal.fire("¡No se pudo eliminar!", `${delerror?.data?.message}.`);
        }
      }
    });
  };
  useEffect(() => {
    if (comt) {
      setComtDesc(comt.comt_desc);
      setComtDate(comt.comt_date);
      setComtDateKey(comt.comt_date_key);
      setComtDateActKey(comt.date_act_key);
      setComtUserKey(comt.comt_user_key);
    }
  }, [comt]);

  const updComt = (
    <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
      <button className="btn btn-danger" onClick={() => setIsOpen(false)}>
        Cerrar
      </button>
      <div className="cultivos_button-section">
        <p className="titulo_tipos-de-actividades col-12">Comentario</p>
        <form className="container myform col-6 needs-validation" novalidate>
          <div className="form-row bg-light">
            <div className="col-12 col-md-6 mb-2">
              <label for="nombre_actividad">Ingresar</label>
              <div className="col-12 col-md-6 mb-2">
                <textarea
                  type="text"
                  placeholder="Ingresar Comentario"
                  value={desc}
                  onChange={onComtDescChange}
                  rows={5}
                  cols={25}
                />
              </div>
            </div>
          </div>
          <div className="edit-campo-button-section_parent col-12">
            <button
              type="submit"
              onClick={onComtChanged}
              className="btn btn-outline-primary limpiar"
            >
              Guardar Cambios
            </button>
            <button
              className="btn btn-outline-danger limpiar"
              onClick={handleClearClick}
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );

  if (comt) {
    const finalDate = (comt?.crop_harvest !== null || !comt.crop_status)? true:false
    
    if (comt) {
      const fecha = `${comtDate}`.split("T")[0];

      const errContent =
        (error?.data?.message || delerror?.data?.message) ?? "";

      //console.log(`${user.user_id} ${userName} ${userRolesString} ${active} ${errContent}`);
      if (isSuccess) {
        console.log(`no hay error ${errContent}`);
      }
      let contenido;
      if (Lista == "Lista1") {
        contenido = (
          <tr key={comtId}>
            <td>{fecha}</td>
            <td>{desc}</td>
            {(!finalDate && isAdmin) && (
              <td>
                <img
                  onClick={onDeleteComtClicked}
                  className="remove-img"
                  src={RemoveImg}
                  alt="Remove"
                />
              </td>
            )}
            {(!finalDate && (isManager || isAdmin)) && (
              <td onClick={() => setIsOpen(true)}>Editar</td>
            )}
            {(!finalDate && (isManager || isAdmin)) && <>{ updComt }</>}
          </tr>
        );
      }
      if (Lista == "Lista2") {
        contenido = (
          <tr key={comtId}>
            <td>{fecha}</td>
            <td>
              <Link to={`/dash/cultivos/info-app/${comtDateKey}`}>
              <Act key={comtDateActKey} actId={comtDateActKey} />
              </Link>
            </td>
            <td>{desc}</td>
            {(!finalDate && (isAdmin) )&& (
              <td>
                <img
                  onClick={onDeleteComtClicked}
                  className="remove-img"
                  src={RemoveImg}
                  alt="Remove"
                />
              </td>
            )}
            {(!finalDate && (isManager || isAdmin)) && (
              <td onClick={() => setIsOpen(true)}>Editar</td>
            )}
            {(!finalDate && (isManager || isAdmin)) && <>{ updComt }</>}
          </tr>
        );
      }

      return contenido;
    }
  } else return null;
};

const memoizedComt = memo(Comt);

export default memoizedComt;
