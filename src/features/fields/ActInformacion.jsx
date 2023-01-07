import React from "react"
import ReImage from "../../images/return.svg"
import "../../styles/editar-campos.css"
import { Link } from "react-router-dom"

const ActInformacion = () => {
    return(
        <>
            <div className="return-div"><Link to={'/dash/usuario/mi-perfil'}><div className="return-button">
                <img className="return-button-img" src={ReImage} alt="Atrás"/>
            </div></Link></div>
        </>
    )
}

export default ActInformacion