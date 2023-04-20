import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetDatesQuery } from "./redux/appApiSlice";
import { useGetItemsQuery } from "./redux/itemApiSlice";
import { useGetCostsQuery, useAddNewCostMutation } from "./redux/costApiSlice";
import { useGetComtsQuery, useAddNewComtMutation } from "./redux/comtApiSlice";
import { useGetCropsQuery } from "./redux/cropApiSlice";
import { Link } from "react-router-dom";
import { Collapse } from "react-collapse";
import ReImage from "../../images/return.svg";
import Cost from "../../components/Cost";
import AppDate from "../../components/AppDate";
import Comt from "../../components/Comt";
import useAuth from "../../hooks/useAuth";

const Report = () => {
  /*
  const {
    data: costs,
    isError: costIsError,
    error: costError,
  } = useGetCostsQuery("costsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { date } = useGetDatesQuery("datesList", {
    selectFromResult: ({ data }) => ({
      date: data?.entities[id],
    }),
  });
  const { data: items } = useGetItemsQuery("itemsList");
  const { crop } = useGetCropsQuery("cropsList", {
    selectFromResult: ({ data }) => ({
      crop: data?.entities[date?.date_crop_key],
    }),
  });

  const onItemCostChanged = (e) => {
    e.preventDefault();
    setItemCostKey(e.target.value);
    if (items) {
      const { entities } = items;
      setItemPrecioKey(`${entities[e.target.value].item_price}`);
      setItemDoseKey(`${entities[e.target.value].dose_name}`);
    }
  };
  const onCostQuantityChanged = (e) => {
    e.preventDefault();
    setCostQuantityKey(e.target.value);
  };

  const onAddCostClicked = async (e) => {
    e.preventDefault();
  };
  //  costItemKey, costQuantity, costDateKey
  const handleClearClick = (e) => {};

  let costList;
  let costTotal = [];
  if (costs) {
    const { ids, entities } = costs;

    costList =
      ids?.length &&
      ids.map((Id) => {
        if (entities[Id].cost_date_key == id) {
          let list = <Cost key={Id} costId={Id} Lista={"Lista1"} />;
          costTotal.push(parseFloat(entities[Id].cost_price));
          return list;
        }
      });
  }
  let TT = costTotal.reduce((valorAnterior, valorActual) => {
    return valorAnterior + valorActual;
  }, 0);
  let precioTT = new Intl.NumberFormat("es-do", {
    style: "currency",
    currency: "DOP",
  }).format(parseFloat(TT));

  let contentApp;

  let precio = new Intl.NumberFormat("es-do", {
    style: "currency",
    currency: "DOP",
  }).format(parseFloat(itemPrecio));
*/
  return (
    <>
      <div className="font-weight-bold titulo_campos">Reporteria</div>
    </>
  );
};

export default Report;
