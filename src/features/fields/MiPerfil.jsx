import React from "react";
import { useGetUsersQuery } from "./redux/usersApiSlice";
import ReImage from "../../images/return.svg";
import "../../styles/mi_perfil.css";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";

const MiPerfil = () => {
  const { username, roles, isManager, isAdmin, userId, nombres, apellidos, email, phone } = useAuth();
  console.log(`Aqui ${username}, ${userId}`);
/*
  const { post, isLoading, isSuccess, isError, error } = useGetUsersQuery(
    "usersList",
    {
      selectFromResult: ({ data }) => ({
        post: data?.find((post) => post.id === userId),
      }),
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      
    
    }
  );


  if (isLoading) {
    console.log("hasta aqui");
    


  }

  if (!isLoading) {
    console.log("hasta murio");
  }
  
  if (isError) {
    console.log(`error ${error?.data?.message}`);
  }

  if (isSuccess) {
    console.log(post);
  }

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.entities[userId],
    }),
  });
  console.log(`${users}`);
*/
  const nombre = nombres ? nombres : "Sin nombre";
  const apellido = apellidos ? apellidos : "";
  const correo = email ? email : "No tiene correo";
  const telefono = phone ? phone : "no tiene";

  return (
    <>
      <div className="return-div">
        <Link to={"/dash"}>
          <div className="return-button">
            <img className="return-button-img" src={ReImage} alt="Atrás" />
          </div>
        </Link>
      </div>
      <h1 className="encabezado">Mi información</h1>
      <div className="profile-card">
        <h2>
          {nombre} {apellido}
        </h2>
        <p className="p-cargo">{roles}</p>
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
          <Link key={userId} to={`/dash/usuario/mi-perfil/act-info/${userId}`}>
            <button type="button" class="btn btn-primary btn-lg">
              Actualizar información
            </button>
          </Link>
          <Link to={"/dash/usuario/mi-perfil/pswd-change"}>
            <button type="button" class="btn btn-secondary btn-lg">
              Cambiar contraseña
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MiPerfil;
