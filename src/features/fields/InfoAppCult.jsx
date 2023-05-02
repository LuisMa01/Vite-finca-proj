import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetDatesQuery } from "./redux/appApiSlice";
import { useGetItemsQuery } from "./redux/itemApiSlice";
import { useGetCostsQuery, useAddNewCostMutation } from "./redux/costApiSlice";
import { useGetComtsQuery, useAddNewComtMutation } from "./redux/comtApiSlice";
import { useGetCropsQuery } from "./redux/cropApiSlice";
import { Link } from "react-router-dom";
import { Collapse } from "react-collapse";
import ReImage from "../../images/return.svg";
import Cost from "../../components/Cost";
import AppDate from "../../components/AppDate";
import Comt from "../../components/Comt";
import useAuth from "../../hooks/useAuth";

const Comentario = ({ dateId, info }) => {
  const { username, isManager, isAdmin } = useAuth();
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
      <p className="titulo_tipos-de-actividades col-12">Comentario</p>

     {(!info && (isAdmin || isManager)) && ( <form className="container myform col-6 needs-validation">
        <div className="form-row bg-light">
          <div className="col-12 mb-2 form-group">
            <textarea
              type="text"
                  className="form-control col-12"
                  placeholder="Ingresar Comentario"
                  value={desc}
                  maxLength={300}
                  onChange={onComtDescChange}
                  rows={2}
                  cols={25}
            />
          </div>
        </div>
        <div className="edit-campo-button-section_parent col-12">
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
      </form>)}
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
            return <Comt key={Id} comtId={Id} Lista={"Lista1"} />;
          }
        });
    }

    contenido = (
      <>
        <div className="table-container col-12 col-md-9 col-xl-6">
          <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-loyola">
              <tr>
                <th className="align-middle" scope="col">
                  Fecha
                </th>
                <th className="align-middle" scope="col">
                  Comentario
                </th>
                {(!info && isAdmin)&& (
                  <th className="align-middle" scope="col">
                    Eliminar
                  </th>
                )}
                {(!info && (isAdmin || isManager))&& (<th className="align-middle" scope="col">
                  Editar
                </th>)}
              </tr>
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
  const { username, isManager, isAdmin } = useAuth();
  const { id } = useParams();

  const [costItemKey, setItemCostKey] = useState("");
  const [costQuantity, setCostQuantityKey] = useState(1);
  const [itemPrecio, setItemPrecioKey] = useState(0);
  const [itemDose, setItemDoseKey] = useState("");
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

  const { date } = useGetDatesQuery("datesList", {
    selectFromResult: ({ data }) => ({
      date: data?.entities[id],
    }),
  });
  const { data: items } = useGetItemsQuery("itemsList");
  const { crop } = useGetCropsQuery("cropsList", {
    selectFromResult: ({ data }) => ({
      crop: data?.entities[date?.date_crop_key],
    }),
  });

  const onItemCostChanged = (e) => {
    e.preventDefault();
    setItemCostKey(e.target.value);
    if (items) {
      const { entities } = items;
      setItemPrecioKey(`${entities[e.target.value].item_price}`);
      setItemDoseKey(`${entities[e.target.value].dose_name}`);
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
    setItemDoseKey("")
  };
  useEffect(() => {
    if (date || costs) {
      setItemCostKey("");
      setItemPrecioKey(0);
      setCostDateKey(id);
      setCostQuantityKey(1);
      setItemDoseKey("")
    }
  }, [date, costs]);

  let itemOption;
  
  if (items) {
    const { ids, entities } = items;

    itemOption = ids.map((Id) => {
      if (entities[Id].item_status) {
        return (
          <option value={entities[Id].item_id}>{entities[Id].item_name}</option>
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
          let list = <Cost key={Id} costId={Id} Lista={"Lista1"} />;
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

  if (costIsError) {
    console.log(costError?.data?.message);
  }

  if (date) {
    let contentApp;
    const finalDate = (crop?.crop_harvest !== null || !crop.crop_status)? true:false

    if (date) {
      contentApp = date.date_id.length ?? (
        <AppDate key={date.date_id} dateId={date.date_id} Lista={"Lista3"} />
      );
    }

    let precio = new Intl.NumberFormat("es-do", {
      style: "currency",
      currency: "DOP",
    }).format(parseFloat(itemPrecio));

    return (
      <>
        <div className="font-weight-bold titulo_campos">
          Materiales, insumos y mano de obra
        </div>
        <div>{contentApp}</div>
        {(!finalDate && (isAdmin || isManager)) && (<form>
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
                <label htmlFor="campo_cultivo">Dosis</label>
              </div>
              <div>{itemDose ? itemDose : "Dosis del articulo."}</div>
            </div>
            <div className="col-md-6 col-lg-3 mb-3">
              <div>
                {" "}
                <label htmlFor="campo_cultivo">Cantidad</label>
              </div>
              <input
                type="number"
                maxLength={9}
                value={costQuantity}
                min="0"
                onChange={onCostQuantityChanged}
              />
            </div>

            <div className="col-12">
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
          </div>
        </form>)}

        <div className="table-container col-12 col-md-9 col-xl-6">
          <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-loyola">
              <tr>
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
                {(!finalDate && isAdmin) && (
                  <th className="align-middle" scope="col">
                    Eliminar
                  </th>
                )}
              </tr>
            </thead>
            <tbody>{costList}</tbody>
            <tfoot>
              <tr>
                <td colSpan={"5"}>Total:</td>
                <td>{precioTT}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div>
          <button
            className="btn btn-success"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Cerrar Observaciones" : "OBSERVACIONES"}
          </button>
          <Collapse isOpened={isOpen}>
            <>
              <Comentario key={id} dateId={id} info={finalDate} />
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
