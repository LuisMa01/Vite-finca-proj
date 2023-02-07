import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import "../styles/header.css";
//import useAuth from "../hooks/useAuth";

import React from "react";

const DashHeader = () => {
  const [uno, setUno] = useState("");
  const [dos, setDos] = useState("");
  const [tres, setTres] = useState("");
  const [cuatro, setCuatro] = useState("");
  const [cinco, setCinco] = useState("");
  //const [back, setBack] = useState([])
  const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation();

  function focusClick (a){
    //a.preventDefault();
    console.log(a.target.id)
    if(a.target.id === 'a'){
      setUno("menu-bar_focus")
      setDos("");
      setTres("")
      setCuatro("")
      setCinco("")
    }
    if(a.target.id === 'b'){
      setUno("")
      setDos("menu-bar_focus");
      setTres("")
      setCuatro("")
      setCinco("")
    } 
    if(a.target.id === 'c'){
      setUno("")
      setDos("");
      setTres("menu-bar_focus")
      setCuatro("")
      setCinco("")
    }   
    if(a.target.id === 'd'){
      setUno("")
      setDos("");
      setTres("")
      setCuatro("menu-bar_focus")
      setCinco("")
    }   
    if(a.target.id === 'e'){
      setUno("")
      setDos("");
      setTres("")
      setCuatro("")
      setCinco("menu-bar_focus")
    }      
  }
  
  const logoutButton = (
    <li className="icon-button" title="Logout" onClick={sendLogout}>
      Salir
    </li>
  );
  const errClass = isError ? "errmsg" : "offscreen";

  let buttonContent;
  if (isLoading) {
    buttonContent = <p className="icon-button">Saliendo...</p>;
  } else {
    buttonContent = <>{logoutButton}</>;
  }
  const navigate = useNavigate()
  // useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
 // }, [isSuccess, navigate]);
  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <nav className="nav-bar navbar navbar-expand-lg navbar-light">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul>
          <Link to={"/dash"}>
            <li
              className={`menu-inicio ${uno}`}
              id="a"
              onClick={focusClick}
            >
              Inicio
            </li>
          </Link>
          <Link to={"/dash/proximas"}>
            <li
              className={`menu-inicio ${dos}`}
              id="b"
              onClick={focusClick}
            >
              Próximas actividades
            </li>
          </Link>
          <Link to={"/dash/cultivos"}>
            <li
              className={`menu-inicio ${tres}`}
              onClick={focusClick}
              id="c"
            >
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
                <li
                  className={`menu-inicio`}
                  onClick={focusClick}
                  id="e"
                >
                  Mi perfil
                </li>
              </Link>
              <Link to={"/dash/usuario/lista-usuarios"}>
                <li
                  className={`menu-inicio`}
                  onClick={focusClick}
                  id="e"
                >
                  Lista de usuarios
                </li>
              </Link>
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