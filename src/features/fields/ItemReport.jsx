import React, { useMemo, useRef } from "react";
import { DownloadTableExcel } from "react-export-table-to-excel";
import _ from "lodash";
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
};
const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.ITEM_ID:
      return { ...state, itemId: action.payload };

    default:
      throw new Error();
  }
};

const TableCont = ({ columns, data }) => {
  const tableRef = useRef(null);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  return (
    <>
      <DownloadTableExcel
        filename="users table"
        sheet="users"
        currentTableRef={tableRef.current}
      >
        <button className="btn btn-success"> Export excel </button>
      </DownloadTableExcel>
      <div className="table-container col-12 col-md-10 col-lg-8">
        <div>
          <table
            ref={tableRef}
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
              {rows.map((row, i) => {
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
};

const ItemReport = () => {
  const { username, isManager, isAdmin, userId } = useAuth();
  const [state, dispatch] = useReducer(reducer, {
    itemId: "",
  });
  const [selectedOption, setSelectedOption] = useState("articulo");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // const { data: plants, isSuccess: plantSucc } = useGetPlantsQuery("plantsList");
  // const { data: camps, isSuccess: campSucc } = useGetCampsQuery("campsList");
  //const { data: crops, isSuccess: cropSucc } = useGetCropsQuery("cropsList");
  //const { data: acts, isSuccess: actSucc } = useGetActsQuery("actsList");
  // const { data: dates, isSuccess: dateSucc } = useGetDatesQuery("datesList");
  //const { data: items, isSuccess: itemSucc } = useGetItemsQuery("itemsList");
  const { data: costs, isSuccess: costSucc } = useGetCostsQuery("costsList");

  const onItemSelect = (e) => {
    e.preventDefault();
  };

  let itemsOption;
  let itemArr;
  let contenido = <></>;
  let actNma;
  if (costSucc) {
    const { ids, entities } = costs;

    const itms = _.groupBy(entities, "item_name");
    itemsOption = Object.keys(itms).map((itm) => {
      const key = _.reduce(itms[itm], (sum, item) => item.cost_item_key, 0);
      if (state.itemId == key) {
        const nn = _.reduce(itms[itm], (sum, item) => itm, 0);
        actNma = nn;
      }

      return <option value={key}>{itm}</option>;
    });

    const result =
      state.itemId == ""
        ? ids
        : ids?.length &&
          ids?.filter((Id) => entities[Id].cost_item_key == state.itemId);

    itemArr =
      result?.length &&
      result?.map((Id) => {
        return entities[Id];
      });
  }

  // Agrupa los datos por cultivo
  const dataByCrop = _.groupBy(itemArr, "crop_name");

  // Agrupa los datos por actividad
  const dataByActivity = _.groupBy(itemArr, "act_name");

  const dataByCamp = _.groupBy(itemArr, "camp_name");

  const itemByCamp = _.groupBy(itemArr, "item_name");

  const campData = useMemo(
    () =>
      Object.keys(dataByCamp).map((camp) => {
        const items = _.reduce(dataByCamp[camp], (sum, item) => sum + 1, 0);
        const costs = _.reduce(
          dataByCamp[camp],
          (sum, item) => sum + parseFloat(item.cost_price),
          0
        );
        let cost = new Intl.NumberFormat("es-do", {
          style: "currency",
          currency: "DOP",
        }).format(costs);
        return { camp, items, cost };
      }),
    []
  );

  const activityData = useMemo(
    () =>
      Object.keys(dataByActivity).map((activity) => {
        const items = _.reduce(
          dataByActivity[activity],
          (sum, item) => sum + 1,
          0
        );
        const costs = _.reduce(
          dataByActivity[activity],
          (sum, item) => sum + parseFloat(item.cost_price),
          0
        );
        let cost = new Intl.NumberFormat("es-do", {
          style: "currency",
          currency: "DOP",
        }).format(costs);
        return { activity, items, cost };
      }),
    [state.itemId]
  );

  const cropData = useMemo(
    () =>
      Object.keys(dataByCrop).map((crop) => {
        const items = _.reduce(dataByCrop[crop], (sum, item) => sum + 1, 0);
        const costs = _.reduce(
          dataByCrop[crop],
          (sum, item) => sum + parseFloat(item.cost_price),
          0
        );
        let cost = new Intl.NumberFormat("es-do", {
          style: "currency",
          currency: "DOP",
        }).format(costs);
        return { crop, items, cost };
      }),
    []
  );

  const itemData = useMemo(
    () =>
      Object.keys(itemByCamp).map((itm) => {
        const items = _.reduce(
          itemByCamp[itm],
          (sum, item) => sum + parseFloat(item.cost_quantity),
          0
        );
        const costs = _.reduce(
          itemByCamp[itm],
          (sum, item) => sum + parseFloat(item.cost_price),
          0
        );
        let cost = new Intl.NumberFormat("es-do", {
          style: "currency",
          currency: "DOP",
        }).format(costs);
        return { itm, items, cost };
      }),
    [state.itemId]
  );

  // Define las columnas para la tabla de actividades
  const activityColumns = useMemo(
    () => [
      { Header: "Actividad", accessor: "activity" },
      { Header: "Cantidad de Items", accessor: "items" },
      {
        Header: "Costo Total",
        accessor: "cost",
        Footer: (info) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () =>
              info.rows.reduce(
                (sum, row) =>
                  sum +
                  parseFloat(`${row.values.cost.slice(3)}`.replace(",", "")),
                0
              ),
            [info.rows]
          );

          let precioTT = new Intl.NumberFormat("es-do", {
            style: "currency",
            currency: "DOP",
          }).format(total);
          return (
            <>
              {" "}
              <b>Total:</b> {precioTT}
            </>
          );
        },
      },
    ],
    [state.itemId]
  );
  const activityColumn = useMemo(
    () => [
      {
        Header: `Articulo: ${actNma}`,
        Footer: "",
        columns: [
          { Header: "Actividad", accessor: "activity", sortType: "basic" },
        ],
      },
      {
        Header: "Fecha",
        Footer: "",
        columns: [
          { Header: "Cantidad de Items", accessor: "items", sortType: "basic" },
          {
            Header: "Costo Total",
            accessor: "cost",
            sortType: "basic",
            Footer: (info) => {
              // Only calculate total visits if rows change
              const total = React.useMemo(
                () =>
                  info.rows.reduce(
                    (sum, row) =>
                      sum +
                      parseFloat(
                        `${row.values.cost.slice(3)}`.replace(",", "")
                      ),
                    0
                  ),
                [info.rows]
              );

              let precioTT = new Intl.NumberFormat("es-do", {
                style: "currency",
                currency: "DOP",
              }).format(total);
              return (
                <>
                  {" "}
                  <b>Total:</b> {precioTT}
                </>
              );
            },
          },
        ],
      },
    ],
    [state.itemId]
  );

  const cropColumns = useMemo(
    () => [
      { Header: "Cultivo", accessor: "crop" },
      { Header: "Cantidad de Items", accessor: "items" },
      {
        Header: "Costo Total",
        accessor: "cost",
        Footer: (info) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () =>
              info.rows.reduce(
                (sum, row) =>
                  sum +
                  parseFloat(`${row.values.cost.slice(3)}`.replace(",", "")),
                0
              ),
            [info.rows]
          );

          let precioTT = new Intl.NumberFormat("es-do", {
            style: "currency",
            currency: "DOP",
          }).format(total);
          return (
            <>
              {" "}
              <b>Total:</b> {precioTT}
            </>
          );
        },
      },
    ],
    [state.itemId]
  );
  const cropColumn = useMemo(
    () => [
      {
        Header: `Articulo: ${actNma}`,
        Footer: "",
        columns: [{ Header: "Actividad", accessor: "crop", sortType: "basic" }],
      },
      {
        Header: "Fecha",
        Footer: "",
        columns: [
          { Header: "Cantidad de Items", accessor: "items", sortType: "basic" },
          {
            Header: "Costo Total",
            accessor: "cost",
            sortType: "basic",
            Footer: (info) => {
              // Only calculate total visits if rows change
              const total = React.useMemo(
                () =>
                  info.rows.reduce(
                    (sum, row) =>
                      sum +
                      parseFloat(
                        `${row.values.cost.slice(3)}`.replace(",", "")
                      ),
                    0
                  ),
                [info.rows]
              );

              let precioTT = new Intl.NumberFormat("es-do", {
                style: "currency",
                currency: "DOP",
              }).format(total);
              return (
                <>
                  {" "}
                  <b>Total:</b> {precioTT}
                </>
              );
            },
          },
        ],
      },
    ],
    [state.itemId]
  );

  const itemColumns = useMemo(
    () => [
      { Header: "Articulo", accessor: "itm" },
      { Header: "Cantidad", accessor: "items" },
      {
        Header: "Costo Total",
        accessor: "cost",
        Footer: (info) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () =>
              info.rows.reduce(
                (sum, row) =>
                  sum +
                  parseFloat(`${row.values.cost.slice(3)}`.replace(",", "")),
                0
              ),
            [info.rows]
          );

          let precioTT = new Intl.NumberFormat("es-do", {
            style: "currency",
            currency: "DOP",
          }).format(total);
          return (
            <>
              {" "}
              <b>Total:</b> {precioTT}
            </>
          );
        },
      },
    ],
    [state.itemId]
  );

  // Define las columnas para la tabla de cultivos

  if (selectedOption == "articulo") {
    contenido = <TableCont columns={itemColumns} data={itemData} />;
  }
  if (selectedOption == "actividad") {
    if (state.itemId == "") {
      contenido = <TableCont columns={activityColumns} data={activityData} />;
    }
    if (state.itemId !== "") {
      contenido = <TableCont columns={activityColumn} data={activityData} />;
    }
  }
  if (selectedOption == "campo") {
    if (state.itemId == "") {
      contenido = <TableCont columns={cropColumns} data={cropData} />;
    }
    if (state.itemId !== "") {
      contenido = <TableCont columns={cropColumn} data={cropData} />;
    }
  }
  if (selectedOption == "planta") {
  }
  if (selectedOption == "cultivo") {
  }

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
            <div className="col-md-2 mb-3">
              <label htmlFor="campo_cultivo">Articulo</label>
              <input
                type="radio"
                name="fav_language"
                value={"articulo"}
                checked={selectedOption === "articulo"}
                onChange={handleOptionChange}
              />
            </div>
            <div className="col-md-2 mb-3">
              <label htmlFor="campo_cultivo">Planta</label>
              <input
                type="radio"
                name="fav_language"
                value={"planta"}
                checked={selectedOption === "planta"}
                onChange={handleOptionChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="campo_cultivo">Campo</label>
              <input
                type="radio"
                name="fav_language"
                value={"campo"}
                checked={selectedOption === "campo"}
                onChange={handleOptionChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="campo_cultivo">Cultivo</label>
              <input
                type="radio"
                name="fav_language"
                value={"cultivo"}
                checked={selectedOption === "cultivo"}
                onChange={handleOptionChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="campo_cultivo">Actividad</label>
              <input
                type="radio"
                name="fav_language"
                value={"actividad"}
                checked={selectedOption === "actividad"}
                onChange={handleOptionChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div>{contenido}</div>
    </>
  );
};

export default ItemReport;
