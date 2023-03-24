import React from "react";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import "../../styles/registrar-plantilla.css";
import { useGetCropsQuery, useAddNewCropMutation } from "./redux/cropApiSlice";
import LasActividades from "../jsons/plantilla-maiz.json";
import MisActividades from "../jsons/tipos-actividades.json";
import Crop from "../../components/Crop";
import useAuth from "../../hooks/useAuth";

const RegistrarPlantilla = () => {
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
        if (plnt == "Plantilla") {
          return <Crop key={Id} cropId={Id} Lista={"Lista1"} />;
        }
      });
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
      <h1 className="titulo_nueva-plantilla font-weight-bold">
         Plantillas
      </h1>
      <div className="ventana_plantillas">
        {/* <form className="container col-12 col-md-10 col-lg-8 col-xl-6 col col needs-validation" novalidate>   */}
        
        
        <div className="table-container-1">
        <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-loyola">
              <th className="align-middle" scope="col">
                Cultivos
              </th>
              <th className="align-middle" scope="col">
                Planta
              </th>
              <th className="align-middle" scope="col">
                Campo
              </th>
              {(isManager || isAdmin) && <th className="align-middle" scope="col">
                Estatus
              </th>}
              {(isAdmin) && <th className="align-middle" scope="col">
                Eliminar
              </th>}
              {(isAdmin) && <th className="align-middle" scope="col">
                Editar
              </th>}
            </thead>
            <tbody>{tableContent}</tbody>
          </table>
        </div>
        
      </div>
    </>
  );
};

export default RegistrarPlantilla;

const Actividades = () => {
  return LasActividades.map((item) => (
    <>
      <tr key={item.index}>
        <td className="align-middle">{item.name}</td>
        <td className="align-middle">{item.fechap}</td>
        <td className="align-middle">{item.responsable}</td>
      </tr>
    </>
  ));
};

const NuestrasActividades = () => {
  return MisActividades.map((item) => (
    <>
      <option className="align-middle">{item.name}</option>
    </>
  ));
};

// function myFilter(){
// (document).ready(function(){
//     ("#myInput").on("keyup", function() {
//       var value = (this).val().toLowerCase();
//       (".dropdown-menu option").filter(function() {
//         (this).toggle((this).text().toLowerCase().indexOf(value) > -1)
//       });
//     });
//   });
// }
