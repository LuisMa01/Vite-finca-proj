import React from 'react'
import "../../styles/nuevo-cultivo.css"
import ReImage from "../../images/return.svg"
import { Link } from 'react-router-dom'
import '../../styles/nuevo-cultivo.css'
import campos from '../jsons/campos.json'
import {
    useGetCropsQuery,
    useAddNewCropMutation,
  } from "./redux/cropApiSlice";


const Campos = () => {
    return(
        campos.map((item) => (
            <option value={item.name} style={isCampoEnabled(item.enable)}>{item.name}</option>
        ))
    )
}

function isCampoEnabled(a){
    if (a===0){
    return {display : 'none'};
    }
    return;
}

const nuevoCultivo = () => {
    const {
        data: crops,
        isLoading,
        isSuccess,
        isError,
        error,
      } = useGetCropsQuery("cropsList", {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
      });
      const [
        addNewCrop,
        { isSuccess: addissuccess, isError: addiserror, error: adderror },
      ] = useAddNewCropMutation();
      
      //username, cropName, datePlant, dateHarvest, finalProd, cropCampKey, cropPlantKey
      const [cropName, setCropName] = useState("");
      const [datePlant, setCropPlant] = useState({varOne:new Date()});
      const [dateHarvest, setCropHarvest] = useState({varOne:new Date()});
      const [finalProd, setCropProd] = useState("");
      const [cropCampKey, setCropCamp] = useState(0);
      const [cropPlantKey, setCropPlantKey] = useState(0);





    return(
        <>
            <div className="return-div"><Link to={'/dash/cultivos'}><div className="return-button">
                    <img className="return-button-img" src={ReImage} alt="Atrás"/>
            </div></Link></div>
            <p className="nuevo-cultivo-header">Añadir cultivo</p>
            <p className='nuevo-descripcion text-muted'>A continuación describa el cultivo que desea implementar, ubicación y características generales que lo identifican.</p>
        
            <form className="container needs-validation nuevo-cultivo-form" novalidate>
            <div className="form-row bg-light">
                <div className="col-md-4 mb-3">
                    <label for="nombre_cultivo">Nombre del cultivo</label>
                    <input type="text" className="form-control" id="nombre_cultivo" placeholder="Fruta ##" required />
                </div>
                <div className="col-md-4 mb-3">
                    <label for="variedad_cultivo">Variedad</label>
                    <input type="text" className="form-control" id="variedad_cultivo" required />
                </div>
                <div className="col-md-4 mb-3">
                    <label for="marco_cultivo">Marco de plantación</label>
                    <input type="text" className="form-control" id="marco_cultivo" />
                </div>
            </div>
            <div className='form-row'>
                <div className="col-md-3 mb-3">
                    <label for="area_cultivo">Area</label>
                    <input type="text" className="form-control" id="area_cultivo" required />
                </div>
                <div className="col-md-3 mb-3">
                    <label for="siembra_cultivo">Fecha de siembra</label>
                    <input type="date" className="form-control" id="siembra_cultivo" required />
                </div>
                <div className="col-md-3 mb-3">
                    <label for="campo_cultivo">Campo</label>
                    <select className="form-control" id="campo_cultivo">
                        <option disabled selected>Elegir campo</option>
                        <Campos />
                    </select>
                </div>
                <div className="col-md-3 mb-3">
                    <label for="cosecha_cultivo">Fecha de cosecha</label>
                    <input type="date" className="form-control" id="cosecha_cultivo" />
                </div>
            </div>
            <div className="form-row bg-light">
                <div className="col-md-6 mb-3">
                    <label for="producto_final">Producto final</label>
                    <input type="text" class="form-control" id="producto_final" />
                </div>
            </div>
            <div className="cultivos_button-section">
                <button className="btn btn-success" type="submit">Guardar cultivo</button>
                <Link to={'/dash/cultivos'} className="Link">
                    <button className="btn btn-danger">Descartar</button>
                </Link>
            </div>
            {/* <p className='nuevo-descripcion text-muted'>Una vez creado el cultivo, podrá cargar plantillas y/o agregar actividades </p> */}
            </form>
        </>
    )
}

export default nuevoCultivo