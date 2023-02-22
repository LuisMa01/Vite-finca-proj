import React from "react";
import "../../styles/nav_cultivos.css";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import "../../styles/item-section.css";
import { useGetItemsQuery, useAddNewItemMutation } from "./redux/itemApiSlice";
import { useState, useEffect } from "react";
import Item from "../../components/Item";

const ItemSection = () => {
  const {
    data: items,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetItemsQuery("itemsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [
    addNewItem,
    { isSuccess: addissuccess, isError: addiserror, error: adderror },
  ] = useAddNewItemMutation();

  const [itemName, setItemName] = useState("");
  const [desc, setDesc] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemDose, setItemDose] = useState("");

  //itemName, desc, itemPrice, itemDose 

  const onSavePlantClicked = async (e) => {
    e.preventDefault();

    await addNewItem({ itemName, desc, itemPrice, itemDose });
  };

  const onItemNameChanged = (e) => setItemName(e.target.value);
  const onItemDescChanged = (e) => setDesc(e.target.value);
  const onItemPriceChanged = (e) => setItemPrice(e.target.value);
  const onItemDoseChanged = (e) => setItemDose(e.target.value);
  useEffect(() => {
    if (addissuccess) {
      setItemName("");
      setDesc("");
      setItemPrice("");
      setItemDose("");
    }
  }, [addissuccess]);

  return (
    <>
      <div className="return-div">
        <Link to={"/dash/cultivos"}>
          <div className="return-button">
            <img className="return-button-img" src={ReImage} alt="Atrás" />
          </div>
        </Link>
      </div>
      <h1 className="item-section_titulo">Materiales y mano de obra</h1>
      <p>
        <i>Ventana en desarrollo...</i>
      </p>
    </>
  );
};

export default ItemSection;
