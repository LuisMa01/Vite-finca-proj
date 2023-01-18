import React from 'react'
import "../../styles/nav_cultivos.css"
import ReImage from "../../images/return.svg"
import { Link } from 'react-router-dom'
import "../../styles/item-section.css"


const ItemSection = () => {
    return(
            <>
                <div className="return-div"><Link to={'/dash/cultivos'}><div className="return-button">
                    <img className="return-button-img" src={ReImage} alt="Atrás"/>
                </div></Link></div>
                <h1 className="item-section_titulo">Materiales y mano de obra</h1>
                <p><i>Ventana en desarrollo...</i></p>
            </>
    );
}

export default ItemSection;