import React from "react";
import "../../styles/proximas.css";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import focusClick from "../../components/DashHeader";
import { Grid, _ } from "gridjs-react";
import { useGetDatesQuery } from "./redux/appApiSlice";
import useAuth from "../../hooks/useAuth";
import AppDate from "../../components/AppDate";
import { useNavigate } from "react-router-dom";
import { h } from "gridjs";

const navProximas = () => {
  const { username, isManager, isAdmin, userId } = useAuth();
  const navigate = useNavigate();

  const { dates } = useGetDatesQuery("datesList", {
    selectFromResult: ({ data }) => ({
      dates: data?.ids?.map((Id) => {
        if (isAdmin) {
          return data?.entities[Id];
        } else {
          if (data?.entities[Id].date_user_key == userId) {
            return data?.entities[Id];
          }
        }
      }),
    }),
  });

  let dateList;
  let dateTable;

  if (dates) {
    dateList =
      dates?.length &&
      dates.map((date) => {
        if (date?.date_end == null) {
          let plnt = `${date?.crop_name}`.split("-")[0];
          if (plnt !== "Plantilla") {
            return (
              <AppDate
                key={date?.date_id}
                dateId={date?.date_id}
                Lista={"Lista2"}
              />
            );
          }
        }
      });

    dateTable = (
      <Grid
        columns={[
          {
            name: "Actividad",
            id: "acti",
          },
          { name: "Cultivo", id: "cult" },
          { name: "Campo", id: "camp" },
          {
            name: "Fecha programada",
            id: "fech",
          },
          {
            name: "Responsable",
            id: "rep",
          },
        ]}
        data={
          dates?.length &&
          dates.map((date) => {
            let plnt = `${date?.crop_name}`.split("-")[0];
            let fecha =
              `${date?.date_init}` == "null"
                ? "no asignada"
                : `${date?.date_init}`.split("T")[0];
            if (plnt !== "Plantilla") {
              return {
                acti: date?.act_name,
                cult: date?.crop_name,
                camp: date?.camp_name,
                fech: fecha,
                rep: date?.user_nombre ? date?.user_nombre : date?.user_name,
              };
            }
          })
        }
        search={true}
        pagination={{
          limit: 10,
        }}
        sort={true}
        className={{
          table:
            "table table-hover table-sm table-striped table-responsive-sm table-bordered",
          thead: "thead-loyola",
          th: "align-middle",
          search: "form-control",
        }}
        fixedHeader={true}
      />
    );
  }
  return (
    <>
      {" "}
      <p className="titulo_proximas_actividades">
        Estas son las próximas actividades a realizar en la finca, de todos los
        campos y cultivos
      </p>
      {/*
     
      <div className="table-container col-12 col-md-10 col-lg-8">
        <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
          <thead className="thead-loyola">
            <tr>
              <th className="align-middle" scope="col">
                Actividad
              </th>
              <th className="align-middle" scope="col">
                Cultivo
              </th>
              <th className="align-middle" scope="col">
                Campo
              </th>
              <th className="align-middle" scope="col">
                Fecha programada
              </th>
              <th className="align-middle" scope="col">
                Responsable
              </th>
            </tr>
          </thead>
          <tbody>{dateList}</tbody>
        </table>
      </div>*/}
      <div className="table-container col-12 col-md-10 col-lg-8">
        {dateTable}
      </div>
    </>
  );
};
export default navProximas;
