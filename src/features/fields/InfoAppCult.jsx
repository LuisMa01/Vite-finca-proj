import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetDatesQuery } from "./redux/appApiSlice";
import { useGetItemsQuery } from "./redux/itemApiSlice";
import { useGetCostsQuery, useAddNewCostMutation } from "./redux/costApiSlice";
import { useGetComtsQuery, useAddNewComtMutation } from "./redux/comtApiSlice";
import { Link } from "react-router-dom";
import { Collapse } from "react-collapse";
import ReImage from "../../images/return.svg";
import Cost from "../../components/Cost";
import AppDate from "../../components/AppDate";
import Comt from "../../components/Comt";

const Comentario = ({ dateId }) => {
  const {
    data: comts,
    isError,
    error,
  } = useGetComtsQuery("comtsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const [
    addNewComt,
    { isSuccess: addComtSuc, isError: addComtIserror, error: addComterror },
  ] = useAddNewComtMutation();
  const [desc, setComtDesc] = useState("");
  const [comtDateKey, setComtDateKey] = useState(dateId);
  //desc, comtDateKey

  const onAddComtClicked = async (e) => {
    e.preventDefault();
    await addNewComt({
      desc,
      comtDateKey,
    });
  };
  const onComtDescChange = (e) => {
    e.preventDefault();
    setComtDesc(e.target.value);
  };
  const handleClearClick = (e) => {
    e.preventDefault();
    setComtDesc("");
    setComtDateKey(dateId);
  };
  useEffect(() => {
    if (comts) {
      setComtDesc("");
      setComtDateKey(dateId);
    }
  }, [comts]);
  const contenidoEdit = (
    <>
      <p className="titulo_tipos-de-actividades">Comentario</p>
      <form className="container myform col-6 needs-validation" novalidate>
        <div className="form-row bg-light">
          <div className="col-12 col-md-6 mb-2">
            <label for="nombre_actividad">Ingresar</label>
            <div className="col-12 col-md-6 mb-2">
              <textarea
                type="text"
                placeholder="Ingresar Comentario"
                value={desc}
                onChange={onComtDescChange}
                rows="10"
                cols="50"
              />
            </div>
          </div>
        </div>
        <div className="edit-campo-button-section_parent">
          <button
            type="submit"
            onClick={onAddComtClicked}
            className="btn btn-outline-primary limpiar"
          >
            Añadir comentario
          </button>
          <button
            className="btn btn-outline-danger limpiar"
            onClick={handleClearClick}
          >
            Limpiar
          </button>
        </div>
      </form>
    </>
  );
  let contenido;
  if (isError) {
    contenido = <>{error?.data?.message}</>;
  }
  if (comts) {
    let comtList;
    if (comts) {
      const { ids, entities } = comts;
      comtList =
        ids?.length &&
        ids.map((Id) => {
          if (entities[Id].comt_date_key == dateId) {
            return <Comt key={Id} comtId={Id} />;
          }
        });
    }

    contenido = (
      <>
        <div className="table-container col-12 col-md-9 col-xl-6">
          <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-loyola">
              <th className="align-middle" scope="col">
                Fecha
              </th>
              <th className="align-middle" scope="col">
                Comentario
              </th>
              <th className="align-middle" scope="col">
                Eliminar
              </th>
              <th className="align-middle" scope="col">
                Editar
              </th>
            </thead>
            <tbody>{comtList}</tbody>
          </table>
        </div>
      </>
    );
  }
  return (
    <>
      {contenidoEdit}
      {contenido}
    </>
  );
};

const InfoAppCult = () => {
  const { id } = useParams();

  const [costItemKey, setItemCostKey] = useState("");
  const [costQuantity, setCostQuantityKey] = useState(1);
  const [itemPrecio, setItemPrecioKey] = useState(0);

  const [costDateKey, setCostDateKey] = useState(id);
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: costs,
    isError: costIsError,
    error: costError,
  } = useGetCostsQuery("costsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { data: date } = useGetDatesQuery("datesList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
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
  };

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
  const handleClearClick = (e) => {
    e.preventDefault();
    setItemCostKey("");
    setCostDateKey(id);
    setItemPrecioKey(0);
    setCostQuantityKey(1);
  };
  useEffect(() => {
    if (date || costs) {
      setItemCostKey("");
      setItemPrecioKey(0);
      setCostDateKey(id);
      setCostQuantityKey(1);
    }
  }, [date, costs]);

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
  let costTotal = [];
  if (costs) {
    const { ids, entities } = costs;

    costList =
      ids?.length &&
      ids.map((Id) => {
        if (entities[Id].cost_date_key == id) {
          let list = <Cost key={Id} costId={Id} />;
          costTotal.push(parseFloat(entities[Id].cost_price));
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
  console.log(date);
  if (date) {
    let contentApp;
    if (date) {
      const { ids, entities } = date;
      ids.map((p) => {
        if (entities[p].date_id == id) {
          contentApp = (
            <AppDate
              key={entities[p].date_id}
              dateId={entities[p].date_id}
              Lista={"Lista3"}
            />
          );
          stop;
        }
      });
    }

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
        <div>{contentApp}</div>
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
              <div>
                {" "}
                <label htmlFor="campo_cultivo">Precio</label>
              </div>
              <div>{precio ? precio : "precio del articulo elejido."}</div>
            </div>
            <div className="col-md-6 col-lg-3 mb-3">
              <div>
                {" "}
                <label htmlFor="campo_cultivo">Cantidad</label>
              </div>
              <input
                type="number"
                value={costQuantity}
                min="0"
                onChange={onCostQuantityChanged}
              />
            </div>

            <div className="cultivos_button-section">
              <button
                className="btn btn-success"
                onClick={onAddCostClicked}
                type="submit"
              >
                Agregar Artículo
              </button>
              <button className="btn btn-danger" onClick={handleClearClick}>
                Limpiar
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
            <tbody>{costList}</tbody>
            <tfoot>
              <td colSpan={"5"}>Total:</td>
              <td>{precioTT}</td>
            </tfoot>
          </table>
        </div>
        <div>
          <button
            className="btn btn-success"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Close" : "Comentario"}
          </button>
          <Collapse isOpened={isOpen}>
            <>
              <Comentario key={id} dateId={id} />
            </>
          </Collapse>
        </div>
      </>
    );
  } else {
    return null;
  }
};

export default InfoAppCult;
