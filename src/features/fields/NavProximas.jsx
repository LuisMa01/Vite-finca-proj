import React, { useState, useEffect, useRef } from "react";
import "../../styles/proximas.css";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import { useTable, useSortBy, usePagination, useFilters } from "react-table";
import { useGetDatesQuery } from "./redux/appApiSlice";
import useAuth from "../../hooks/useAuth";
import AppDate from "../../components/AppDate";
import { useNavigate } from "react-router-dom";

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter, id },
}) {
  // Obtener una lista de opciones únicas a partir de los valores en la columna
  const options = React.useMemo(() => {
    const uniqueOptions = new Set();
    preFilteredRows.forEach((row) => {
      uniqueOptions.add(row.values[id]);
    });
    return Array.from(uniqueOptions);
  }, [id, preFilteredRows]);

  // Renderizar una lista de opciones para el filtro
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">Todos</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

const TablePr = ({ columns, data }) => {
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    setFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0 },
      // Be sure to pass the defaultColumn option
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
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
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                      {column.render("Header")}

                      <div>
                        {column.canFilter ? column.render("Filter") : null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
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
          <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </button>{" "}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {"<"}
            </button>{" "}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {">"}
            </button>{" "}
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </button>{" "}
            <span>
              Página{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>
            <span>
              | Ir a la página:{" "}
              <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                style={{ width: "100px" }}
              />
            </span>{" "}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Mostrar {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

const navProximas = () => {
  const { username, isManager, isAdmin, userId } = useAuth();
  const navigate = useNavigate();
  const [prodArray, setProdArr] = useState([]);

  const { isSuccess } = useGetDatesQuery("datesList");

  const filterDates = (data, isAdmin, isManager, userId) => {
    const filteredDates = data?.ids?.reduce((filtered, Id) => {
      let plnt = `${data?.entities[Id].crop_name}`.split("-")[0];
      let statusCrop = data?.entities[Id].crop_status
      let dateH = `${data?.entities[Id].crop_harvest}` == "null"?true:false
      let appActDate = `${data?.entities[Id].date_end}` == "null"?true:false
      if (plnt !== "Plantilla" && (statusCrop && dateH && appActDate)) {
        if (isAdmin) {
          filtered.push(data?.entities[Id]);
        } else if (isManager) {
          if (
            data?.entities[Id].crop_user_key == userId ||
            data?.entities[Id].date_user_key == userId
          ) {
            filtered.push(data?.entities[Id]);
          }
        } else {
          if (data?.entities[Id].date_user_key == userId) {
            filtered.push(data?.entities[Id]);
          }
        }
      }
      return filtered;
    }, []);
    return filteredDates;
  };

  const { dates } = useGetDatesQuery("datesList", {
    selectFromResult: ({ data }) => ({
      dates: filterDates(data, isAdmin, isManager, userId),
    }),
  });

  let num = 0;

  useEffect(() => {
    const prodArr =
      dates?.length &&
      dates
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
                ? "-"
                : `${date?.date_init}`.split("T")[0];

            return {
              id: num,
              act: actNma,
              cult: cropNma,
              camp: campNma,
              fech: fecha,
              resp: nomnb,
            };
          }
        });


        console.log(dates);

    setProdArr(prodArr);
  }, [isSuccess]);

  const data = React.useMemo(
    () =>
      prodArray?.length &&
      Object.keys(prodArray).map((info) => {
        const col1 = prodArray[info].id;
        const col2 = prodArray[info].act;
        const col3 = prodArray[info].cult;
        const col4 = prodArray[info].camp;
        const col5 = prodArray[info].fech;
        const col6 = prodArray[info].resp;

        return { col1, col2, col3, col4, col5, col6 };
      }),
    [prodArray]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        accessor: "col1", // accessor is the "key" in the data
        sortType: "basic",
        Filter: "",
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
        Filter: "",
      },
      {
        Header: "Responsable",
        accessor: "col6",
        sortType: "basic",
      },
    ],
    []
  );

  let content =
    data?.length > 0 ? (
      <TablePr columns={columns} data={data} />
    ) : (
      <>Loading...</>
    );

  return (
    <>
      <p className="titulo_proximas_actividades">
        Estas son las próximas actividades a realizar en la finca, de todos los
        campos y cultivos
      </p>
      {content}
    </>
  );
};
export default navProximas;
