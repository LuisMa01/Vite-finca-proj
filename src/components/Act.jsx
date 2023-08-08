//import { useNavigate } from 'react-router-dom'
import "../../src/styles/registrar-actividad.css";
import { useState, useEffect } from "react";
import {
  useGetActsQuery,
  useUpdateActMutation,
  useDeleteActMutation,
} from "../features/fields/redux/actApiSlice";
import { memo } from "react";
import { Link } from "react-router-dom";
import RemoveImg from "../images/remove.svg";
import Swal from "sweetalert2";
import { ROLES } from "../config/roles";
import Modal from "react-modal";
import useAuth from "../hooks/useAuth";

Modal.setAppElement("#root");

const ACT_REGEX =
  /^([A-ZÑ]{1})([a-zñ\d]{0,20})(-?\s?([\wñÑ\d]{0,20})?){0,5}/;

const Act = ({ actId }) => {
  const { username, isManager, isAdmin } = useAuth();
  const { act } = useGetActsQuery("actsList", {
    selectFromResult: ({ data }) => ({
      act: data?.entities[actId],
    }),
  });
  if (act) {
    const [actName, setActName] = useState(act.act_name);
    const [desc, setDesc] = useState(act.act_desc);
    const [active, setActive] = useState(act.act_status);
    const [isOpen, setIsOpen] = useState(false);
    const [validActName, setValidActName] = useState(false);
    useEffect(() => {
      setValidActName(ACT_REGEX.test(actName));
    }, [actName]);

    //id, actName, desc, active
    const [updateAct, { isLoading, isSuccess, isError, error }] =
      useUpdateActMutation();

    const [
      deleteAct,
      { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
    ] = useDeleteActMutation();

    const canSave = [validActName].every(Boolean) && !isLoading;

    const onActNameChanged = (e) => setActName(e.target.value);
    const onActDescChanged = (e) => setDesc(e.target.value);

    const handleClearClick = (e) => {
      e.preventDefault();
      setActName(act.act_name);
      setDesc(act.act_desc);
      setActive(act.act_status);
    };

    const onActiveChanged = async (e) => {
      await updateAct({
        id: act.act_id,
        actName,
        active: e.target.checked,
      });
    };
    const onActChanged = async (e) => {
      e.preventDefault();
      if (canSave) {
        await updateAct({
          id: act.act_id,
          actName,
          active,
          desc,
        });
        setIsOpen(false);
      }
    };
    // id, actName, desc, active
    const onDeleteActClicked = async () => {
      Swal.fire({
        title: "¿Seguro de eliminar?",
        text: `Eliminar esta actividad afectará todos los datos asociados a esta. Esta acción será irreversible.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar!",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteAct({ id: act.act_id });
          Swal.fire(
            "¡Eliminada!",
            "Esta actividad ha sido eliminada.",
            "success"
          );
        }
      });
    };

    useEffect(() => {
      if (act) {
        setIsOpen(false);
        setActName(act.act_name);
        setDesc(act.act_desc);
        setActive(act.act_status);
      }
    }, [act]);

    const updAct = (
      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        <button
          className="btn btn-danger"
          onClick={() => {
            setActName(act.act_name);
            setDesc(act.act_desc);
            setActive(act.act_status);
            setIsOpen(false);
          }}
        >
          Cerrar
        </button>
        <div className="cultivos_button-section">
          <form
            className="container myform col-6 needs-validation"
            onSubmit={onActChanged}
          >
            <div className="form-row bg-light">
              <div className="col-12">
                <label for="nombre_actividad">Nombre de actividad</label>
                <input
                  type="text"
                  maxLength={20}
                  className="form-control"
                  placeholder="Actividad X o Actividad-x"
                  pattern="^([A-ZÑ]{1})([a-zñ\d]{0,20})(-?\s?([\wñÑ\d]{0,20})?){0,5}"
                  value={actName}
                  onChange={onActNameChanged}
                  required=""
                />
                <div className="error-message">
                  <p>Formato incorrecto</p>
                </div>
              </div>

              <div className="col-12">
                <label for="descripcion_actividad">
                  Descripción (opcional)
                </label>

                <input
                  type="text"
                  className="form-control rounded-1"
                  placeholder="Ingresar descripción"
                  pattern="^([A-ZÑ]{1})([a-zñ\d]{0,20})(-?\s?\.?,?([\wñ\d]{0,20})?){0,30}"
                  value={desc}
                  onChange={onActDescChanged}
                  
                /><div className="error-message">
                <p>No se admiten caracteres especiales, solo [.] [-] [,]</p>
              </div>
              </div>
            </div>
            <div className="edit-campo-button-section_parent">
              <button
                type="submit"
                disabled={!canSave}
                className="btn btn-outline-primary limpiar"
              >
                Guardar Cambios
              </button>
              <button
                onClick={handleClearClick}
                className="btn btn-outline-danger limpiar"
              >
                Retornar valor
              </button>
            </div>
          </form>
        </div>
      </Modal>
    );

    //const handleEdit = () => navigate(`/dash/users/${actId}`)

    const actname = actName ? actName : "no tiene";

    const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

    //console.log(`${user.user_id} ${userName} ${userRolesString} ${active} ${errContent}`);
    if (isSuccess) {
      console.log(`no hay error ${errContent}`);
    }

    const contenido = (
      <tr key={actId}>
        <td>{actname}</td>
        <td>{desc ? desc : ""}</td>
        {(isManager || isAdmin) && (
          <td>
            <input
              type="checkbox"
              checked={active}
              onChange={onActiveChanged}
            />
          </td>
        )}
        {isAdmin && (
          <td>
            <img
              onClick={onDeleteActClicked}
              className="remove-img"
              src={RemoveImg}
              alt="Remove"
            />
          </td>
        )}
        {isAdmin && <td onClick={() => setIsOpen(true)}>Editar</td>}
        {isAdmin && <>{updAct}</>}
      </tr>
    );

    return contenido;
  } else return null;
};

const memoizedAct = memo(Act);

export default memoizedAct;
