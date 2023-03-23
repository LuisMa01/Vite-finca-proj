import React from "react";
import "../../styles/nav_cultivos.css";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import cultivos from "../jsons/cultivos.json";
import { useGetCropsQuery } from "./redux/cropApiSlice";
import Crop from "../../components/Crop";



const NavCultivos = () => {
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

  let tableContent;
  if (cropSuc) {
    const { ids, entities } = crops;

    tableContent =
      ids?.length &&
      ids.map((Id) =>{ 
        let plnt = `${entities[Id].crop_name}`.split("-")[0];
        if (plnt !== "Plantilla") {
          return <Crop key={Id} cropId={Id} Lista={"Lista2"} />
        }      
    });
  }

  return (
    <>
      <div className="return-div">
        <Link to={"/dash"}>
          <div className="return-button">
            <img className="return-button-img" src={ReImage} alt="Atrás" />
          </div>
        </Link>
      </div>
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
            <input type="checkBox" className="curso" defaultChecked={true} />
            <span>Cultivos en curso</span>
          </div>
          <div>
            <input
              type="checkBox"
              className="finalizados"
              defaultChecked={false}
            />
            <span>Cultivos finalizados</span>
          </div>
        </div>
        <div className="card-deck cultivos_big-card">{tableContent}</div>
      </div>
    </>
  );
};
export default NavCultivos;
