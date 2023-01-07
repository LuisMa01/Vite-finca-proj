import React from "react"
import ReImage from "../../images/return.svg"
import "../../styles/editar-campos.css"
import { Link } from "react-router-dom"
import { campos } from "./NavCampos"
import AddImage from "../../images/add.svg"

const EditarCampos = () => {
    return(
        <>
            <div className="return-div"><Link to={'/dash/campos'}><div className="return-button">
                <img className="return-button-img" src={ReImage} alt="Atrás"/>
            </div></Link></div>
            <div className="seccion_cultivos_btn-agregar margintop">
                <img className="img-comun img-add" src={AddImage} alt="Add-Icon"/>
                <p>Nuevo campo</p>
                <form>
                    <div className="nuevo-campo-card_form" id="nuevo-campo-card_form" onClick={showForm()}>
                        <label id="campo_label">Nombre</label>
                        <input type="text" id="new-field-name" name="new-field-name" placeholder="Ej: Campo 7 noroeste" autoFocus />
                    </div>
                </form>
            </div>
        </>
    )
}

export default EditarCampos

function showForm() {
    document.getElementById('nuevo-campo-card_form').style.display = "flex";
}
