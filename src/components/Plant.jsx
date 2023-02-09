//import { useNavigate } from 'react-router-dom'
import "../../src/styles/registrar-actividad.css";
import {
  useGetPlantsQuery,
  useUpdatePlantMutation,
  useDeletePlantMutation,
} from "../features/fields/redux/plantApiSlice";
import { memo } from "react";
import { Link } from "react-router-dom";
import RemoveImg from "../images/remove.svg";
import Swal from "sweetalert2";
import { ROLES } from "../config/roles";


const Plant = ({ plantId }) => {
  const { plant } = useGetPlantsQuery("plantsList", {
    selectFromResult: ({ data }) => ({
      plant: data?.entities[plantId],
    }),
  });

  const [updatePlant, { isLoading, isSuccess, isError, error }] =
  useUpdatePlantMutation();

  const [
    deletePlant,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeletePlantMutation();

  const onActiveChanged = async (e) => {
    await updatePlant({
      id: plant.plant_id,
      plantName: plant.plant_name,
      desc: plant.plant_desc,
      variety: plant.plant_variety,
      active: e.target.checked,
    });
  };
  // id, plantName, desc, variety, active
  const onDeletePlantClicked = async () => {

    Swal.fire({
      title: '¿Seguro de eliminar?',
      text: `Eliminar esta Planta afectará todos los datos asociados a esta. Esta acción será irreversible.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deletePlant({ id: plant.plant_id });
        Swal.fire(
          '¡Eliminada!',
          'Esta Plant ha sido eliminada.',
          'success'
        )
      }
    })
    
  };

  if (plant) {
    //const handleEdit = () => navigate(`/dash/users/${plantId}`)

    const plantname = plant.plant_name ? plant.plant_name : "no tiene";

    const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

    //console.log(`${user.user_id} ${userName} ${userRolesString} ${active} ${errContent}`);
    if (isSuccess) {
      console.log(`no hay error ${errContent}`);
    }

    const contenido = (
      <tr key={plantId}>
        <td>{plantname}</td>
        <td>
          <input
            type="checkbox"
            checked={plant.plant_status}
            onChange={onActiveChanged}
          />
        </td>
        <td>
          <img
            onClick={onDeletePlantClicked}
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

const memoizedPlant = memo(Plant);

export default memoizedPlant;
