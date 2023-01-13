import React from "react"
import ReImage from "../../images/return.svg"
import "../../styles/mi_perfil.css"
import { Link } from "react-router-dom"


const MiPerfil = () => {
    return(
        <>  
            <div className="return-div"><Link to={'/dash'}><div className="return-button">
                 <img className="return-button-img" src={ReImage} alt="Atrás"/>
            </div></Link></div>
            <h1 className="encabezado">Mi información</h1>
            <div className="profile-card">
                <h2>Ronald Pozo</h2>
                <p className="p-cargo">Analista de infraestructura</p>
                <p><b>Usuario: </b> ronald23</p>
                <p><b>Correo:</b>  16-03-0056@ipl.edu.do</p>
                <p><b>Teléfono:</b> 809-528-4010</p>
                <div className="split-line"></div>
                <div className="button-section">
                    <Link to={'/dash/usuario/mi-perfil/act-info'}><button className="btn btn-left">Actualizar información</button></Link>
                    <Link to={'/dash/usuario/mi-perfil/pswd-change'}><button className="btn btn-right">Cambiar contraseña</button></Link>
                </div>        
            </div>
        </>
    )
}

export default MiPerfil

function Focus5(){
    document.getElementById('inicio').className="menu-inicio";
    document.getElementById('proximas').className="menu-inicio";
    document.getElementById('cultivos').className="menu-inicio";
    document.getElementById('campos').className="menu-inicio";
    document.getElementById('perfil').className="menu-inicio menu-bar_focus";
}

export {Focus5};