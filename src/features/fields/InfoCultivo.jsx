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
import { useGetComtsQuery } from "./redux/comtApiSlice";
import { useGetCostsQuery } from "./redux/costApiSlice";
import { useGetActsQuery } from "./redux/actApiSlice";
import { useGetUsersQuery } from "./redux/usersApiSlice";
import AppDate from "../../components/AppDate";
import Crop from "../../components/Crop";
import Cost from "../../components/Cost";
import Comt from "../../components/Comt";
import useAuth from "../../hooks/useAuth";

const Costo = ({ crpId }) => {
  const { username, isManager, isAdmin } = useAuth();
  const {
    data: costs,
    isError: costIsError,
    error: costError,
  } = useGetCostsQuery("costsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  let costList;
  let costTotal = [];
  let listSum = 0
  if (costs) {
    const { ids, entities } = costs;

    costList =
      ids?.length &&
      ids.map((Id) => {
        if (entities[Id].date_crop_key == crpId) {
          listSum = listSum + 1
          let list = <Cost key={Id} costId={Id} Lista={"Lista2"} />;
          costTotal.push(parseFloat(entities[Id].cost_price));
          return list;
        }
      });
    let TT = costTotal.reduce((valorAnterior, valorActual) => {
      return valorAnterior + valorActual;
    }, 0);
    let precioTT = new Intl.NumberFormat("es-do", {
      style: "currency",
      currency: "DOP",
    }).format(parseFloat(TT));

    let contenido = (<></>)
    if (listSum > 0) {
      contenido = (
        <>
          <p className="already-existing-activities col-12">
            <b>MATERIALES, INSUMOS Y MANO DE OBRA:</b>
          </p>
          <div className="table-container col-12 col-md-9 col-xl-6">
            <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
              <thead className="thead-loyola">
                <tr>
                  <th className="align-middle" scope="col">
                    Articulo
                  </th>
                  <th className="align-middle" scope="col">
                    Actividad
                  </th>
                  <th className="align-middle" scope="col">
                    Dosis
                  </th>
                  <th className="align-middle" scope="col">
                    Cantidad
                  </th>
                  <th className="align-middle" scope="col">
                    Unidad
                  </th>
                  <th className="align-middle" scope="col">
                    Costo Unitario
                  </th>
                  <th className="align-middle" scope="col">
                    Costo Total
                  </th>
                  {(isAdmin) && <th className="align-middle" scope="col">
                    Eliminar
                  </th>}
                </tr>
              </thead>
              <tbody>{costList}</tbody>
              <tfoot>
                <tr>
                  <td colSpan={"6"}>Total:</td>
                  <td>{precioTT}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      );
    }
    
    return contenido;
  }
};

const Comentario = ({ cropId }) => {
  const { username, isManager, isAdmin } = useAuth();
  const {
    data: comts,
    isError,
    error,
  } = useGetComtsQuery("comtsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  let comtList;
  let listSum = 0
  if (comts) {
    const { ids, entities } = comts;
    comtList =
      ids?.length &&
      ids.map((Id) => {
        if (entities[Id].date_crop_key == cropId) {
          listSum = listSum+1
          return <Comt key={Id} comtId={Id} Lista={"Lista2"} />;
        }
      });
  }

  let contenido = (<></>)
  if (listSum > 0) {
    contenido = (
      <>
        <p className="already-existing-activities">
          <b>Observaciones:</b>
        </p>
        <div className="table-container col-12 col-md-9 col-xl-6">
          <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-loyola">
              <th className="align-middle" scope="col">
                Fecha
              </th>
              <th className="align-middle" scope="col">
                Actividad
              </th>
              <th className="align-middle" scope="col">
                Comentario
              </th>
              {(isAdmin) && <th className="align-middle" scope="col">
                Eliminar
              </th>}
              {(isManager || isAdmin) && <th className="align-middle" scope="col">
                Editar
              </th>}
            </thead>
            <tbody>{comtList}</tbody>
          </table>
        </div>
      </>
    );
  }
  
  return <>{contenido}</>;
};

const infoCultivo = () => {
  const { username, isManager, isAdmin } = useAuth();
  const { id } = useParams();
  const [actKey, setActKey] = useState("");
  const [dateInit, setDateInit] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [userRep, setUserRep] = useState("");
  const [plantillaKey, setPlantillaKey] = useState("");
  const [isPlantilla, setIsPlantilla] = useState(false);
  let actArr = [];
  let plntCrop
  const { crop } = useGetCropsQuery("cropsList", {
    selectFromResult: ({ data }) => ({
      crop: data?.entities[id],
    }),
  });
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
    plntCrop = `${crop.crop_name}`.split("-")[0];
    if (plntCrop == "Plantilla") {
      await addNewDate({
        actKey,
        userRep: "",
        dateInit: "",
        dateEnd: "",
        cropKey: crop.crop_id,
        plantId: crop.crop_plant_key,
      });
    } 
    if (plntCrop !== "Plantilla") {
      await addNewDate({
        actKey,
        userRep,
        dateInit,
        dateEnd,
        cropKey: crop.crop_id,
        plantId: crop.crop_plant_key,
      });
    }
  };
  const onSecAddActClicked = (e) => {
    e.preventDefault();
    actArr.map((id) => {
      addNewDate({
        actKey: id,
        userRep,
        dateInit,
        dateEnd,
        cropKey: crop.crop_id,
        plantId: crop.crop_plant_key,
      });
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
  const onPlantillaKeyChanged = (e) => {
    e.preventDefault();
    setPlantillaKey(e.target.value);
  };
  

  const handleClearClick = (e) => {
    e.preventDefault();
    setActKey("");
    setDateInit("");
    setDateEnd("");
    setUserRep("");
    setPlantillaKey("");
  };
  useEffect(() => {
    if (addDateSuc) {
      setActKey("");
      setDateInit("");
      setDateEnd("");
      setUserRep("");
      setPlantillaKey("");
    }
  }, [addDateSuc]);

  let opciones;
  
  let contenido;
  let userOption;
  let actOption;
  let cropDato;
  let comtCrop;
  let costCrop;
  let dateList;
  let plnt = <></>;
  let cropUsado = 0;
  if (crop) {
    //para asegurar que obtenga los datos del cultivo
    
    

    cropDato = (
      <Crop key={crop.crop_id} cropId={crop.crop_id} Lista={"Lista3"} />
    );
    comtCrop = <Comentario key={crop.crop_id} cropId={crop.crop_id} />;
    costCrop = <Costo key={crop.crop_id} crpId={crop.crop_id} />;

    if (rpuser) {
      const { ids, entities } = rpuser;
      userOption = ids.map((Id) => {
        if (entities[Id].user_status) {
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
    if (cropSuc) {
      const { ids, entities } = crops;

      opciones =
        ids?.length &&
        ids.map((Id) => {
          if (entities[Id].crop_status) {
            let plnt = `${entities[Id].crop_name}`.split("-")[0];
            let nomm = `${entities[Id].crop_name}`;

            if (plnt == "Plantilla") {
              return (
                <option key={Id} value={Id}>
                  {nomm}
                </option>
              );
            }
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

    
    if (dateIsError) {
      dateList = <p className="errmsg">{dateError?.data?.message}</p>;
    }
    if (dates) {
      const { ids, entities } = dates;

      if (plantillaKey) {
        ids?.length &&
          ids.map((Id) => {
            if (entities[Id].date_crop_key == plantillaKey) {
              actArr.push(entities[Id].date_act_key);
            }
          });
      }

      dateList =
        ids?.length &&
        ids.map((Id) => {
          if (entities[Id].date_crop_key == crop.crop_id) {
            cropUsado = cropUsado + 1;
            return <AppDate key={Id} dateId={Id} Lista={"Lista1"} />;
          } else {
            return <></>;
          }
        });

      

      ids?.length &&
        ids.map((Id) => {
          if (entities[Id].date_crop_key == crop.crop_id) {
            stop;
          }
        });

      if (cropUsado <= 0) {
        plnt = (
          <>
            <label htmlFor="campo_cultivo">Seleccionar Plantillas</label>
            <div className="col-12 row">
              <div className="col-6">
                <select
                  className="form-control"
                  value={plantillaKey}
                  onChange={onPlantillaKeyChanged}
                >
                  <option disabled value={""}>
                    Elegir plantilla
                  </option>
                  {opciones}
                </select>
              </div>
              <div className="cultivos_button-section col-6">
                <button
                  className="btn btn-success"
                  type="submit"
                  onClick={onSecAddActClicked}
                >
                  Usar Plantilla
                </button>
              </div>
            </div>
          </>
        );
      }
    }

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

        <p className="add-new-activities">
          <b>Agregar actividad:</b>
        </p>
        <form>
          <div className="new-activity-miniform d-flex justify-content-center col-12 col-md-10 col-lg-9 form-row bg-light">
            <div className="col-12">{plnt}</div>
            <div className="col-md-6 col-lg-3 mb-3">
              <label htmlFor="campo_cultivo">Actividad</label>

              <select
                className="form-control"
                value={actKey}
                onChange={onActKeyChanged}
              >
                <option disabled value={""}>
                  Elegir actividad
                </option>
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
                <option disabled value={""}>
                  Elegir Responsable
                </option>
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
              <button className="btn btn-danger" onClick={handleClearClick}>
                Limpiar
              </button>
            </div>
          </div>
        </form>

        <p className="already-existing-activities">
          <b>Actividades agregadas:</b>
        </p>
        <div className="table-container col-12 col-lg-9">
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
              {(isAdmin) && <th className="align-middle" scope="col">
                Eliminar
              </th>}
              {(isManager || isAdmin) && <th className="align-middle" scope="col">
                Editar
              </th>}
            </thead>
            <tbody>
              <>{dateList}</>
            </tbody>
          </table>
        </div>
        <div>{costCrop}</div>
        <div>{comtCrop}</div>
      </>
    );
  } else {
    contenido = <>No Disponible</>;
  }

  return contenido;
};

export default infoCultivo;
