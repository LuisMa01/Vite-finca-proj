import React from "react";
import { useEffect, useState, useReducer } from "react";
import { useParams } from "react-router-dom";
import { useGetDatesQuery } from "./redux/appApiSlice";
import { useGetItemsQuery } from "./redux/itemApiSlice";
import { useGetCostsQuery } from "./redux/costApiSlice";
import { useGetUsersQuery } from "./redux/usersApiSlice";
import { useGetCropsQuery } from "./redux/cropApiSlice";
import { useGetCampsQuery } from "./redux/campApiSlice";
import { useGetActsQuery } from "./redux/actApiSlice";
import { useGetPlantsQuery } from "./redux/plantApiSlice";
import { useTable, useSortBy } from "react-table";
import { Link } from "react-router-dom";
import { Collapse } from "react-collapse";
import ReImage from "../../images/return.svg";
import Cost from "../../components/Cost";
import AppDate from "../../components/AppDate";
import Comt from "../../components/Comt";
import useAuth from "../../hooks/useAuth";

const ACTION = {
  ITEM_ID: "itemId",
  PLANTA: "planta",
  CAMPO: "campo",
  CULTIVO: "cultivo",
  ACTIVIDAD: "actividad",
};
const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.ITEM_ID:
      return { ...state, itemId: action.payload };
    case ACTION.PLANTA:
      return { ...state, planta: action.payload };
    case ACTION.CAMPO:
      return { ...state, campo: action.payload };
    case ACTION.CULTIVO:
      return { ...state, cultivo: !state.cultivo };
    case ACTION.ACTIVIDAD:
      return { ...state, actividad: !state.actividad };

    default:
      throw new Error();
  }
};

const ItemReport = () => {
  const { username, isManager, isAdmin, userId } = useAuth();
  const [state, dispatch] = useReducer(reducer, {
    itemId: "",
    planta: false,
    campo: false,
    cultivo: false,
    actividad: false,
  });

  const { data: plants, isSuccess: plantSucc } =
    useGetPlantsQuery("plantsList");
  const { data: camps, isSuccess: campSucc } = useGetCampsQuery("campsList");
  const { data: crops, isSuccess: cropSucc } = useGetCropsQuery("cropsList");
  const { data: acts, isSuccess: actSucc } = useGetActsQuery("actsList");
  const { data: dates, isSuccess: dateSucc } = useGetDatesQuery("datesList");
  const { data: items, isSuccess: itemSucc } = useGetItemsQuery("itemsList");
  const { data: costs, isSuccess: costSucc } = useGetCostsQuery("costsList");

  const onItemSelect = (e) => {
    e.preventDefault();
  };

  let itemsOption;
  if (itemSucc) {
    const { ids, entities } = items;

    itemsOption = ids.map((Id) => {
      let oob = Object.values(costs.entities).filter(
        (Ids) => Ids.cost_item_key == entities[Id].item_id
      ).length;
      
      if (oob > 0) {
        return <option value={Id}>{entities[Id].item_name}</option>;
      }
    });
  }

  if (state.itemId) {
    
  }
  if (state.itemId == "") {
  }
  if (state.cultivo) {
    
  }
  let itemArr = [];

  if (costSucc) {
    const { ids, entities } = costs;

    const result =
      state.itemId == ""
        ? ids
        : ids?.length &&
          ids?.filter((Id) => entities[Id].cost_item_key == state.itemId);

    result?.length &&
      result?.map((Id) => {
        itemArr.push(entities[Id]);
      });
  }

  /*
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

  const onAddCostClicked = async (e) => {
    e.preventDefault();
  };
  //  costItemKey, costQuantity, costDateKey
  const handleClearClick = (e) => {};

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

  let contentApp;

  let precio = new Intl.NumberFormat("es-do", {
    style: "currency",
    currency: "DOP",
  }).format(parseFloat(itemPrecio));

*/
  /*
  const { datess } = useGetDatesQuery("datesList", {
    selectFromResult: ({ data }) => ({
      datess: data?.ids?.map((Id) => {
        let plnt = `${data?.entities[Id].crop_name}`.split("-")[0];
        if (plnt !== "Plantilla") {
          return data?.entities[Id];
        }
      }),
    }),
  });
  let ddd = datess.filter((data) => data !== undefined);

  let num = 0;
  const data = React.useMemo(() => {
    return ddd?.map((date) => {
      if (date !== undefined) {
        num = num + 1;
        let nomnb =
          `${date?.date_user_key}` == "null"
            ? "no"
            : date?.user_nombre
            ? date?.user_nombre
            : date?.user_name;
        let actNma =
          date?.act_name == 0 || date?.act_name == undefined
            ? "no"
            : date?.act_name;
        let cropNma =
          date?.crop_name == 0 || date?.crop_name == undefined
            ? "no"
            : date?.crop_name;
        let campNma =
          date?.camp_name == 0 || date?.camp_name == undefined
            ? "no"
            : date?.camp_name;
        let fecha =
          `${date?.date_init}` == "null"
            ? "no asignada"
            : `${date?.date_init}`.split("T")[0];

        return {
          col1: num,
          col2: actNma,
          col3: cropNma,
          col4: campNma,
          col5: fecha,
          col6: nomnb,
        };
      }
    });
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        accessor: "col1", // accessor is the "key" in the data
        sortType: "basic",
      },
      {
        Header: "Actividad",
        accessor: "col2",
        sortType: "basic",
      },
      {
        Header: "Cultivo",
        accessor: "col3",
        sortType: "basic",
      },
      {
        Header: "Campo",
        accessor: "col4", // accessor is the "key" in the data
        sortType: "basic",
      },
      {
        Header: "Fecha Programada",
        accessor: "col5",
        sortType: "basic",
        Footer: (info) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () => info.rows.reduce((sum, row) => 1 + sum, 0),
            [info.rows]
          );

          return <>Total: {total}</>;
        },
      },
      {
        Header: "Responsable",
        accessor: "col6",
        sortType: "basic",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  let conteido = (
    <>
      <div className="table-container col-12 col-md-10 col-lg-8">
        <div>
          <table
            {...getTableProps()}
            className="table table-hover table-sm table-striped table-responsive-sm table-bordered"
          >
            <thead className="thead-loyola">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              {footerGroups.map((group) => (
                <tr {...group.getFooterGroupProps()}>
                  {group.headers.map((column) => (
                    <td {...column.getFooterProps()}>
                      {column.render("Footer")}
                    </td>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
*/
  return (
    <>
      <div className="font-weight-bold titulo_campos">Reporteria</div>
      <div className="container needs-validation nuevo-cultivo-form">
        <div className="form-row bg-light">
          <div className="col-md-3 mb-3">
            <label htmlFor="campo_cultivo">Articulos</label>
            <select
              className="form-control"
              value={state.itemId}
              onChange={(e) =>
                dispatch({
                  type: ACTION.ITEM_ID,
                  payload: e.target.value,
                })
              }
            >
              <option value={""}>Todas</option>
              {itemsOption}
            </select>
          </div>
          <div className="form-row bg-light">
            <div div className="col-md-2 mb-3">
              <label htmlFor="campo_cultivo">Planta</label>
              <input type="checkbox" value={state.planta} />
            </div>
            <div div className="col-md-3 mb-3">
              <label htmlFor="campo_cultivo">Campo</label>
              <input type="checkbox" value={state.campo} />
            </div>
            <div div className="col-md-3 mb-3">
              <label htmlFor="campo_cultivo">Cultivo</label>
              <input
                type="checkbox"
                value={state.cultivo}
                onChange={(e) =>
                  dispatch({
                    type: ACTION.CULTIVO,
                  })
                }
              />
            </div>
            <div div className="col-md-3 mb-3">
              <label htmlFor="campo_cultivo">Actividad</label>
              <input type="checkbox" />
            </div>
          </div>
        </div>
      </div>

      <div></div>
    </>
  );
};

export default ItemReport;
