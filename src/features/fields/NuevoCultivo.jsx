import React from "react";
import "../../styles/nuevo-cultivo.css";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import "../../styles/nuevo-cultivo.css";
import { useNavigate } from "react-router-dom";
import { useGetCropsQuery, useAddNewCropMutation } from "./redux/cropApiSlice";
import { useGetCampsQuery } from "./redux/campApiSlice";
import { useGetPlantsQuery } from "./redux/plantApiSlice";
import { useGetUsersQuery } from "./redux/usersApiSlice";
import { useEffect, useState } from "react";
import Crop from "../../components/Crop";
import useAuth from "../../hooks/useAuth";

const nuevoCultivo = () => {
  const { username, isManager, isAdmin } = useAuth();
  const {
    data: crops,
    isLoading,
    isSuccess: cropSuc,
    isError,
    error,
  } = useGetCropsQuery("cropsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
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

  let userOption;
  if (useSucc) {
    const { ids, entities } = rpuser;

    userOption = ids.map((Id) => {
      if (entities[Id].user_status) {
        return (
          <option value={entities[Id].user_id}>
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
          <option value={Id}>
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
          <option value={Id}>
            {entities[Id].camp_name}
          </option>
        );
      }
    });
  }

  const [
    addNewCrop,
    {
      isLoading: isNewLoading,
      isSuccess: addissuccess,
      data,
      isError: addiserror,
      error: adderror,
    },
  ] = useAddNewCropMutation();

  //username, cropNames, datePlant, dateHarvest, finalProd, cropCampKey, cropPlantKey
  const [cropNames, setCropNames] = useState("");
  const [repUser, setRepUser] = useState("");
  const [datePlant, setCropPlant] = useState();
  const [dateHarvest, setCropHarvest] = useState();
  const [finalProd, setCropProd] = useState("");
  const [cropCampKey, setCropCamp] = useState("");
  const [cropPlantKey, setCropPlantKey] = useState("");
  const [cropArea, setCropArea] = useState("");
  const [plantilla, setPlantilla] = useState("");
  const [cropName, setCropName] = useState("");
  const navigate = useNavigate();

  const onCropNamesChanged = (e) => {
    setCropNames(e.target.value);
  };
  const onRepUserChanged = (e) => setRepUser(e.target.value);
  const onCropPlantChanged = (e) => {
    e.preventDefault();
    setCropPlant(e.target.value);
  };
  const onCropHarvestChanged = (e) => {
    e.preventDefault();
    setCropHarvest(e.target.value);
  };
  const onPlantillaChanged = (e) => {
    setPlantilla(e.target.value);
  };
  const onCropFinalProdChanged = (e) => {
    e.preventDefault();
    setCropProd(e.target.value);
  };
  const onCropCampChanged = (e) => {
    e.preventDefault();
    setCropCamp(e.target.value);
  };
  const onCropPlantKeyChanged = (e) => {
    e.preventDefault();
    setCropPlantKey(e.target.value);
  };
  const onCropAreaChanged = (e) => {
    e.preventDefault();
    setCropArea(e.target.value);
  };

  const save = async (e) => {
    await addNewCrop({
      repUser,
      cropName,
      datePlant,
      dateHarvest,
      finalProd,
      cropCampKey,
      cropPlantKey,
      cropArea,
    });
  };
  const savePlantilla = async (e) => {
    await addNewCrop({
      repUser: "",
      cropName,
      datePlant: "",
      dateHarvest: "",
      finalProd: "",
      cropCampKey: "",
      cropPlantKey,
      cropArea: "",
    });
  };

  const onSaveCropClicked = async (e) => {
    e.preventDefault();
    if (plantilla !== "Plantilla") {
      save();
    }
    if (plantilla == "Plantilla") {
      savePlantilla();
    }
  };
  useEffect(() => {
    setCropName(`${plantilla}${cropNames}`);
    
  }, [plantilla, cropNames]);

  useEffect(() => {
    if (addissuccess) {
      
      setCropNames("");
      setRepUser("");
      setCropPlant();
      setCropHarvest();
      setCropProd("");
      setCropCamp("");
      setCropPlantKey("");
      setCropArea("");
      setPlantilla("");
      setCropName("");
      if (plantilla) {
        navigate("/dash/cultivos/registrar-plantilla");
      }
    }
  }, [addissuccess]);

  let tableContent;
  if (isError) {
    tableContent = <p className="errmsg">{error?.data?.message}</p>;
    console.log(error?.data?.message);
  }
  if (cropSuc) {
    const { ids, entities } = crops;

    tableContent =
      ids?.length &&
      ids.map((Id) => {
        let plnt = `${entities[Id].crop_name}`.split("-")[0];
        if (plnt !== "Plantilla") {
          
          return <Crop key={Id} cropId={Id} Lista={"Lista1"} />;
        }
      });
  }

  return (
    <>
      {isAdmin && (
        <p className="nuevo-cultivo-header font-weight-bold">Añadir cultivo</p>
      )}
      {isAdmin && (
        <p className="nuevo-descripcion text-muted">
          A continuación describa el cultivo que desea implementar, ubicación y
          características generales que lo identifican.
        </p>
      )}

      {isAdmin && (
        <form className="container needs-validation nuevo-cultivo-form">
          <div className="form-row bg-light">
            <div className="col-md-6 mb-3">
              <label htmlFor="nombre_cultivo">Nombre del cultivo</label>
              <div className="form-row">
                <div className="col-7">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Fruta ##"
                    value={cropNames}
                    onChange={onCropNamesChanged}
                    required
                  />
                </div>
                <div className="col-5">
                  <select
                    className="form-control"
                    value={plantilla}
                    onChange={onPlantillaChanged}
                  >
                    <option value={""}>Cultivo</option>
                    <option value={"Plantilla-"}>Plantilla</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-3 mb-2">
              <label htmlFor="variedad_cultivo">Área de Cultivo (tareas)</label>
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
                value={datePlant}
                onChange={onCropPlantChanged}
                required
              />
            </div>
          </div>

          <div className="form-row">
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
                value={dateHarvest}
                onChange={onCropHarvestChanged}
              />
            </div>
          </div>
          <div className="form-row bg-light">
            <div className="col-12 mb-3">
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
              onClick={onSaveCropClicked}
              type="submit"
            >
              Guardar cultivo
            </button>
            <Link to={"/dash/cultivos"} className="Link">
              <button className="btn btn-danger">Descartar</button>
            </Link>
          </div>
        </form>
      )}
      <hr />

      <div className="ventana_plantillas">
        <p className="subheader">Cultivos</p>
        <div className="table-container col-12 col-md-10 col-lg-8">
          <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-loyola">
              <tr>
                <th className="align-middle" scope="col">
                  Cultivos
                </th>
                <th className="align-middle" scope="col">
                  Planta
                </th>
                <th className="align-middle" scope="col">
                  Campo
                </th>
                {(isManager || isAdmin) && (
                  <th className="align-middle" scope="col">
                    Estatus
                  </th>
                )}
                {isAdmin && (
                  <th className="align-middle" scope="col">
                    Eliminar
                  </th>
                )}
                {isAdmin && (
                  <th className="align-middle" scope="col">
                    Editar
                  </th>
                )}
              </tr>
            </thead>
            <tbody>{tableContent}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default nuevoCultivo;
