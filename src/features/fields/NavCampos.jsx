import React from 'react'
import "../../styles/nav_campos.css"
import ReImage from "../../images/return.svg"
import AddImage from "../../images/edit.svg"
import { Link } from 'react-router-dom'
import MaizImag from '../../images/maiz.jpg'
import campos from '../jsons/campos.json'

const Campos = () => {
    return(
        campos.map((item) => (
            <div className='col-12 col-sm-6 col-md-4 col-xl-3' style={isCampoEnabled(item.enable)}>
                <div className="card">
                    {/* <img className="card-img-top" src={MaizImag} alt="dec-img" /> */}
                    <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text"><b>Área: </b>{item.area} tareas</p>
                    </div>
                </div>
            </div>
        )));
}

function isCampoEnabled(a){
    if (a===0){
    return {display : 'none'};
    }
    return;
}

const navCampos = () => {
    return(
        <>
            <div className="return-div"><Link to={'/dash'}><div className="return-button">
                <img className="return-button-img" src={ReImage} alt="Atrás"/>
            </div></Link></div>
            <div className='campos_top-section'>
                <p className='titulo_campos'>Campos existentes</p>
                <div className="button-section_edit">
                    <Link to={'/dash/campos/editar-campos'} className="Link"><div className="seccion_campos_btn-agr">
                        <img className="img-edit" src={AddImage} alt="Add-Icon"/>
                        <p>Editar campos</p>
                </div></Link></div>
            </div>
            <div className='seccion_cultivos_checkbox-div'>
                    <div><input type="checkBox" className="curso" defaultChecked={true} /><span>Campos activos</span></div>
                    <div><input type="checkBox" className="finalizados" defaultChecked={false} /><span>Campos inactivos</span></div>
            </div>
            <div className='card-deck'>
                <Campos />
            </div>
        </>
    );
}

export default navCampos;