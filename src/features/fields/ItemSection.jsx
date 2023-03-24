import React from "react";
import "../../styles/nav_cultivos.css";
import ReImage from "../../images/return.svg";
import { Link } from "react-router-dom";
import "../../styles/item-section.css";
import { useGetItemsQuery, useAddNewItemMutation } from "./redux/itemApiSlice";
import { useGetDosesQuery } from "./redux/doseApiSlice";
import { useState, useEffect } from "react";
import Item from "../../components/Item";
import Modal from "react-modal";
import DoseSection from "./DoseSection";
import useAuth from "../../hooks/useAuth";

Modal.setAppElement("#root");

const ItemSection = () => {
  const { username, isManager, isAdmin } = useAuth();
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
  const { data: doses } = useGetDosesQuery("dosesList", {
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
  const [isOpen, setIsOpen] = useState(false);

  //itemName, desc, itemPrice, itemDose

  const onSaveItemClicked = async (e) => {
    e.preventDefault();

    await addNewItem({ itemName, desc, itemPrice, itemDose });
  };

  const onItemNameChanged = (e) => setItemName(e.target.value);
  const onItemDescChanged = (e) => setDesc(e.target.value);
  const onItemPriceChanged = (e) => {
    setItemPrice(e.target.value);
  };
  const onItemDoseChanged = (e) => setItemDose(e.target.value);
  useEffect(() => {
    if (addissuccess) {
      setItemName("");
      setDesc("");
      setItemPrice("");
      setItemDose("");
    }
  }, [addissuccess]);

  let doseOption;
  if (doses) {
    const { ids, entities } = doses;

    doseOption = ids.map((Id) => {
      if (entities[Id].dose_status) {
        return (
          <option key={Id} value={Id}>
            {entities[Id].dose_name}
          </option>
        );
      }
    });
  }

  let content;
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
    console.log(error?.data?.message);
  }

  if (items) {
    const { ids } = items;

    let tableContent =
      ids?.length && ids.map((Id) => <Item key={Id} itemId={Id} />);

    content = (
      <div className="ventana_plantillas">
        <p className="subheader font-weight-bold">Lista de Artículos</p>
        <div className="table-container-1">
          <table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
            <thead className="thead-loyola">
              <th className="align-middle" scope="col">
                Artículos
              </th>
              <th className="align-middle" scope="col">
                Dosis
              </th>
              <th className="align-middle" scope="col">
                Unidad
              </th>
              <th className="align-middle" scope="col">
                Precio
              </th>
              {(isManager || isAdmin) && (
                <th className="align-middle" scope="col">
                  Estatus
                </th>
              )}
              {isAdmin && (
                <th className="align-middle" scope="col">
                  Eliminar
                </th>
              )}
              {isAdmin && (
                <th className="align-middle" scope="col">
                  Editar
                </th>
              )}
            </thead>
            <tbody>{tableContent}</tbody>
          </table>
        </div>
      </div>
    );
  }

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
      <p className="subheader font-weight-bold">Crear Artículo</p>
      <div className=" container col-md-3 mb-3 item-button">
        <button
          className=" btn btn-outline-secondary"
          onClick={() => setIsOpen(true)}
        >
          Crear Nueva Dosis
        </button>
      </div>
      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        <button className="btn btn-danger" onClick={() => setIsOpen(false)}>
          Cerrar
        </button>
        <DoseSection />
      </Modal>
      {(isAdmin) && 
      <form className="container col-12 col-sm-11 col-lg-9 bg-light needs-validation nuevo-cultivo-form">
        <div className="form-row bg-light">
          <div className="col-md-4 mb-3">
            <label htmlFor="nombre_cultivo">Nombre del Artículo</label>
            <input
              type="text"
              className="form-control"
              placeholder="Articulo X"
              value={itemName}
              onChange={onItemNameChanged}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="campo_cultivo">Dosis y Unidad</label>
            <select
              className="form-control"
              value={itemDose}
              onChange={onItemDoseChanged}
            >
              <option disabled value={""}>
                Elegir dosis
              </option>
              {doseOption}
            </select>
          </div>
          <div className="col-12 col-md-4 mb-2">
            <label htmlFor="variedad_cultivo">Precio del Artículo</label>
            <input
              type="number"
              step="any"
              min={0}
              className="form-control"
              id="variedad_cultivo"
              value={itemPrice}
              onChange={onItemPriceChanged}
            />
          </div>
        </div>

        <div className="form-row bg-light">
          <div className="col-12 mb-3">
            <label htmlFor="producto_final">Descripción del Artículo</label>
            <input
              type="text"
              class="form-control"
              value={desc}
              onChange={onItemDescChanged}
            />
          </div>
        </div>
        <div className="cultivos_button-section">
          <button
            className="btn btn-success"
            onClick={onSaveItemClicked}
            type="submit"
          >
            Guardar Item
          </button>
          <Link to={"/dash/cultivos"} className="Link">
            <button className="btn btn-danger">Descartar</button>
          </Link>
        </div>
      </form>}
      <hr />
      {content}
    </>
  );
};

export default ItemSection;
