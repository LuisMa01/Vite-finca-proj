//import { useNavigate } from 'react-router-dom'
import "../../src/styles/registrar-actividad.css";
import {
  useGetCampsQuery,
  useUpdateCampMutation,
  useDeleteCampMutation,
} from "../features/fields/redux/campApiSlice";
import { memo } from "react";
import { Link } from "react-router-dom";
import RemoveImg from "../images/remove.svg";
import Swal from "sweetalert2";
import { ROLES } from "../config/roles";

const Camp = ({ campId }) => {
  const { camp } = useGetCampsQuery("campsList", {
    selectFromResult: ({ data }) => ({
      camp: data?.entities[campId],
    }),
  });

  const [updateCamp, { isLoading, isSuccess, isError, error }] =
    useUpdateCampMutation();

  const [
    deleteCamp,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteCampMutation();

  const onActiveChanged = async (e) => {
    await updateCamp({
      id: camp.camp_id,
      campName: camp.camp_name,
      area: camp.camp_area,
      active: e.target.checked,
    });
  };
  // id, campName, area, active
  const onDeleteCampClicked = async () => {

    Swal.fire({
      title: '¿Seguro de eliminar?',
      text: `Eliminar este Campo afectará todos los datos asociados a esta. Esta acción será irreversible.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteCamp({ id: camp.camp_id });
        Swal.fire(
          '¡Eliminada!',
          'Este campo ha sido eliminada.',
          'success'
        )
      }
    })
    
  };

  if (camp) {
    

    const campname = camp.camp_name ? camp.camp_name : "no tiene";

    const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

    //console.log(`${user.user_id} ${userName} ${userRolesString} ${active} ${errContent}`);
    if (isSuccess) {
      console.log(`no hay error ${errContent}`);
    }

    const contenido = (
      <tr key={campId}>
        <td>{campname}</td>
        <td>
          <input
            type="checkbox"
            checked={camp.camp_status}
            onChange={onActiveChanged}
          />
        </td>
        <td>
          <img
            onClick={onDeleteCampClicked}
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

const memoizedCamp = memo(Camp);

export default memoizedCamp;


 