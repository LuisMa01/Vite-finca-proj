import React from "react";
import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
//import { filterBetween } from 'date-fns/fp';
import { isWithinInterval, parseISO } from "date-fns";
import Chart from "chart.js/auto";

import PropTypes from "prop-types";
import { useGetUsersQuery } from "./redux/usersApiSlice";
import { useGetCropsQuery } from "./redux/cropApiSlice";
import { useGetCampsQuery } from "./redux/campApiSlice";
import { useGetActsQuery } from "./redux/actApiSlice";
import { useGetPlantsQuery } from "./redux/plantApiSlice";

import { useGetCostsQuery } from "./redux/costApiSlice";

import {
  useTable,
  useGroupBy,
  useExpanded,
  useSortBy,
  useFilters,
  useAsyncDebounce,
} from "react-table";
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
    }
  };

  return (
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
    state: { groupBy, expanded },
    setFilter,
  } = tableInstance;

  const getChartData = (selectedRow) => {
    // console.log(selectedRow);

    const chartData = data.filter((d) => d.crop === selectedRow.crop);

    return chartData;
  };

  const handleRowClick = (row) => {
    setSelectedRow(row.original);
  };

  let datata = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 },
  ];
  let kkk;
  const handleColumnClick = (column) => {
    // Obtener los datos de la columna seleccionada

    const columnData =
      rows?.length &&
      rows.map((row) => {
        const cell = row.cells.find((cell) => cell.column.id === column.id);
        //datata.push({ eachNme: `${cell.value}`, cost: `${cell.row.values.cost}` });
        return { eachNme: `${cell.value}`, cost: `${cell.row.values.cost}` };
      });

    // Acciones a realizar con los datos de la columna
    //console.log(`Datos de la columna "${column.Header}": `, columnData);
  };
  console.log(datata);
  // segundo intento

  function handleCellClick(cell) {
    const labels = data.map((row) => row.plant);
    const values = data.map((row) => row.cost);
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: cell.column.Header,
            data: values,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

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
                  <th
                    {...column.getHeaderProps()}
                    
                  >
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
      {/*<canvas id="myChart" />*/}

      <br />
    </>
  );

  return content;
};

const Report = () => {
  const navigate = useNavigate();

  const [focusedInput, setFocusedInput] = useState(null);

  const { username, isManager, isAdmin, userId } = useAuth();
  //const [focusedInput, setFocusedInput]=useState()

  const {
    data: costs,
    isLoading,
    isSuccess: costSucc,
    isError: costIsError,
    error: costError,
  } = useGetCostsQuery("costsList");

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
        const costDate = itemArr[data].cost_date;
        const cost = parseFloat(itemArr[data].cost_price);

        return { act, camp, crop, plant, items, costDate, cost };
      }),
    [itemArr]
  );

  function formatDate(date) {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    return `${day}/${month}/${year}`;
  }
  /*
  function RangeDateFilter({ column: { filterValue = [], setFilter } }) {
    
  const [focusedInput, setFocusedInput] = useState(null);
     console.log(filterValue.length);
    return (
      <DateRangePicker
        startDate={filterValue[0] || ""}
        endDate={filterValue[1] || ""}
        onDatesChange={({ startDate, endDate }) => {
          setFilter(startDate && endDate ? [startDate, endDate] : []);
        }}
        focusedInput={focusedInput}
        onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
        startDatePlaceholderText="Desde"
        endDatePlaceholderText="Hasta"
        isOutsideRange={() => false}
        displayFormat="DD/MM/YYYY"
      />
    );
  }
*/

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
        Header: "Fecha",
        accessor: "costDate",
        filter: "betweenDates",
        aggregate: "",
        Aggregated: () => ``,
        Cell: ({ value }) => formatDate(value),
        Filter: DateRangeFilter,
      },
      {
        Header: "Costo",
        accessor: "cost",
        aggregate: "sum",
        Filter: "",
        Aggregated: ({ value }) =>
          `${value.toLocaleString("es-do", {
            style: "currency",
            currency: "DOP",
          })}`,
        Cell: ({ value }) =>
          value.toLocaleString("es-do", { style: "currency", currency: "DOP" }),
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
