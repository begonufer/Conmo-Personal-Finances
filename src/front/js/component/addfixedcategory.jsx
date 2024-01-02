import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/forms.css";

export const AddFixedCategoryModal = () => {
    const { store, actions } = useContext(Context);

    const [value, setValue] = useState("");
    const updateValue = (valueInputValue) => {
      setValue(valueInputValue);
    };

    const addCategory = async () => {
      await actions.setFixedCategory(value);
      console.log("La categoría se ha añadido");
      window.location.reload();
    };

    return (
        <>
            <div className="modal fade" id="fixedCategoryModal" tabIndex="-1" aria-labelledby="fixedCategoryModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-body p-0 m-0">
                            <button type="button" className="btn text-white fs-2 position-absolute top-0 end-0 px-4 py-3" data-bs-dismiss="modal" aria-label="Close">
                                <i className="fa-solid fa-close"> </i>
                            </button>
                            <div>
                                <h1 className="text-center text-white p-4 mb-2" id="add-title">
                                    Añade una nueva categoría
                                </h1>
                            </div>
                            <div className="justify-content-center align-items-center text-center mt-2 pt-4 pb-5 mb-5">
                                <div className="row mt-5 mx-0 px-0 justify-content-center text-center">
                                    <input type="text" className="col rounded-0 border-1 mx-3" id="inputQuantity" placeholder="Categoría" onChange={(e) => {updateValue(e.target.value);}}/>
                                </div>
                            </div>
                            <div className="row mx-0 px-0 mt-5 pt-3 justify-content-center align-bottom ">
                                <button className="btn-add-form col-3 btn btn-lg m-3 mb-4 py-3 fs-3 rounded-pill text-white" onClick={() => addCategory()} data-bs-dismiss="modal">
                                    Añadir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </>
    );
};