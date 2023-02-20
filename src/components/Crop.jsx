//import { useNavigate } from 'react-router-dom'
import "../../src/styles/registrar-actividad.css";
import {
  useGetCropsQuery,
  useUpdateCropMutation,
  useDeleteCropMutation,
} from "../features/fields/redux/cropApiSlice";
import { memo } from "react";
import { Link } from "react-router-dom";
import RemoveImg from "../images/remove.svg";
import Swal from "sweetalert2";
import { ROLES } from "../config/roles";

const Crop = ({ cropId }) => {
  const { crop } = useGetCropsQuery("cropsList", {
    selectFromResult: ({ data }) => ({
      crop: data?.entities[cropId],
    }),
  });

  const [updateCrop, { isLoading, isSuccess, isError, error }] =
    useUpdateCropMutation();

  const [
    deleteCrop,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteCropMutation();

  const onActiveChanged = async (e) => {
    await updateCrop({
      id: crop.crop_id,
      cropName: crop.crop_name,
      datePlant: crop.crop_plant,
      dateHarvest: crop.crop_Harvest,
      finalProd: crop.crop_final_prod,
      cropCampKey: crop.crop_camp_key,
      cropPlantKey: crop.crop_plant_key,
      active: e.target.checked,
      cropArea: crop.crop_area,
    });
  };
  //id, cropName, datePlant, dateHarvest, finalProd, cropCampKey, cropPlantKey, active
  const onDeleteCropClicked = async () => {
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
        await deleteCrop({ id: crop.crop_id });
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
            onClick={onDeleteCropClicked}
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
