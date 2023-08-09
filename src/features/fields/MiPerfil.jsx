import React from "react";
import { useGetUsersQuery } from "./redux/usersApiSlice";
import "../../styles/mi_perfil.css";
import useAuth from "../../hooks/useAuth";

import { ROLES } from "../../config/roles";
import User from "../../components/User";

const MiPerfil = () => {
  const { isManager, isAdmin, userId } = useAuth();

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  let contenido;

  if (user) {
    contenido = user.user_id.length ?? (
      <User key={user.user_id} userId={user.user_id} Lista={"Lista2"} />
    );
  } else {
    contenido = <>No Carga</>;
  }

  return contenido;
};

export default MiPerfil;
