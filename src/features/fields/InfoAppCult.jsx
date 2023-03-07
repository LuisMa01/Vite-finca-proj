import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetDatesQuery, useUpdateDateMutation } from "./redux/appApiSlice";
import { useGetActsQuery } from "./redux/actApiSlice";
import { useGetUsersQuery } from "./redux/usersApiSlice";
import { useGetItemsQuery } from "./redux/itemApiSlice";
import { useGetCostsQuery, useAddNewCostMutation } from "./redux/costApiSlice";
import { Link } from "react-router-dom";
import ReImage from "../../images/return.svg";
import Cost from "../../components/Cost";

const User = ({ userId }) => {
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  if (user) {
    const usuario = user.user_nomnbre ? user.user_nombre : user.user_name;
    return <>{usuario}</>;
  }
};
const Act = ({ actId }) => {
  const { act } = useGetActsQuery("actsList", {
    selectFromResult: ({ data }) => ({
      act: data?.entities[actId],
    }),
  });

  if (act) {
    return <>{act.act_name}</>;
  }
};

const InfoAppCult = () => {
  const { id } = useParams();
  const [actKey, setActKey] = useState("");
  const [dateInit, setDateInit] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [userRep, setUserRep] = useState("");
  const [costItemKey, setItemCostKey] = useState("");
  const [costQuantity, setCostQuantityKey] = useState(1);
  const [itemPrecio, setItemPrecioKey] = useState(0);

  const [costDateKey, setCostDateKey] = useState(id);

  const {
    data: costs,
    isError: costIsError,
    error: costError,
  } = useGetCostsQuery("costsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { date } = useGetDatesQuery("datesList", {
    selectFromResult: ({ data }) => ({
      date: data?.entities[id],
    }),
  });
  const { data: items } = useGetItemsQuery("itemsList");

  const onItemCostChanged = (e) => {
    e.preventDefault();
    setItemCostKey(e.target.value);
    if (items) {
      const { entities } = items;
      setItemPrecioKey(`${entities[e.target.value].item_price}`);
    }
  };
  const onCostQuantityChanged = (e) => {
    e.preventDefault();
    setCostQuantityKey(e.target.value);
  }

  const [
    addNewCost,
    { isSuccess: addCostSuc, isError: addCostIserror, error: addCosterror },
  ] = useAddNewCostMutation();

  const onAddCostClicked = async (e) => {
    e.preventDefault();

    await addNewCost({
      costItemKey,
      costQuantity,
      costDateKey,
    });
  };
  //  costItemKey, costQuantity, costDateKey
  useEffect(
    () => {
      if (date || costs) {
        setActKey(date.date_act_key);
        setDateInit(date.date_init);
        setDateEnd(date.date_end);
        setUserRep(date.date_user_key);
        setItemCostKey("");
        setItemPrecioKey(0);
        setCostDateKey(id);
        setCostQuantityKey(1);
      }
    },
    [date],
    [costs]
  );

  let itemOption;

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

  let costList;
  let costTotal=[]
  if (costs) {
    const { ids, entities } = costs;

    costList =
      ids?.length &&
      ids.map((Id) => {
        if (entities[Id].cost_date_key == date.date_id) {
          let list = <Cost key={Id} costId={Id} />
          costTotal.push(parseFloat(entities[Id].cost_price))
          return list;
        }
      });
  }
  let TT = costTotal.reduce((valorAnterior, valorActual) => {
    return valorAnterior + valorActual;
  }, 0);
  let precioTT = new Intl.NumberFormat("es-do", {
    style: "currency",
    currency: "DOP",
  }).format(parseFloat(TT));

  console.log(costTotal);
  if (costIsError) {
    console.log(costError?.data?.message);
  }
  if (date) {
    const usuario = (
      <>
        <User key={userRep} userId={userRep} />
      </>
    );
    const actividad = (
      <>
        <Act key={actKey} actId={actKey} />
      </>
    );
    let precio = new Intl.NumberFormat("es-do", {
      style: "currency",
      currency: "DOP",
    }).format(parseFloat(itemPrecio));

    return (
      <>
        <div className="return-div">
          <Link to={"/dash/cultivos"}>
            <div className="return-button">
              <img className="return-button-img" src={ReImage} alt="Atrás" />
            </div>
          </Link>
        </div>
        <div className="nuevo-cultivo-header">
          MATERIALES, INSUMOS Y MANO DE OBRA 
        </div>
        <div className="nuevo-cultivo-header">
          {usuario} {actividad} {dateEnd}{" "}
          {dateInit}
        </div>
        <form>
          <div className="new-activity-miniform d-flex justify-content-center col-12 col-md-10 col-xl-9 form-row bg-light">
            <div className="col-md-6 col-lg-3 mb-3">
              <label htmlFor="campo_cultivo">Articulos</label>
              <select
                className="form-control"
                value={costItemKey}
                onChange={onItemCostChanged}
              >
                <option disabled value={""}>
                  Elegir Acticulo
                </option>
                {itemOption}
              </select>
            </div>
            <div className="col-md-6 col-lg-3 mb-3">
              <div> <label htmlFor="campo_cultivo">Precio</label></div>
              <div>{precio ? precio : "precio del articulo elejido."}</div>
            </div>
            <div className="col-md-6 col-lg-3 mb-3">
              <div> <label htmlFor="campo_cultivo">Cantidad</label></div>
              <input type="number" value={costQuantity} min="0" onChange={onCostQuantityChanged} />
            </div>

            <div className="cultivos_button-section">
              <button
                className="btn btn-success"
                onClick={onAddCostClicked}
                type="submit"
              >
                Agregar Artículo
              </button>
            </div>
          </div>
        </form>

        <div className="table-container col-12 col-md-9 col-xl-6">
          <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-loyola">
              <th className="align-middle" scope="col">
                Articulo
              </th>
              <th className="align-middle" scope="col">
                Dosis
              </th>
              <th className="align-middle" scope="col">
                Cantidad
              </th>
              <th className="align-middle" scope="col">
                Unidad
              </th>
              <th className="align-middle" scope="col">
                Costo Unitario 
              </th>
              <th className="align-middle" scope="col">
                Costo Total 
              </th>
              <th className="align-middle" scope="col">
                Eliminar
              </th>
            </thead>
            <tbody>
              {costList}
              
            </tbody>
            <tfoot><td colSpan={"5"} >Total:</td><td>{precioTT}</td></tfoot>
          </table>
        </div>
      </>
    );
  } else {
    return null;
  }
};

export default InfoAppCult;
