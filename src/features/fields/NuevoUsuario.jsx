import React from "react";
import "../../styles/nuevo-usuario.css";
import { Link } from "react-router-dom";
import ReImage from "../../images/return.svg";
import { useAddNewUserMutation } from "../fields/redux/usersApiSlice";
import { useState, useEffect } from "react";
import { ROLES } from "../../config/roles";
import { useNavigate } from "react-router-dom";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NuevoUsuario = () => {
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(3);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);
console.log(validUsername);
console.log(validPassword);
console.log(roles);
  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRoles(3);
      navigate("/dash/usuario/lista-usuarios/editar-usuario");
    }
  }, [isSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);

  const onRolesChanged = (e) => {
    
    const values = Array.from(
      e.target.selectedOptions, //HTMLCollection
      (option) => option.value
    );
    
    setRoles(parseInt(values));
  };

  const canSave =
    [ validUsername, validPassword].every(Boolean) && !isLoading;

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    console.log(`guardar ${e}`);
    if (canSave) {
      await addNewUser({ username, password, roles });
    }
  };
  
  const options = Object.values(ROLES).map((role) => {
    
    return (
      <option key={role} value={role}>
        {" "}
        {role}
      </option>
    );
  });
  
  const content = (
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
        <form className="nuevo-usuario-card_form" onSubmit={onSaveUserClicked}>
          <div>
            <p>{error?.data?.message}</p>
            <div>
              <label id="username_label" htmlFor="username">
                Nombre de usuario:
              </label>
              <input
                id="new-user-username"
                name="username"
                type="text"
                autoComplete="off"
                placeholder="Ej: minombre07"
                value={username}
                onChange={onUsernameChanged}
              />
            </div>
            <div>
              <label id="pswd_label" htmlFor="password">
                Contraseña:
              </label>
              <input
                id="new-user-pswd"
                name="password"
                type="password"
                placeholder="******"
                value={password}
                onChange={onPasswordChanged}
              />
            </div>
            <div>
              <label htmlFor="role">
                Cargo
              </label>
              <select
                id="cargo"
                name="role"
                className="dropdown"
                size="3"
                value={roles}
                onChange={onRolesChanged}
              >
                {options}
              </select>
            </div>
            <div className="button-section">
              <button id="user-save" disabled={!canSave}>
                Guardar Usuario
              </button>
              <Link
                className="Link"
                id="no-crear"
                to={"/dash/usuario/lista-usuarios"}
              >
                <button>Cancelar</button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );

  return content;
};

export default NuevoUsuario;
