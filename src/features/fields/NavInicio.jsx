import React from 'react'
import "../../styles/inicio.css"
import BookImage from "../../images/book.svg"
import AddImage from "../../images/add.svg"
import UsersImage from "../../images/users.svg"
import { Link } from 'react-router-dom'
import useAuth from "../../hooks/useAuth";

import Mapa from "../../components/map"

const NavInicio = () => {
    const { username, isManager, isAdmin } = useAuth();
        return( <>
                    <div className="ventana_inicio">
                        <p className="inicio_bienvenida">Bienvenido a la plataforma
                        de la finca experimental profesor André Vloebergh</p>
                        <div className="inicio_iconos">
                        {(isManager || isAdmin) && <Link to={'/dash/cultivos/nuevo-cultivo'}><div className="inicio_icono-boton">
                                <img className="img-comun" src={AddImage} alt="Add-Icon"/>
                                <p>Añadir cultivo</p>
                            </div></Link>}
                            <Link to={'/dash/cultivos'} className="Link"><div className="inicio_icono-boton">
                                <img className="img-comun" src={BookImage} alt="Book-Icon"/>
                                <p>Ver cultivos</p>
                            </div></Link>
                            {(isAdmin) && <Link to={'/dash/usuario/lista-usuarios'} className="Link"><div className="inicio_icono-boton">
                                <img className="img-comun" src={UsersImage} alt="Users-Icon"/>
                                <p>Administrar perfiles</p>
                            </div></Link>}
                        </div>
                    </div>

                    {/* <Mapa /> */}
                </>
        );
    }
    
export default NavInicio
