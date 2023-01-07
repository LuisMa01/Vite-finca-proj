//import { useNavigate } from 'react-router-dom'
import "../styles/user-list.css";
import { useGetUsersQuery } from "../features/fields/redux/usersApiSlice";
import { memo } from "react";
import { Link } from "react-router-dom";

const User = ({ userId }) => {
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  //console.log(user)

  //const navigate = useNavigate()

  if (user) {
    //const handleEdit = () => navigate(`/dash/users/${userId}`)

    const userName = user.nombres ? user.nombres : "no tiene";

    const userRolesString = user.rol_user.toString().replaceAll(",", ", ");

    const cellStatus = user.activo ? "activo" : "inactivo";

    console.log(`${user.user_id} ${userName} ${userRolesString} ${cellStatus}`);

    return (
      <>
        <ul
          key={userId}
          className="user-list_card_item"
          onClick={console.log("infomap")}
        >
          <Link className="Link" to={"/dash/usuario/lista-usuarios/info-user"}>
            <li>{userName}</li>
            <li id="username">{user.user_name}</li>
            <li>{userRolesString}</li>
            <li>{cellStatus}</li>
          </Link>
        </ul>
        <div className="linea_horizontal"></div>
      </>
    );
    
  } else return null;
};

const memoizedUser = memo(User);

export default memoizedUser;
