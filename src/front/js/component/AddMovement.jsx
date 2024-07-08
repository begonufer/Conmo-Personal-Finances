import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { CategoriesModal } from "../component/CategoriesModal.jsx";

export const AddMovement = ({ type, actionSet, typeName, storedData, actionCategory }) => {

    const { store, actions } = useContext(Context);

    useEffect(() => {
        switch (type) {
            case "fixed":
                actions.getFixedCategories();
                break;
            case "income":
                actions.getIncomeCategories();
                break;
            case "saved":
            case "usage":
            case "ocassional":
                actions.getOcassionalCategories();
                break;
            default:
                break;
        }
    }, [type]);

    const [value, setValue] = useState("");
    const [category_id, setCategory_id] = useState("");
    const [category_name, setCategory_name] = useState(""); 
    const [dateTime, setDateTime] = useState("");

    const updateValue = (valueInputValue) => { setValue(valueInputValue); };

    const updateCategory = (categoryInputValue) => {
        setCategory_id(categoryInputValue);
        const selectedCategory = storedData.find(category => category.id === parseInt(categoryInputValue));
        if (selectedCategory) {
            setCategory_name(selectedCategory.name);
        }
    };
    const updateDateTime = (dateTimeInputValue) => { setDateTime(dateTimeInputValue); };

    const addMovement = async () => {
        await actionSet(dateTime, category_id, category_name, value);
        setValue("");
        setCategory_id("");
        setCategory_name("");
        setDateTime("");
    };

    return (
        <>
            <div className="modal fade" id="addMovementModal" tabIndex="-1" aria-labelledby="addMovementModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content modal-border">
                        <div className="modal-body p-0 m-0">
                            <button type="button" className="btn text-white fs-2 position-absolute top-0 end-0 px-4 py-3" data-bs-dismiss="modal" aria-label="Close">
                                <i className="fa-solid fa-close"> </i>
                            </button>
                            <div>
                                <h1 className="text-center title-in conmo-bg p-4 mb-2">
                                    Añade {typeName}
                                </h1>
                            </div>
                            <div className="justify-content-center align-items-center text-center my-5 pt-md-5">
                                <div className="row mx-0 px-0 justify-content-center text-center gap-3 gap-md-0">
                                    <input type="date" value={dateTime} className="col-md-3 col-11 p-3 rounded-0 border-1 " id="inputDate" placeholder="Fecha" onChange={(e) => { updateDateTime(e.target.value); }} />
                                    <div className="col-md-6">
                                        <select id="inputCategory" value={category_id} className="w-100 rounded-0" onChange={(e) => {updateCategory(e.target.value);}}>
                                            <option>Selecciona una categoría</option>
                                            {storedData?.map((category) => {
                                                return (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <input type="text" value={value} className="col-md-2 col-11 p-3 rounded-0 border-1 mx-3" id="inputQuantity" placeholder="0.00 €" onChange={(e) => {updateValue(e.target.value);}}/>
                                </div>
                                <button className="mt-5" title="Eliminar categoría" type="button" data-bs-toggle="modal" data-bs-target="#deleteCategoryModal">
                                    Administrar categorías
                                </button>
                            </div>
                            <div className="justify-content-center align-items-center">
                                <div className="text-center">
                                    <button className="conmo-bg btn btn-lg m-3 mb-4 py-3 px-5 fs-3 rounded-pill text-white" onClick={() => addMovement()} data-bs-dismiss="modal">
                                        Añadir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CategoriesModal action={actionCategory} storedData={storedData} type={type} />
        </>
    );
};