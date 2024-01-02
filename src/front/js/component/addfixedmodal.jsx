import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { AddFixedCategoryModal } from "../component/addfixedcategory.jsx";
import { Link } from "react-router-dom";
import "../../styles/forms.css";

export const AddFixedModal = () => {
    const { store, actions } = useContext(Context);
    useEffect(() => {
      actions.getFixedCategories();
    }, []);

    const [value, setValue] = useState("");
    const [fixedcategory_id, setFixedcategory_id] = useState("");
    const [dateTime, setDateTime] = useState("");
    
    const updateValue = (valueInputValue) => {
      setValue(valueInputValue);
    };
    const updateFixedCategory = (categoryInputValue) => {
      setFixedcategory_id(categoryInputValue);
    };
    const updateDateTime = (dateTimeInputValue) => {
      setDateTime(dateTimeInputValue);
    };
  
    const addFixed = async () => {
      await actions.setFixed(dateTime,fixedcategory_id,value);
    };

    return (
        <>
            <div className="modal fade" id="fixedModal" tabIndex="-1" aria-labelledby="fixedModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-body p-0 m-0">
                            <button type="button" className="btn text-white fs-2 position-absolute top-0 end-0 px-4 py-3" data-bs-dismiss="modal" aria-label="Close">
                                <i className="fa-solid fa-close"> </i>
                            </button>
                            <div>
                                <h1 className="text-center text-white p-4 mb-2" id="add-title">
                                    Añade un gasto fijo
                                </h1>
                            </div>
                            <div className="justify-content-center align-items-center text-center mt-2">
                                <div className="row mt-5 mx-0 px-0 justify-content-center text-center">
                                    <input type="date" className="col-3 rounded-0 border-1 " id="inputDate" placeholder="Fecha" onChange={(e) => { updateDateTime(e.target.value); }} />
                                    <div className="col-4">
                                        <select id="inputCategory" className="w-100 rounded-0" onChange={(e) => {updateFixedCategory(e.target.value);}}>
                                            <option>Selecciona una categoría</option>
                                            {store.fixedcategories?.map((fixedcategory) => {
                                                return (
                                                    <option key={fixedcategory.id} value={fixedcategory.id}>
                                                        {fixedcategory.name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <input type="text" className="col-2 rounded-0 border-1 mx-3" id="inputQuantity" placeholder="€" onChange={(e) => {updateValue(e.target.value);}}/>
                                    <input type="text" className="col-2 rounded-0 border-1" id="inputPercentage" placeholder="%"/>
                                </div>
                                <button className="mt-5" title="Añadir categoría" type="button" data-bs-toggle="modal" data-bs-target="#fixedCategoryModal">
                                    Añadir una nueva categoría
                                </button>
                            </div>
                            <div className="row mx-0 px-0 mt-5 pt-3 justify-content-center align-bottom ">
                                <button className="btn-add-form col-3 btn btn-lg m-3 py-3 fs-3 rounded-pill text-white" onClick={() => addFixed()} data-bs-dismiss="modal">
                                    Añadir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddFixedCategoryModal />
        </>
    );
};