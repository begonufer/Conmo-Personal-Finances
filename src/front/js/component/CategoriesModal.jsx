import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const CategoriesModal = ({ action, storedData, type }) => {
    const { store, actions } = useContext(Context);

    const [editingCategoryId, setEditingCategoryId] = useState(null);

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
    const updateValue = (valueInputValue) => {
        setValue(valueInputValue);
    };

    const [modifyValue, setModifyValue] = useState("");
    const updateModifyValue = (inputValue) => {
        setModifyValue(inputValue);
    };

    const addCategory = async () => {
        await action(value);
        console.log("Category added");
        setEditingCategoryId(null);
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
        setValue("");
    };

    const deleteCategory = async (categoryId) => {
        let endpoint = '';
        switch (type) {
            case 'income':
                endpoint = 'incomes';
                break;
            case 'saved':
                endpoint = 'ocassionals';
                break;
            case 'usage':
                endpoint = 'ocassionals';
                break;
            case 'ocassional':
                endpoint = 'ocassionals';
                break;
            case 'fixed':
                endpoint = 'fixed';
                break;
            default:
                console.error('Invalid category type');
                return [];
        }
        try {
            await actions.getMovementsByCategory(categoryId, endpoint);
            const associatedMovements = store.movements;
            if (associatedMovements.length > 0) {
                alert('No puedes borrar esta categoría porque tiene movimientos asociados.');
                console.log('Category not deleted due to associated movements.');
                return;
            }
            console.log(associatedMovements);
            switch (type) {
                case "fixed":
                    await actions.deleteFixedCategory(categoryId);
                    break;
                case "income":
                    await actions.deleteIncomeCategory(categoryId);
                    break;
                case "saved":
                case "usage":
                case "ocassional":
                    await actions.deleteOcassionalCategory(categoryId);
                    break;
                default:
                    break;
            }
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
        } catch (error) {
            console.error('Error to delete category:', error);
        }
    };
    
    const modifyCategory = async (categoryId) => {
        if (editingCategoryId === categoryId) {
            setEditingCategoryId(null);
        } else {
            setEditingCategoryId(categoryId);
        }
    };

    const saveModifiedCategory = async (categoryId) => {
        switch (type) {
            case "fixed":
                await actions.modifyFixedCategory(categoryId, modifyValue);
                break;
            case "income":
                await actions.modifyIncomeCategory(categoryId, modifyValue);
                break;
            case "saved":
            case "usage":
            case "ocassional":
                await actions.modifyOcassionalCategory(categoryId, modifyValue);
                break;
            default:
                break;
        }
        setEditingCategoryId(null);
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
        };
        setModifyValue("");
    };

    const sortedCategories = storedData?.slice().sort((a, b) => a.id - b.id);

    return (
        <>
            <div className="modal fade" id="deleteCategoryModal" tabIndex="-1" aria-labelledby="categoryModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content modal-border">
                        <div className="modal-body p-0 m-0">
                            <button type="button" className="btn text-white fs-2 position-absolute top-0 end-0 px-4 py-3" data-bs-dismiss="modal" aria-label="Close">
                                <i className="fa-solid fa-close"> </i>
                            </button>
                            <div>
                                <h1 className="text-center title-in conmo-bg p-4 mb-2">
                                    Categorías
                                </h1>
                            </div>
                            <div className="justify-content-center align-items-center text-center my-5">
                                <div className="px-5 d-flex align-items-center">
                                    <input type="text" value={value} className="col rounded-0 mobile-text border-1 overflow-hidden text-truncate" id="inputQuantity" placeholder="Nueva categoría" onChange={(e) => {updateValue(e.target.value);}}/>
                                    <button className="col-auto conmo-bg py-1 px-4 ms-3 fs-5 rounded-pill text-white" onClick={() => addCategory()}>
                                        <span className="fa fa-plus"></span>
                                    </button>
                                </div>
                                <div className="px-5 pt-2 justify-content-center text-center">
                                {sortedCategories?.map((category) => {
                                    return (
                                        <div key={category.id} value={category.id}>
                                            {editingCategoryId === category.id ? (
                                                <div className="d-md-flex d-sm-block align-items-center">
                                                    <input
                                                        type="text"
                                                        value={modifyValue}
                                                        id="inputQuantity"
                                                        className="col-md col-sm-12 my-1 rounded-0 mobile-text conmo-text text-center border-1 overflow-hidden text-truncate"
                                                        placeholder={category.name}
                                                        onChange={(e) => updateModifyValue(e.target.value)}
                                                    />  
                                                    <button className="col-md-auto col-sm-3 conmo-bg py-1 px-4 me-1 fs-5 rounded-pill text-white" onClick={() => saveModifiedCategory(category.id)}>
                                                        <span className="fa fa-check"></span>
                                                    </button>
                                                    <button className="col-md-auto col-sm-3 conmo-bg py-1 px-4 me-1 fs-5 rounded-pill text-white" onClick={() => deleteCategory(category.id)}>
                                                        <span className="fa fa-trash"></span>
                                                    </button>
                                                    <button className="col-md-auto col-sm-3 conmo-bg py-1 px-4 fs-5 rounded-pill text-white" onClick={() => modifyCategory(category.id)}>
                                                        <span className="fa fa-pencil"></span>
                                                    </button>                                             
                                                </div>
                                            ) : (
                                                <div className="d-flex align-items-center">
                                                    <p className="col conmo-text m-0 fs-2 overflow-hidden text-truncate">{category.name}</p>
                                                    <button className="col-auto conmo-bg py-1 px-4 me-1 fs-5 rounded-pill text-white" onClick={() => deleteCategory(category.id)}>
                                                        <span className="fa fa-trash"></span>
                                                    </button>
                                                    <button className="col-auto conmo-bg py-1 px-4 fs-5 rounded-pill text-white" onClick={() => modifyCategory(category.id)}>
                                                        <span className="fa fa-pencil"></span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};