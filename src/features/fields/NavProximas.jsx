import React, { useState, useEffect } from "react";
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

  const { dates, isSuccess } = useGetDatesQuery("datesList", {
    selectFromResult: ({ data }) => ({
      dates: data?.ids?.map((Id) => {
        if (isAdmin) {
          return data?.entities[Id];
        } else if(isManager){
          if (data?.entities[Id].crop_user_key == userId || data?.entities[Id].date_user_key == userId) {
            return data?.entities[Id];
          }
        } else {
          if (data?.entities[Id].date_user_key == userId) {
            return data?.entities[Id];
          }
        }
      }),
    }),
  });
  let dateTable=<></>;
  if (dates) {
    const row = dates?.length &&
    dates.map((date) => {
      let plnt = `${date?.crop_name}`.split("-")[0];
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

      if (plnt !== "Plantilla") {
        if (date) {
          return [actNma, cropNma, campNma, fecha, nomnb];
        }
        
      }
    });




const rowF = row.filter((data)=>data!==undefined)

if (rowF) {
  dateTable = (
    <Grid
      columns={[
        {
          name: "Actividad",
        },
        { name: "Cultivo" },
        { name: "Campo" },
        {
          name: "Fecha programada",
        },
        {
          name: "Responsable",
        },
      ]}
      data={rowF}
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
  }

  
  return (
    <>
      {" "}
      <p className="titulo_proximas_actividades">
        Estas son las próximas actividades a realizar en la finca, de todos los
        campos y cultivos
      </p>
     
      <div className="table-container col-12 col-md-10 col-lg-8">
        {dateTable}
      </div>
    </>
  );
};
export default navProximas;
