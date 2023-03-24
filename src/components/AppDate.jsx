//import { useNavigate } from 'react-router-dom'
import "../../src/styles/registrar-actividad.css";
import {
  useGetDatesQuery,
  useUpdateDateMutation,
  useDeleteDateMutation,
} from "../features/fields/redux/appApiSlice";
import { useEffect, useState } from "react";
import { useGetActsQuery } from "../features/fields/redux/actApiSlice";
import { useGetUsersQuery } from "../features/fields/redux/usersApiSlice";
import { useGetCropsQuery } from "../features/fields/redux/cropApiSlice";
import { useGetCampsQuery } from "../features/fields/redux/campApiSlice";
import { useNavigate } from "react-router-dom";
import { memo } from "react";
import { Link } from "react-router-dom";
import RemoveImg from "../images/remove.svg";
import Swal from "sweetalert2";
import { ROLES } from "../config/roles";
import Modal from "react-modal";
import useAuth from "../hooks/useAuth";

Modal.setAppElement("#root");

const Crop = ({ cropId }) => {
  const { crop } = useGetCropsQuery("cropsList", {
    selectFromResult: ({ data }) => ({
      crop: data?.entities[cropId],
    }),
  });

  if (crop) {
    return <>{crop.crop_name}</>;
  }
};
const Camp = ({ campId }) => {
  const { camp } = useGetCampsQuery("campsList", {
    selectFromResult: ({ data }) => ({
      camp: data?.entities[campId],
    }),
  });

  if (camp) {
    return <>{camp.camp_name}</>;
  }
};
const Act = ({ actId }) => {
  const { act } = useGetActsQuery("actsList", {
    selectFromResult: ({ data }) => ({
      act: data?.entities[actId],
    }),
  });

  if (act) {
    return <>{act.act_name ? act.act_name : "sin nombre"}</>;
  }
};
const User = ({ userId }) => {
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  if (user) {
    return <>{user.user_nombre ? user.user_nombre : user.user_name}</>;
  }
};

const AppDate = ({ dateId, Lista }) => {
  const { username, isManager, isAdmin } = useAuth();
  const { date } = useGetDatesQuery("datesList", {
    selectFromResult: ({ data }) => ({
      date: data?.entities[dateId],
    }),
  });
  //console.log(dateId);
  const { data: rpuser } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  if (date) {
    const [actKey, setActKey] = useState(date.date_act_key);
    const [dateInit, setDateInit] = useState(date.date_init);
    const [dateEnd, setDateEnd] = useState(date.date_end);
    const [cropKey, setCropKey] = useState(date.date_crop_key);
    const [plantId, setPlantKey] = useState(date.crop_plant_key);
    const [userRep, setUserRep] = useState(date.date_user_key);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    let plntCrop = `${date.crop_name}`.split("-")[0];
    const [updateDate, { isLoading, isSuccess, isError, error }] =
      useUpdateDateMutation();

    const [
      deleteDate,
      { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
    ] = useDeleteDateMutation();

    // id, dateInit, dateEnd, actKey, cropKey, plantId, userRep
    const onDeleteDateClicked = async () => {
      Swal.fire({
        title: "¿Seguro de eliminar?",
        text: `Eliminar esta actividad afectará todos los datos asociados a esta. Esta acción será irreversible.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar!",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteDate({ id: date.date_id });
          if (isDelSuccess) {
            Swal.fire(
              "¡Eliminada!",
              "Esta actividad ha sido eliminada.",
              "success"
            );
          }
          if (isDelError) {
            Swal.fire("¡No se pudo eliminar!", `${delerror?.data?.message}.`);
          }
        }
      });
    };

    const onDateInitChanged = (e) => {
      e.preventDefault();
      setDateInit(e.target.value);
    };
    const enlace = (e) => {
      e.preventDefault();
      if (plntCrop !== "Plantilla") {
        navigate(`/dash/cultivos/info-app/${dateId}`);
      }
    };
    const onDateEndChanged = (e) => {
      e.preventDefault();
      setDateEnd(e.target.value);
    };
    const onUserRepChanged = (e) => {
      e.preventDefault();
      setUserRep(e.target.value);
    };
    const onActiveChanged = async (e) => {
      e.preventDefault();
      await updateDate({
        id: dateId,
        dateInit,
        dateEnd,
        actKey,
        plantId,
        userRep,
      });
    };
    //id, dateInit, dateEnd, actKey, plantId, userRep
    const handleClearClick = (e) => {
      e.preventDefault();
      setActKey(date.date_act_key);
      setDateInit(date.date_init);
      setDateEnd(date.date_end);
      setUserRep(date.date_user_key);
    };
    useEffect(() => {
      if (date) {
        setIsOpen(false);
        setActKey(date.date_act_key);
        setDateInit(date.date_init);
        setDateEnd(date.date_end);
        setUserRep(date.date_user_key);
        setPlantKey(date.crop_plant_key);
        setCropKey(date.date_crop_key);
        plntCrop = `${date.crop_name}`.split("-")[0];
      }
    }, [date]);

    let userOption;
    if (rpuser) {
      const { ids, entities } = rpuser;

      userOption = ids.map((Id) => {
        if (entities[Id].user_status) {
          return (
            <option key={Id} value={entities[Id].user_id}>
              {entities[Id].user_nombre
                ? entities[Id].user_nombre
                : entities[Id].user_name}
            </option>
          );
        }
      });
    }
    const fechaIni = dateInit == "null" ? "" : `${dateInit}`.split("T")[0];

    const fechaFin = dateEnd == "null" ? "" : `${dateEnd}`.split("T")[0];

    const updateApp = (
      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        <button className="btn btn-danger" onClick={() => setIsOpen(false)}>
          Cerrar
        </button>
        <div className="cultivos_button-section">
          <Act key={actKey} actId={actKey} />
          <form>
            <div className="new-activity-miniform d-flex justify-content-center col-12 col-md-10 col-xl-9 form-row bg-light">
              <div className="col-md-6 col-lg-3 mb-3">
                <label htmlFor="campo_cultivo">Responsable</label>
                <select
                  className="form-control"
                  value={userRep}
                  onChange={onUserRepChanged}
                >
                  <option disabled value={""}>
                    Elegir Responsable
                  </option>
                  {userOption}
                </select>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <label htmlFor="siembra_cultivo">Fecha de Programada</label>
                <input
                  type="date"
                  className="form-control"
                  value={fechaIni}
                  onChange={onDateInitChanged}
                />
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <label htmlFor="siembra_cultivo">Fecha de Ejecución</label>
                <input
                  type="date"
                  className="form-control"
                  value={fechaFin}
                  onChange={onDateEndChanged}
                />
              </div>

              <div className="cultivos_button-section">
                <button
                  className="btn btn-success"
                  onClick={onActiveChanged}
                  type="submit"
                >
                  Guardar Cambios
                </button>
                <button className="btn btn-danger" onClick={handleClearClick}>
                  Limpiar
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    );

    //const handleEdit = () => navigate(`/dash/users/${actId}`)

    const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

    //console.log(`${user.user_id} ${userName} ${userRolesString} ${active} ${errContent}`);
    if (isSuccess) {
      console.log(`no hay error ${errContent}`);
    }
    let contenido;
    if (Lista == "Lista1") {
      contenido = (
        <tr key={dateId}>
          <td>
            <div type="button" onClick={enlace}>
              <Act key={actKey} actId={actKey} />
            </div>
          </td>
          <td>{fechaIni == "null" ? "no fecha asignada" : fechaIni}</td>

          <td>{fechaFin == "null" ? "no fecha asignada" : fechaFin}</td>
          <td>
            <User key={userRep} userId={userRep} />
          </td>
          {(isAdmin) &&
          <td>
            <img
              onClick={onDeleteDateClicked}
              className="remove-img"
              src={RemoveImg}
              alt="Remove"
            />
          </td>}
          {(isManager || isAdmin) &&
          <td
            onClick={() => {
              if (plntCrop !== "Plantilla") {
                setIsOpen(true);
              }
            }}
          >
            Editar
          </td>}
          {(isManager || isAdmin) && <>{updateApp}</>}
        </tr>
      );
    }
    if (Lista == "Lista2") {
      contenido = (
        <tr key={dateId}>
          <td>
            <div type="button" onClick={enlace}>
              <Act key={actKey} actId={actKey} />
            </div>
          </td>
          <td>
            <Link to={`/dash/cultivos/info-cultivo/${date.date_crop_key}`}>
              <Crop key={date.date_crop_key} cropId={date.date_crop_key} />
            </Link>
          </td>
          <td>
            <Link to={`/dash/campos`}>
              <Camp key={date.crop_camp_key} campId={date.crop_camp_key} />
            </Link>
          </td>

          <td>{fechaIni == "null" ? "no fecha asignada" : fechaIni}</td>
          <td>
            <User key={userRep} userId={userRep} />
          </td>
        </tr>
      );
    }
    if (Lista == "Lista3") {
      contenido = (
        <>
          <div className="general-info col-12 col-lg-9">
            <h2 className="the_crop_header">
              <Act key={actKey} actId={actKey} />{" "}
            </h2>
            <div className="first-section">
              <p className="general-info_subh">
                <b>Información general:</b>
              </p>
              <div class="row">
                <p>
                  <b>Cultivo: </b>
                  <Crop
                    key={date.date_crop_key}
                    cropId={date.date_crop_key}
                  />{" "}
                </p>
                <p>
                  <b>Responsable de la actividad: </b>
                  <User key={userRep} userId={userRep} />{" "}
                </p>
              </div>
              <div className="row">
                <p>
                  <b>Fecha programada: </b>
                  {fechaIni == "null" ? "no fecha asignada" : fechaIni}
                </p>
                <p>
                  <b>Fecha de ejecución: </b>
                  {fechaFin == "null" ? "no fecha asignada" : fechaFin}
                </p>
              </div>
              {(isManager || isAdmin) &&
              <div class="row">
                <p>
                  <button
                    className="btn btn-success"
                    onClick={() => setIsOpen(true)}
                  >
                    Editar Fecha
                  </button>
                </p>
              </div>}
            </div>

            {(isManager || isAdmin) && <>{updateApp}</>}
          </div>
        </>
      );
    }

    return contenido;
  } else return null;
};

const memoizedAppDate = memo(AppDate);

export default memoizedAppDate;
