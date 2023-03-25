import React from "react";
import "../../styles/pswd_change.css";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";

const pswdChange = () => {
  return (
    <>
      
      <p className="titulo_cambiar">Cambiar contraseña</p>
      <div className="my-card card-outline-secondary col-8 col-sm-6 col-md-5 col-lg-4">
        <div className="card-body">
          <form className="form" autocomplete="off">
            <div className="form-group">
              <label for="inputPasswordOld">Contraseña actual</label>
              <input
                type="password"
                className="form-control"
                id="inputPasswordOld"
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label for="inputPasswordNew">Nueva contraseña</label>
              <input
                type="password"
                className="form-control"
                id="inputPasswordNew"
                required
              />
              <span className="form-text small text-muted">
                La contraseña debe contener entre 8-20 caracteres, y <b>no</b>{" "}
                debe contener espacios.
              </span>
            </div>
            <div className="form-group">
              <label for="inputPasswordNewVerify">Verificar</label>
              <input
                type="password"
                className="form-control"
                id="inputPasswordNewVerify"
                required
              />
              <span className="form-text small text-muted">
                Para confirmar, escriba la nueva contraseña.
              </span>
            </div>
            <div className="button-section">
              <button type="submit" className="btn btn-success btn-lg">
                Guardar
              </button>
              <Link to={"/dash/usuario/mi-perfil"} className=".Link">
                <button type="submit" className="btn btn-danger btn-lg">
                  Cancelar
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default pswdChange;
