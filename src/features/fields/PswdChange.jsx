import React from "react"
import '../../styles/pswd_change.css'
import ReImage from "../../images/return.svg"
import { Link } from "react-router-dom"

const PswdChange = () => {
    return(
        <>
            <div className="return-div"><Link to={'/dash/usuario/mi-perfil'}><div className="return-button">
                <img className="return-button-img" src={ReImage} alt="Atrás"/>
            </div></Link></div>
            <div className="pswd-card">
                <h1>ronnie07</h1>
                <div className="split-line"></div>
                <form className="pswd-card_form" action="#">
                    <div>
                        <label id="current-pswd_label">Contraseña actual</label>
                        <input type="password" id="current-pswd" name="current-pswd" placeholder="Contraseña actual" autoFocus/>
                    </div>
                    <p id="wrong-pswd_message" class="wrong-pswd">Contraseña incorrecta</p>
                    <div>
                        <label id="new-pswd_label">Contraseña nueva</label>
                        <input type="password" id="new-pswd" name="new-pswd" placeholder="Contraseña nueva"/>
                    </div>
                    <p id="confirm-wrong_message" class="wrong-pswd">Las contraseñas no coinciden</p>
                    <div>
                        <label id="confirm-pswd_label">Confirme contraseña</label>
                        <input type="password" id="confirm-new-pswd" name="confirm-current-pswd" placeholder="Confirme contraseña nueva"/>
                    </div>
                    <div className="button-section">
                        <button id="save" type="submit">Guardar cambios</button>
                        <Link to={'/dash/usuario/mi-perfil'} className=".Link"><button id="discard">Cancelar</button></Link>
                    </div>
                </form>
            </div>
        </>
    )
}

export default PswdChange