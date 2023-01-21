//import { useNavigate } from 'react-router-dom'
import "../styles/user-list.css";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../features/fields/redux/usersApiSlice";
import { memo } from "react";
import { Link } from "react-router-dom";
import RemoveImg from "../images/remove.svg"
import useAuth from "../hooks/useAuth";

const User = ({ userId }) => {
  const { userId: idUser } = useAuth();
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });
  console.log(`${idUser}`);
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation();



  const onActiveChanged = async (e) => {
  
    await updateUser({ id: user.user_id, username: user.user_name, roles: user.user_rol, status: e.target.checked });
   
};
   const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.user_id, idUser });
  };

  //console.log(user)

  //const navigate = useNavigate()

  if (user) {
    //const handleEdit = () => navigate(`/dash/users/${userId}`)

    const userName = user.user_nombre ? user.user_nombre : "no tiene";

    const userRolesString = user.user_rol.toString().replaceAll(",", ", ");

    //const cellStatus = user.user_status ? "activo" : "inactivo";

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    //console.log(`${user.user_id} ${userName} ${userRolesString} ${active} ${errContent}`);
    if (isSuccess) {
      console.log(`no hay error ${errContent}`);
    }

    return (
      <>
        <tr
          key={userId}
          onClick={console.log("")}
        >
            <td>{userName}</td>
            <td id="username">{user.user_name}</td>
            <td>{userRolesString}</td>
          <td>
            <input
              type="checkbox"
              checked={user.user_status}
              onChange={onActiveChanged}
            />
          </td>
          <td>
            {" "}
            <img onClick={onDeleteUserClicked} className="remove-img" src={RemoveImg} alt="Remove"/>
          </td>
        </tr>
      </>
    );
  } else return null;
};

const memoizedUser = memo(User);

export default memoizedUser;
