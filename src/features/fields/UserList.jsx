import React, { useState } from "react";
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
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("");

  const searchEstado = (e) => {
    e.preventDefault();
    setEstado(e.target.value);
  };

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  let content;
  

  if (isLoading) {
    content = <p>Cargando...</p>;
  }

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }
  if (users) {

    const { ids, entities } = users;
    
    const results = !search
      ? ids
      : ids.filter((dato) =>
          `${entities[dato].user_nombre?entities[dato].user_nombre:entities[dato].user_name}`
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase())
        );

      const results2 = !estado ? results : results.filter((dato) =>
          (`${entities[dato].user_status}` == estado));

     const tableContent =
      results2?.length &&
      results2.map((userId) => {
        let lista = <User key={userId} userId={userId} Lista={"Lista1"} /> 
        
        return lista
      });

    content = (
      <>
        <h1 className="user-list_header font-weight-bold">Lista de usuarios</h1>
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
        <div className="container col-12 col-lg-6">
          <div className="col-6">
            <select
              className="form-control "
              value={estado}
              onChange={searchEstado}
            >
              <option value={""}>Todos</option>
              <option value={true}>Activos</option>
              <option value={false}>Inactivos</option>
            </select>
          </div>
            <input
            value={search}
            onChange={searcher}
            type="text"
            placeholder="Search"
            className="form-control"
            />
        </div>
        
        <div className="table-container col-12 col-md-9 col-xl-6">
          <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-loyola">
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
              <th className="align-middle" scope="col">
                Editar
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
  const cabeza = (
    <div className="return-div">
      <Link to={"/dash"}>
        <div className="return-button">
          <img className="return-button-img" src={ReImage} alt="" />
        </div>
      </Link>
    </div>
  );

  return (
    <>
      {cabeza}
      {content}
    </>
  );
};

export default userList;
