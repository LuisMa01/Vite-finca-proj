import React from "react"
import ReImage from "../../images/return.svg"
import { Link } from "react-router-dom"
import "../../styles/registrar-plantilla.css"
import LasActividades from "../jsons/plantilla-maiz.json"
import MisActividades from "../jsons/tipos-actividades.json"

const RegistrarPlantilla = () => {
    return(
        <>
            <div className="return-div"><Link to={'/dash/cultivos'}><div className="return-button">
                <img className="return-button-img" src={ReImage} alt="Atrás"/>
            </div></Link></div>
            <h1 className='titulo_nueva-plantilla font-weight-bold'>Nueva plantilla</h1>
            <div className="ventana_plantillas">   
                {/* <form className="container col-12 col-md-10 col-lg-8 col-xl-6 col col needs-validation" novalidate>   */}
                    <div className="form-row justify-content-center">
                        <div className="col-md-4 mb-3">
                            <label for="nombre_cultivo" className="text-center">Nombre de plantilla</label>
                            <input type="text" className="form-control" id="nombre_cultivo" placeholder="Fruta X" required />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label for="nombre_cultivo" className="text-center">Variedad</label>
                            <input type="text" className="form-control" id="nombre_cultivo" placeholder="Color, forma, textura, origen, etc." />
                        </div>
                    </div>
                    <hr/>
                    <p className="subheader font-weight-bold">Nueva actividad</p>
                    <form disable>
                        <div className="form-row justify-content-center">
                            <div className="col-md-4 mb-3">
                                <label for="nombre_cultivo">Nombre de actividad</label>
                                <select className="form-control">
                                    <option disabled selected>Elija la actividad</option>
                                    <NuestrasActividades />
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label for="fecha-planeada">Fecha planeada</label>
                                <input type="date" className="form-control" id="fecha-planeada" required />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label for="responsable">Responsable</label>
                                <input type="text" className="form-control" id="responsable" />
                            </div>
                        
                            <div className="cultivos_button-section">
                                <button class="btn btn-sm btn-success" type="submit">Agregar</button>
                                <button className="btn btn-sm btn-danger" type="reset">Limpiar</button>
                            </div>
                        </div>
                    </form>
                    <hr/>
                    <p className='subheader font-weight-bold'>Actividades de esta plantilla</p>
                    <div className="table-container-1"><table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
                        <thead className="thead-loyola">
                            <th className="align-middle" scope="col">Actividad</th>
                            <th className="align-middle" scope="col">Fecha programada</th>
                            <th className="align-middle" scope="col">Responsable</th> 
                        </thead>
                        <tbody>
                        <Actividades /> 
                        </tbody>
                    </table></div>
                    <div className="cultivos_button-section">
                        <button class="btn btn-success">Guardar plantilla</button>
                        <Link to={'/dash/cultivos'} className="Link">
                            <button className="btn btn-danger">Descartar</button>
                        </Link>
                    </div>
            </div>
        </>
    )
}

export default RegistrarPlantilla

const Actividades = () => {
    return(
        LasActividades.map((item) => (
            <>
                <tr key={item.index}>
                    <td className="align-middle">{item.name}</td>
                    <td className="align-middle">{item.fechap}</td>
                    <td className="align-middle">{item.responsable}</td>
                </tr>
            </>
        )))
}

const NuestrasActividades = () => {
    return(
        MisActividades.map((item) => (
            <>
                <option className="align-middle">{item.name}</option>
            </>
        )))
}

// function myFilter(){
// (document).ready(function(){
//     ("#myInput").on("keyup", function() {
//       var value = (this).val().toLowerCase();
//       (".dropdown-menu option").filter(function() {
//         (this).toggle((this).text().toLowerCase().indexOf(value) > -1)
//       });
//     });
//   });
// }