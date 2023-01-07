import React from 'react'
import "../../styles/nav_cultivos.css"
import ReImage from "../../images/return.svg"
import AddImage from "../../images/add.svg"
import { Link } from 'react-router-dom'

const cultivos = [
    {
        "name" : "Sandia",
        "variedad" : "",
        "area" : "5.7",
        "marco_plantacion" : "1.5x0.9",
        "campo" : "7",
        "fecha_siembra" : "19/02/2021",
        "fecha_cosecha" : "",
        "producto_final" : "",
        "costo" : "0",
        "finalizado" : "no"
    },
    {
        "name" : "Sandia",
        "variedad" : "",
        "area" : "5.7",
        "marco_plantacion" : "1.5x0.9",
        "campo" : "7",
        "fecha_siembra" : "19/02/2021",
        "fecha_cosecha" : "",
        "producto_final" : "",
        "costo" : "0",
        "finalizado" : "no"
    },
    {
        "name" : "Sandia",
        "variedad" : "",
        "area" : "5.7",
        "marco_plantacion" : "1.5x0.9",
        "campo" : "7",
        "fecha_siembra" : "19/02/2021",
        "fecha_cosecha" : "",
        "producto_final" : "",
        "costo" : "0",
        "finalizado" : "no"
    },
    {
        "name" : "Sandia",
        "variedad" : "",
        "area" : "5.7",
        "marco_plantacion" : "1.5x0.9",
        "campo" : "7",
        "fecha_siembra" : "19/02/2021",
        "fecha_cosecha" : "",
        "producto_final" : "",
        "costo" : "0",
        "finalizado" : "no"
    }
]

const Cultivos = () => {
    return(
        cultivos.map((item) => (
            <ul className='cultivos_general'>
                <li><b>Nombre: </b>{item.name}</li>
                <li><b>Variedad: </b>{item.variedad}</li>
                <li><b>Área: </b>{item.area} tareas</li>
                <li><b>Marco de plantacion: </b>{item.marco_plantacion}</li>
                <li><b>Campo#: </b>{item.campo}</li>
                <li><b>Fecha de siembra: </b>{item.fecha_siembra}</li>
                <li><b>Fecha de cosecha: </b>{item.fecha_cosecha}</li>
                <li><b>Producto final: </b>{item.producto_final}</li>
                <li><b>Costo acumulado: </b>${item.costo}</li>
                <li><b>Finalizado: </b>{item.finalizado}</li>
            </ul>
        ))
    )
}

const navCultivos = () => {
    return(
            <>
                <div className="return-div"><Link to={'/dash'}><div className="return-button">
                    <img className="return-button-img" src={ReImage} alt="Atrás"/>
                </div></Link></div>
                <div className="seccion_cultivos">
                    <div className="button-section_parent">
                        <Link to={'/dash/cultivos/nuevo-cultivo'} className="Link"><div className="seccion_cultivos_btn-agr">
                            <img className="img-comun img-agr" src={AddImage} alt="Add-Icon"/>
                            <p>Añadir cultivo</p>
                        </div></Link>
                    </div>
                    <div className='seccion_cultivos_checkbox-div'>
                        <div><input type="checkBox" defaultChecked /><span>Cultivos en curso</span></div>
                        <div><input type="checkBox" defaultChecked /><span>Cultivos finalizados</span></div>
                    </div>
                    <Cultivos />
                </div>
            </>
    );
}
export default navCultivos;