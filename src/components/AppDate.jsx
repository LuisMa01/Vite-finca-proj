//import { useNavigate } from 'react-router-dom'
import "../../src/styles/registrar-actividad.css";
import {
  useGetDatesQuery,
  useUpdateDateMutation,
  useDeleteDateMutation,
} from "../features/fields/redux/appApiSlice";
import { useEffect, useState } from "react";
import { useGetActsQuery } from "../features/fields/redux/actApiSlice";
import { useGetUsersQuery } from "../features/fields/redux/usersApiSlice";
import { memo } from "react";
import { Link } from "react-router-dom";
import RemoveImg from "../images/remove.svg";
import Swal from "sweetalert2";
import { ROLES } from "../config/roles";

const AppDate = ({ dateId }) => {
  const { date } = useGetDatesQuery("datesList", {
    selectFromResult: ({ data }) => ({
      date: data?.entities[dateId],
    }),
  });
  const [actKey, setActKey] = useState(date.date_act_key);
  const [dateInit, setDateInit] = useState(date.date_init);
  const [dateEnd, setDateEnd] = useState(date.date_end);
  const [cropKey, setCropKey] = useState(date.date_crop_key);
  const [userRep, setUserRep] = useState(date.date_user_key);

  const [updateDate, { isLoading, isSuccess, isError, error }] =
    useUpdateDateMutation();

  const [
    deleteDate,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteDateMutation();

  const onActiveChanged = async (e) => {
    await updateDate({
      id: dateId,
      dateInit,
      dateEnd,
      actKey,
      cropKey,
      plantId: date.crop_plant_key,
      userRep,
    });
  };
  // id, dateInit, dateEnd, actKey, cropKey, plantId, userRep
  const onDeleteDateClicked = async () => {
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
        await deleteDate({ id: date.date_id });
        if (isDelSuccess) {
          Swal.fire(
            "¡Eliminada!",
            "Esta actividad ha sido eliminada.",
            "success"
          );
        }
        if (isDelError) {
          Swal.fire(
            "¡No se pudo eliminar!",
            `${delerror?.data?.message}.`
          );
        }        
      }
    });
  };

  if (date) {
    //const handleEdit = () => navigate(`/dash/users/${actId}`)
    const { act } = useGetActsQuery("actsList", {
      selectFromResult: ({ data }) => ({
        act: data?.entities[actKey],
      }),
    });
    const { user } = useGetUsersQuery("usersList", {
      selectFromResult: ({ data }) => ({
        user: data?.entities[userRep],
      }),
    });
    
    if (act && user) {
      const actname = act.act_name ? act.act_name : "sin nombre";

      const fechaIni = `${dateInit}`
      const feIni = fechaIni.split("T")
      const fechaFin = `${dateEnd}`
      const feFin = fechaFin.split("T")
      const errContent =
        (error?.data?.message || delerror?.data?.message) ?? "";

      //console.log(`${user.user_id} ${userName} ${userRolesString} ${active} ${errContent}`);
      if (isSuccess) {
        console.log(`no hay error ${errContent}`);
      }

      const contenido = (
        <tr key={dateId}>
          <td>{actname}</td>
          <td>{feIni[0]}</td>
          <td>{feFin[0]}</td>
          <td>{user.user_name}</td>
          <td>
            <img
              onClick={onDeleteDateClicked}
              className="remove-img"
              src={RemoveImg}
              alt="Remove"
            />
          </td>
        </tr>
      );

      return contenido;
    }
  } else return null;
};

const memoizedAppDate = memo(AppDate);

export default memoizedAppDate;
