import React from "react"
import ReImage from "../../images/return.svg"
import "../../styles/editar-campos.css"
import { Link } from "react-router-dom"
import RemoveImg from "../../images/remove.svg"
import campos from '../jsons/campos.json'
import Swal from "sweetalert2"
import { useGetCampsQuery, useAddNewCampMutation } from "../fields/redux/campApiSlice";
import Camp from "../../components/Camp";
import { useState, useEffect } from "react";

const EditarCampos = () => { 
    const {
        data: camps,
        isLoading,
        isSuccess,
        isError,
        error,
      } = useGetCampsQuery("campsList", {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
      });

      const [addNewCamp, { isSuccess : addissuccess, isError: addiserror, error: adderror }] = useAddNewCampMutation();

      const [campName, setCampname] = useState("");
      const [area, setArea] = useState("");
    
      const onSaveCampClicked = async (e) => {
        e.preventDefault();
        
          await addNewCamp({ campName, area});  
      };
    
      const onCampNameChanged = (e) => setCampname(e.target.value);
      const onCampAreaChanged = (e) => setArea(e.target.value);
      useEffect(() => {
        if (addissuccess) {
          setCampname("");
          setArea("");      
        }
      }, [addissuccess]);
    


      let tableContent;
  if (isError) {
    tableContent = <p className="errmsg">{error?.data?.message}</p>;
    console.log(error?.data?.message);
  }
  if (isSuccess) {
    const { ids } = camps;
    
    tableContent = ids?.length && ids.map((Id) => <Camp key={Id} campId={Id} />);
  }


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
                        <input type="text" className="form-control" id="nombre_cultivo" placeholder="Campo X" value={campName} onChange={onCampNameChanged} required />
                    </div>
                    <div className="col-12 col-md-6 mb-2">
                        <label for="variedad_cultivo">Área (tareas)</label>
                        <input type="number" step="any" min={0} className="form-control" id="variedad_cultivo" value={area} onChange={onCampAreaChanged} />
                    </div>
                </div>
                <div className="edit-campo-button-section_parent">
                    <button type="submit" className="btn btn-outline-primary limpiar" onClick={onSaveCampClicked}>Añadir campo</button>
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
                    {tableContent}
                </tbody>
            </table></div>
        </>
    )
}

export default EditarCampos
