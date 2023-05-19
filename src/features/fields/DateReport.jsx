import React from "react";
import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
//import { filterBetween } from 'date-fns/fp';
import { isWithinInterval, parseISO } from "date-fns";
import Chart from "chart.js/auto";
import { Bar, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);
import PropTypes from "prop-types";
import { useGetDatesQuery } from "./redux/appApiSlice";
import {
  useTable,
  useGroupBy,
  useExpanded,
  useSortBy,
  useFilters,
  useAsyncDebounce,
} from "react-table";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { DownloadTableExcel } from "react-export-table-to-excel";
import _ from "lodash";

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

const DateRangeFilter = ({ column: { filterValue = {}, setFilter } }) => {
  const [minDate, setMinDate] = useState(filterValue.minDate || "");
  const [maxDate, setMaxDate] = useState(filterValue.maxDate || "");

  const handleFilterChange = () => {
    if (minDate && maxDate) {
      if (maxDate >= minDate) {
        setFilter({ minDate, maxDate });
      }
    } else {
      setFilter(undefined);
    }
  };

  const handleClearFilter = () => {
    setMinDate("");
    setMaxDate("");
    setFilter(undefined);
  };

  return (
    <div>
      <div>
        <input
          type="date"
          value={minDate}
          max={maxDate}
          onChange={(e) => setMinDate(e.target.value)}
          onBlur={handleFilterChange}
        />
        <span> - </span>
        <input
          type="date"
          value={maxDate}
          min={minDate}
          onChange={(e) => setMaxDate(e.target.value)}
          onBlur={handleFilterChange}
        />
      </div>

      <button className="btn btn-success" onClick={handleClearFilter}>
        Limpiar
      </button>
    </div>
  );
};

DateRangeFilter.propTypes = {
  column: PropTypes.shape({
    filterValue: PropTypes.shape({
      minDate: PropTypes.string,
      maxDate: PropTypes.string,
    }),
    setFilter: PropTypes.func.isRequired,
  }).isRequired,
};

// opcional: defina el método "autoRemove" para que la columna se filtre automáticamente después de seleccionar las fechas
DateRangeFilter.autoRemove = (val) => !val.minDate && !val.maxDate;

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return <input type="checkbox" ref={resolvedRef} {...rest} />;
  }
);
const TableCont = ({ columns, data }) => {
  const tableRef = useRef(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const filterTypes = {
    // Filtrar por rango de fechas
    betweenDates: (rows, id, filterValue) => {
      const { minDate, maxDate } = filterValue;
      return rows.filter((row) => {
        const rowDate = new Date(row.values[id]);

        return isWithinInterval(rowDate, {
          start: new Date(minDate),
          end: new Date(maxDate),
        });
      });
    },
  };

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );
  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: { selectedRowIds: [selectedRow?.id] },
    },
    useFilters,
    useGroupBy,
    useExpanded // useGroupBy would be pretty useless without useExpanded ;)
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
    allColumns,
    getToggleHideAllColumnsProps,
    state: { groupBy, expanded },
    setFilter,
  } = tableInstance;

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
        <div className="row">
          <div className="col-2">
            <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Todo
          </div>
          {allColumns.map((column) => (
            <div key={column.id} className="col-2">
              <label>
                <input type="checkbox" {...column.getToggleHiddenProps()} />{" "}
                {column.Header}
              </label>
            </div>
          ))}
          <br />
        </div>
      </div>

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
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
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

  return content;
};

const DateReport = () => {
  const { username, isManager, isAdmin, userId } = useAuth();
  const navigate = useNavigate();
  const [prodArray, setProdArr] = useState([]);

  const { isSuccess } = useGetDatesQuery("datesList");

  const filterDates = (data, isAdmin, isManager, userId) => {
    const filteredDates = data?.ids?.reduce((filtered, Id) => {
      let plnt = `${data?.entities[Id].crop_name}`.split("-")[0];
      if (plnt !== "Plantilla") {
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

  let infoRender = <></>;

  const prodArr =
    dates?.length &&
    dates
      ?.filter((data) => data !== undefined)
      .map((date) => {
        if (date) {
          let actNma =
            date?.act_name == 0 || date?.act_name == undefined
              ? "-"
              : date?.act_name;
          let plantNma =
            date?.plant_name == 0 || date?.plant_name == undefined
              ? "-"
              : date?.plant_name;
          let cropNma =
            date?.crop_name == 0 || date?.crop_name == undefined
              ? "-"
              : date?.crop_name;
          let campNma =
            date?.camp_name == 0 || date?.camp_name == undefined
              ? "-"
              : date?.camp_name;
          let fechaPro = `${date?.date_init}` == "null" ? "-" : date?.date_init;
          let fechaEjc = `${date?.date_end}` == "null" ? "-" : date?.date_end;

          let fechaPlant =
            `${date?.crop_plant}` == "null" ? "-" : date?.crop_plant;
          let fechaHarvest =
            `${date?.crop_harvest}` == "null" ? "-" : date?.crop_harvest;
          let cropStatus = date?.crop_status?'Activo':'Inactivo';

          const date1 = new Date(fechaPlant);
          const date2 = new Date(fechaHarvest);

          // Diferencia en milisegundos entre las dos fechas
          const differenceMs = Math.abs(date2 - date1);

          // Cálculo de la diferencia en días
          const differenceDays = Math.ceil(
            differenceMs / (1000 * 60 * 60 * 24)
          );

          const date3 = new Date(fechaPro);
          const date4 = new Date(fechaEjc);
          const dateHoy = new Date()
           let estadoAct = "-"
          if (
            `${date?.date_end}` !== "null" &&
            `${date?.date_init}` !== "null"
          ) {
            // Comparar si date3 es igual a date4
            if (date3.getTime() === date4.getTime()) {
              estadoAct = "Completado a tiempo"
            }

            // Comparar si date3 es mayor que date4
            if (date3.getTime() > date4.getTime()) {
              estadoAct = "Completado anticipadamente"
            }

            // Comparar si date3 es menor que date4
            if (date3.getTime() < date4.getTime()) {
              estadoAct = "Completado con retraso"
            }
          }
          if (
            `${date?.date_end}` == "null" &&
            `${date?.date_init}` !== "null"
          ) {
            // Comparar si date3 es igual a date4
            if (date3.getTime() === dateHoy.getTime()) {
              estadoAct = "Urgente"
            }

            // Comparar si date3 es mayor que date4
            if (date3.getTime() > dateHoy.getTime()) {
              estadoAct = "Retrasado"
            }

            // Comparar si date3 es menor que date4
            if (date3.getTime() < dateHoy.getTime()) {
              estadoAct = "En progreso"
            }
          }

          const diffDay = `${differenceDays}` == "NaN" ? "-" : differenceDays;

          return {
            actNma,
            cropNma,
            campNma,
            fechaPro,
            fechaEjc,
            plantNma,
            fechaPlant,
            fechaHarvest,
            cropStatus,
            diffDay,
            estadoAct
          };
        }
      });

  // setProdArr(prodArr);

  const data = React.useMemo(
    () =>
      prodArr?.length &&
      Object.keys(prodArr).map((info) => {
        const actNma = prodArr[info].actNma;
        const cropNma = prodArr[info].cropNma;
        const campNma = prodArr[info].campNma;
        const fechaPro = prodArr[info].fechaPro;
        const fechaEjc = prodArr[info].fechaEjc;
        const plantNma = prodArr[info].plantNma;
        const fechaPlant = prodArr[info].fechaPlant;
        const fechaHarvest = prodArr[info].fechaHarvest;
        const cropStatus = prodArr[info].cropStatus;
        const diffDay = prodArr[info].diffDay;
        const estadoAct = prodArr[info].estadoAct;
        

        return {
          actNma,
          cropNma,
          campNma,
          fechaPro,
          fechaEjc,
          plantNma,
          fechaPlant,
          fechaHarvest,
          cropStatus,
          diffDay,
          estadoAct,
        };
      }),
    [prodArr]
  );

  function formatDate(date) {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    return `${day}/${month}/${year}`;
  }
  function formatMonthYear(date) {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const options = { month: "long" };
    const month = dateObj.toLocaleString("es", options);
    //const day = dateObj.getDate();

    return `${month}-${year}`;
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "Planta",
        accessor: "plantNma",
        aggregate: "count",
        Aggregated: () => ``,
      },
      {
        Header: "Campo",
        accessor: "campNma", // accessor is the "key" in the data
        aggregate: "count",
        Aggregated: () => ``,
      },
      {
        Header: "Cultivo",
        accessor: "cropNma",
        aggregate: "count",
        Aggregated: () => ``,
      },
      {
        Header: "Estado del Cultivo",
        accessor: "cropStatus",
        aggregate: "",
        Aggregated: () => ``,
      },
      {
        Header: "Fecha de plantación",
        accessor: "fechaPlant",
        filter: "betweenDates",
        aggregate: "",
        Aggregated: () => ``,
        Cell: ({ value }) => (value !== "-" ? formatDate(value) : "-"),
        Filter: DateRangeFilter,
      },
      {
        Header: "Fecha de cosecha",
        accessor: "fechaHarvest",
        filter: "betweenDates",
        aggregate: "",
        Aggregated: () => ``,
        Cell: ({ value }) => (value !== "-" ? formatDate(value) : "-"),
        Filter: DateRangeFilter,
      },
      {
        Header: "Días X Cultivo",
        accessor: "diffDay",
        aggregate: "",
        Aggregated: () => ``,
        Filter: "",
      },
      {
        Header: "Actividad",
        accessor: "actNma",
        aggregate: "count",
        Aggregated: () => ``,
      },
      {
        Header: "Fecha programada",
        accessor: "fechaPro",
        filter: "betweenDates",
        aggregate: "",
        Aggregated: () => ``,
        Cell: ({ value }) => (value !== "-" ? formatDate(value) : "-"),
        Filter: DateRangeFilter,
      },
      {
        Header: "Fecha de ejecución",
        accessor: "fechaEjc",
        filter: "betweenDates",
        aggregate: "",
        Aggregated: () => ``,
        Cell: ({ value }) => (value !== "-" ? formatDate(value) : "-"),
        Filter: DateRangeFilter,
      },
      {
        Header: "Estado de la actividad",
        accessor: "estadoAct",
        aggregate: "count",
        Aggregated: () => ``,
      },
    ],
    []
  );

  infoRender = isSuccess ? <TableCont columns={columns} data={data} /> : <></>;

  return (
    <>
      <div>
        <div className="button-section_parent ">
        <div>
            <div className="button-section_parent ">
              <button
                className="btn btn-outline-primary seccion_cultivos_btn-agr"
                onClick={() => navigate("/dash/reporteria")}
              >
                Reporte de Costos
              </button>


              <button
                type="button"
                className="btn btn-outline-primary seccion_cultivos_btn-agr"
                onClick={() => navigate("/dash/reporteria/cultivos")}
              >
                Reporte de Duración
              </button>

              
            </div>
          </div>
        </div>
      </div>
      <h1 className="title">Reporte de Duración y Cumplimiento del Cultivo</h1>
      <div className="container needs-validation nuevo-cultivo-form">
        <div className="form-row"></div>
      </div>

      <div>{infoRender}</div>
    </>
  );
};

export default DateReport;
