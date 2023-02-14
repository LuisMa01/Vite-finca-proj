import React from "react";
import "../../styles/nuevo-cultivo.css";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import "../../styles/nuevo-cultivo.css";
import { useGetCropsQuery, useAddNewCropMutation } from "./redux/cropApiSlice";
import { useGetCampsQuery } from "./redux/campApiSlice";
import { useGetPlantsQuery } from "./redux/plantApiSlice";
import { useEffect, useState } from "react";
import Crop from "../../components/Crop";


const nuevoCultivo = () => {
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

  let plantOption
if (plantSucc) {
    const { ids, entities } = plts;

  plantOption = ids.map((Id) => {
    if (entities[Id].plant_status) {
        return <option key={Id} value={Id}>{entities[Id].plant_name}</option>;
    }
    
  });
    
}

let campOption
if (campSucc) {
    const { ids, entities } = cmp;

    campOption = ids.map((Id) => {
        if (entities[Id].camp_status) {
            return <option key={Id} value={Id}>{entities[Id].camp_name}</option>; 
        }
    
  });
    
}
  

  const [
    addNewCrop,
    { isSuccess: addissuccess, isError: addiserror, error: adderror },
  ] = useAddNewCropMutation();

  //username, cropName, datePlant, dateHarvest, finalProd, cropCampKey, cropPlantKey
  const [cropName, setCropName] = useState("");
  const [datePlant, setCropPlant] = useState();
  const [dateHarvest, setCropHarvest] = useState();
  const [finalProd, setCropProd] = useState("");
  const [cropCampKey, setCropCamp] = useState(0);
  const [cropPlantKey, setCropPlantKey] = useState(0);

  const onSaveCropClicked = async (e) => {
    e.preventDefault();
    console.log(`${cropName} ${datePlant} ${dateHarvest} ${finalProd} ${cropCampKey} ${cropPlantKey}`);

    await addNewCrop({
      cropName,
      datePlant,
      dateHarvest,
      finalProd,
      cropCampKey,
      cropPlantKey,
    });
  };
  const onCropNameChanged = (e) => setCropName(e.target.value);
  const onCropPlantChanged = (e) => setCropPlant(e.target.value);
  const onCropHarvestChanged = (e) => setCropHarvest(e.target.value);
  const onCropFinalProdChanged = (e) => setCropProd(e.target.value);
  const onCropCampChanged = (e) => setCropCamp(e.target.value);
  const onCropPlantKeyChanged = (e) => setCropPlantKey(e.target.value);

  useEffect(() => {
    if (addissuccess) {
      setCropName("");
      setCropPlant();
      setCropHarvest();
      setCropProd("");
      setCropCamp(0);
      setCropPlantKey(0);
    }
  }, [addissuccess]);

  let tableContent;
  if (isError) {
    tableContent = <p className="errmsg">{error?.data?.message}</p>;
    console.log(error?.data?.message);
  }
  if (cropSuc) {
    const { ids } = crops;

    tableContent =
      ids?.length && ids.map((Id) => <Crop key={Id} cropId={Id} />);
  }

  return (
    <>
      <div className="return-div">
        <Link to={"/dash/cultivos"}>
          <div className="return-button">
            <img className="return-button-img" src={ReImage} alt="Atrás" />
          </div>
        </Link>
      </div>
      <p className="nuevo-cultivo-header">Añadir cultivo</p>
      <p className="nuevo-descripcion text-muted">
        A continuación describa el cultivo que desea implementar, ubicación y
        características generales que lo identifican.
      </p>

      <form
        className="container needs-validation nuevo-cultivo-form"
        novalidate
      >
        <div className="form-row bg-light">
          <div className="col-md-4 mb-3">
            <label for="nombre_cultivo">Nombre del cultivo</label>
            <input
              type="text"
              className="form-control"
              id="nombre_cultivo"
              placeholder="Fruta ##"
              value={cropName}
              onChange={onCropNameChanged}
              required
            />
          </div>
          {/*
          <div className="col-md-4 mb-3">
            <label for="variedad_cultivo">Variedad</label>
            <input
              type="text"
              className="form-control"
              id="variedad_cultivo"
              required
            />
          </div>
          
          <div className="col-md-4 mb-3">
            <label for="marco_cultivo">Marco de plantación</label>
            <input type="text" className="form-control" id="marco_cultivo" />
          </div>
          */}
        </div>
        <div className="form-row">
         {/* <div className="col-md-3 mb-3">
            <label for="area_cultivo">Area</label>
            <input
              type="text"
              className="form-control"
              id="area_cultivo"
              required
            />
          </div>
  */}
          <div className="col-md-3 mb-3">
            <label for="siembra_cultivo">Fecha de siembra</label>
            <input
              type="date"
              className="form-control"
              id="siembra_cultivo"
              value={datePlant}
              onChange={onCropPlantChanged}
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <label for="campo_cultivo">Plantas</label>
            <select className="form-control" id="campo_cultivo" value={cropPlantKey} onChange={onCropPlantKeyChanged} >
              <option disabled selected>
                Elegir Planta
              </option>
              {plantOption}
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <label for="campo_cultivo">Campos</label>
            <select className="form-control" id="campo_cultivo" value={cropCampKey} onChange={onCropCampChanged} >
              <option disabled selected>
                Elegir Campo
              </option>
              {campOption}
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <label for="cosecha_cultivo">Fecha de cosecha</label>
            <input
              type="date"
              className="form-control"
              id="cosecha_cultivo"
              value={dateHarvest}
              onChange={onCropHarvestChanged}
            />
          </div>
        </div>
        <div className="form-row bg-light">
          <div className="col-md-6 mb-3">
            <label for="producto_final">Producto final</label>
            <input
              type="text"
              class="form-control"
              id="producto_final"
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
        {/* <p className='nuevo-descripcion text-muted'>Una vez creado el cultivo, podrá cargar plantillas y/o agregar actividades </p> */}
      </form>
      <hr />
      <div className="ventana_plantillas">
        <p className="subheader">Cultivos</p>
        <div className="table-container-1">
          <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-blue">
              <th className="align-middle" scope="col">
                Cultivos
              </th>
              <th className="align-middle" scope="col">
                Estatus
              </th>
              <th className="align-middle" scope="col">
                Eliminar
              </th>
            </thead>
            <tbody>{tableContent}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default nuevoCultivo;
