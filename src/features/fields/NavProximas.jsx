import React from "react";
import "../../styles/proximas.css";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import focusClick from "../../components/DashHeader";
import actividades from "../jsons/proximas.json";
import { useGetDatesQuery } from "./redux/appApiSlice";
import useAuth from "../../hooks/useAuth";

import AppDate from "../../components/AppDate";

const navProximas = () => {
  const { username, isManager, isAdmin } = useAuth();
  const {
    data: dates,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetDatesQuery("datesList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let dateList;

  if (dates) {
    const { ids, entities } = dates;

    dateList =
      ids?.length &&
      ids.map((Id) => {

        if (entities[Id].date_end == null) {
          let plnt = `${entities[Id].crop_name}`.split("-")[0];
          if (plnt !== "Plantilla") {
            return <AppDate key={Id} dateId={Id} Lista={"Lista2"} />;
          }
        }
      });
  }
  return (
    <>
      <div className="return-div">
        <Link to={"/dash"}>
          <div onClick={focusClick} className="return-button">
            <img className="return-button-img" src={ReImage} alt="Atrás" />
          </div>
        </Link>
      </div>
      <p className="titulo_proximas_actividades">
        Estas son las próximas actividades a realizar en la finca, de todos los
        campos y cultivos
      </p>
      <div className="table-container col-12 col-md-10 col-lg-8">
        <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
          <thead className="thead-loyola">
            <th className="align-middle" scope="col">
              Actividad
            </th>
            <th className="align-middle" scope="col">
              Cultivo
            </th>
            <th className="align-middle" scope="col">
              Campo
            </th>
            <th className="align-middle" scope="col">
              Fecha programada
            </th>
            <th className="align-middle" scope="col">
              Responsable
            </th>
          </thead>
          <tbody>{dateList}</tbody>
        </table>
      </div>
    </>
  );
};
export default navProximas;
