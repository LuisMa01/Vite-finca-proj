import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isManager = false;
  let isAdmin = false;
  let status = 3;
  let adminID = false

  if (token) {
    const decoded = jwtDecode(token);
    const { userId, username, roles, nombres, apellidos, email, phone } =
      decoded.UserInfo;

    isManager = roles.includes(2);
    isAdmin = roles.includes(1);

    if (isManager) status = 2;
    if (isAdmin) status = 1;
    if (userId == 1) adminID = true

    return {
      userId,
      username,
      roles,
      status,
      isManager,
      isAdmin,
      nombres,
      apellidos,
      email,
      phone,
      adminID
    };
  }

  return { username: "", roles: [], isManager, isAdmin, status };
};
export default useAuth;
