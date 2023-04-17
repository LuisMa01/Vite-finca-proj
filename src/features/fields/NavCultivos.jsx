import React, { useState } from "react";
import "../../styles/nav_cultivos.css";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";

import { useGetCropsQuery } from "./redux/cropApiSlice";
import Crop from "../../components/Crop";
import useAuth from "../../hooks/useAuth";

const NavCultivos = () => {
  const { username, isManager, isAdmin, userId } = useAuth();
  const [stado, setStado] = useState("");
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
  const searchEstado = (e) => {
    e.preventDefault();
    setStado(e.target.value);
  };
  let tableContent;
  if (cropSuc) {
    const { ids, entities } = crops;

    const results = !stado
      ? ids
      : ids.filter((dato) => `${entities[dato].crop_status}` == stado);

    tableContent =
      results?.length &&
      results.map((Id) => {
        let plnt = `${entities[Id].crop_name}`.split("-")[0];
        if (plnt !== "Plantilla") {

         
          if (isAdmin) {
            return <Crop key={Id} cropId={Id} Lista={"Lista2"} />;
          } else if (isManager) {
            if (entities[Id].crop_user_key == userId || entities[Id].date_user_key == userId) {
              return <Crop key={Id} cropId={Id} Lista={"Lista2"} />;
            }
          } else {
            if (entities[Id].date_user_key == userId) {
              return <Crop key={Id} cropId={Id} Lista={"Lista2"} />;
            }
          }
        }
      });
  }

  return (
    <>
      <div className="seccion_cultivos">
        <div>
          <div className="button-section_parent ">
            <Link to={"/dash/cultivos/nuevo-cultivo"} className="Link">
              <button className="btn btn-outline-primary seccion_cultivos_btn-agr">
                Cultivo
              </button>
            </Link>
            <Link to={"/dash/cultivos/registrar-plantilla"} className="Link">
              <button
                type="button"
                className="btn btn-outline-secondary seccion_cultivos_btn-agr"
              >
                Plantillas de cultivos
              </button>
            </Link>
            <Link to={"/dash/cultivos/registrar-planta"} className="Link">
              <button
                type="button"
                className="btn btn-outline-secondary seccion_cultivos_btn-agr"
              >
                Plantas
              </button>
            </Link>
            <Link to={"/dash/cultivos/registrar-actividad"} className="Link">
              <button
                type="button"
                className="btn btn-outline-secondary seccion_cultivos_btn-agr"
              >
                Actividades de cultivo
              </button>
            </Link>
            <Link to={"/dash/cultivos/item-section"} className="Link">
              <button
                type="button"
                className="btn btn-outline-secondary seccion_cultivos_btn-agr"
              >
                Materiales y mano de obra
              </button>
            </Link>
          </div>
        </div>
        <div className="seccion_cultivos_checkbox-div">
          <div>
            <select
              className="form-control"
              value={stado}
              onChange={searchEstado}
            >
              <option value={""}>Todos</option>
              <option value={true}>Activos</option>
              <option value={false}>Inactivos</option>
            </select>
          </div>
        </div>
        <div className="card-deck cultivos_big-card">{tableContent}</div>
      </div>
    </>
  );
};
export default NavCultivos;
