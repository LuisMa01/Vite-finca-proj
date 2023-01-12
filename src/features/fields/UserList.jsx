import React from "react";
import "../../styles/user-list.css";
import ReImage from "../../images/return.svg";
import AddImage from "../../images/add.svg";
import { Link } from "react-router-dom";
import  User  from "../../components/User";

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
  let content

  if (isLoading) content = <p>Cargando...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids } = users;
    const tableContent =(
        ids?.length && ids.map((userId) => <User key={userId} userId={userId} />)
    )


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
        <Link
          to={"/dash/usuario/lista-usuarios/nuevo-usuario"}
          className="Link"
        >
          <div className="seccion_user_btn-agregar">
            <img className="img-comun img-add" src={AddImage} alt="Add-Icon" />
            <p>Nuevo Usuario</p>
          </div>
        </Link>
        <div className="user-list_card">
          <ul id="user-list_card_header">
            <li>Nombre</li>
            <li>Nombre de usuario</li>
            <li>Rol</li>
            <li>Activo</li>
          </ul>
          <>{tableContent}</>
        </div>
      </>
    )
  }

  return content
  
}

export default userList
