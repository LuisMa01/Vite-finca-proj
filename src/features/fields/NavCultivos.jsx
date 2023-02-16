import React from 'react'
import "../../styles/nav_cultivos.css"
import ReImage from "../../images/return.svg"
import { Link } from 'react-router-dom'
import cultivos from '../jsons/cultivos.json'

const Cultivos = () => {
    return(
        cultivos.map((item) => (
            <div className="big-cont col-12 col-sm-6 col-md-4 col-xl-3" style={allOrSome(item.finalizado)}>
                <div className="card">
                    <h5 className="card-header">{item.name}</h5>
                    <ul className='cultivos_general'>
                        <li className='col-12'><b>Variedad: </b>{item.variedad}</li>
                        <li className='col-12'><b>Área: </b>{item.area} tareas</li>
                        <li className='col-12'><b>Marco de plantacion: </b>{item.marco_plantacion}</li>
                        <li className='col-12'><b>Campo#: </b>{item.campo}</li>
                        <li className='col-12'><b>Fecha de siembra: </b>{item.fecha_siembra}</li>
                        <li className='col-12'><b>Fecha de cosecha: </b>{item.fecha_cosecha}</li>
                        <li className='col-12'><b>Producto final: </b>{item.producto_final}</li>
                        <li className='col-12'><b>Costo acumulado: </b>${numberWithCommas(item.costo)}</li>
                        <li className='col-12'><b>Finalizado: </b>{isCompleted(item.finalizado)}</li>
                    </ul>
                </div>
            </div>
        ))
    )
}

function allOrSome(a){
    if (a===1){
    return {display : 'none'};
    }
    return;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function isCompleted(a){
    if (a === 1){
        return "sí"
    }
    else {
        return "no"
    }
}



const NavCultivos = () => {
    return(
            <>
                <div className="return-div"><Link to={'/dash'}><div className="return-button">
                    <img className="return-button-img" src={ReImage} alt="Atrás"/>
                </div></Link></div>
                <div className="seccion_cultivos">
                        <div>   
                            <div className="button-section_parent ">
                                <Link to={'/dash/cultivos/nuevo-cultivo'} className="Link">
                                <button className="btn btn-outline-primary seccion_cultivos_btn-agr">Cultivo</button>
                                </Link>
                                <Link to={'/dash/cultivos/registrar-plantilla'} className="Link">
                                <button type="button" class="btn btn-outline-secondary seccion_cultivos_btn-agr">Plantillas de cultivos</button>
                                </Link>
                                <Link to={'/dash/cultivos/registrar-planta'} className="Link">
                                <button type="button" class="btn btn-outline-secondary seccion_cultivos_btn-agr">Plantas</button>
                                </Link>
                                <Link to={'/dash/cultivos/registrar-actividad'} className="Link">
                                <button type="button" class="btn btn-outline-secondary seccion_cultivos_btn-agr">Actividades de cultivo</button>
                                </Link>
                                <Link to={'/dash/cultivos/item-section'} className="Link">
                                <button type="button" class="btn btn-outline-secondary seccion_cultivos_btn-agr">Materiales y mano de obra</button>
                                </Link>
                            </div>  
                        </div>
                        <div className='seccion_cultivos_checkbox-div'>
                                <div><input type="checkBox" className="curso" defaultChecked={true} /><span>Cultivos en curso</span></div>
                                <div><input type="checkBox" className="finalizados" defaultChecked={false} /><span>Cultivos finalizados</span></div>
                        </div>
                    <div className="card-deck cultivos_big-card">
                        <Cultivos />
                    </div>
                </div>
            </>
    );
}
export default NavCultivos;