//import { useNavigate } from 'react-router-dom'
import "../../src/styles/registrar-actividad.css";
import { useState, useEffect } from "react";
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
import Modal from "react-modal";
import useAuth from "../hooks/useAuth";

Modal.setAppElement("#root");

const PLANT_REGEX =
  /^([A-Z]{1})([a-z0-9]{4,20})(([- ]{1}?)([a-zA-Z0-9]{1,20}?)){0,3}$/;
const VARY_REGEX = /^([A-Z]{1})([a-z-0-9]{2,20})$/;
const FRAME_REGEX = /^((\d{1,3})(\.?)(\d{0,2}))[X-x]((\d{1,3})(\.?)(\d{0,2}))/;

const Plant = ({ plantId }) => {
  const { username, isManager, isAdmin } = useAuth();
  const { plant } = useGetPlantsQuery("plantsList", {
    selectFromResult: ({ data }) => ({
      plant: data?.entities[plantId],
    }),
  });
  if (plant) {
    const [plantName, setPlantName] = useState(plant.plant_name);
    const [desc, setDesc] = useState(plant.plant_desc);
    const [active, setActive] = useState(plant.plant_status);
    const [plantFrame, setPlantFrame] = useState(plant.plant_frame);
    const [variety, setVariety] = useState(plant.plant_variety);
    const [isOpen, setIsOpen] = useState(false);
    const [validPlantName, setValidPlantName] = useState(false);
    const [validVary, setValidVary] = useState(false);
    const [validFrame, setValidFrame] = useState(false);

    useEffect(() => {
      setValidPlantName(PLANT_REGEX.test(plantName));
    }, [plantName]);
    useEffect(() => {
      setValidVary(VARY_REGEX.test(variety));
    }, [variety]);
    useEffect(() => {
      setValidFrame(FRAME_REGEX.test(plantFrame));
    }, [plantFrame]);

    //id, plantName, desc, variety, active, plantFrame

    const [updatePlant, { isLoading, isSuccess, isError, error }] =
      useUpdatePlantMutation();

    const [
      deletePlant,
      { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
    ] = useDeletePlantMutation();

    const canSave =
      [
        validPlantName,
        variety ? validVary : true,
        plantFrame ? validFrame : true,
      ].every(Boolean) && !isLoading;

    const onPlantNameChanged = (e) => setPlantName(e.target.value);
    const onPlantDescChanged = (e) => setDesc(e.target.value);
    const onPlantVaryChanged = (e) => setVariety(e.target.value);
    const onPlantFrameChanged = (e) => setPlantFrame(e.target.value);

    const onActiveChanged = async (e) => {
      await updatePlant({
        id: plant.plant_id,
        plantName,
        desc,
        variety,
        active: e.target.checked,
        plantFrame,
      });
    };
    const onPlantChanged = async (e) => {
      e.preventDefault();
      if (canSave) {
        await updatePlant({
          id: plant.plant_id,
          plantName,
          desc,
          variety,
          active,
          plantFrame,
        });
      }

      setIsOpen(false);
    };
    // id, plantName, desc, variety, active
    const onDeletePlantClicked = async () => {
      Swal.fire({
        title: "¿Seguro de eliminar?",
        text: `Eliminar esta Planta afectará todos los datos asociados a esta. Esta acción será irreversible.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar!",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deletePlant({ id: plant.plant_id });
          Swal.fire("¡Eliminada!", "Esta Plant ha sido eliminada.", "success");
        }
      });
    };
    const handleClearClick = (e) => {
      e.preventDefault();
      setPlantName(plant.plant_name);
      setDesc(plant.plant_desc);
      setVariety(plant.plant_variety);
      setPlantFrame(plant.plant_frame);
      setActive(plant.plant_status);
    };

    useEffect(() => {
      if (plant) {
        setIsOpen(false);
        setPlantName(plant.plant_name);
        setDesc(plant.plant_desc);
        setVariety(plant.plant_variety);
        setPlantFrame(plant.plant_frame);
        setActive(plant.plant_status);
      }
    }, [plant]);
    const updPlant = (
      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        <button
          className="btn btn-danger"
          onClick={() => {
            setIsOpen(false);
            setPlantName(plant.plant_name);
            setDesc(plant.plant_desc);
            setVariety(plant.plant_variety);
            setPlantFrame(plant.plant_frame);
            setActive(plant.plant_status);
          }}
        >
          Cerrar
        </button>
        <div className="cultivos_button-section">
          <form onSubmit={onPlantChanged}>
            <div className="form-row justify-content-center">
              <div className="col-md-4 mb-3">
                <label for="nombre_cultivo" className="text-center">
                  Nombre de planta
                </label>
                <input
                  type="text"
                  maxLength={20}
                  className="form-control"
                  id="nombre_cultivo"
                  placeholder="Fruta X o Fruta-x"
                  pattern="^([A-Z]{1})([a-z0-9]{4,20})(([- ]{1}?)([a-zA-Z0-9]{1,20}?)){0,3}$"
                  value={plantName}
                  onChange={onPlantNameChanged}
                  required
                />
                <div className="error-message">
                  <p>Formato incorrecto</p>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <label for="nombre_cultivo" className="text-center">
                  Variedad
                </label>
                <input
                  type="text"
                  maxLength={20}
                  className="form-control"
                  id="nombre_cultivo"
                  placeholder="Herbáceas"
                  pattern="^([A-Z]{1})([a-z-0-9]{2,20})$"
                  value={variety}
                  onChange={onPlantVaryChanged}
                />
                <div className="error-message">
                  <p>Formato incorrecto</p>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <label for="nombre_cultivo" className="text-center">
                  Marco de Plantación
                </label>
                <input
                  type="text"
                  maxLength={30}
                  className="form-control"
                  id="nombre_cultivo"
                  placeholder="ej: 1.1X2.2"
                  pattern="^((\d{1,3})(\.?)(\d{0,2}))[X-x]((\d{1,3})(\.?)(\d{0,2}))"
                  value={plantFrame}
                  onChange={onPlantFrameChanged}
                />
                <div className="error-message">
                <p>Formato incorrecto</p>
              </div>
              </div>
            </div>

            <div className="form-row">
              <div className="col-md-12 mb-3">
                <label for="responsable">Descripción</label>
                <input
                  type="text"
                  maxLength={100}
                  className="form-control"
                  id="responsable"
                  value={desc}
                  onChange={onPlantDescChanged}
                />
              </div>
            </div>
            <div className="cultivos_button-section">
              <button
                className="btn btn-sm btn-success"
                type="submit"
                disabled={!canSave}
              >
                Guardar Cambios
              </button>
              <button
                onClick={handleClearClick}
                className="btn btn-outline-danger limpiar"
              >
                Retornar Valor
              </button>
            </div>
          </form>
        </div>
      </Modal>
    );

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
        <td>{variety}</td>
        <td>{plantFrame}</td>
        <td>{desc}</td>
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
              onClick={onDeletePlantClicked}
              className="remove-img"
              src={RemoveImg}
              alt="Remove"
            />
          </td>
        )}
        {isAdmin && <td onClick={() => setIsOpen(true)}>Editar</td>}
        {isAdmin && <>{updPlant}</>}
      </tr>
    );

    return contenido;
  } else return null;
};

const memoizedPlant = memo(Plant);

export default memoizedPlant;
