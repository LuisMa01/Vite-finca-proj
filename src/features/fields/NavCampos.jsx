import React from 'react'
import "../../styles/nav_campos.css"
import ReImage from "../../images/return.svg"
import AddImage from "../../images/edit.svg"
import { Link } from 'react-router-dom'

const campos = [
    {
        "name" : "Campo 1",
        "area" : "1.5",
    },
    {
        "name" : "Campo 2 Norte",
        "area" : "2",
    },
    {
        "name" : "Campo 2 Sur",
        "area" : "0.5",
    },
    {
        "name" : "Campo 3",
        "area" : "1",
    },
    {
        "name" : "Campo 4 Oeste",
        "area" : "2.5",
    },
    {
        "name" : "Campo 4 Este",
        "area" : "2.5",
    },
    {
        "name" : "Campo 5 Norte",
        "area" : "3",
    },
    {
        "name" : "Campo 5 Sur",
        "area" : "3",
    },
    {
        "name" : "Campo 6",
        "area" : "1",
    },
    {
        "name" : "Campo 7",
        "area" : "2.5",
    }
]
export {campos}

const Campos = () => {
    return(
        campos.map((item) => (
            <ul className='boton_campo'>
                <li className='campo_name'><b>{item.name}</b></li>
                <li><b>Área: </b>{item.area} tareas</li>
            </ul>
        )));
}

const navCultivos = () => {
    return(
        <>
            <div className="return-div"><Link to={'/dash'}><div className="return-button">
                <img className="return-button-img" src={ReImage} alt="Atrás"/>
            </div></Link></div>
            <p className='titulo_campos'>Campos existentes</p>
            <div className='seccion_campos'>
            <Campos />
            </div>
            <div className="button-section_edit">
                <Link to={'/dash/campos/editar-campos'} className="Link"><div className="seccion_campos_btn-agregar">
                    <img className="img-comun img-add" src={AddImage} alt="Add-Icon"/>
                    <p>Editar campos</p>
                </div></Link>
            </div>
        </>
    );
}

export default navCultivos;