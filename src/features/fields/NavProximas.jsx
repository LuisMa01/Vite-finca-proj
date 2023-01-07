import React from "react"
import "../../styles/proximas.css"
import ReImage from "../../images/return.svg"
import { Link } from 'react-router-dom'
import focusClick from '../../components/DashHeader'

const actividades = [
        {
            "name" : "Fertilizacion",
            "cultivo" : "Maíz",
            "campo" : "2 Este",
            "fechap" : "28/11/2022",
            "responsable" : "No asignado"
        },
        {
            "name" : "Cruce con rasta transversa mediana",
            "cultivo" : "Yautía",
            "campo" : "2 Oeste",
            "fechap" : "29/11/2022",
            "responsable" : "No asignado"
        },
        {
            "name" : "Riego",
            "cultivo" : "Habichuelas",
            "campo" : "2 Este",
            "fechap" : "28/11/2022",
            "responsable" : "No asignado"
        },
        {
            "name" : "Deshierbe",
            "cultivo" : "Yuca",
            "campo" : "2 Oeste",
            "fechap" : "29/11/2022",
            "responsable" : "No asignado"
        },
        {
            "name" : "Cosecha",
            "cultivo" : "Ñame",
            "campo" : "2 Este",
            "fechap" : "28/11/2022",
            "responsable" : "No asignado"
        },
        {
            "name" : "Riego",
            "cultivo" : "Habichuelas",
            "campo" : "2 Este",
            "fechap" : "28/11/2022",
            "responsable" : "No asignado"
        }
    ]

const Actividades = () => {
    return(
        actividades.map((item) => (
            <>
                <ul key={item.index} className="actividad">
                    <li>{item.name}</li>
                    <li>{item.cultivo}</li>
                    <li>{item.campo}</li>
                    <li>{item.fechap}</li>
                    <li>{item.responsable}</li>
                </ul>
                <div className="linea_horizontal"></div>
            </>
        )))
}

const NavProximas = () => {
    return(
            <>
                <div className="return-div"><Link to={'/dash'}><div onClick={focusClick} className="return-button">
                    <img className="return-button-img" src={ReImage} alt="Atrás"/>
                </div></Link></div>
                <p className="titulo_proximas_actividades">
                    Estas son las próximas actividades a realizar en la finca, de todos los campos y cultivos
                </p>
                <div className="lista_proximas_actividades"> 
                        <ul className="encabezado_actividades">
                            <li>Actividad</li>
                            <li>Cultivo</li>
                            <li>Campo</li>
                            <li>Fecha programada</li>
                            <li>Responsable</li> 
                        </ul>
                        <Actividades />
                </div>
            </>
    )
}
export default NavProximas