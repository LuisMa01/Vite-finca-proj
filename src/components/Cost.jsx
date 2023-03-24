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
import { memo } from "react";
import { Link } from "react-router-dom";
import RemoveImg from "../images/remove.svg";
import Swal from "sweetalert2";
import { ROLES } from "../config/roles";
import useAuth from "../hooks/useAuth";

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

const Cost = ({ costId, Lista }) => {
  const { username, isManager, isAdmin } = useAuth();
  const { cost } = useGetCostsQuery("costsList", {
    selectFromResult: ({ data }) => ({
      cost: data?.entities[costId],
    }),
  });
  const [costItemKey, setItemKey] = useState(cost.cost_item_key);
  const [costQuantity, setCostQuantity] = useState(cost.cost_quantity);
  const [costItemPrice, setCostItemPrice] = useState(cost.cost_item_price);
  const [costPrice, setCostPrice] = useState(cost.cost_price);
  const [costDateKey, setCostDateKey] = useState(cost.cost_date_key);

  const [updateCost, { isLoading, isSuccess, isError, error }] =
    useUpdateCostMutation();

  const [
    deleteCost,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteCostMutation();

  const onActiveChanged = async (e) => {
    await updateCost({
      id: costId,
      costItemKey,
      costQuantity,
      costItemPrice,
      costDateKey,
    });
  };
  // id, costItemKey, costQuantity, costDateKey, costItemPrice
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
        await deleteCost({ id: cost.cost_id });
        if (isDelSuccess) {
          Swal.fire(
            "¡Eliminada!",
            "Esta actividad ha sido eliminada.",
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
    if (cost) {
      setCostDateKey(cost.cost_date_key);
      setCostPrice(cost.cost_price);
      setCostItemPrice(cost.cost_item_price);
      setCostQuantity(cost.cost_quantity);
      setItemKey(cost.cost_item_key);
    }
  }, [cost]);

  if (cost) {
    //const handleEdit = () => navigate(`/dash/users/${actId}`)
    
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

    if (item && dose) {
      const itemname = item.item_name ? item.item_name : "sin nombre";

      const errContent =
        (error?.data?.message || delerror?.data?.message) ?? "";

      //console.log(`${user.user_id} ${userName} ${userRolesString} ${active} ${errContent}`);
      if (isSuccess) {
        console.log(`no hay error ${errContent}`);
      }

      let contenido 
      if (Lista == "Lista1") {
        contenido = (
          <tr key={costId}>
            <td>
              <div type="button">{itemname}</div>
            </td>
            <td>{dose.dose_name}</td>
            <td>{costQuantity}</td>
            <td>{dose.dose_unit}</td>
            <td>{precioItem}</td>
            <td>{precio}</td>
            {(isAdmin) && <td>
              <img
                onClick={onDeleteDateClicked}
                className="remove-img"
                src={RemoveImg}
                alt="Remove"
              />
            </td>}
          </tr>
        );        
      }
      if (Lista == "Lista2") {
        contenido = (
          <tr key={costId}>
            <td>
              <div type="button">{itemname}</div>
            </td>
            <td><Link to={`/dash/cultivos/info-app/${costDateKey}`}><Act key={cost.date_act_key} actId={cost.date_act_key} /></Link></td>
            <td>{dose.dose_name}</td>            
            <td>{costQuantity}</td>
            <td>{dose.dose_unit}</td>
            <td>{precioItem}</td>
            <td>{precio}</td>
            {(isAdmin) && <td>
              <img
                onClick={onDeleteDateClicked}
                className="remove-img"
                src={RemoveImg}
                alt="Remove"
              />
            </td>}
          </tr>
        ); 
      }
      

      return contenido;
    }
  } else return null;
};

const memoizedCost = memo(Cost);

export default memoizedCost;
