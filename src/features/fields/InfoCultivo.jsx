import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetCropsQuery, useUpdateCropMutation } from "./redux/cropApiSlice";
import ReImage from "../../images/return.svg";
import "../../styles/nuevo-cultivo.css";
import { Link } from "react-router-dom";
import {
  useGetDatesQuery,
  useUpdateDateMutation,
  useAddNewDateMutation,
  useDeleteDateMutation,
} from "./redux/appApiSlice";
import { useGetActsQuery } from "./redux/actApiSlice";
import { useGetUsersQuery } from "./redux/usersApiSlice";
import AppDate from "../../components/AppDate";
import Crop from "../../components/Crop";


const infoCultivo = () => {
  const { id } = useParams();
  const [actKey, setActKey] = useState("");
  const [dateInit, setDateInit] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [userRep, setUserRep] = useState(""); 

  const { crop } = useGetCropsQuery("cropsList", {
    selectFromResult: ({ data }) => ({
      crop: data?.entities[id],
    }),
  });
  const { data: rpuser } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const {
    data: dates,
    isError: dateIsError,
    error: dateError,
  } = useGetDatesQuery("datesList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { data: activ } = useGetActsQuery("actsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });



  const [
    addNewDate,
    { isSuccess: addDateSuc, isError: addDateIserror, error: addDateerror },
  ] = useAddNewDateMutation();

  const onAddActClicked = async (e) => {
    e.preventDefault();
    console.log(
      `${actKey} ${userRep} ${dateInit} ${dateEnd} ${crop.crop_id} ${crop.crop_plant_key}`
    );
    await addNewDate({
      actKey,
      userRep,
      dateInit,
      dateEnd,
      cropKey: crop.crop_id,
      plantId: crop.crop_plant_key,
    });
  };

  //userRep, dateInit, dateEnd, actKey, cropKey, plantId , userRep, dateInit, dateEnd, actKey, cropKey, plantId

  const onActKeyChanged = (e) => {
    e.preventDefault();
    setActKey(e.target.value);
  };
  const onDateInitChanged = (e) => {
    e.preventDefault();
    setDateInit(e.target.value);
  };
  const onDateEndChanged = (e) => {
    e.preventDefault();
    setDateEnd(e.target.value);
  };
  const onUserRepChanged = (e) => {
    e.preventDefault();
    setUserRep(e.target.value);
  };
  const handleClearClick = (e) => {
    e.preventDefault()
    setActKey("");
      setDateInit("");
      setDateEnd("");
      setUserRep("");
  };
  useEffect(() => {
    if (addDateSuc) {
      setActKey("");
      setDateInit("");
      setDateEnd("");
      setUserRep("");
    }
  }, [addDateSuc]);

  let cropName;
  let contenido;
  let userOption;
  let actOption;
  let cropDato
  if (crop) {
    //para asegurar que obtenga los datos del cultivo
    if(crop.crop_id){

      cropDato = (crop.crop_id).length ?? <Crop key={crop.crop_id} cropId={crop.crop_id} Lista={"Lista3"} />

    }
    if (rpuser) {
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
    if (activ) {
      const { ids, entities } = activ;

      actOption = ids.map((Id) => {
        if (entities[Id].act_status) {
          return (
            <option key={Id} value={entities[Id].act_id}>
              {entities[Id].act_name}
            </option>
          );
        }
      });
    }

    let dateList;
    if (dateIsError) {
      dateList = <p className="errmsg">{dateError?.data?.message}</p>;
    }
    if (dates) {
      const { ids, entities } = dates;

      dateList =
        ids?.length &&
        ids.map((Id) => {
          if (entities[Id].date_crop_key == crop.crop_id) {
            return <AppDate key={Id} dateId={Id} Lista={"Lista1"} />;
          }
        });
    }

    cropName = crop.crop_name ? crop.crop_name : "no tiene";
    contenido = (
      <>
        <div className="return-div">
          <Link to={"/dash/cultivos"}>
            <div className="return-button">
              <img className="return-button-img" src={ReImage} alt="Atrás" />
            </div>
          </Link>
        </div>

        <div>{cropDato}</div>
        
        <form>
        <div className="new-activity-miniform d-flex justify-content-center col-12 col-md-10 col-xl-9 form-row bg-light">
          <div className="col-md-6 col-lg-3 mb-3">
            <label htmlFor="campo_cultivo">Actividad</label>
            <select
              className="form-control"
              value={actKey}
              onChange={onActKeyChanged}
            >
              <option disabled value={""}>Elegir actividad</option>
              {actOption}
            </select>
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <label htmlFor="campo_cultivo">Responsable</label>
            <select
              className="form-control"
              value={userRep}
              onChange={onUserRepChanged}
            >
              <option disabled value={""}>Elegir Responsable</option>
              {userOption}
            </select>
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <label htmlFor="siembra_cultivo">Fecha Programada</label>
            <input
              type="date"
              className="form-control"
              value={dateInit}
              onChange={onDateInitChanged}
            />
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <label htmlFor="siembra_cultivo">Fecha Ejecutada</label>
            <input
              type="date"
              className="form-control"
              value={dateEnd}
              onChange={onDateEndChanged}
            />
          </div>

          <div className="cultivos_button-section">
            <button
              className="btn btn-success"
              onClick={onAddActClicked}
              type="submit"
            >
              Agregar Actividad
            </button>
            <button className="btn btn-danger" onClick={handleClearClick}>Limpiar</button>
          </div>
        </div>
        </form>

        <div className="table-container col-12 col-md-9 col-xl-6">
          <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-loyola">
              <th className="align-middle" scope="col">
                Actividad
              </th>
              <th className="align-middle" scope="col">
              Fecha Programada
              </th>
              <th className="align-middle" scope="col">
              Fecha Ejecutada
              </th>
              <th className="align-middle" scope="col">
                Responsable
              </th>
              <th className="align-middle" scope="col">
                Eliminar
              </th>
              <th className="align-middle" scope="col">
                Editar
              </th>
            </thead>
            <tbody>
              <>{dateList}</>
            </tbody>
          </table>
        </div>
      </>
    );
  } else {
    contenido = null;
  }

  return contenido;
};

export default infoCultivo;
