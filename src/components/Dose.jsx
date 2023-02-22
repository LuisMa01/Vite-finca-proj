//import { useNavigate } from 'react-router-dom'
import "../../src/styles/registrar-actividad.css";
import {
  useGetDosesQuery,
  useUpdateDoseMutation,
  useDeleteDoseMutation,
} from "../features/fields/redux/doseApiSlice";
import { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RemoveImg from "../images/remove.svg";
import Swal from "sweetalert2";
import { ROLES } from "../config/roles";

//en progreso aun falta configurar dosis y luego de este
const Dose = ({ doseId }) => {
  const { dose } = useGetDosesQuery("dosesList", {
    selectFromResult: ({ data }) => ({
      dose: data?.entities[doseId],
    }),
  });
  const [doseName, setDoseName] = useState(dose.dose_name);
  const [doseUnit, setDoseUnit] = useState(dose.dose_unit);
  const [desc, setDesc] = useState(dose.dose_desc);

  const [updateDose, { isLoading, isSuccess: doseUpSuc, isError, error }] =
  useUpdateDoseMutation();

  const [
    deleteDose,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteDoseMutation();

  const onDoseNameChanged = (e) => setDoseName(e.target.value);
  const onDoseUnitChanged = (e) => setDoseUnit(e.target.value);
  const onDoseDescChanged = (e) => setDesc(e.target.value);
  

  const onActiveChanged = async (e) => {
    await updateDose({
      id: dose.dose_id,
      doseName,
      doseUnit,
      desc,
      active: e.target.checked,
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
      setDoseUnit(dose.dose_unit);
      setDesc(dose.dose_desc);
    }
  }, [doseUpSuc]);
  if (dose) {
    //const handleEdit = () => navigate(`/dash/users/${cropId}`)

    const dosename = doseName ? doseName : "no tiene";

    const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

    //console.log(`${user.user_id} ${userName} ${userRolesString} ${active} ${errContent}`);
    if (isSuccess) {
      console.log(`no hay error ${errContent}`);
    }

    const contenido = (
      <tr key={doseId}>
        <td>
          
            <div type="button">{dosename}</div>
          
        </td>
        <td>
          <input
            type="checkbox"
            checked={dose.dose_status}
            onChange={onActiveChanged}
          />
        </td>
        <td>
          <img
            onClick={onDeleteDoseClicked}
            className="remove-img"
            src={RemoveImg}
            alt="Remove"
          />
        </td>
      </tr>
    );

    return contenido;
  } else return null;
};

const memoizedDose = memo(Dose);

export default memoizedDose;
