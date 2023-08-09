import React from "react";
import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

import { isWithinInterval, parseISO } from "date-fns";
import Chart from "chart.js/auto";
import { Bar, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

import PropTypes from "prop-types";

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
      <div
        style={{
          display: "flex",
        }}
      >
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

const Report = () => {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [uno, setUno] = useState(true);
  const [dos, setDos] = useState(false);
  const [tres, setTres] = useState(false);
  const [cuatro, setCuatro] = useState(false);
  const [cinco, setCinco] = useState(false);
  const [seis, setSeis] = useState(true);
  const [siete, setSiete] = useState(true);
  const [ocho, setOcho] = useState(true);

  const { username, isManager, isAdmin, userId } = useAuth();

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
        const itemCost = parseFloat(itemArr[data].cost_item_price);
        const quantity = parseFloat(itemArr[data].cost_quantity);
        const unidad = itemArr[data].dose_unit;
        return {
          act,
          camp,
          crop,
          plant,
          items,
          costDate,
          cost,
          itemCost,
          quantity,
          unidad,
        };
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
        accessor: "plant",
        aggregate: "count",
        Aggregated: () => ``,
      },
      {
        Header: "Cultivo",
        accessor: "crop",
        aggregate: "count",
        Aggregated: () => ``,
      },
      {
        Header: "Campo",
        accessor: "camp", // accessor is the "key" in the data
        aggregate: "count",
        Aggregated: () => ``,
      },
      {
        Header: "Actividad",
        accessor: "act",
        aggregate: "count",
        Aggregated: () => ``,
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
        Header: "Precio del Articulo",
        accessor: "itemCost",
        aggregate: "count",
        Filter: "",
        Aggregated: () => ``,
        Cell: ({ value }) =>
          value.toLocaleString("es-do", { style: "currency", currency: "DOP" }),
      },
      {
        Header: "Cantidad",
        accessor: "quantity",
        aggregate: "sum",
        Filter: "",
        Aggregated: ({ value, row }) => {
          let valor;
          if (
            row.isGrouped &&
            (row.groupByID == "items" || row.groupByID == "unidad")
          ) {
            valor = value;
          } else {
            valor = "";
          }
          return `${valor}`;
        },
      },
      {
        Header: "Unidad",
        accessor: "unidad",
        aggregate: "count",
        Aggregated: () => ``,
      },
      {
        Header: "Costo",
        accessor: "cost",
        aggregate: "sum",
        Filter: "",
        Aggregated: ({ value, isAggregated }) =>
          isAggregated
            ? "Agrupado"
            : `${value.toLocaleString("es-do", {
                style: "currency",
                currency: "DOP",
              })}`,
        Cell: ({ value }) =>
          value.toLocaleString("es-do", { style: "currency", currency: "DOP" }),
        Footer: (info) => {
          // Only calculate total visits if rows change

          const total = React.useMemo(
            () =>
              info.rows.reduce(
                (sum, row) =>
                  row.isGrouped && row.groupByID == info.rows[0].groupByID
                    ? sum + row.values.cost
                    : sum,
                0
              ),
            [info.rows]
          );
          const totalNoGroup = React.useMemo(
            () =>
              info.rows.reduce(
                (sum, row) => (row.isGrouped ? sum : sum + row.values.cost),
                0
              ),
            [info.rows]
          );
          let precioTT;

          info?.rows[0]?.isGrouped
            ? (precioTT = new Intl.NumberFormat("es-do", {
                style: "currency",
                currency: "DOP",
              }).format(total))
            : (precioTT = new Intl.NumberFormat("es-do", {
                style: "currency",
                currency: "DOP",
              }).format(totalNoGroup));

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

  const filteredData =
    endDate == "" && startDate == ""
      ? itemArr
      : itemArr?.filter((item) => {
          const itemDate = new Date(item.cost_date);
          return (
            itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
          );
        });

  const dateFitered =
    endDate && startDate
      ? [formatMonthYear(startDate), formatMonthYear(endDate)]
      : [];

  const costXfecha = filteredData?.map((info) => {
    const dateObj = new Date(info.cost_date);
    const year = dateObj.getFullYear();
    const options = { month: "long" };
    const month = dateObj.toLocaleString("es", options);
    const mes = `${month} - ${year}`;
    const costos = info.cost_price;
    return { year, mes, costos, dateObj };
  });
  const sortedData = _.orderBy(costXfecha, (o) => o.dateObj, "asc");
  const dataByYear = _.groupBy(sortedData, "year");

  const dataByMes = _.groupBy(sortedData, "mes");

  const dataByCrop = _.groupBy(filteredData, "crop_name");

  // Agrupa los datos por actividad
  const dataByActivity = _.groupBy(filteredData, "act_name");

  const dataByCamp = _.groupBy(filteredData, "camp_name");

  const dataByItem = _.groupBy(filteredData, "item_name");

  const dataByPlant = _.groupBy(filteredData, "plant_name");

  const dataYear = Object.keys(dataByYear).map((year) => {
    const costs = _.reduce(
      dataByYear[year],
      (sum, item) => sum + parseFloat(item.costos),
      0
    );
    return { year, costs };
  });

  const dataMes = Object.keys(dataByMes).map((mes) => {
    const costs = _.reduce(
      dataByMes[mes],
      (sum, item) => sum + parseFloat(item.costos),
      0
    );
    return { mes, costs };
  });

  const dataAct = Object.keys(dataByActivity).map((activity) => {
    const costs = _.reduce(
      dataByActivity[activity],
      (sum, item) => sum + parseFloat(item.cost_price),
      0
    );
    return { activity, costs };
  });

  const dataPlant = Object.keys(dataByPlant).map((name) => {
    const costs = _.reduce(
      dataByPlant[name],
      (sum, item) => sum + parseFloat(item.cost_price),
      0
    );
    return { name, costs };
  });

  const dataCrop = Object.keys(dataByCrop).map((name) => {
    const costs = _.reduce(
      dataByCrop[name],
      (sum, item) => sum + parseFloat(item.cost_price),
      0
    );
    return { name, costs };
  });

  const dataCamp = Object.keys(dataByCamp).map((name) => {
    const costs = _.reduce(
      dataByCamp[name],
      (sum, item) => sum + parseFloat(item.cost_price),
      0
    );
    return { name, costs };
  });

  const dataItem = Object.keys(dataByItem).map((name) => {
    const costs = _.reduce(
      dataByItem[name],
      (sum, item) => sum + parseFloat(item.cost_price),
      0
    );
    return { name, costs };
  });

  const YearCostChart = ({ data }) => {
    const datas = {
      labels: data.map((row) => row.year),
      datasets: [
        {
          label: "Costos por Año",
          data: data.map((row) => row.costs),
          backgroundColor: ["rgba(10, 10, 155, 0.2)"],
          borderColor: ["rgba(10, 10, 155, 1)"],

          borderWidth: 2,
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        datalabels: {
          color: "black",
          anchor: "end",
          align: "start",
          offset: -17,
          font: {
            weight: "bold",
            size: "14",
          },
          formatter: (value, context) => {
            return `${value.toLocaleString("es-do", {
              style: "currency",
              currency: "DOP",
            })}`;
          },
        },
      },
    };
    return (
      <>
        <div className="header">
          <h1 className="font-weight-bold titulo_campos">Costos por Año</h1>
          <h3 className="font-weight-bold titulo_campos">
            {dateFitered[0]} {dateFitered[1]}
          </h3>
        </div>
        <Bar data={datas} options={options} />
      </>
    );
  };

  const MonthCostChart = ({ data }) => {
    const datas = {
      labels: data.map((row) => row.mes),
      datasets: [
        {
          label: "Costos por Mes",
          data: data.map((row) => row.costs),
          backgroundColor: ["rgba(153, 10, 155, 0.2)"],
          borderColor: ["rgba(153, 10, 155, 1)"],
          borderWidth: 2,
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        datalabels: {
          color: "black",
          anchor: "end",
          align: "start",
          offset: -17,
          font: {
            weight: "bold",
            size: "14",
          },
          formatter: (value, context) => {
            return `${value.toLocaleString("es-do", {
              style: "currency",
              currency: "DOP",
            })}`;
          },
        },
      },
    };
    return (
      <>
        <div className="header">
          <h1 className="font-weight-bold titulo_campos">Costos Por Mes</h1>
          <h3 className="font-weight-bold titulo_campos">
            {dateFitered[0]} {dateFitered[1]}
          </h3>
        </div>
        <Bar data={datas} options={options} />
      </>
    );
  };

  const ActividadCostChart = ({ data }) => {
    const datas = {
      labels: data.map((row) => row.activity),
      datasets: [
        {
          label: "Costo por Actividad",
          data: data.map((row) => row.costs),

          borderWidth: 2,
        },
      ],
    };
    /*
    const avg = _.mean(datas.datasets[0].data);
    
    const modifiedData = datas.datasets[0].data.map((d, i) => {
      if (d < (avg/2)) {        
        datas.labels[i]="Otros";
      }
      return d;
    });
    const newData = { ...datas };
    
    newData.datasets[0].data = modifiedData;
    */
    const options = {
      plugins: {
        datalabels: {
          color: "black",
          anchor: "end",
          align: "start",
          offset: -10,
          font: {
            weight: "bold",
            size: "14",
          },
          formatter: (value, context) => {
            return `$${value.toLocaleString("es-do", {
              style: "currency",
              currency: "DOP",
            })}`;
          },
        },
      },
    };
    return (
      <>
        <div className="header">
          <h1 className="font-weight-bold titulo_campos">
            Costo por Actividad
          </h1>
          <h3 className="font-weight-bold titulo_campos">
            {dateFitered[0]} {dateFitered[1]}
          </h3>
        </div>
        <Pie data={datas} options={options} />
      </>
    );
  };

  const PlantaCostChart = ({ data }) => {
    const datas = {
      labels: data.map((row) => row.name),
      datasets: [
        {
          label: "Costo por Actividad",
          data: data.map((row) => row.costs),
          borderWidth: 2,
        },
      ],
    };

    const options = {
      plugins: {
        datalabels: {
          color: "black",
          anchor: "end",
          align: "start",
          offset: -10,
          font: {
            weight: "bold",
            size: "14",
          },
          formatter: (value, context) => {
            return `$${value.toLocaleString("es-do", {
              style: "currency",
              currency: "DOP",
            })}`;
          },
        },
      },
    };
    return (
      <>
        <div className="header">
          <h1 className="font-weight-bold titulo_campos">Costo por Planta</h1>
          <h3 className="font-weight-bold titulo_campos">
            {dateFitered[0]} {dateFitered[1]}
          </h3>
        </div>
        <Pie data={datas} options={options} />
      </>
    );
  };

  const CultivoCostChart = ({ data }) => {
    const datas = {
      labels: data.map((row) => row.name),
      datasets: [
        {
          label: "Costo por Cultivo",
          data: data.map((row) => row.costs),
          borderWidth: 2,
        },
      ],
    };

    const options = {
      plugins: {
        datalabels: {
          color: "black",
          anchor: "end",
          align: "start",
          offset: -10,
          font: {
            weight: "bold",
            size: "14",
          },
          formatter: (value, context) => {
            return `$${value.toLocaleString("es-do", {
              style: "currency",
              currency: "DOP",
            })}`;
          },
        },
      },
    };
    return (
      <>
        <div className="header">
          <h1 className="font-weight-bold titulo_campos">Costo por Cultivo</h1>
          <h3 className="font-weight-bold titulo_campos">
            {dateFitered[0]} {dateFitered[1]}
          </h3>
        </div>
        <Pie data={datas} options={options} />
      </>
    );
  };

  const CampoCostChart = ({ data }) => {
    const datas = {
      labels: data.map((row) => row.name),
      datasets: [
        {
          label: "Costo por Campo",
          data: data.map((row) => row.costs),
          borderWidth: 2,
        },
      ],
    };

    const options = {
      plugins: {
        datalabels: {
          color: "black",
          anchor: "end",
          align: "start",
          offset: -10,
          font: {
            weight: "bold",
            size: "14",
          },
          formatter: (value, context) => {
            return `$${value.toLocaleString("es-do", {
              style: "currency",
              currency: "DOP",
            })}`;
          },
        },
      },
    };
    return (
      <>
        <div className="header">
          <h1 className="font-weight-bold titulo_campos">Costo por Campo</h1>
          <h3 className="font-weight-bold titulo_campos">
            {dateFitered[0]} {dateFitered[1]}
          </h3>
        </div>
        <Pie data={datas} options={options} />
      </>
    );
  };

  const ItemCostChart = ({ data }) => {
    const datas = {
      labels: data.map((row) => row.name),
      datasets: [
        {
          label: "Costo por Artículo",
          data: data.map((row) => row.costs),
          borderWidth: 2,
        },
      ],
    };

    const options = {
      plugins: {
        datalabels: {
          color: "black",
          anchor: "end",
          align: "start",
          offset: -10,
          font: {
            weight: "bold",
            size: "14",
          },
          formatter: (value, context) => {
            return `${value.toLocaleString("es-do", {
              style: "currency",
              currency: "DOP",
            })}`;
          },
        },
      },
    };

    return (
      <>
        <div className="header">
          <h1 className="font-weight-bold titulo_campos">Costo por Artículo</h1>
          <h3 className="font-weight-bold titulo_campos">
            {dateFitered[0]} {dateFitered[1]}
          </h3>
        </div>
        <Pie data={datas} options={options} />
      </>
    );
  };

  return (
    <>
      <div>
        <div className="button-section_parent ">
          <div>
            <div className="button-section_parent ">
              <button
                className="btn btn-outline-primary seccion_cultivos_btn-agr"
                onClick={() => {
                  navigate("/dash/reporteria");
                  setOcho(true);
                }}
              >
                Reporte de Costos
              </button>

              <button
                type="button"
                className="btn btn-outline-primary seccion_cultivos_btn-agr"
                onClick={() => setOcho(false)}
              >
                Grafica de Costos
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
      <div id={`${ocho ? "miDivB" : "miDivN"}`}>
        <h1 className="title">Reporte de Costos</h1>

        <div>{infoRender}</div>
      </div>
      <div id={`${!ocho ? "miDivB" : "miDivN"}`}>
        <div className="container needs-validation nuevo-cultivo-form">
          <div>
            <h1 className="title">Gráficas de costos</h1>
          </div>
          <div>
            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span> - </span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="row">
            <h3 className="col-2">
              <label htmlFor="year">Mensual</label>{" "}
              <input
                type="checkbox"
                name="year"
                checked={seis}
                onChange={(e) => setSeis(e.target.checked)}
              />
            </h3>
            <h3 className="col-2">
              <label htmlFor="mensual">Anual</label>{" "}
              <input
                type="checkbox"
                name="mensual"
                checked={siete}
                onChange={(e) => setSiete(e.target.checked)}
              />
            </h3>
            <h3 className="col-2">
              <label htmlFor="actividad">Actidades</label>{" "}
              <input
                type="checkbox"
                name="actividad"
                checked={uno}
                onChange={(e) => setUno(e.target.checked)}
              />
            </h3>
            <h3 className="col-2">
              <label htmlFor="planta">Plantas </label>{" "}
              <input
                type="checkbox"
                name="planta"
                checked={dos}
                onChange={(e) => setDos(e.target.checked)}
              />
            </h3>
            <h3 className="col-2">
              <label htmlFor="cultivo">Cultivos </label>{" "}
              <input
                type="checkbox"
                name="cultivo"
                checked={tres}
                onChange={(e) => setTres(e.target.checked)}
              />
            </h3>
            <h3 className="col-2">
              <label htmlFor="Campos">Campos </label>{" "}
              <input
                type="checkbox"
                name="Campos"
                checked={cuatro}
                onChange={(e) => setCuatro(e.target.checked)}
              />
            </h3>
            <h3 className="col-2">
              <label htmlFor="articulos">Artículos </label>{" "}
              <input
                type="checkbox"
                name="articulos"
                checked={cinco}
                onChange={(e) => setCinco(e.target.checked)}
              />
            </h3>
          </div>
        </div>
        <div className="container needs-validation nuevo-cultivo-form row">
          <div id={`${seis ? "miDivB" : "miDivN"}`} className="container col-6">
            <MonthCostChart data={dataMes} />
          </div>
          <div
            id={`${siete ? "miDivB" : "miDivN"}`}
            className="container col-6"
          >
            <YearCostChart data={dataYear} />
          </div>
        </div>
        <div className="container needs-validation nuevo-cultivo-form row">
          <div id={`${uno ? "miDivB" : "miDivN"}`} className="container col-6">
            <ActividadCostChart data={dataAct} />
          </div>
          <div id={`${dos ? "miDivB" : "miDivN"}`} className="container col-6">
            <PlantaCostChart data={dataPlant} />
          </div>
        </div>

        <div className="container needs-validation nuevo-cultivo-form row">
          <div id={`${tres ? "miDivB" : "miDivN"}`} className="container col-6">
            <CultivoCostChart data={dataCrop} />
          </div>

          <div
            id={`${cuatro ? "miDivB" : "miDivN"}`}
            className="container col-6"
          >
            <CampoCostChart data={dataCamp} />
          </div>
        </div>

        <div className="container needs-validation nuevo-cultivo-form row">
          <div
            id={`${cinco ? "miDivB" : "miDivN"}`}
            className="container col-6"
          >
            <ItemCostChart data={dataItem} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
