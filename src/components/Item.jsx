//import { useNavigate } from 'react-router-dom'
import "../../src/styles/registrar-actividad.css";
import {
  useGetItemsQuery,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from "../features/fields/redux/itemApiSlice";
import { memo } from "react";
import { Link } from "react-router-dom";
import RemoveImg from "../images/remove.svg";
import Swal from "sweetalert2";
import { ROLES } from "../config/roles";



//en progreso aun falta configurar dosis y luego de este 
const Crop = ({ itemId }) => {
  const { item } = useGetItemsQuery("itemsList", {
    selectFromResult: ({ data }) => ({
      item: data?.entities[itemId],
    }),
  });

  const [updateItem, { isLoading, isSuccess, isError, error }] =
  useUpdateItemMutation();

  const [
    deleteItem,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteItemMutation();

  const onActiveChanged = async (e) => {
    await updateCrop({
      id: item.item_id,
      itemName: item.item_name,
      datePlant: item.item_plant,
      dateHarvest: item.item_Harvest,
      finalProd: item.item_final_prod,
      itemCampKey: item.item_camp_key,
      itemPlantKey: item.item_plant_key,
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

  if (crop) {
    //const handleEdit = () => navigate(`/dash/users/${cropId}`)

    const cropname = crop.crop_name ? crop.crop_name : "no tiene";

    const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

    //console.log(`${user.user_id} ${userName} ${userRolesString} ${active} ${errContent}`);
    if (isSuccess) {
      console.log(`no hay error ${errContent}`);
    }

    const contenido = (
      <tr key={cropId}>
        <td>
          <Link to={`/dash/cultivos/info-cultivo/${cropId}`}>
            <div type="button">{cropname}</div>
          </Link>
        </td>
        <td>
          <input
            type="checkbox"
            checked={crop.crop_status}
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

const memoizedCrop = memo(Crop);

export default memoizedCrop;
