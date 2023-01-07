import React from 'react'
import "../../styles/nuevo-cultivo.css"
import ReImage from "../../images/return.svg"
import { Link } from 'react-router-dom'
import '../../styles/nuevo-cultivo.css'

const NuevoCultivo = () => {
    return(
        <>
            <div className="return-div"><Link to={'/dash/cultivos'}><div className="return-button">
                    <img className="return-button-img" src={ReImage} alt="Atrás"/>
            </div></Link></div>
            <h1>Añadir cultivo</h1>
            <h2>Información general</h2>
            <div className='inf-general_card'>

            </div>
            <h2>Agregar actividades</h2>
            <div className='inf-general_card '>

            </div>
        </>
    )
}

export default NuevoCultivo