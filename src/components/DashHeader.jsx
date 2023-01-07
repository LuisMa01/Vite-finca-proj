/*import { Link } from "react-router-dom";
import { useState } from "react";
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
  const [sendLogout, { isLoading, isError, error }] = useSendLogoutMutation();


  const focusClick = (a) =>{
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
    <button className="icon-button" title="Logout" onClick={sendLogout}>
      Logout
    </button>
  );
  const errClass = isError ? "errmsg" : "offscreen";

  let buttonContent;
  if (isLoading) {
    buttonContent = <p>Logging Out...</p>;
  } else {
    buttonContent = <>{logoutButton}</>;
  }

  

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <header>
        <div className="main_header_img">
          <img
            className="logo-loyola"
            src="https://ipl.edu.do/images/logo-loyola.svg"
            alt="logo-loyola"
          />
        </div>
        <div className="main_header">
          <h1>Finca Experimental</h1>
          <p className="main_header_p">Profesor André Vloebergh</p>
        </div>
      </header>
      <nav className="nav-bar">
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
          <Link to={"#"}>
            <li
              className={`menu-inicio ${tres}`}
              onClick={focusClick}
              id="c"
            >
              Cultivos
            </li>
          </Link>
          <Link to={"#"}>
            <li
              className={`menu-inicio ${cuatro}`}
              id="d"
              onClick={focusClick}
            >
              Campos
            </li>
          </Link>
          <li id="perfil">
            Usuario
            <ul>
              <Link to={"/dash/usuario/mi-perfil"}>
                <li
                  className={`menu-inicio ${cinco}`}
                  id="e"
                  onClick={focusClick}
                >
                  Mi perfil
                </li>
              </Link>
              <Link to={"/dash/usuario/lista-usuarios"}>
                <li
                  className={`menu-inicio ${cinco}`}
                  id="e"
                  onClick={focusClick}
                >
                  Lista de usuarios
                </li>
              </Link>
              <hr />
              <nav>{buttonContent}</nav>
            </ul>
          </li>
        </ul>
      </nav>
      
    </>
  );

  return content;
};

export default DashHeader;
*/

import React from "react"
import "../styles/header.css";

const Header = () => {
    return(
        <header>
        <div className="main_header_img">
          <img
            className="logo-loyola img-fluid"
            src="https://ipl.edu.do/images/logo-loyola.svg"
            alt="logo-loyola"
          />
        </div>
        <div className="main_header">
          <h1>Finca Experimental</h1>
          <p className="main_header_p">Profesor André Vloebergh</p>
        </div>
      </header>
    )
}

export default Header