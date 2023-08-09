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

const DOSE_REGEX = /^([A-ZÑ]{1})([\wñÑ\d]{0,20})(\/?-?([\wñÑ\d]{1,20}?)){0,4}/;
const UNIT_REGEX = /^([\wñÑ\d]{0,20})((\/?\s?-?)([\wñÑ\d]{1,20}?)){0,4}$/;

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
  const [validDose, setValidDose] = useState(false);
  const [validUnit, setValidUnit] = useState(false);

  useEffect(() => {
    setValidUnit(UNIT_REGEX.test(doseUnit));
  }, [doseUnit]);
  useEffect(() => {
    setValidDose(DOSE_REGEX.test(doseName));
  }, [doseName]);

  const [updateDose, { isLoading, isSuccess: doseUpSuc, isError, error }] =
    useUpdateDoseMutation();

  const [
    deleteDose,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteDoseMutation();

  const canSave = [validDose, validUnit].every(Boolean) && !isLoading;
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
    if (canSave) {
      await updateDose({
        id: dose.dose_id,
        doseName,
        doseUnit,
        desc,
        active,
      });
    }
  };

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
    const dosename = doseName ? doseName : "no tiene";

    const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

    let contenido = (
      <>
        <tr key={doseId}>
          <td>
            <div type="button">
              {dose.dose_name ? dose.dose_name : "no tiene"}
            </div>
          </td>
          <td>
            <div>{dose.dose_unit}</div>
          </td>
          <td>{dose.dose_desc}</td>
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
          {isAdmin && (
            <td>
              <div
                type="button"
                onClick={() => {
                  setIsOpen(!isOpen);
                  setDoseName(dose.dose_name);
                  setDesc(dose.dose_desc);
                  setDoseUnit(dose.dose_unit);
                  setActive(dose.dose_status);
                }}
              >
                {isOpen ? "Cerrar" : "Editar"}
              </div>
            </td>
          )}
        </tr>

        {isAdmin && (
          <tr>
            <td>
              <Collapse isOpened={isOpen}>
                <input
                  type="text"
                  maxLength={30}
                  className="form-control"
                  placeholder="Ej: hora/hombre"
                  pattern="^([A-ZÑ]{1})([\wñÑ\d]{0,20})(\/?-?([\wñÑ\d]{1,20}?)){0,4}"
                  value={doseName}
                  onChange={onDoseNameChanged}
                  required
                />
                <div className="error-message">
                  <p>Formato incorrecto. Ej: [hora/hombre]</p>
                </div>
              </Collapse>
            </td>
            <td>
              <Collapse isOpened={isOpen}>
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
              </Collapse>
            </td>
            <td>
              <Collapse isOpened={isOpen}>
                <input
                  type="text"
                  maxLength={200}
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
                <div
                  className="btn btn-sm btn-success"
                  type="button"
                  onClick={onDoseChanged}
                  disabled={!canSave}
                >
                  Guardar
                </div>
              </Collapse>
            </td>

            <td>
              <Collapse isOpened={isOpen}>
                <button className="btn btn-danger" onClick={handleClearClick}>
                  Retornar Valor
                </button>
              </Collapse>
            </td>
          </tr>
        )}
      </>
    );

    return contenido;
  } else return null;
};

const memoizedDose = memo(Dose);

export default memoizedDose;
