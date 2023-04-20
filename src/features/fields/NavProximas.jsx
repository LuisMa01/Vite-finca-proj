import React, { useState, useEffect } from "react";
import "../../styles/proximas.css";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import { useTable } from "react-table";
import { useGetDatesQuery } from "./redux/appApiSlice";
import useAuth from "../../hooks/useAuth";
import AppDate from "../../components/AppDate";
import { useNavigate } from "react-router-dom";

const navProximas = () => {
  /*
  const { username, isManager, isAdmin, userId } = useAuth();
  const navigate = useNavigate();
  const { SearchBar } = Search;

  const { dates, isSuccess } = useGetDatesQuery("datesList", {
    selectFromResult: ({ data }) => ({
      dates: data?.ids?.map((Id) => {
        let plnt = `${data?.entities[Id].crop_name}`.split("-")[0];
        if (plnt !== "Plantilla") {
          if (isAdmin) {
            return data?.entities[Id];
          } else if (isManager) {
            if (
              data?.entities[Id].crop_user_key == userId ||
              data?.entities[Id].date_user_key == userId
            ) {
              return data?.entities[Id];
            }
          } else {
            if (data?.entities[Id].date_user_key == userId) {
              return data?.entities[Id];
            }
          }
        }
      }),
    }),
  });

  const columns = [
    {
      dataField: "id",
      text: "#",
      sort: true,
    },
    {
      dataField: "act",
      text: "Actividad",
      sort: true,
    },
    {
      dataField: "cult",
      text: "Cultivo",
      sort: true,
    },
    {
      dataField: "camp",
      text: "Campo",
      sort: true,
    },
    {
      dataField: "fech",
      text: "Fecha programada",
      sort: true,
    },
    {
      dataField: "resp",
      text: "Responsable",
      sort: true,
    },
  ];

  let products;
  let prodArr = [];
  
    let num = 0;
    products =
      dates?.length &&
      dates
        .filter((data) => data !== undefined)
        .map((date) => {
          if (date) {
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
            
            prodArr.push({
              id: num,
              act: actNma,
              cult: cropNma,
              camp: campNma,
              fech: fecha,
              resp: nomnb,
            });
          }
        });
  
*/

  const data = React.useMemo(
    () => [
      {
        col1: "Hello",
        col2: "World",
      },
      {
        col1: "react-table",
        col2: "rocks",
      },
      {
        col1: "whatever",
        col2: "you want",
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Column 1",
        accessor: "col1", // accessor is the "key" in the data
      },
      {
        Header: "Column 2",
        accessor: "col2",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });
  return (
    <>
      <p className="titulo_proximas_actividades">
        Estas son las próximas actividades a realizar en la finca, de todos los
        campos y cultivos
      </p>
      <div className="table-container col-12 col-md-10 col-lg-8">
        <div>hola mundo, ahora</div>
        <div>
          <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      style={{
                        borderBottom: "solid 3px red",
                        background: "aliceblue",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      {column.render("Header")}
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
                        <td
                          {...cell.getCellProps()}
                          style={{
                            padding: "10px",
                            border: "solid 1px gray",
                            background: "papayawhip",
                          }}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default navProximas;
