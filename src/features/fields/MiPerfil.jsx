import React from "react";
//import { useGetUsersQuery } from "./redux/usersApiSlice";
//import ReImage from "../../images/return.svg";
//import PeopleImg from "../../images/users.svg"
import "../../styles/mi_perfil.css";
//import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
//import { useEffect, useState } from "react";
import { ROLES } from "../../config/roles";
import User from "../../components/User";

const MiPerfil = () => {
  const {  isManager, isAdmin, userId } = useAuth();
  /*
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });
  */
/*
  const [username, setUserName] = useState(user.user_name)
  const [roles, setRoles] = useState(user.user_rol)
  const [status, setStatus] = useState(user.user_status)
  const [names, setNames] = useState(user.user_nombre)
  const [surname, setSurname] = useState(user.user_apellido)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.user_phone)


  //id,  username, roles,  status,  password,  names,  surname,  email,  phone,

  useEffect(() => {
    if (user) {
      setUserName(user.user_name)
      setRoles(user.user_rol)
      setStatus(user.user_status)
      setNames(user.user_nombre)
      setSurname(user.user_apellido)
      setEmail(user.email)
      setPhone(user.user_phone)
    }
  }, [user]);
  */
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
/*
  const nombre = names ? names : "Sin nombre";
  const apellido = surname ? surname : "";
  const correo = email ? email : "No tiene correo";
  const telefono = phone ? phone : "no tiene";

  let llave 
  if (roles==Object.values(ROLES)[0]) {
    llave = Object.keys(ROLES)[0]
  }
  if (roles==Object.values(ROLES)[1]) {
    llave = Object.keys(ROLES)[1]
  }
  if (roles==Object.values(ROLES)[2]) {
    llave = Object.keys(ROLES)[2]
  }
  */
  let contenido
  if (userId) {
    console.log(userId);
    contenido = (<><User key={userId} userId={userId} Lista={"Lista2"} /></>)
  } else {
    contenido = (<>No Carga</>)
  }

  return contenido
};

export default MiPerfil;
