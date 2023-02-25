import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetDatesQuery, useUpdateDateMutation } from "./redux/appApiSlice";
import { useGetActsQuery } from "./redux/actApiSlice";
import { useGetUsersQuery } from "./redux/usersApiSlice";
import { useGetItemsQuery } from "./redux/itemApiSlice";


const User = ({ userId }) =>{
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  if (user) {
    const usuario = user.user_nomnbre ? user.user_nombre: user.user_name
    return(<>{usuario}</>)
  }
}
const Act = ({ actId }) =>{
  const { act } = useGetActsQuery("actsList", {
    selectFromResult: ({ data }) => ({
      act: data?.entities[actId],
    }),
  });

  if (act) {
    return(<>{act.act_name}</>)
  }
}
const InfoAppCult = () => {
  const [actKey, setActKey] = useState("");
  const [dateInit, setDateInit] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [userRep, setUserRep] = useState("");
  const { id } = useParams();

  const { date } = useGetDatesQuery("datesList", {
    selectFromResult: ({ data }) => ({
      date: data?.entities[id],
    }),
  });
  const { data: items } = useGetItemsQuery("itemsList");
  

  useEffect(() => {
    if (date) {
      setActKey(date.date_act_key);
      setDateInit(date.date_init);
      setDateEnd(date.date_end);
      setUserRep(date.date_user_key);
    }
  }, [date]);

  let itemOption
  if (items) {
    const { ids, entities } = items;

    itemOption = ids.map((Id) => {
      if (entities[Id].item_status) {
        return (
          <option key={Id} value={entities[Id].item_id}>
            {entities[Id].item_name}
          </option>
        );
      }
    });
  }

  if(date){
  const usuario = (<><User key={userRep} userId={userRep} /></>)
  const actividad = (<><Act key={actKey} actId={actKey} /></>)
  
    
  

  return (
    <>
      <div>ok {usuario} {actividad} {dateEnd} {dateInit}</div>
      <div className="col-md-6 col-lg-3 mb-3">
            <label htmlFor="campo_cultivo">Articulos</label>
            <select
              className="form-control"
              
            >
              <option disabled value={""}>Elegir Acticulo</option>
              {itemOption}
            </select>
          </div>
    </>
  );
}else{
  return null
}
};

export default InfoAppCult;
