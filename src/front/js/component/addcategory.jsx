import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/forms.css";

export const AddCategoryModal = () => {
    const { store, actions } = useContext(Context);

    const [value, setValue] = useState("");
    const updateValue = (valueInputValue) => {
        setValue(valueInputValue);
    };

    const addCategory = async () => {
        await actions.setOcassionalCategory(value);
        console.log("La categoría se ha añadido");
        window.location.reload();
    };

    return (
        <>
            <div className="modal fade" id="categoryModal" tabIndex="-1" aria-labelledby="categoryModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-body p-0 m-0">
                            <button type="button" className="btn text-white fs-2 position-absolute top-0 end-0 px-4 py-3" data-bs-dismiss="modal" aria-label="Close">
                                <i className="fa-solid fa-close"> </i>
                            </button>
                            <div>
                                <h1 className="text-center text-white p-4 mb-2" id="add-title">
                                    Nueva categoría
                                </h1>
                            </div>
                            <div className="justify-content-center align-items-center text-center">
                                <div className="m-md-5 my-5 pt-3 justify-content-center text-center">
                                    <input type="text" className="col-md-9 col-11 rounded-0 border-1" id="inputQuantity" placeholder="Categoría" onChange={(e) => {updateValue(e.target.value);}}/>
                                </div>
                            </div>
                            <div className="justify-content-center align-items-center">
                                <div className="text-center">
                                    <button className="btn-add-form btn btn-lg m-3 mb-4 py-3 px-5 fs-3 rounded-pill text-white" onClick={() => addCategory()} data-bs-dismiss="modal">
                                        Añadir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </>
    );
};