import React, { useState } from "react";
import "../../styles/nav_campos.css";
import ReImage from "../../images/return.svg";
import AddImage from "../../images/edit.svg";
import { Link } from "react-router-dom";
import MaizImag from "../../images/maiz.jpg";

import { useGetCampsQuery } from "../fields/redux/campApiSlice";
import Camp from "../../components/Camp";
import useAuth from "../../hooks/useAuth";



const navCampos = () => {
  

  const [stado, setStado] = useState("")
  const { username, isManager, isAdmin } = useAuth();
  const {
    data: camps,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCampsQuery("campsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const searchEstado = (e) => {
    e.preventDefault();
    setStado(e.target.value);
  };
  let tableContent;
  if (isError) {
    tableContent = <p className="errmsg">{error?.data?.message}</p>;
    console.log(error?.data?.message);
  }
  if (isSuccess) {
    const { ids, entities } = camps;

    

    const results = !stado
      ? ids
      : ids.filter((dato) => `${entities[dato].camp_status}` == stado);
        
    tableContent =
      results?.length &&
      results.map((Id) => <Camp key={Id} campId={Id} Lista={"Lista2"} />);
  }

  return (
    <>
      <div className="campos_top-section">
        <p className="titulo_campos font-weight-bold">Campos existentes</p>
        {(isManager || isAdmin) && (
          <div className="button-section_edit">
            <Link to={"/dash/campos/editar-campos"} className="Link">
              <div className="seccion_campos_btn-agr">
                <img className="img-edit" src={AddImage} alt="Add-Icon" />
                <p>Editar campos</p>
              </div>
            </Link>
          </div>
        )}
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
      <div className="card-deck">{tableContent}</div>
    </>
  );
};

export default navCampos;
