import React from "react";
import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
//import { filterBetween } from 'date-fns/fp';
import { isWithinInterval, parseISO } from "date-fns";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";

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
  function formatMonthYear(date) {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const options = { month: 'long' };
  const month = dateObj.toLocaleString('es', options);
    //const day = dateObj.getDate();

    return `${month}-${year}`;
  }

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

  const dataByCrop = _.groupBy(filteredData, "crop_name");

  // Agrupa los datos por actividad
  const dataByActivity = _.groupBy(filteredData, "act_name");

  const dataByCamp = _.groupBy(filteredData, "camp_name");

  const dataByItem = _.groupBy(filteredData, "item_name");

  const dataByPlant = _.groupBy(filteredData, "plant_name");

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




  const ActividadCostChart = ({data}) => {
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
  
    const options = {
      scales: {
        y: {
          beginAtZero: false,
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
        <Bar data={datas} options={options} />
      </>
    );
  };

  const PlantaCostChart = ({data}) => {
    const datas = {
      labels: data.map((row) => row.name),
      datasets: [
        {
          label: "Costo por Actividad",
          data: data.map((row) => row.costs),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)'
          ],
  
          borderWidth: 2,
        },
      ],
    };
  
    const options = {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    };
    return (
      <>
        <div className="header">
          <h1 className="font-weight-bold titulo_campos">
            Costo por Planta
          </h1>
          <h3 className="font-weight-bold titulo_campos">
            {dateFitered[0]} {dateFitered[1]}
          </h3>
        </div>
        <Bar data={datas} options={options} />
      </>
    );
  };

  const CultivoCostChart = ({data}) => {
    const datas = {
      labels: data.map((row) => row.name),
      datasets: [
        {
          label: "Costo por Cultivo",
          data: data.map((row) => row.costs),
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)'
          ],
  
          borderWidth: 2,
        },
      ],
    };
  
    const options = {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    };
    return (
      <>
        <div className="header">
          <h1 className="font-weight-bold titulo_campos">
            Costo por Cultivo
          </h1>
          <h3 className="font-weight-bold titulo_campos">
            {dateFitered[0]} {dateFitered[1]}
          </h3>
        </div>
        <Bar data={datas} options={options} />
      </>
    );
  };

  const CampoCostChart = ({data}) => {
    const datas = {
      labels: data.map((row) => row.name),
      datasets: [
        {
          label: "Costo por Campo",
          data: data.map((row) => row.costs),
          backgroundColor: [
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(153, 102, 255, 1)'
          ],
  
          borderWidth: 2,
        },
      ],
    };
  
    const options = {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    };
    return (
      <>
        <div className="header">
          <h1 className="font-weight-bold titulo_campos">
            Costo por Campo
          </h1>
          <h3 className="font-weight-bold titulo_campos">
            {dateFitered[0]} {dateFitered[1]}
          </h3>
        </div>
        <Bar data={datas} options={options} />
      </>
    );
  };

  const ItemCostChart = ({data}) => {
    const datas = {
      labels: data.map((row) => row.name),
      datasets: [
        {
          label: "Costo por Artículo",
          data: data.map((row) => row.costs),
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)'
          ],
  
          borderWidth: 2,
        },
      ],
    };
  
    const options = {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    };
    return (
      <>
        <div className="header">
          <h1 className="font-weight-bold titulo_campos">
            Costo por Artículo
          </h1>
          <h3 className="font-weight-bold titulo_campos">
            {dateFitered[0]} {dateFitered[1]}
          </h3>
        </div>
        <Bar data={datas} options={options} />
      </>
    );
  };

  
  


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
      <div className="title">Reporte General</div>
      <div className="container needs-validation nuevo-cultivo-form">
        <div className="form-row"></div>
      </div>

      <div>{infoRender}</div>
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
          <label htmlFor="actividad">Actidades</label>
          {' '}
          <input type="checkbox" name="actividad" checked={uno} onChange={(e)=>setUno(e.target.checked)} />
          </h3>
          <h3 className="col-2">

          <label htmlFor="planta">Plantas{' '}</label>
          {' '}
          <input type="checkbox" name="planta" checked={dos} onChange={(e)=>setDos(e.target.checked)} />
          </h3>
          <h3 className="col-2">
          <label htmlFor="cultivo">Cultivos{' '}</label>
          {' '}
          <input type="checkbox" name="cultivo" checked={tres} onChange={(e)=>setTres(e.target.checked)} />
          </h3>
          <h3 className="col-2">
          <label htmlFor="Campos">Campos{' '}</label>
          {' '}
          <input type="checkbox" name="Campos" checked={cuatro} onChange={(e)=>setCuatro(e.target.checked)} />
          </h3>
          <h3 className="col-2">
          <label htmlFor="articulos">Artículos{' '}</label>
          {' '}
          <input type="checkbox" name="articulos" checked={cinco} onChange={(e)=>setCinco(e.target.checked)} />
          </h3>
          
        </div>
      </div>
      <div id={`${uno?'miDivB':'miDivN'}`} className="container needs-validation nuevo-cultivo-form">
        <ActividadCostChart data={dataAct} />
      </div>
      <div id={`${dos?'miDivB':'miDivN'}`} className="container needs-validation nuevo-cultivo-form">
        <PlantaCostChart data={dataPlant} />
      </div>

      <div id={`${tres?'miDivB':'miDivN'}`} className="container needs-validation nuevo-cultivo-form">
        <CultivoCostChart data={dataCrop} />
      </div>

      <div id={`${cuatro?'miDivB':'miDivN'}`} className="container needs-validation nuevo-cultivo-form">
        <CampoCostChart data={dataCamp} />
      </div>

      <div id={`${cinco?'miDivB':'miDivN'}`} className="container needs-validation nuevo-cultivo-form">
        <ItemCostChart data={dataItem} />
      </div>
    </>
  );
};

export default Report;
