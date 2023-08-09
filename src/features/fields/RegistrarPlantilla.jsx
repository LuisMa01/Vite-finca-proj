import React from "react";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import "../../styles/registrar-plantilla.css";
import { useGetCropsQuery, useAddNewCropMutation } from "./redux/cropApiSlice";

import Crop from "../../components/Crop";
import useAuth from "../../hooks/useAuth";

const RegistrarPlantilla = () => {
  const { username, isManager, isAdmin } = useAuth();
  const {
    crops,
    isLoading,
    isSuccess: cropSuc,
    isError,
    error,
  } = useGetCropsQuery("cropsList", {
    selectFromResult: ({ data }) => ({
      crops: data?.ids.map((Id) => {
        let plnt = `${data?.entities[Id].crop_name}`.split("-")[0];
        if (plnt == "Plantilla") {
          return data?.entities[Id].crop_id;
        }
      }),
    }),
  });

  let tableContent;
  if (isError) {
    tableContent = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (crops) {
    tableContent =
      crops?.length &&
      crops?.map((info) => {
        if (info) {
          return <Crop key={info} cropId={info} Lista={"Lista1"} />;
        }
      });
  }
  return (
    <>
      <h1 className="titulo_nueva-plantilla font-weight-bold">Plantillas</h1>
      <div className="ventana_plantillas">
        <div className="table-container-1">
          <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-loyola">
              <tr>
                <th className="align-middle" scope="col">
                  Cultivos
                </th>
                <th className="align-middle" scope="col">
                  Planta
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

export default RegistrarPlantilla;
