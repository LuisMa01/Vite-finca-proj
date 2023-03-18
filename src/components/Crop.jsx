//import { useNavigate } from 'react-router-dom'
import "../../src/styles/registrar-actividad.css";
import {
  useGetCropsQuery,
  useUpdateCropMutation,
  useDeleteCropMutation,
} from "../features/fields/redux/cropApiSlice";
import { useGetPlantsQuery } from "../features/fields/redux/plantApiSlice";
import { useGetCampsQuery } from "../features/fields/redux/campApiSlice";
import { useGetUsersQuery } from "../features/fields/redux/usersApiSlice";
import { useGetActsQuery } from "../features/fields/redux/actApiSlice";
import { useGetCostsQuery } from "../features/fields/redux/costApiSlice";
import { memo } from "react";
import { Link } from "react-router-dom";
import RemoveImg from "../images/remove.svg";
import Swal from "sweetalert2";
import { ROLES } from "../config/roles";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Cost = ({ cropId }) => {
  const { data: cost } = useGetCostsQuery("costsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let costTotal = [];
  if (cost) {
    const { ids, entities } = cost;

    ids?.length &&
      ids.map((Id) => {
        if (entities[Id].date_crop_key == cropId) {
          costTotal.push(parseFloat(entities[Id].cost_price));
        }
      });
  }

  let TT = costTotal.reduce((valorAnterior, valorActual) => {
    return valorAnterior + valorActual;
  }, 0);
  let precioTT = new Intl.NumberFormat("es-do", {
    style: "currency",
    currency: "DOP",
  }).format(parseFloat(TT));
  return precioTT;
};

const Camp = ({ campId }) => {
  const { camp } = useGetCampsQuery("campsList", {
    selectFromResult: ({ data }) => ({
      camp: data?.entities[campId],
    }),
  });

  if (camp) {
    return <>{camp.camp_name}</>;
  }
};
const Plant = ({ plantId, Opt }) => {
  const { plant } = useGetPlantsQuery("plantsList", {
    selectFromResult: ({ data }) => ({
      plant: data?.entities[plantId],
    }),
  });

  if (plant) {
    if (Opt == "name") {
      return <>{plant.plant_name}</>;
    }
    if (Opt == "vary") {
      return <>{plant.plant_variety}</>;
    }
    if (Opt == "marco") {
      return <>{plant.plant_frame}</>;
    }
  }
};

const Crop = ({ cropId, Lista }) => {
  const { crop } = useGetCropsQuery("cropsList", {
    selectFromResult: ({ data }) => ({
      crop: data?.entities[cropId],
    }),
  });
  const { data: plts, isSuccess: plantSucc } = useGetPlantsQuery("plantsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { data: cmp, isSuccess: campSucc } = useGetCampsQuery("campsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const { data: rpuser, isSuccess: useSucc } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  if (crop) {
    const [cropName, setCropName] = useState(crop.crop_name);
    const [repUser, setRepUser] = useState(crop.crop_user_key);
    const [datePlant, setDatePlant] = useState(crop.crop_plant);
    const [dateHarvest, setDateHarvest] = useState(crop.crop_Harvest);
    const [finalProd, setFinalProd] = useState(crop.crop_final_prod);
    const [cropCampKey, setCropCampKey] = useState(crop.crop_camp_key);
    const [cropPlantKey, setCropPlantKey] = useState(crop.crop_plant_key);
    const [active, setActive] = useState(crop.crop_status);
    const [cropArea, setCropArea] = useState(crop.crop_area);
    const [isOpen, setIsOpen] = useState(false);

    const [updateCrop, { isLoading, isSuccess, isError, error }] =
      useUpdateCropMutation();

    const [
      deleteCrop,
      { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
    ] = useDeleteCropMutation();

    const onCropNameChanged = (e) => setCropName(e.target.value);
    const onRepUserChanged = (e) => setRepUser(e.target.value);
    const onCropPlantChanged = (e) => setDatePlant(e.target.value);
    const onCropHarvestChanged = (e) => setDateHarvest(e.target.value);
    const onCropFinalProdChanged = (e) => setFinalProd(e.target.value);
    const onCropCampChanged = (e) => setCropCampKey(e.target.value);
    const onCropPlantKeyChanged = (e) => setCropPlantKey(e.target.value);
    const onCropAreaChanged = (e) => setCropArea(e.target.value);
    //id, repUser, cropName, datePlant, dateHarvest, finalProd, cropCampKey, cropPlantKey, active, cropArea
    const onActiveChanged = async (e) => {
      e.preventDefault();
      await updateCrop({
        id: crop.crop_id,
        cropName,
        repUser,
        datePlant,
        dateHarvest,
        finalProd,
        cropCampKey,
        cropPlantKey,
        active,
        cropArea,
      });
    };
    const onStatusChanged = async (e) => {
      await updateCrop({
        id: crop.crop_id,
        cropName,
        repUser,
        datePlant,
        dateHarvest,
        finalProd,
        cropCampKey,
        cropPlantKey,
        active: e.target.checked,
        cropArea,
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
          Swal.fire(
            "¡Eliminado!",
            "Este cultivo ha sido eliminado.",
            "success"
          );
        }
      });
    };

    const handleClearClick = (e) => {
      e.preventDefault();
      setCropName(crop.crop_name);
      setRepUser(crop.crop_user_key);
      setDatePlant(crop.crop_plant);
      setDateHarvest(crop.crop_Harvest);
      setFinalProd(crop.crop_final_prod);
      setCropCampKey(crop.crop_camp_key);
      setCropPlantKey(crop.crop_plant_key);
      setActive(crop.crop_status);
      setCropArea(crop.crop_area);
    };
    useEffect(() => {
      if (crop) {
        setCropName(crop.crop_name);
        setRepUser(crop.crop_user_key);
        setDatePlant(crop.crop_plant);
        setDateHarvest(crop.crop_Harvest);
        setFinalProd(crop.crop_final_prod);
        setCropCampKey(crop.crop_camp_key);
        setCropPlantKey(crop.crop_plant_key);
        setActive(crop.crop_status);
        setCropArea(crop.crop_area);
      }
    }, [crop]);

    let userOption;
    if (useSucc) {
      const { ids, entities } = rpuser;

      userOption = ids.map((Id) => {
        if (entities[Id].user_status) {
          console.log(`${entities[Id].user_id}   ${Id}`);
          return (
            <option key={Id} value={entities[Id].user_id}>
              {entities[Id].user_nombre
                ? entities[Id].user_nombre
                : entities[Id].user_name}
            </option>
          );
        }
      });
    }

    let plantOption;
    if (plantSucc) {
      const { ids, entities } = plts;

      plantOption = ids.map((Id) => {
        if (entities[Id].plant_status) {
          return (
            <option key={Id} value={Id}>
              {entities[Id].plant_name}
            </option>
          );
        }
      });
    }

    let campOption;
    if (campSucc) {
      const { ids, entities } = cmp;

      campOption = ids.map((Id) => {
        if (entities[Id].camp_status) {
          return (
            <option key={Id} value={Id}>
              {entities[Id].camp_name}
            </option>
          );
        }
      });
    }

    const fechaIni = datePlant == null ? "" : `${datePlant}`.split("T")[0];

    const fechaFin = dateHarvest == null ? "" : `${dateHarvest}`.split("T")[0];

    const actCrop = (
      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        <button className="btn btn-danger" onClick={() => setIsOpen(false)}>
          Cerrar
        </button>
        <div className="cultivos_button-section">
          <form className="container needs-validation nuevo-cultivo-form">
            <div className="form-row bg-light">
              <div className="col-md-6 mb-3">
                <label htmlFor="nombre_cultivo">Nombre del cultivo</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Fruta ##"
                  value={cropName}
                  onChange={onCropNameChanged}
                  required
                />
              </div>
              <div className="col-12 col-md-3 mb-2">
                <label htmlFor="variedad_cultivo">
                  Área de Cultivo (tareas)
                </label>
                <input
                  type="number"
                  step="any"
                  min={0}
                  className="form-control"
                  id="variedad_cultivo"
                  value={cropArea}
                  onChange={onCropAreaChanged}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="siembra_cultivo">Fecha de siembra</label>
                <input
                  type="date"
                  className="form-control"
                  value={fechaIni}
                  onChange={onCropPlantChanged}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="col-md-3 mb-3">
                <label htmlFor="campo_cultivo">Responsable</label>
                <select
                  className="form-control"
                  value={repUser}
                  onChange={onRepUserChanged}
                >
                  <option disabled value={""}>
                    Elegir Responsable
                  </option>
                  {userOption}
                </select>
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="campo_cultivo">Plantas</label>
                <select
                  className="form-control"
                  value={cropPlantKey}
                  onChange={onCropPlantKeyChanged}
                >
                  <option disabled value={""}>
                    Elegir Planta
                  </option>
                  {plantOption}
                </select>
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="campo_cultivo">Campos</label>
                <select
                  className="form-control"
                  value={cropCampKey}
                  onChange={onCropCampChanged}
                >
                  <option disabled value={""}>
                    Elegir Campo
                  </option>
                  {campOption}
                </select>
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="cosecha_cultivo">Fecha de cosecha</label>
                <input
                  type="date"
                  className="form-control"
                  value={fechaFin}
                  onChange={onCropHarvestChanged}
                />
              </div>
            </div>
            <div className="form-row bg-light">
              <div className="col-md-6 mb-3">
                <label htmlFor="producto_final">Producto final</label>
                <input
                  type="text"
                  className="form-control"
                  value={finalProd}
                  onChange={onCropFinalProdChanged}
                />
              </div>
            </div>

            <div className="cultivos_button-section">
              <button
                className="btn btn-success"
                onClick={onActiveChanged}
                type="submit"
              >
                Guardar Cambios
              </button>
              <button className="btn btn-danger" onClick={handleClearClick}>
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </Modal>
    );

    //const handleEdit = () => navigate(`/dash/users/${cropId}`)

    const cropname = crop.crop_name ? crop.crop_name : "no tiene";

    const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

    //console.log(`${user.user_id} ${userName} ${userRolesString} ${active} ${errContent}`);
    if (isSuccess) {
      console.log(`no hay error ${errContent}`);
    }
    let contenido;
    if (Lista == "Lista1") {
      contenido = (
        <tr key={cropId}>
          <td>
            <Link to={`/dash/cultivos/info-cultivo/${cropId}`}>
              <div type="button">{cropname}</div>
            </Link>
          </td>

          <td>
            <Plant key={cropPlantKey} plantId={cropPlantKey} Opt={"name"} />
          </td>
          <td>
            <Camp key={cropCampKey} campId={cropCampKey} />
          </td>
          <td>
            <input
              type="checkbox"
              checked={crop.crop_status}
              onChange={onStatusChanged}
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
          <td onClick={() => setIsOpen(true)}>Editar</td>
          {actCrop}
        </tr>
      );
    }
    if (Lista == "Lista2") {
      contenido = (
        <div
          key={cropId}
          className="big-cont col-12 col-sm-6 col-md-4 col-xl-3"
        >
          <div className="card">
            <Link to={`/dash/cultivos/info-cultivo/${cropId}`}>
              <div className="card-header rounded">
                <h5>
                  <Plant
                    key={cropPlantKey}
                    plantId={cropPlantKey}
                    Opt={"name"}
                  />
                </h5>
              </div>
            
            <ul className="cultivos_general">
              <li className="col-12">
                <b>Cultivo: </b>
                {cropName}
              </li>
              <li className="col-12">
                <b>Variedad: </b>
                <Plant key={cropPlantKey} plantId={cropPlantKey} Opt={"vary"} />
              </li>
              <li className="col-12">
                <b>Área: </b>
                {cropArea ? cropArea : 0} tareas
              </li>
              <li className="col-12">
                <b>Marco de plantacion: </b>
                <Plant
                  key={cropPlantKey}
                  plantId={cropPlantKey}
                  Opt={"marco"}
                />
              </li>
              <li className="col-12">
                <b>Campo#: </b>
                <Camp key={cropCampKey} campId={cropCampKey} />
              </li>
              <li className="col-12">
                <b>Fecha de siembra: </b>
                {fechaIni}
              </li>
              <li className="col-12">
                <b>Fecha de cosecha: </b>
                {fechaFin}
              </li>
              <li className="col-12">
                <b>Producto final: </b>
                {finalProd}
              </li>
              <li className="col-12">
                <b>Costo acumulado: </b>
                <Cost key={cropId} cropId={cropId} />
              </li>
            </ul>
            </Link>
          </div>
        </div>
      );
    }
    if (Lista == "Lista3") {
      contenido = (
        <div
          key={cropId}
          className="general-info col-12 col-lg-9"
        >
          <h1 className="the_crop_header">
            <b>{cropName} </b>
          </h1>
          <div className="first-section">
            <p className="general-info_subh"><b>Información general:</b></p>
            <div className="row">
            <p>
                <b>Planta a cultivar: </b>
                <Plant key={cropPlantKey} plantId={cropPlantKey} Opt={"name"} />
              </p>
              <p>
                <b>Variedad: </b>
                <Plant key={cropPlantKey} plantId={cropPlantKey} Opt={"vary"} />
              </p>
              <p>
                <b>Área: </b>
                {cropArea ? cropArea : 0} tareas
              </p>
            </div>
            <div className="row">
              <p>
                <b>Marco de plantacion: </b>
                <Plant key={cropPlantKey} plantId={cropPlantKey} Opt={"marco"} />
              </p>
              <p>
                <b>Campo#: </b>
                <Camp key={cropCampKey} campId={cropCampKey} />
              </p>
              <p>
                <b>Fecha de siembra: </b>
                {fechaIni}
              </p>
            </div>
            <div className="row">
              <p>
                <b>Fecha de cosecha: </b>
                {fechaFin}
              </p>
              <p>
                <b>Producto final: </b>
                {finalProd}
              </p>
              <p>
                <b>Costo acumulado: </b>
                <Cost key={cropId} cropId={cropId} />
              </p>
            </div>
          </div>
        </div>
      );
    }
    return contenido;
  } else return null;
};

const memoizedCrop = memo(Crop);

export default memoizedCrop;
