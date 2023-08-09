import "../../src/styles/registrar-actividad.css";
import {
  useGetItemsQuery,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from "../features/fields/redux/itemApiSlice";
import { useGetDosesQuery } from "../features/fields/redux/doseApiSlice";
import { memo, useState, useEffect } from "react";
import RemoveImg from "../images/remove.svg";
import Swal from "sweetalert2";
import Modal from "react-modal";
import useAuth from "../hooks/useAuth";

Modal.setAppElement("#root");

const ITEM_REGEX = /^([A-ZÑ]{1})([a-zñ\d]{0,20})(-?\s?([\wñ\d]{0,20})?){0,5}/;

const DESC_REGEX =
  /^([A-ZÑ]{1})([a-zñ\d]{0,20})(-?\s?\.?,?([\wñ\d]{0,20})?){0,50}/;
const Dose = ({ doseId }) => {
  const { dose } = useGetDosesQuery("dosesList", {
    selectFromResult: ({ data }) => ({
      dose: data?.entities[doseId],
    }),
  });

  if (dose) {
    return (
      <>
        <td>{dose.dose_name}</td>
        <td>{dose.dose_unit}</td>
      </>
    );
  }
};

const Item = ({ itemId }) => {
  const { username, isManager, isAdmin } = useAuth();
  const { item } = useGetItemsQuery("itemsList", {
    selectFromResult: ({ data }) => ({
      item: data?.entities[itemId],
    }),
  });
  const { data: doses } = useGetDosesQuery("dosesList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const [updateItem, { isLoading, isSuccess: itemUpSuc, isError, error }] =
    useUpdateItemMutation();

  const [
    deleteItem,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteItemMutation();

  if (item) {
    const [itemName, setItemName] = useState(item.item_name);
    const [itemPrice, setItemPrice] = useState(item.item_price);
    const [desc, setDesc] = useState(item.item_desc);
    const [itemDose, setItemDose] = useState(item.item_dose_key);
    const [active, setActive] = useState(item.item_status);
    const [isOpen, setIsOpen] = useState(false);
    const [validItemName, setValidItemName] = useState(false);
    const [validDesc, setValidUnit] = useState(false);
    useEffect(() => {
      setValidItemName(ITEM_REGEX.test(itemName));
    }, [itemName]);
    useEffect(() => {
      setValidUnit(DESC_REGEX.test(desc));
    }, [desc]);
    const canSave =
      [validItemName, desc ? validDesc : true].every(Boolean) && !isLoading;

    const onItemNameChanged = (e) => setItemName(e.target.value);
    const onItemPriceChanged = (e) => setItemPrice(e.target.value);
    const onItemDescChanged = (e) => setDesc(e.target.value);
    const onItemDoseChanged = (e) => setItemDose(e.target.value);

    const onActiveChanged = async (e) => {
      await updateItem({
        id: item.item_id,
        itemName,
        itemPrice,
        desc,
        itemDose,
        active: e.target.checked,
      });
    };
    const onItemChanged = async (e) => {
      e.preventDefault();
      if (canSave) {
        await updateItem({
          id: item.item_id,
          itemName,
          itemPrice,
          desc,
          itemDose,
          active,
        });
      }

      setIsOpen(false);
    };

    const onDeleteItemClicked = async () => {
      Swal.fire({
        title: "¿Seguro de eliminar?",
        text: `Eliminar este cultivo afectará todos los datos asociados a este. Esta acción será irreversible.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar!",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteItem({ id: item.item_id });
          Swal.fire(
            "¡Eliminado!",
            "Este cultivo ha sido eliminado.",
            "success"
          );
        }
      });
    };
    const handleClearClick = (e) => {
      e.preventDefault();
      setItemName(item.item_name);
      setItemPrice(item.item_price);
      setDesc(item.item_desc);
      setItemDose(item.item_dose_key);
      setActive(item.item_status);
    };

    useEffect(() => {
      if (item) {
        setItemName(item.item_name);
        setItemPrice(item.item_price);
        setDesc(item.item_desc);
        setItemDose(item.item_dose_key);
        setActive(item.item_status);
      }
    }, [item]);

    let doseOption;
    if (doses) {
      const { ids, entities } = doses;

      doseOption = ids.map((Id) => {
        if (entities[Id].dose_status) {
          return <option value={Id}>{entities[Id].dose_name}</option>;
        }
      });
    }

    let precio = new Intl.NumberFormat("es-do", {
      style: "currency",
      currency: "DOP",
    }).format(parseFloat(itemPrice));

    const updItem = (
      <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          setIsOpen(false);
          setItemName(item.item_name);
          setItemPrice(item.item_price);
          setDesc(item.item_desc);
          setItemDose(item.item_dose_key);
          setActive(item.item_status);
        }}
      >
        <button
          className="btn btn-danger"
          onClick={() => {
            setIsOpen(false);
            setItemName(item.item_name);
            setItemPrice(item.item_price);
            setDesc(item.item_desc);
            setItemDose(item.item_dose_key);
            setActive(item.item_status);
          }}
        >
          Cerrar
        </button>
        <div className="cultivos_button-section">
          <form
            className="container needs-validation nuevo-cultivo-form"
            onSubmit={onItemChanged}
          >
            <div className="form-row bg-light">
              <div className="col-md-4 mb-3">
                <label htmlFor="nombre_cultivo">Nombre del Artículo</label>
                <input
                  type="text"
                  maxLength={30}
                  className="form-control"
                  placeholder="Articulo X o Articulo-X"
                  pattern="^([A-ZÑ]{1})([a-zñ\d]{0,20})(-?\s?([\wñ\d]{0,20})?){0,5}"
                  value={itemName}
                  onChange={onItemNameChanged}
                  required
                />
                <div className="error-message">
                  <p>Formato incorrecto. Ej: [Item-##] [Item ##]</p>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="col-md-3 mb-3">
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
            </div>
            <div className="form-row bg-light">
              <div className="col-12 col-md-6 mb-2">
                <label htmlFor="variedad_cultivo">Precio del Artículo</label>
                <input
                  type="number"
                  step="any"
                  min={0}
                  max={1000000}
                  className="form-control"
                  id="variedad_cultivo"
                  value={itemPrice}
                  onChange={onItemPriceChanged}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="producto_final">Descripción del Artículo</label>
                <input
                  type="text"
                  maxLength={200}
                  className="form-control"
                  pattern="^([A-ZÑ]{1})([a-zñ\d]{0,20})(-?\s?\.?,?([\wñ\d]{0,20})?){0,50}"
                  value={desc}
                  onChange={onItemDescChanged}
                />
                <div className="error-message">
                  <p>No se admiten caracteres especiales, solo [.] [-] [,]</p>
                </div>
              </div>
            </div>
            <div className="cultivos_button-section">
              <button
                className="btn btn-success"
                disabled={!canSave}
                type="submit"
              >
                Guardar Cambios
              </button>
              <button
                onClick={handleClearClick}
                className="btn btn-outline-danger limpiar"
              >
                Retornar valor
              </button>
            </div>
          </form>
        </div>
      </Modal>
    );

    const itemname = itemName ? itemName : "no tiene";

    const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

    const contenido = (
      <tr key={itemId}>
        <td>
          <div type="button">{itemname}</div>
        </td>
        <>
          <Dose key={itemDose} doseId={itemDose} />
        </>
        <td>{precio}</td>
        {(isManager || isAdmin) && (
          <td>
            <input
              type="checkbox"
              checked={item.item_status}
              onChange={onActiveChanged}
            />
          </td>
        )}
        {isAdmin && (
          <td>
            <img
              onClick={onDeleteItemClicked}
              className="remove-img"
              src={RemoveImg}
              alt="Remove"
            />
          </td>
        )}
        {isAdmin && <td onClick={() => setIsOpen(true)}>Editar</td>}
        {isAdmin && <>{updItem}</>}
      </tr>
    );

    return contenido;
  } else return null;
};

const memoizedItem = memo(Item);

export default memoizedItem;
