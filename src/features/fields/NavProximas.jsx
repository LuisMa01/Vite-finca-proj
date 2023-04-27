import React, { useState, useEffect, useRef } from "react";
import "../../styles/proximas.css";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import { useTable, useSortBy, usePagination } from "react-table";
import { useGetDatesQuery } from "./redux/appApiSlice";
import useAuth from "../../hooks/useAuth";
import AppDate from "../../components/AppDate";
import { useNavigate } from "react-router-dom";

const navProximas = () => {
  const { username, isManager, isAdmin, userId } = useAuth();
  const navigate = useNavigate();
  
  
  const { data : datess } = useGetDatesQuery("datesList");
  const { dates } = useGetDatesQuery("datesList", {
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





 
  let prodArr = [];

  let num = 0;
  
 dates?.length && dates
      ?.filter((data) => data !== undefined)
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
    


 

  const data = React.useMemo(() => {
    return prodArr?.map((info) => {
      return {
        col1: info.id,
        col2: info.act,
        col3: info.cult,
        col4: info.camp,
        col5: info.fech,
        col6: info.resp,
      };
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
      },
      {
        Header: "Responsable",
        accessor: "col6",
        sortType: "basic",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);
let conteido
    
      
      conteido=(<>
        
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
            </table>
          </div>
        </div>
      </>)
    
  return (
    <>
    <p className="titulo_proximas_actividades">
          Estas son las próximas actividades a realizar en la finca, de todos los
          campos y cultivos
        </p>
      {conteido}
    </>
  );
};
export default navProximas;
