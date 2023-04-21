import React, { useState } from "react";
import "../../styles/nav_cultivos.css";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useGetCropsQuery } from "./redux/cropApiSlice";
import Crop from "../../components/Crop";
import useAuth from "../../hooks/useAuth";

const NavCultivos = () => {
  const navigate = useNavigate();
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
            if (
              entities[Id].crop_user_key == userId ||
              entities[Id].date_user_key == userId
            ) {
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
            <button
              className="btn btn-outline-primary seccion_cultivos_btn-agr"
              onClick={() => navigate("/dash/cultivos/nuevo-cultivo")}
            >
              Cultivo
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary seccion_cultivos_btn-agr"
              onClick={() => navigate("/dash/cultivos/registrar-plantilla")}
            >
              Plantillas de cultivos
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary seccion_cultivos_btn-agr"
              onClick={() => navigate("/dash/cultivos/registrar-planta")}
            >
              Plantas
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary seccion_cultivos_btn-agr"
              onClick={() => navigate("/dash/cultivos/registrar-actividad")}
            >
              Actividades de cultivo
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary seccion_cultivos_btn-agr"
              onClick={() => navigate("/dash/cultivos/item-section")}
            >
              Materiales y mano de obra
            </button>
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
