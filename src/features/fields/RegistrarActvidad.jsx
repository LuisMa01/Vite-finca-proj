import React from "react"
import ReImage from "../../images/return.svg"
import { Link } from "react-router-dom"
import "../../styles/registrar-actividad.css"
import actividades from "../jsons/tipos-actividades.json"
import RemoveImg from "../../images/remove.svg"
import Swal from "sweetalert2"

const registrarActividad = () => {
    return(
        <>
            <div className="return-div"><Link to={'/dash/cultivos'}><div className="return-button">
                <img className="return-button-img" src={ReImage} alt="Atrás"/>
            </div></Link></div>
            <p className='titulo_tipos-de-actividades'>Tipos de actividades</p>
            <p className="tipos_description"><i>Esta seccion es para la administración de la base de datos de las actividades estandarizadas que se pueden realizar a los cultivos, de esta manera se eficientiza el sistema.</i></p>

            <form className="container myform col-6 needs-validation" novalidate>
                <div className="form-row bg-light">
                    <div className="col-12 col-md-6 mb-2">
                        <label for="nombre_actividad">Nombre de actividad</label>
                        <input type="text" className="form-control" id="nombre_actividad" placeholder="Actividad X" required />
                    </div>
                    <div className="col-12 col-md-6 mb-2">
                        <label for="descripcion_actividad">Descripción (opcional)</label>
                        <textarea className="form-control rounded-1" id="descripcion_actividad" rows="1"  placeholder="Esta actividad consiste en..."></textarea>
                    </div>
                </div>
                <div className="edit-campo-button-section_parent">
                    <button type="submit" className="btn btn-outline-primary limpiar">Añadir actividad</button>
                    <button type="reset" className="btn btn-outline-danger limpiar">Limpiar</button>
                </div>
            </form>

            <div className='seccion_campos_checkbox-div'>
                <div><input type="checkBox" defaultChecked /><span>Actividades habilitadas</span></div>
                <div><input type="checkBox" /><span>Actividades inhabilitadas</span></div>
            </div>
             <div className=" container col-12 col-md-9 col-lg-6 edit_table-container"><table className="table table-hover table-sm table-striped table-bordered">
                <thead className="thead-blue">
                    <th className="align-middle" scope="col">Campo</th>
                    <th className="align-middle" scope="col">Habilitar</th>
                    <th className="align-middle" scope="col">Eliminar</th>
                </thead>
                <tbody>
                    <Lista />
                </tbody>
            </table></div> 
        </>
    )
}

export default registrarActividad

const Lista = () => {
    return(
        actividades.map((item) => (
            <>
                <tr>
                    <td>{item.name}</td>
                    <td>
                        <input type="checkbox" defaultChecked={actividadIsEnabled(item.enable)} />
                    </td>
                    <td onClick={Delete}><img id={item.id} className="remove-img" src={RemoveImg} alt="Remove"/></td>
                </tr>
            </>
        )
    ))
}

function actividadIsEnabled(a){
    if (a === 1) {
        return true;
    }
    else {
        return false;
    }
}

function Delete(a){
    Swal.fire({
        title: '¿Seguro de eliminar?',
        text: `Eliminar esta actividad afectará todos los datos asociados a esta. Esta acción será irreversible.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            '¡Eliminada!',
            'Este actividad ha sido eliminada.',
            'success'
          )
        }
      })
} 