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
  const [uno, setUno] = useState("");
  const [dos, setDos] = useState("");
  const [tres, setTres] = useState("");
  const [cuatro, setCuatro] = useState("");
  const [cinco, setCinco] = useState("");
  //const [back, setBack] = useState([])
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

  function focusClick(a) {
    //a.preventDefault();
    
    if (a.target.id === "a") {
      setUno("menu-bar_focus");
      setDos("");
      setTres("");
      setCuatro("");
      setCinco("");
    }
    if (a.target.id === "b") {
      setUno("");
      setDos("menu-bar_focus");
      setTres("");
      setCuatro("");
      setCinco("");
    }
    if (a.target.id === "c") {
      setUno("");
      setDos("");
      setTres("menu-bar_focus");
      setCuatro("");
      setCinco("");
    }
    if (a.target.id === "d") {
      setUno("");
      setDos("");
      setTres("");
      setCuatro("menu-bar_focus");
      setCinco("");
    }
    if (a.target.id === "e") {
      setUno("");
      setDos("");
      setTres("");
      setCuatro("");
      setCinco("menu-bar_focus");
    }
  }

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

  // useEffect(() => {
  if (isSuccess) {
    navigate("/");
  }
  // }, [isSuccess, navigate]);
  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <nav className="nav-bar navbar navbar-expand-lg navbar-light">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul>
            <Link to={"/dash"}>
              <li className={`menu-inicio ${uno}`} id="a" onClick={focusClick}>
                Inicio
              </li>
            </Link>
            <Link to={"/dash/proximas"}>
              <li className={`menu-inicio ${dos}`} id="b" onClick={focusClick}>
                Próximas actividades
              </li>
            </Link>
            <Link to={"/dash/cultivos"}>
              <li className={`menu-inicio ${tres}`} onClick={focusClick} id="c">
                Cultivos
              </li>
            </Link>
            <Link to={"/dash/campos"}>
              <li
                className={`menu-inicio ${cuatro}`}
                id="d"
                onClick={focusClick}
              >
                Campos
              </li>
            </Link>
            <li id="e" className={`menu-inicio ${cinco}`}>
              Usuario
              <ul>
                <Link to={"/dash/usuario/mi-perfil"}>
                  <li className={`menu-inicio`} onClick={focusClick} id="e">
                    {"  "}Mi perfil{"  "}
                  </li>
                </Link>
                {isAdmin && (
                  <Link to={"/dash/usuario/lista-usuarios"}>
                    <li className={`menu-inicio`} onClick={focusClick} id="e">
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

      <nav>
        <div className="return-div">
          <div onClick={goBack} className="return-button">
            <img className="return-button-img" src={ReImage} alt="Atrás" />
          </div>
        </div>
      </nav>
    </>
  );

  return content;
};

export default DashHeader;
