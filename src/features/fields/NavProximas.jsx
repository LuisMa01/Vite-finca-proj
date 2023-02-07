import React from "react"
import "../../styles/proximas.css"
import ReImage from "../../images/return.svg"
import { Link } from 'react-router-dom'
import focusClick from '../../components/DashHeader'
import actividades from '../jsons/proximas.json'

const Actividades = () => {
    return(
        actividades.map((item) => (
            <>
                <tr key={item.index}>
                    <td className="align-middle">{item.name}</td>
                    <td className="align-middle">{item.cultivo}</td>
                    <td className="align-middle">{item.campo}</td>
                    <td className="align-middle">{item.fechap}</td>
                    <td className="align-middle">{item.responsable}</td>
                </tr>
            </>
        )))
}

const navProximas = () => {
    return(
            <>
                <div className="return-div"><Link to={'/dash'}><div onClick={focusClick} className="return-button">
                    <img className="return-button-img" src={ReImage} alt="Atrás"/>
                </div></Link></div>
                <p className="titulo_proximas_actividades">
                    Estas son las próximas actividades a realizar en la finca, de todos los campos y cultivos
                </p>
                <div className="table-container col-12 col-md-10 col-lg-8"><table className="table table-hover table-sm table-striped table-responsive-sm table-bordered">
                    <thead className="thead-blue">
                        <th className="align-middle" scope="col">Actividad</th>
                        <th className="align-middle" scope="col">Cultivo</th>
                        <th className="align-middle" scope="col">Campo</th>
                        <th className="align-middle" scope="col">Fecha programada</th>
                        <th className="align-middle" scope="col">Responsable</th> 
                    </thead>
                    <tbody>
                       <Actividades /> 
                    </tbody>
                </table></div>
            </>
    )
}
export default navProximas