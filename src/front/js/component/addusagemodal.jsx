import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { AddCategoryModal } from "../component/addcategory.jsx";
import { Link } from "react-router-dom";
import "../../styles/forms.css";

export const AddUsageModal = () => {
    const { store, actions } = useContext(Context);
    useEffect(() => {
        actions.getOcassionalCategories();
    }, []);

    const [value, setValue] = useState("");
    const [usageCategory_id, setUsageCategory_id] = useState("");
    const [dateTime, setDateTime] = useState("");
    const updateValue = (valueInputValue) => {
      setValue(valueInputValue);
    };
    const updateUsageCategory = (categoryInputValue) => {
      setUsageCategory_id(categoryInputValue);
    };
    const updateDateTime = (dateTimeInputValue) => {
      setDateTime(dateTimeInputValue);
    };

    const addUsage = async () => {
      await actions.setUsage(dateTime, usageCategory_id, value);
      console.log(store.saves);
      window.location.reload();
    };

    return (
        <>
            <div className="modal fade" id="usageModal" tabIndex="-1" aria-labelledby="usageModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-body p-0 m-0">
                            <button type="button" className="btn text-white fs-2 position-absolute top-0 end-0 px-4 py-3" data-bs-dismiss="modal" aria-label="Close">
                                <i className="fa-solid fa-close"> </i>
                            </button>
                            <div>
                                <h1 className="text-center text-white p-4 mb-2" id="add-title">
                                    Añade un uso de reservado
                                </h1>
                            </div>
                            <div className="justify-content-center align-items-center text-center my-5 pt-md-5">
                                <div className="row mx-0 px-0 justify-content-center text-center gap-3 gap-md-0">
                                    <input type="date" className="col-md-3 col-11 p-3 rounded-0 border-1 " id="inputDate" placeholder="Fecha" onChange={(e) => { updateDateTime(e.target.value); }} />
                                    <div className="col-md-6">
                                    <select id="inputCategory" className="w-100 rounded-0" onChange={(e) => {updateUsageCategory(e.target.value);}}>
                                        <option>Selecciona una categoría</option>
                                        {store.ocassionalcategories?.map((ocassionalcategory) => {
                                            return (
                                                <option key={ocassionalcategory.id} value={ocassionalcategory.id}>
                                                    {ocassionalcategory.name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    </div>
                                    <input type="text" className="col-md-2 col-11 p-3 rounded-0 border-1 mx-3" id="inputQuantity" placeholder="0.00 €" onChange={(e) => {updateValue(e.target.value);}}/>
                                </div>
                                <button className="mt-5" title="Añadir categoría" type="button" data-bs-toggle="modal" data-bs-target="#categoryModal">
                                    Añadir una nueva categoría
                                </button>
                            </div>
                            <div className="justify-content-center align-items-center">
                                <div className="text-center">
                                    <button className="btn-add-form btn btn-lg m-3 mb-4 py-3 px-5 fs-3 rounded-pill text-white" onClick={() => addUsage()} data-bs-dismiss="modal">
                                        Añadir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddCategoryModal />
        </>
    );
};