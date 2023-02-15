import React from "react";
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

const infoCultivo = () => {
  const { id } = useParams();

  console.log(`Esto va ${id}`);

  const { crop } = useGetCropsQuery("cropsList", {
    selectFromResult: ({ data }) => ({
      crop: data?.entities[id],
    }),
  });
  console.log(crop);

  let cropName;
  let contenido;
  if (crop) {
    const {
      data: dates,
      isSuccess: dateSucc,
      isError,
      error,
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

    let actOption;
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
    if (isError) {
      dateList = <p className="errmsg">{error?.data?.message}</p>;
    }
    if (dateSucc) {
      const { ids, entities } = dates;

      dateList =
        ids?.length &&
        ids.map((Id) => {
          if ((entities[Id].date_crop_key = crop.crop_id)) {
            const { act } = useGetActsQuery("actsList", {
              selectFromResult: ({ data }) => ({
                act: data?.entities[entities[Id].crop_act_key],
              }),
            });
            return (
              <tr key={act.act_id}>
                <td>{act.act_name}</td>
                <td>{entities[Id].date_init}</td>
                <td>{entities[Id].date_end}</td>
              </tr>
            );
          }
        });
    }

    console.log(crop.crop_name);
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
        <div className="nuevo-cultivo-header">{cropName}</div>
        <div className="form-row bg-light">
          <div className="col-md-3 mb-3">
            <label for="campo_cultivo">Actividad</label>
            <select className="form-control" id="campo_cultivo">
              <option disabled selected>
                Elegir actividad
              </option>
              {actOption}
            </select>
          </div>
        </div>

        <div className="table-container col-12 col-md-9 col-xl-6">
          <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-blue">
              <th className="align-middle" scope="col">
                Actividad
              </th>
              <th className="align-middle" scope="col">
                Fecha de Inicio
              </th>
              <th className="align-middle" scope="col">
                Fecha de Fin
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
