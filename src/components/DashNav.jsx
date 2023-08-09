import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import "../styles/header.css";
import useAuth from "../hooks/useAuth";
import { useLocation } from "react-router-dom";
import ReImage from "../images/return.svg";
import "../styles/inicio.css";

import React from "react";

let nume = 0;
let valor = true;
let ruta = [];

const DashHeader = () => {
  const { username, isManager, isAdmin } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (valor) {
      ruta.push(`${location.pathname}`);
      nume = ruta.length;
      if (nume >= 20) {
        ruta = ruta.slice(10, nume);
        nume = ruta.length;
      }
    }
    valor = true;
  }, [location.pathname]);

  const goBack = (e) => {
    valor = false;
    if (nume > 1) {
      nume = nume - 1;
      navigate(`${ruta[nume - 1]}`);
      ruta = ruta.slice(0, nume);
    }
  };
  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  const logoutButton = (
    <div className="icon-button" title="Logout" onClick={sendLogout}>
      Salir
    </div>
  );
  const errClass = isError ? "errmsg" : "offscreen";

  let buttonContent;
  if (isLoading) {
    buttonContent = <p className="icon-button">Saliendo...</p>;
  } else {
    buttonContent = <>{logoutButton}</>;
  }

  if (isSuccess) {
    navigate("/");
  }

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <nav className="nav-bar navbar navbar-expand-lg navbar-light">
        <a className="navbar-brand">
          <div className="return-div">
            <div onClick={goBack} className="return-button">
              <img className="return-button-img" src={ReImage} alt="Atrás" />
            </div>
          </div>
        </a>
        <a className="navbar-brand">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </a>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <Link className="nav-item" to={"/dash"}>
              <li className={`menu-inicio`} id="a">
                Inicio
              </li>
            </Link>
            <Link className="nav-item" to={"/dash/proximas"}>
              <li className={`menu-inicio`} id="b">
                Próximas actividades
              </li>
            </Link>
            <Link className="nav-item" to={"/dash/cultivos"}>
              <li className={`menu-inicio`} id="c">
                Cultivos
              </li>
            </Link>
            <Link className="nav-item" to={"/dash/campos"}>
              <li className={`menu-inicio`} id="d">
                Campos
              </li>
            </Link>
            {isAdmin && (
              <Link className="nav-item" to={"/dash/reporteria"}>
                <li className={`menu-inicio`} id="d">
                  Reportes
                </li>
              </Link>
            )}
            <li id="e" className={`menu-inicio nav-item dropdown`}>
              Usuario
              <ul>
                <Link to={"/dash/usuario/mi-perfil"}>
                  <li className={`menu-inicio`} id="e">
                    {"  "}Mi perfil{"  "}
                  </li>
                </Link>
                {isAdmin && (
                  <Link to={"/dash/usuario/lista-usuarios"}>
                    <li className={`menu-inicio`} id="e">
                      Lista de usuarios
                    </li>
                  </Link>
                )}
                <hr className="line" />
                <li className={`menu-inicio`}>{buttonContent}</li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );

  return content;
};

export default DashHeader;
