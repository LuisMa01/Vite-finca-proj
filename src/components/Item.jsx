//import { useNavigate } from 'react-router-dom'
import "../../src/styles/registrar-actividad.css";
import {
  useGetItemsQuery,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from "../features/fields/redux/itemApiSlice";
import {
  useGetDosesQuery
} from "../features/fields/redux/doseApiSlice";
import { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RemoveImg from "../images/remove.svg";
import Swal from "sweetalert2";
import { ROLES } from "../config/roles";

const Dose = ({doseId}) =>{
  const { dose } = useGetDosesQuery("dosesList", {
    selectFromResult: ({ data }) => ({
      dose: data?.entities[doseId],
    }),
  });

  if (dose) {
    return (<><td>{dose.dose_name}</td><td>{dose.dose_unit}</td></>)
    
  }
}

//en progreso aun falta configurar dosis y luego de este
const Item = ({ itemId }) => {
  const { item } = useGetItemsQuery("itemsList", {
    selectFromResult: ({ data }) => ({
      item: data?.entities[itemId],
    }),
  });
  const [itemName, setItemName] = useState(item.item_name);
  const [itemPrice, setItemPrice] = useState(item.item_price);
  const [desc, setDesc] = useState(item.item_desc);
  const [itemDose, setItemDose] = useState(item.item_dose_key);

  const [updateItem, { isLoading, isSuccess: itemUpSuc, isError, error }] =
    useUpdateItemMutation();

  const [
    deleteItem,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteItemMutation();

  const onItemNameChanged = (e) => setItemName(e.target.value);
  const onItemPriceChanged = (e) => setItemPrice(e.target.value);
  const onItemDescChanged = (e) => setDesc(e.target.value);
  const onItemDoseChanged = (e) => setItemDose(e.target.value);

  const onActiveChanged = async (e) => {
    await updateItem({
      id: item.item_id,
      itemName,
      itemPrice,
      desc,
      itemDose,
      active: e.target.checked,
    });
  };
  //id, itemName, desc, itemPrice, active, itemDose 

  const onDeleteItemClicked = async () => {
    Swal.fire({
      title: "¿Seguro de eliminar?",
      text: `Eliminar este cultivo afectará todos los datos asociados a este. Esta acción será irreversible.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteItem({ id: item.item_id });
        Swal.fire("¡Eliminado!", "Este cultivo ha sido eliminado.", "success");
      }
    });
  };
  useEffect(() => {
    if (itemUpSuc) {
      setItemName(item.item_dose_key);
      setItemPrice(item.item_dose_key);
      setDesc(item.item_dose_key);
      setItemDose(item.item_dose_key);
    }
  }, [itemUpSuc]);
  if (item) {
    //const handleEdit = () => navigate(`/dash/users/${cropId}`)
    let precio = new Intl.NumberFormat("es-do", {
      style: "currency",
      currency: "DOP",
    }).format(parseFloat(itemPrice));

    const itemname = itemName ? itemName : "no tiene";

    const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

    //console.log(`${user.user_id} ${userName} ${userRolesString} ${active} ${errContent}`);
    

    const contenido = (
      <tr key={itemId}>
        <td>
          
            <div type="button">{itemname}</div>
          
        </td>
      <><Dose key={itemDose} doseId={itemDose} /></>
        <td>{precio}</td>
        <td>
          <input
            type="checkbox"
            checked={item.item_status}
            onChange={onActiveChanged}
          />
        </td>
        <td>
          <img
            onClick={onDeleteItemClicked}
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

const memoizedItem = memo(Item);

export default memoizedItem;
