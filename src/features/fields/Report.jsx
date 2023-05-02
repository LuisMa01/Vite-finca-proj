import React from "react";
import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";

import { useGetUsersQuery } from "./redux/usersApiSlice";
import { useGetCropsQuery } from "./redux/cropApiSlice";
import { useGetCampsQuery } from "./redux/campApiSlice";
import { useGetActsQuery } from "./redux/actApiSlice";
import { useGetPlantsQuery } from "./redux/plantApiSlice";

import { useGetCostsQuery } from "./redux/costApiSlice";

import { useTable, useGroupBy, useExpanded, useSortBy } from "react-table";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Collapse } from "react-collapse";
import ReImage from "../../images/return.svg";
import Cost from "../../components/Cost";
import AppDate from "../../components/AppDate";
import Comt from "../../components/Comt";
import useAuth from "../../hooks/useAuth";
import { DownloadTableExcel } from "react-export-table-to-excel";
import _ from "lodash";

const TableCont = ({ columns, data }) => {
  const tableRef = useRef(null);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
    state: { groupBy, expanded },
  } = useTable(
    {
      columns,
      data,
    },
    useGroupBy,
    useExpanded // useGroupBy would be pretty useless without useExpanded ;)
  );

  const content = (
    <>
      <DownloadTableExcel
        filename="users table"
        sheet="users"
        currentTableRef={tableRef.current}
      >
        <button className="btn btn-success"> Export excel </button>
      </DownloadTableExcel>
      <div className="table-container col-12 col-md-10 col-lg-8">
        <table
          {...getTableProps()}
          ref={tableRef}
          className="table table-hover table-sm table-striped table-responsive-sm table-bordered"
        >
          <thead className="thead-loyola">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.canGroupBy ? (
                      // If the column can be grouped, let's add a toggle
                      <span {...column.getGroupByToggleProps()}>
                        {column.isGrouped ? "↥ " : "↓ "}
                      </span>
                    ) : null}
                    {column.render("Header")}
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
                      <td
                        // For educational purposes, let's color the
                        // cell depending on what type it is given
                        // from the useGroupBy hook
                        {...cell.getCellProps()}
                      >
                        {cell.isGrouped ? (
                          // If it's a grouped cell, add an expander and row count
                          <>
                            <span {...row.getToggleRowExpandedProps()}>
                              {row.isExpanded ? "↘  " : "→  "}
                            </span>{" "}
                            {cell.render("Cell")} ({row.subRows.length})
                          </>
                        ) : cell.isAggregated ? (
                          // If the cell is aggregated, use the Aggregated
                          // renderer for cell
                          cell.render("Aggregated")
                        ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                          // Otherwise, just render the regular cell
                          cell.render("Cell")
                        )}
                      </td>
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

      <br />
    </>
  );

  return content; /*(
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
  */
};

const Report = () => {
  const navigate = useNavigate();
  const { username, isManager, isAdmin, userId } = useAuth();

  const {
    data: costs,
    isLoading,
    isSuccess: costSucc,
    isError: costIsError,
    error: costError,
  } = useGetCostsQuery("costsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let infoRender;
  let itemArr;
  if (isLoading) {
    infoRender = <></>;
  }

  if (costSucc) {
    const { ids, entities } = costs;

    const result =
      ids?.length && ids?.filter((Id) => entities[Id] !== undefined);

    itemArr =
      result?.length &&
      result?.map((Id) => {
        return entities[Id];
      });
  }

  let num = 0;
  const data = React.useMemo(
    () =>
      itemArr?.length &&
      Object.keys(itemArr).map((data) => {
        
        const camp = itemArr[data].camp_name;
        const act = itemArr[data].act_name;
        const crop = itemArr[data].crop_name;
        const plant = itemArr[data].plant_name;
        const items = itemArr[data].item_name;
        const cost = parseFloat(itemArr[data].cost_price);

        return { act, camp, crop, plant, items, cost };
      }),
    [itemArr]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Planta",
        accessor: "plant",
        aggregate: "count",
        Aggregated: ({ value }) => `${value} Plantas`,
      },
      {
        Header: "Cultivo",
        accessor: "crop",
        aggregate: "count",
        Aggregated: ({ value }) => `${value} Cultivos`,
      },
      {
        Header: "Campo",
        accessor: "camp", // accessor is the "key" in the data
        aggregate: "count",
        Aggregated: ({ value }) => `${value} Campos`,
      },
      {
        Header: "Actividad",
        accessor: "act",
        aggregate: "count",
        Aggregated: ({ value }) => `${value} Actividades`,
      },
      {
        Header: "Articulo",
        accessor: "items",
        aggregate: "count",
        Aggregated: ({ value }) => `${value} Articulos`,
      },
      {
        Header: "Costo",
        accessor: "cost",
        aggregate: "sum",
        Aggregated: ({ value }) => `${value.toLocaleString("es-do", { style: 'currency', currency: 'DOP' })}`,
        Cell: ({ value }) => value.toLocaleString("es-do", { style: 'currency', currency: 'DOP' }),
        Footer: (info) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () => info.rows.reduce((sum, row) => sum + row.values.cost, 0),
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
    [itemArr]
  );

  infoRender = costSucc ? <TableCont columns={columns} data={data} /> : <></>;

  return (
    <>
      <div>
        <div className="button-section_parent ">
          {/*<button
            className="btn btn-outline-primary seccion_cultivos_btn-agr"
            onClick={() => navigate("/dash/reporteria/items")}
          >
            Articulo
  </button>*/}
        </div>
      </div>
      <div className="font-weight-bold titulo_campos">Reporte General</div>
      <div className="container needs-validation nuevo-cultivo-form">
        <div className="form-row"></div>
      </div>

      <div>{infoRender}</div>
    </>
  );
};

export default Report;
