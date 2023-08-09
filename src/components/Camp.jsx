import "../../src/styles/registrar-actividad.css";
import {
  useGetCampsQuery,
  useUpdateCampMutation,
  useDeleteCampMutation,
} from "../features/fields/redux/campApiSlice";
import { useGetCropsQuery } from "../features/fields/redux/cropApiSlice";
import { memo } from "react";

import RemoveImg from "../images/remove.svg";
import Swal from "sweetalert2";

import { useEffect, useState } from "react";
import Modal from "react-modal";
import useAuth from "../hooks/useAuth";

Modal.setAppElement("#root");

const Crop = ({ campId }) => {
  const { data: crops } = useGetCropsQuery("cropsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  let Lista;
  let cont;
  if (crops) {
    const { ids, entities } = crops;
    Lista =
      ids?.length &&
      ids.map((id) => {
        if (entities[id].crop_camp_key == campId) {
          let plnt = `${entities[id].crop_name}`.split("-")[0];
          if (plnt !== "Plantilla") {
            return (
              <>
                <br />
                {entities[id].crop_name}{" "}
              </>
            );
          }
        }
      });
    cont = (
      <p className="card-text">
        <b>Cultivo: </b>
        {Lista}
      </p>
    );
  }
  return cont;
};

const Camp = ({ campId, Lista }) => {
  const { username, isManager, isAdmin } = useAuth();
  const { camp } = useGetCampsQuery("campsList", {
    selectFromResult: ({ data }) => ({
      camp: data?.entities[campId],
    }),
  });
  const [campName, setCampName] = useState(camp.camp_name);
  const [area, setArea] = useState(camp.camp_area);
  const [active, setActive] = useState(camp.camp_status);
  const [isOpen, setIsOpen] = useState(false);

  const [updateCamp, { isLoading, isSuccess, isError, error }] =
    useUpdateCampMutation();

  const [
    deleteCamp,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteCampMutation();
  const onCampNameChanged = (e) => {
    e.preventDefault();
    setCampName(e.target.value);
  };
  const onCampAreaChanged = (e) => {
    e.preventDefault();
    setArea(e.target.value);
  };

  const onCampChanged = async (e) => {
    e.preventDefault();
    await updateCamp({
      id: camp.camp_id,
      campName,
      area,
      active,
    });
  };

  const onActiveChanged = async (e) => {
    e.preventDefault();
    await updateCamp({
      id: camp.camp_id,
      campName,
      area,
      active: e.target.checked,
    });
  };

  const onDeleteCampClicked = async () => {
    Swal.fire({
      title: "¿Seguro de eliminar?",
      text: `Eliminar este Campo afectará todos los datos asociados a esta. Esta acción será irreversible.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteCamp({ id: camp.camp_id });
        Swal.fire("¡Eliminada!", "Este campo ha sido eliminada.", "success");
      }
    });
  };

  const handleClearClick = (e) => {
    e.preventDefault();
    setCampName(camp.camp_name);
    setArea(camp.camp_area);
    setActive(camp.camp_status);
  };
  useEffect(() => {
    if (camp) {
      setCampName(camp.camp_name);
      setArea(camp.camp_area);
      setActive(camp.camp_status);
    }
  }, [camp]);

  const actuCamp = (
    <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
      <button className="btn btn-danger" onClick={() => setIsOpen(false)}>
        Cerrar
      </button>
      <div className="cultivos_button-section">
        <form className="container myform col-6 needs-validation" novalidate>
          <div className="form-row bg-light">
            <div className="col-12 col-md-6 mb-2">
              <label for="nombre_cultivo">Nombre del campo</label>
              <input
                type="text"
                maxLength={20}
                className="form-control"
                id="nombre_cultivo"
                placeholder="Campo X"
                pattern="^([A-ZÑ]{1})([a-zñ\d]{0,20})(-?\s?([\wñ\d]{0,20})?){0,5}"
                value={campName}
                onChange={onCampNameChanged}
                required
              />
              <div className="error-message">
                <p>Formato incorrecto. ej: Campo X</p>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-2">
              <label for="variedad_cultivo">Área (tareas)</label>
              <input
                type="number"
                step="any"
                min={0}
                className="form-control"
                id="variedad_cultivo"
                value={area}
                onChange={onCampAreaChanged}
              />
            </div>
          </div>
          <div className="edit-campo-button-section_parent">
            <button
              type="submit"
              className="btn btn-outline-primary limpiar"
              onClick={onCampChanged}
            >
              Guardar Cambios
            </button>
            <button className="btn btn-danger" onClick={handleClearClick}>
              Retornar valor
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );

  if (camp) {
    const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

    if (isSuccess) {
      console.log(`no hay error ${errContent}`);
    }

    let contenido;
    if (Lista == "Lista1") {
      contenido = (
        <tr key={campId}>
          <td>{campName}</td>
          <td>{area} tareas</td>
          <td>
            <input
              type="checkbox"
              checked={camp.camp_status}
              onChange={onActiveChanged}
            />
          </td>
          {isAdmin && (
            <td>
              <img
                onClick={onDeleteCampClicked}
                className="remove-img"
                src={RemoveImg}
                alt="Remove"
              />
            </td>
          )}
          {isAdmin && <td onClick={() => setIsOpen(true)}>Editar</td>}
          {isAdmin && <>{actuCamp}</>}
        </tr>
      );
    }

    if (Lista == "Lista2") {
      contenido = (
        <div key={camp.camp_id} className="col-12 col-sm-6 col-md-4 col-xl-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{camp.camp_name}</h5>
              <p className="card-text">
                <b>Área: </b>
                {camp.camp_area} tareas
              </p>
              <Crop key={campId} campId={camp.camp_id} />
            </div>
          </div>
        </div>
      );
    }

    return contenido;
  } else return null;
};

const memoizedCamp = memo(Camp);

export default memoizedCamp;
