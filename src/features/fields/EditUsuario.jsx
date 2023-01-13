import React from "react";
import "../../styles/nuevo-usuario.css";
import { Link } from "react-router-dom";
import ReImage from "../../images/return.svg";
import { useUpdateUserMutation } from "./redux/usersApiSlice";
import { useState, useEffect } from "react";
import { ROLES } from "../../config/roles";
import { Collapse } from 'react-collapse';
/*
const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
*/


const EditUsuario = () => {
    const [isOpen, setIsOpen] = useState(false);
    /*
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["Employee"]);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);
*/
  return (
    <>
      <div className="return-div">
        <Link to={"/dash/usuario/lista-usuarios"}>
          <div className="return-button">
            <img className="return-button-img" src={ReImage} alt="Atrás" />
          </div>
        </Link>
      </div>
      
      <h1 className="crear_titulo">Crear usuario</h1>
      <div className="nuevo-usuario-card">
        <form className="nuevo-usuario-card_form" action="#">
        <div>
        
        <Collapse isOpened={isOpen}>
        <div>
            <label id="username_label">Nombre de usuario</label>
            <input
              type="text"
              id="new-user-username"
              name="new-user-username"
              placeholder="Ej: minombre07"
            />
          </div>
          <div>
            <label id="pswd_label">Contraseña</label>
            <input
              type="password"
              id="new-user-pswd"
              name="new-user-pswd"
              placeholder="******"
            />
          </div>
          <div>
            <label for="cargo">Cargo</label>
            <select className="dropdown" name="cargo" id="cargo">
              <option disabled selected>
                Elegir cargo
              </option>
              <option value="usuario">Usuario</option>
              <option value="supervisor">Supervisor</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
        </Collapse>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close' : 'Open'}
        </button>
      </div>
          <div>
            <label id="nombre_label">Nombres</label>
            <input
              type="text"
              id="new-user-name"
              name="new-user-name"
              placeholder="Ej: Juan"
              autoFocus
            />
          </div>
          
          <div>
            <label id="nombre_label">Apellidos</label>
            <input
              type="text"
              id="new-user-name"
              name="new-user-name"
              placeholder="Ej: Pérez"
              autoFocus
            />
          </div>     
                 
          <div>
            <label id="email_label">Correo</label>
            <input
              type="email"
              id="new-user-email"
              name="new-user-email"
              placeholder="ejemplo@gmail.com"
            />
          </div>
          <div>
            <label id="phone_label">Teléfono</label>
            <input
              type="number"
              id="new-user-phone"
              name="new-user-phone"
              placeholder="8090001111"
            />
          </div>
          <div className="button-section">
            <button id="user-save" type="submit">
              Guardar usuario
            </button>
            <Link
              className="Link"
              id="no-crear"
              to={"/dash/usuario/lista-usuarios"}
            >
              <button>Cancelar</button>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditUsuario;
