import React from "react";
import "../../styles/nav_campos.css";
import ReImage from "../../images/return.svg";
import AddImage from "../../images/edit.svg";
import { Link } from "react-router-dom";
import MaizImag from "../../images/maiz.jpg";

import { useGetCampsQuery } from "../fields/redux/campApiSlice";
import Camp from "../../components/Camp";

const navCampos = () => {
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
  let tableContent;
  if (isError) {
    tableContent = <p className="errmsg">{error?.data?.message}</p>;
    console.log(error?.data?.message);
  }
  if (isSuccess) {
    const { ids } = camps;

    tableContent =
      ids?.length &&
      ids.map((Id) => <Camp key={Id} campId={Id} Lista={"Lista2"} />);
  }

  return (
    <>
      <div className="campos_top-section">
        <p className="titulo_campos font-weight-bold">Campos existentes</p>
        <div className="button-section_edit">
          <Link to={"/dash/campos/editar-campos"} className="Link">
            <div className="seccion_campos_btn-agr">
              <img className="img-edit" src={AddImage} alt="Add-Icon" />
              <p>Editar campos</p>
            </div>
          </Link>
        </div>
      </div>
      <div className="seccion_cultivos_checkbox-div">
        <div>
          <input type="checkBox" className="curso" defaultChecked={true} />
          <span>Campos activos</span>
        </div>
        <div>
          <input
            type="checkBox"
            className="finalizados"
            defaultChecked={false}
          />
          <span>Campos inactivos</span>
        </div>
      </div>
      <div className="card-deck">{tableContent}</div>
    </>
  );
};

export default navCampos;
