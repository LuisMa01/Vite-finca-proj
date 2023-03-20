//import { useNavigate } from 'react-router-dom'
import "../styles/user-list.css";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../features/fields/redux/usersApiSlice";
import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RemoveImg from "../images/remove.svg";
import Swal from "sweetalert2";
import { ROLES } from "../config/roles";
import Modal from "react-modal";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody
} from 'mdb-react-ui-kit';
import ReImage from "../images/return.svg";
import PeopleImg from "../images/users.svg";

Modal.setAppElement("#root");

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PHONE_REGEX = /^[1-9]\d{2}-\d{3}-\d{4}/;

//^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

const User = ({ userId, Lista }) => {
  const {
    user,
    isLoading: userIsLoading,
    isSuccess: userIsSuc,
    isError: userIsErr,
  } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });
  console.log(userId);
  console.log(Lista);
  if (user) {
    
  console.log('aqui');
  const [username, setUsername] = useState(user.user_name);
  const [names, setNames] = useState(user.user_nombre);
  const [surname, setSurname] = useState(user.user_apellido);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.user_phone);
  const [validEmail, setValidEmail] = useState(false);
  const [validUsername, setValidUsername] = useState(false);
  const [validUserphone, setValidUserphone] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordDu, setPasswordDu] = useState("");
  const [passwordAnt, setPasswordAnt] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [validPasswordAnt, setValidPasswordAnt] = useState(false);
  const [roles, setRoles] = useState(user.user_rol);
  const [status, setStatus] = useState(user.user_status);
  const [isOpen, setIsOpen] = useState(false);
  const [isAbierto, setIsisAbierto] = useState(false);

  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation();
  useEffect(() => {
    if (user) {
      setUsername(user.user_name);
      setNames(user.user_nombre);
      setSurname(user.user_apellido);
      setRoles(user.user_rol);
      setEmail(user.email);
      setPhone(user.user_phone);
      setStatus(user.user_status);
    }
  }, [user]);
  const handleClearClick = (e) => {
    e.preventDefault();
    setUsername(user.user_name);
    setNames(user.user_nombre);
    setSurname(user.user_apellido);
    setRoles(user.user_rol);
    setEmail(user.email);
    setPhone(user.user_phone);
    setStatus(user.user_status);
  };

  const onActiveChanged = async (e) => {
    await updateUser({
      id: user.user_id,
      username,
      roles,
      status: e.target.checked,
    });
  };

  const onDeleteUserClicked = () => {
    Swal.fire({
      title: "¿Seguro de eliminar?",
      text: `Eliminar este usuario afectará todos los datos asociados a esta. Esta acción será irreversible.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUser({ id: user.user_id });
        if (isDelSuccess) {
          Swal.fire("¡Eliminada!", "Esta Usurio ha sido eliminada.", "success");
        } else if (isDelError) {
          Swal.fire("¡No se pudo eliminar!", `${delerror?.data?.message}.`);
        } else {
          Swal.fire("No se puede eliminar Usuario");
        }
      }
    });
  };

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
    setValidPasswordAnt(PWD_REGEX.test(passwordAnt));
  }, [password]);
  useEffect(() => {
    setValidUserphone(PHONE_REGEX.test(phone));
  }, [phone]);

  const onUsernameChanged = (e) => {
    setUsername(e.target.value);
  };
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onPasswordDuChanged = (e) => setPasswordDu(e.target.value);
  const onPasswordAntChanged = (e) => setPasswordAnt(e.target.value);
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
      email ? validEmail : true,
      phone ? validUserphone : true,
    ].every(Boolean) && !isLoading;

  const canSavePs =
    [
      validPassword,
      validPasswordAnt,
      passwordDu == password,
      password != passwordAnt,
    ].every(Boolean) && !isLoading;

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await updateUser({
        id: user.user_id,
        username,
        status,
        roles,
        names,
        surname,
        email,
        phone,
      });
    }
  };
  const onChangePsClicked = async (e) => {
    e.preventDefault();
    if (canSavePs) {
      await updateUser({
        id: user.user_id,
        username,
        status,
        roles,
        password,
        passwordAnt,
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

  const actuUser = (
    <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
      <button className="btn btn-danger" onClick={() => setIsOpen(false)}>
        Cerrar
      </button>
      <div className="cultivos_button-section">
        <form
          className="container col-12 col-sm-11 col-lg-9 bg-light"
          onSubmit={onSaveUserClicked}
        >
          <p className="error-text">{error?.data?.message}</p>
          <div class="form-row">
            <div class="col-md-4 mb-3">
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

            <div class="col-md-4 mb-3">
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

            <div class="col-md-4 mb-3">
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
            <div class="col-md-4 mb-3">
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

            <div class="col-md-4 mb-3">
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
            <button className="btn btn-danger" onClick={handleClearClick}>
              Limpiar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
  const actuPass = (
      <Modal isOpen={isAbierto} onRequestClose={() => setIsisAbierto(false)}>
        <button className="btn btn-danger" onClick={() => setIsisAbierto(false)}>
          Cerrar
        </button>

        <p className="titulo_cambiar font-weight-bold">Cambiar contraseña</p>
        <div className="my-card card-outline-secondary col-12 col-sm-10 col-md-8 col-lg-6">
          <div className="card-body">
            <form className="form" onSubmit={onChangePsClicked}>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Contraseña actual"
                  value={passwordAnt}
                  onChange={onPasswordAntChanged}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Nueva contraseña"
                  value={password}
                  onChange={onPasswordChanged}
                />
                <span className="form-text small text-muted">
                  La contraseña debe contener entre 8-20 caracteres, y <b>no</b>{" "}
                  debe contener espacios.
                </span>
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Verificar contraseña"
                  value={passwordDu}
                  onChange={onPasswordDuChanged}
                />
                <span className="form-text small text-muted">
                  Para confirmar, escriba la nueva contraseña.
                </span>
              </div>
              <div className="button-section">
                <button
                  type="submit"
                  className="btn btn-success btn-lg"
                  disabled={!canSavePs}
                >
                  Guardar
                </button>
                <button className="btn btn-danger" onClick={handleClearClick}>
                  Limpiar
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
  );
  let contenido;
  if (userIsLoading) {
    contenido = <>Cargando...</>;
  }
  if (userIsErr) {
    contenido(<>Error...</>);
  }
  
   // if (user) {
      //const handleEdit = () => navigate(`/dash/users/${userId}`)
      const nombre = names ? names : "Sin nombre";
      const apellido = surname ? surname : "";
      const correo = email ? email : "No tiene correo";
      const telefono = phone ? phone : "no tiene";

      let llave;

      const userName = names ? names : "no tiene";

      const errContent =
        (error?.data?.message || delerror?.data?.message) ?? "";
      if (roles == Object.values(ROLES)[0]) {
        llave = Object.keys(ROLES)[0];
      }
      if (roles == Object.values(ROLES)[1]) {
        llave = Object.keys(ROLES)[1];
      }
      if (roles == Object.values(ROLES)[2]) {
        llave = Object.keys(ROLES)[2];
      }

      //console.log(`${user.user_id} ${userName} ${userRolesString} ${active} ${errContent}`);

      if (Lista == "Lista1") {
        contenido = (
          <>
            <tr key={userId} onClick={console.log("")}>
              <td>{userName}</td>
              <td id="username">{username}</td>
              <td>{llave}</td>
              <td>
                <input
                  type="checkbox"
                  checked={status}
                  onChange={onActiveChanged}
                />
              </td>
              <td>
                {" "}
                <img
                  onClick={onDeleteUserClicked}
                  className="remove-img"
                  src={RemoveImg}
                  alt="Remove"
                />
              </td>
              <td onClick={() => setIsOpen(true)}>Editar</td>
              {actuUser}
            </tr>
          </>
        );
      }
      if (Lista == "Lista2") {
        contenido = (
          <>
            <div className="return-div">
              <Link to={"/dash"}>
                <div className="return-button">
                  <img
                    className="return-button-img"
                    src={ReImage}
                    alt="Atrás"
                  />
                </div>
              </Link>
            </div>
            <div className="profile-card">
              <div className="name-header">
                <h2>
                  {nombre} {apellido}
                </h2>
                <div className="small-icon-container">
                  <img className="reduced-icon" src={PeopleImg} alt="." />
                </div>
              </div>

              <p className="p-cargo">{llave}</p>
              <p>
                <b>Usuario: </b> {username}
              </p>
              <p>
                <b>Correo:</b> {correo}
              </p>
              <p>
                <b>Teléfono:</b> {telefono}
              </p>
              <div className="split-line"></div>
              <div className="button-section">
                <button
                  type="button"
                  class="btn thead-loyola btn-lg"
                  onClick={() => setIsOpen(true)}
                >
                  Actualizar información
                </button>

                {actuUser}

                <button
                  type="button"
                  class="btn btn-secondary btn-lg"
                  onClick={() => setIsisAbierto(true)}
                >
                  Cambiar contraseña
                </button>
                {actuPass}
              </div>
            </div>
          </>
        );
      }
    //}
  

  return contenido;
  }else{ return null}
};

const memoizedUser = memo(User);

export default memoizedUser;
