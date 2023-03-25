import React from "react";
import ReImage from "../../images/return.svg";
import "../../styles/mi_perfil.css";
import { Link } from "react-router-dom";

const InfoUser = () => {
  return (
    <>
      <h1 className="encabezado">Información de usuario</h1>
      <div className="profile-card">
        <h2>Juan Pozo</h2>
        <p className="p-cargo">Técnico de infraestructura</p>
        <p>
          <b>Usuario: </b> ronnie07
        </p>
        <p>
          <b>Correo:</b> juanreyes@gmail.com
        </p>
        <p>
          <b>Teléfono:</b> 809-528-4010
        </p>
        <div className="split-line"></div>
        <div className="button-section">
          <Link to={"/dash/usuario/ActInformacionUsr/act-info"}>
            <button className="btn btn-left">Actualizar información</button>
          </Link>
          <button className="btn btn-right">Eliminar usuario</button>
        </div>
      </div>
    </>
  );
};

export default InfoUser;
