import React from "react"
import ReImage from "../../images/return.svg"
import "../../styles/editar-campos.css"
import { Link } from "react-router-dom"
import RemoveImg from "../../images/remove.svg"
import campos from '../jsons/campos.json'
import Swal from "sweetalert2"

const EditarCampos = () => { 
    return(
        <>
            <div className="return-div"><Link to={'/dash/campos'}><div className="return-button">
                <img className="return-button-img" src={ReImage} alt="Atrás"/>
            </div></Link></div>
            <p className="editar_campos_description"> 
            Editar lista de campos existentes </p>
            <form className="container myform col-6 needs-validation" novalidate>
                <div className="form-row bg-light">
                    <div className="col-12 col-md-6 mb-2">
                        <label for="nombre_cultivo">Nombre del campo</label>
                        <input type="text" className="form-control" id="nombre_cultivo" placeholder="Campo X" required />
                    </div>
                    <div className="col-12 col-md-6 mb-2">
                        <label for="variedad_cultivo">Área (tareas)</label>
                        <input type="text" className="form-control" id="variedad_cultivo" />
                    </div>
                </div>
                <div className="edit-campo-button-section_parent">
                    <button type="submit" className="btn btn-outline-primary limpiar">Añadir campo</button>
                    <button type="reset" className="btn btn-outline-danger limpiar">Limpiar</button>
                </div>
            </form> 
            
            <div className='seccion_campos_checkbox-div'>
                <div><input type="checkBox" defaultChecked /><span>Campos habilitados</span></div>
                <div><input type="checkBox" /><span>Campos inhabilitados</span></div>
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

export default EditarCampos

const Lista = () => {
    return(
        campos.map((item) => (
            <>
                <tr>
                    <td>{item.name}</td>
                    <td>
                        <input type="checkbox" defaultChecked={campoIsEnabled(item.enable)} />
                    </td>
                    <td onClick={Delete}><img id={item.id} className="remove-img" src={RemoveImg} alt="Remove"/></td>
                </tr>
            </>
        )
    ))
}

function campoIsEnabled(a){
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
        text: `Eliminar este campo afectará todos los datos asociados a este. Esta acción será irreversible.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            '¡Eliminado!',
            'Este campo ha sido eliminado.',
            'success'
          )
        }
      })
}