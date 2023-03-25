//import { useNavigate } from 'react-router-dom'
import "../../src/styles/registrar-actividad.css";
import {
  useGetDosesQuery,
  useUpdateDoseMutation,
  useDeleteDoseMutation,
} from "../features/fields/redux/doseApiSlice";
import { memo, useState, useEffect } from "react";
import { Collapse } from "react-collapse";
import { Link } from "react-router-dom";
import RemoveImg from "../images/remove.svg";
import Swal from "sweetalert2";
import { ROLES } from "../config/roles";
import useAuth from "../hooks/useAuth";

//en progreso aun falta configurar dosis y luego de este
const Dose = ({ doseId }) => {
  const { username, isManager, isAdmin } = useAuth();

  const { dose } = useGetDosesQuery("dosesList", {
    selectFromResult: ({ data }) => ({
      dose: data?.entities[doseId],
    }),
  });

  const [doseName, setDoseName] = useState(dose.dose_name);
  const [doseUnit, setDoseUnit] = useState(dose.dose_unit);
  const [desc, setDesc] = useState(dose.dose_desc);
  const [active, setActive] = useState(dose.dose_status);
  const [isOpen, setIsOpen] = useState(false);

  const [updateDose, { isLoading, isSuccess: doseUpSuc, isError, error }] =
    useUpdateDoseMutation();

  const [
    deleteDose,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteDoseMutation();

  const onDoseNameChanged = (e) => setDoseName(e.target.value);
  const onItemDescChanged = (e) => setDesc(e.target.value);
  const onDoseUnitChanged = (e) => setDoseUnit(e.target.value);
  const handleClearClick = (e) => {
    e.preventDefault();
    setDoseName(dose.dose_name);
    setDesc(dose.dose_desc);
    setDoseUnit(dose.dose_unit);
    setActive(dose.dose_status);
  };
  const onActiveChanged = async (e) => {
    await updateDose({
      id: dose.dose_id,
      doseName,
      doseUnit,
      desc,
      active: e.target.checked,
    });
  };
  const onDoseChanged = async (e) => {
    await updateDose({
      id: dose.dose_id,
      doseName,
      doseUnit,
      desc,
      active,
    });
  };
  //id, itemName, desc, itemPrice, active, itemDose

  const onDeleteDoseClicked = async () => {
    Swal.fire({
      title: "¿Seguro de eliminar?",
      text: `Eliminar esta dosis afectará todos los datos asociados a este. Esta acción será irreversible.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDose({ id: dose.dose_id });
        Swal.fire("¡Eliminado!", "Este dosis ha sido eliminado.", "success");
      }
    });
  };
  useEffect(() => {
    if (doseUpSuc) {
      setDoseName(dose.dose_name);
      setDesc(dose.dose_desc);
      setDoseUnit(dose.dose_unit);
      setActive(dose.dose_status);
    }
  }, [doseUpSuc, dose]);

  if (dose) {
    //const handleEdit = () => navigate(`/dash/users/${cropId}`)

    const dosename = doseName ? doseName : "no tiene";

    const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

    //console.log(`${user.user_id} ${userName} ${userRolesString} ${active} ${errContent}`);

    let contenido = (
      <>
        <tr key={doseId}>
          <td>
            <div type="button">{dosename}</div>
          </td>
          <td>
            <div>{doseUnit}</div>
          </td>
          <td>{desc}</td>
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
                onClick={onDeleteDoseClicked}
                className="remove-img"
                src={RemoveImg}
                alt="Remove"
              />
            </td>
          )}
          {isAdmin &&<td>
            <div type="button" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? "Cerrar" : "Editar"}
            </div>
          </td>}
        </tr>

        {(isAdmin) && <tr>
          <td>
            <Collapse isOpened={isOpen}>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: hora/hombre"
                value={doseName}
                onChange={onDoseNameChanged}
                required
              />
            </Collapse>
          </td>
          <td>
            <Collapse isOpened={isOpen}>
              <input
                type="text"
                className="form-control"
                placeholder="Unidad"
                value={doseUnit}
                onChange={onDoseUnitChanged}
              />
            </Collapse>
          </td>
          <td>
            <Collapse isOpened={isOpen}>
              <input
                type="text"
                className="form-control"
                placeholder="Descripción"
                value={desc}
                onChange={onItemDescChanged}
              />
            </Collapse>
          </td>
          <td>
            <Collapse isOpened={isOpen}></Collapse>
          </td>

          <td>
            <Collapse isOpened={isOpen}>
              <div type="button" onClick={onDoseChanged}>
                Guardar
              </div>
            </Collapse>
          </td>

          <td>
            <Collapse isOpened={isOpen}>
              <button className="btn btn-danger" onClick={handleClearClick}>
                Limpiar
              </button>
            </Collapse>
          </td>
        </tr>}
      </>
    );

    return contenido;
  } else return null;
};

const memoizedDose = memo(Dose);

export default memoizedDose;
