//import { useNavigate } from 'react-router-dom'
import "../../src/styles/registrar-actividad.css";
import {
  useGetActsQuery,
  useUpdateActMutation,
  useDeleteActMutation,
} from "../features/fields/redux/actApiSlice";
import { memo } from "react";
import { Link } from "react-router-dom";
import RemoveImg from "../images/remove.svg";

import { ROLES } from "../config/roles";

const Act = ({ actId }) => {
  const { act } = useGetActsQuery("actsList", {
    selectFromResult: ({ data }) => ({
      act: data?.entities[actId],
    }),
  });

  const [updateAct, { isLoading, isSuccess, isError, error }] =
    useUpdateActMutation();

  const [
    deleteAct,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteActMutation();

  const onActiveChanged = async (e) => {
    await updateAct({
      id: act.act_id,
      actName: act.act_name,
      active: e.target.checked,
    });
  };
  // id, actName, desc, active
  const onDeleteActClicked = async () => {
    await deleteAct({ id: act.act_id });
  };

  if (act) {
    //const handleEdit = () => navigate(`/dash/users/${actId}`)

    const actname = act.act_name ? act.act_name : "no tiene";

    const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

    //console.log(`${user.user_id} ${userName} ${userRolesString} ${active} ${errContent}`);
    if (isSuccess) {
      console.log(`no hay error ${errContent}`);
    }

    const contenido = (
      <tr key={actId}>
        <td>{actname}</td>
        <td>
          <input
            type="checkbox"
            checked={act.act_status}
            onChange={onActiveChanged}
          />
        </td>
        <td>
          <img
            onClick={onDeleteActClicked}
            className="remove-img"
            src={RemoveImg}
            alt="Remove"
          />
        </td>
      </tr>
    );

    return contenido;
  } else return null;
};

const memoizedAct = memo(Act);

export default memoizedAct;