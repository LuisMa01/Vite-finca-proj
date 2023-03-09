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

const Comt = ({ comtId }) => {
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

  const [updateComt, { isLoading, isSuccess, isError, error }] =
    useUpdateComtMutation();

  const [
    deleteComt,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteComtMutation();

  const onActiveChanged = async (e) => {
    await updateComt({
      id: comtId,
      desc,
      comtDateKey,
    });
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

  if (comt) {
    //const handleEdit = () => navigate(`/dash/users/${actId}`)
    /*
    const { item } = useGetItemsQuery("itemsList", {
      selectFromResult: ({ data }) => ({
        item: data?.entities[costItemKey],
      }),
    });
    const { dose } = useGetDosesQuery("dosesList", {
      selectFromResult: ({ data }) => ({
        dose: data?.entities[cost.item_dose_key],
      }),
    });
    
    let precioItem = new Intl.NumberFormat("es-do", {
      style: "currency",
      currency: "DOP",
    }).format(parseFloat(costItemPrice));

    let precio = new Intl.NumberFormat("es-do", {
      style: "currency",
      currency: "DOP",
    }).format(parseFloat(costPrice));
*/
    if (comt) {
      const fecha = (`${comtDate}`).split("T")[0];

      const errContent =
        (error?.data?.message || delerror?.data?.message) ?? "";

      //console.log(`${user.user_id} ${userName} ${userRolesString} ${active} ${errContent}`);
      if (isSuccess) {
        console.log(`no hay error ${errContent}`);
      }

      const contenido = (
        <tr key={comtId}>
          <td>{fecha}</td>
          <td>{desc}</td>
          <td>
            <img
              onClick={onDeleteComtClicked}
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

const memoizedComt = memo(Comt);

export default memoizedComt;
