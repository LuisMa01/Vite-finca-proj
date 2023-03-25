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
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PHONE_REGEX = /^[1-9]\d{2}-\d{3}-\d{4}/;

const NuevoUsuario = () => {
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [names, setNames] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [validUsername, setValidUsername] = useState(false);
  const [validUserphone, setValidUserphone] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(3);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);
  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);
  useEffect(() => {
    setValidUserphone(PHONE_REGEX.test(phone));
  }, [phone]);

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setNames("");
      setSurname("");
      setPassword("");
      setRoles(3);
      setEmail("");
      setPhone("");
      navigate("/dash/usuario/lista-usuarios");
    }
  }, [isSuccess, navigate]);

  const onUsernameChanged = (e) => {
    setUsername(e.target.value);
  };
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);
  const onNamesChanged = (e) => setNames(e.target.value);
  const onSurnameChanged = (e) => setSurname(e.target.value);
  const onPhoneChanged = (e) => setPhone(e.target.value);

  const onRolesChanged = (e) => {
    setRoles(e.target.value);
  };

  const canSave =
    [
      validUsername,
      validPassword,
      email ? validEmail : true,
      phone ? validUserphone : true,
    ].every(Boolean) && !isLoading;
 
  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({
        username,
        password,
        roles,
        names,
        surname,
        email,
        phone,
      });
    }
  };

  const options = Object.keys(ROLES).map((role) => {
    return (
      <option key={ROLES[role]} value={ROLES[role]}>
        {" "}
        {role}
      </option>
    );
  });

  const content = (
    <>
      <h1 className="crear_titulo">Crear usuario</h1>

      {/* A partir de aqui son las modificaciones, esperando no poner otro huevo] */}

      <form
        className="container col-12 col-sm-11 col-lg-9 bg-light"
        onSubmit={onSaveUserClicked}
      >
        <p className="error-text">{error?.data?.message}</p>
        <div className="form-row">
          <div className="col-md-4 mb-3">
            <label id="username_label" htmlFor="username">
              Nombre de usuario
            </label>
            <input
              id="new-user-username"
              className="form-control"
              name="username"
              type="text"
              autoComplete="off"
              autoFocus
              placeholder="Ej: minombre07"
              value={username}
              onChange={onUsernameChanged}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label id="username_label" htmlFor="names">
              Nombres
            </label>
            <input
              className="form-control"
              name="names"
              type="text"
              autoComplete="off"
              autoFocus
              placeholder="Ej: Juan Andres"
              value={names}
              onChange={onNamesChanged}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label id="username_label" htmlFor="surname">
              Apellidos
            </label>
            <input
              className="form-control"
              name="surname"
              type="text"
              autoComplete="off"
              autoFocus
              placeholder="Ej: Gómez Almanzar"
              value={surname}
              onChange={onSurnameChanged}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label id="username_label" htmlFor="phone">
              Telefono
            </label>
            <input
              type="tel"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              className="form-control"
              name="surname"
              autoComplete="off"
              autoFocus
              placeholder="Ej: 1-809-000-0000"
              value={phone}
              onChange={onPhoneChanged}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label id="username_label" htmlFor="email">
              Correo electrónico
            </label>
            <input
              className="form-control"
              name="email"
              type="text"
              autoComplete="off"
              autoFocus
              placeholder="Ej: nombre@ejemplo.com"
              value={email}
              onChange={onEmailChanged}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label id="pswd_label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="new-user-pswd"
              className="form-control"
              name="password"
              type="password"
              placeholder="******"
              value={password}
              onChange={onPasswordChanged}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="role">Cargo</label>
            <select
              id="cargo"
              name="role"
              className="dropdown form-control"
              value={roles}
              onChange={onRolesChanged}
            >
              {options}
            </select>
          </div>
        </div>

        <div className="cultivos_button-section">
          <button
            className="btn btn-success"
            id="user-save"
            disabled={!canSave}
          >
            Guardar usuario
          </button>
          <Link to={"/dash/usuario/lista-usuarios"} className="Link">
            <button className="btn btn-danger">Cancelar</button>
          </Link>
        </div>
      </form>
    </>
  );

  return content;
};

export default NuevoUsuario;
