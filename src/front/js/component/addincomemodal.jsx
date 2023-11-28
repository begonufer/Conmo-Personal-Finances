import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/forms.css";

export const AddIncomeModal = () => {
    const { store, actions } = useContext(Context);
    useEffect(() => {
      actions.getIncomeCategories();
    }, []);

    const [value, setValue] = useState("");
    const [incomecategory_id, setIncomecategory_id] = useState("");
    const [dateTime, setDateTime] = useState("");
    const updateValue = (valueInputValue) => {
      setValue(valueInputValue);
    };
    const updateIncomeCategory = (categoryInputValue) => {
      setIncomecategory_id(categoryInputValue);
    };
    const updateDateTime = (dateTimeInputValue) => {
      setDateTime(dateTimeInputValue);
    };
  
    const addincome = async () => {
      await actions.setIncome(dateTime, incomecategory_id, value);
      console.log(store.incomes)
    };

    return (
        <>
            <div className="modal fade" id="incomeModal" tabIndex="-1" aria-labelledby="incomeModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-body p-0 m-0">
                            <button type="button" className="btn text-white fs-2 position-absolute top-0 end-0 px-4 py-3" data-bs-dismiss="modal" aria-label="Close">
                                <i className="fa-solid fa-close"> </i>
                            </button>
                            <div>
                                <h1 className="text-center text-white p-4 mb-2" id="add-title">
                                    Añade un ingreso
                                </h1>
                            </div>
                            <div className="justify-content-center align-items-center text-center mt-2 pt-4 pb-5 mb-5">
                                <div className="row mt-5 mx-0 px-0 justify-content-center text-center">
                                    <input type="date" className="col-3 rounded-0 border-1 " id="inputDate" placeholder="Fecha" onChange={(e) => { updateDateTime(e.target.value); }} />
                                    <div className="col-6">
                                        <select id="inputCategory" className="w-100 rounded-0" onChange={(e) => {updateIncomeCategory(e.target.value);}}>
                                            <option>Selecciona una categoría</option>
                                            {store.incomecategories?.map((incomecategory) => {
                                                return (
                                                    <option key={incomecategory.id} value={incomecategory.id}>
                                                        {incomecategory.name}
                                                    </option>
                                                );
                                            })}
                                            <option>Nueva categoría</option>
                                        </select>
                                    </div>
                                    <input type="text" className="col-2 rounded-0 border-1 mx-3" id="inputQuantity" placeholder="€" onChange={(e) => {updateValue(e.target.value);}}/>
                                </div>
                            </div>
                            <div className="justify-content-center text-center">
                                <div className="container-fluid mx-0 px-0 justify-content-center text-center">
                                    <strong className="row justify-content-center text-center border-3 p-1 pb-0 mx-0" id="saves-title">
                                        Reservas
                                    </strong>
                                    <p className="text-center pb-3">Elige el porcentaje del ingreso que quieres reservar en cada categoría.</p>
                                    <div className="row m-3 px-5 mx-5 justify-content-center text-center">
                                        <div className="col-2 p-0 m-0 text-center">
                                            <input type="text" className="pt-2 rounded-0" id="inputSave" placeholder="Categoría 1"/>
                                            <input type="text" className="pt-2 rounded-0" id="inputSave" placeholder="Categoría 2"/>
                                            <input type="text" className="pt-2 rounded-0" id="inputSave" placeholder="Categoría 3"/>
                                            <input type="text" className="pt-2 rounded-0" id="inputSave" placeholder="Categoría 4"/>
                                            <input type="text" className="pt-2 rounded-0" id="inputSave" placeholder="Categoría 5"/>
                                            <input type="text" className="pt-2 mt-2 rounded-0" id="inputSave" placeholder="Total"/>
                                        </div>
                                        <div className="col-2">
                                            <input type="text" className="pt-2 rounded-0" id="inputSave" placeholder="10%"/>
                                            <input type="text" className="pt-2 rounded-0" id="inputSave" placeholder="5%"/>
                                            <input type="text" className="pt-2 rounded-0" id="inputSave" placeholder="5%"/>
                                            <input type="text" className="pt-2 rounded-0" id="inputSave" placeholder="5%"/>
                                            <input type="text" className="pt-2 rounded-0" id="inputSave" placeholder="5%"/>
                                            <input type="text" className="pt-2 mt-2 rounded-0" id="inputSave" placeholder="30%"/>
                                        </div>
                                        <div className="col-2">
                                            <input type="text" className="pt-2 rounded-0" id="inputSave" placeholder="85€"/>
                                            <input type="text" className="pt-2 rounded-0" id="inputSave" placeholder="35€"/>
                                            <input type="text" className="pt-2 rounded-0" id="inputSave" placeholder="35€"/>
                                            <input type="text" className="pt-2 rounded-0" id="inputSave" placeholder="35€"/>
                                            <input type="text" className="pt-2 rounded-0" id="inputSave" placeholder="35€"/>
                                            <input type="text" className="pt-2 mt-2 rounded-0" id="inputSave" placeholder="350€"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mx-0 px-0 mt-5 pt-3 justify-content-center align-bottom ">
                                <button className="btn-add-form col-3 btn btn-lg m-3 mb-4 py-3 fs-3 rounded-pill text-white" onClick={() => addincome()} data-bs-dismiss="modal">
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