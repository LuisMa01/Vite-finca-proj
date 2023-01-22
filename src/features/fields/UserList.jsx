import React from "react";
import "../../styles/user-list.css";
import ReImage from "../../images/return.svg";
import AddImage from "../../images/add.svg";
import { Link } from "react-router-dom";
import User from "../../components/User";

import { useGetUsersQuery } from "./redux/usersApiSlice";

const userList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  let content;

  if (isLoading) {
    content = <p>Cargando...</p>;
    
  }
  

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = users;
    const tableContent =
      ids?.length && ids.map((userId) => <User key={userId} userId={userId} />);

    content = (
      <>
        <div className="return-div">
          <Link to={"/dash"}>
            <div className="return-button">
              <img className="return-button-img" src={ReImage} alt="" />
            </div>
          </Link>
        </div>
        <h1 className="user-list_header">Lista de usuarios</h1>
        <div className="button_section_parent">
          <Link
            to={"/dash/usuario/lista-usuarios/nuevo-usuario"}
            className="Link"
          >
            <div className="seccion_user_btn-agregar">
              <img className="img-circ" src={AddImage} alt="Add-Icon" />
              <p>Nuevo Usuario</p>
            </div>
          </Link>
        </div>
        <div className="seccion_cultivos_checkbox-div">
          <div>
            <input type="checkBox" className="curso" defaultChecked={true} />
            <span>Usuarios activos</span>
          </div>
          <div>
            <input
              type="checkBox"
              className="finalizados"
              defaultChecked={false}
            />
            <span>Usuarios inactivos</span>
          </div>
        </div>
        <div className="table-container col-12 col-md-9 col-xl-6">
          <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-blue">
              <th className="align-middle" scope="col">
                Nombre
              </th>
              <th className="align-middle" scope="col">
                Nombre de usuario
              </th>
              <th className="align-middle" scope="col">
                Rol
              </th>
              <th className="align-middle" scope="col">
                Activo
              </th>
              <th className="align-middle" scope="col">
                Eliminar
              </th>
            </thead>
            <tbody>
              <>{tableContent}</>
            </tbody>
          </table>
        </div>
      </>
    );
  }

  return content;
};

export default userList;
