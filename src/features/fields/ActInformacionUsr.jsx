import React from "react"
import ReImage from "../../images/return.svg"
import "../../styles/editar-campos.css"
import { Link } from "react-router-dom"

const ActInformacionUsr = () => {
    return(
        <>
            <div className="return-div"><Link to={'/dash/usuario/lista-usuarios/info-user'}><div className="return-button">
                <img className="return-button-img" src={ReImage} alt="Atrás"/>
            </div></Link></div>
        </>
    )
}

export default ActInformacionUsr