//import { useNavigate } from 'react-router-dom'
import "../styles/user-list.css";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../features/fields/redux/usersApiSlice";
import { memo } from "react";
import { Link } from "react-router-dom";

const User = ({ userId }) => {
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation();



  const onActiveChanged = async (e) => {
  
    await updateUser({ id: user.user_id, username: user.user_name, roles: user.rol_user, active: e.target.checked });
   
}

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.user_id });
  };

  //console.log(user)

  //const navigate = useNavigate()

  if (user) {
    //const handleEdit = () => navigate(`/dash/users/${userId}`)

    const userName = user.nombres ? user.nombres : "no tiene";

    const userRolesString = user.rol_user.toString().replaceAll(",", ", ");

    const cellStatus = user.activo ? "activo" : "inactivo";

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    //console.log(`${user.user_id} ${userName} ${userRolesString} ${active} ${errContent}`);
    if (isSuccess) {
      console.log(`no hay error ${errContent}`);
    }

    return (
      <>
        <ul
          key={userId}
          className="user-list_card_item"
          onClick={console.log("")}
        >
          <Link className="Link" to={"/dash/usuario/lista-usuarios/info-user"}>
            <li>{userName}</li>
            <li id="username">{user.user_name}</li>
            <li>{userRolesString}</li>
          </Link>
          <li>
            <input
              type="checkbox"
              checked={user.activo}
              onChange={onActiveChanged}
            />
          </li>
          <li>
            {" "}
            <button onClick={onDeleteUserClicked}>BORRAR</button>
          </li>
        </ul>
        <div className="linea_horizontal"></div>
      </>
    );
  } else return null;
};

const memoizedUser = memo(User);

export default memoizedUser;
