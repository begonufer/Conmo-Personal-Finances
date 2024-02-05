import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { AddMovement } from "../component/AddMovement.jsx";

export const AddButton = () => {

    const { store, actions } = useContext(Context);

    const [selectedButton, setSelectedButton] = useState(null);
    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
    };
    return (
        <>
            <div className="group-floating-button">
                <ul className="sub-buttons">
                    <input type="checkbox" id="all-buttons-up" className="all-buttons-up-toggle" name="all-buttons-up-toggle"/>
                    <li className="boton" id="boton5">
                        <button href="#" title="Añadir ingreso" type="button" data-bs-toggle="modal" data-bs-target="#addMovementModal" onClick={() => handleButtonClick("income")}>
                            <i className="fa-solid fa-landmark"></i>
                        </button>
                    </li>
                    <li className="boton" id="boton4">
                        <button href="#" title="Añadir reserva" type="button" data-bs-toggle="modal" data-bs-target="#addMovementModal" onClick={() => handleButtonClick("saved")}>
                            <i className="fa-solid fa-box"></i>
                        </button>
                    </li>
                    <li className="boton" id="boton3">
                        <button href="#" title="Añadir uso de reservado" type="button" data-bs-toggle="modal" data-bs-target="#addMovementModal" onClick={() => handleButtonClick("usage")}>
                            <i className="fa-solid fa-box-open"></i>
                        </button>
                    </li>
                    <li className="boton" id="boton2">
                        <button href="#" title="Añadir gasto fijo" type="button" data-bs-toggle="modal" data-bs-target="#addMovementModal" onClick={() => handleButtonClick("fixed")}>
                            <i className="fa-solid fa-circle-dollar-to-slot"> </i>
                        </button>
                    </li>
                    <li className="boton boton-first" id="boton1">
                        <button href="#" title="Añadir gasto ocasional" type="button" data-bs-toggle="modal" data-bs-target="#addMovementModal" onClick={() => handleButtonClick("ocassional")}>
                            <i className="fa-solid fa-cash-register"></i>
                        </button>
                    </li>
                    <li className="main-button">
                        <button href="#">
                            <label className="all-buttons-up-toggle-lbl" htmlFor="all-buttons-up">
                                <span className="fa fa-plus"></span>
                            </label>
                        </button>
                    </li>
                </ul>
            </div>
            <AddMovement
                type={
                    selectedButton === "income"
                        ? "income"
                        : selectedButton === "saved"
                        ? "saved"
                        : selectedButton === "usage"
                        ? "usage"
                        : selectedButton === "fixed"
                        ? "fixed"
                        : selectedButton === "ocassional"
                        ? "ocassional"
                        : null
                    }
                actionSet={
                    selectedButton === "income"
                        ? actions.setIncome
                        : selectedButton === "saved"
                        ? actions.setSaved
                        : selectedButton === "usage"
                        ? actions.setUsage
                        : selectedButton === "fixed"
                        ? actions.setFixed
                        : selectedButton === "ocassional"
                        ? actions.setOcassional
                        : null
                }
                actionCategory={
                    selectedButton === "income"
                        ? actions.setIncomeCategory
                        : selectedButton === "saved"
                        ? actions.setOcassionalCategory
                        : selectedButton === "usage"
                        ? actions.setOcassionalCategory
                        : selectedButton === "fixed"
                        ? actions.setFixedCategory
                        : selectedButton === "ocassional"
                        ? actions.setOcassionalCategory
                        : null
                }
                storedData={
                    selectedButton === "income"
                        ? store.incomecategories
                        : selectedButton === "saved"
                        ? store.ocassionalcategories
                        : selectedButton === "usage"
                        ? store.ocassionalcategories
                        : selectedButton === "fixed"
                        ? store.fixedcategories
                        : selectedButton === "ocassional"
                        ? store.ocassionalcategories
                        : null
                }
                typeName={
                    selectedButton === "income"
                        ? "un ingreso"
                        : selectedButton === "saved"
                        ? "una reserva"
                        : selectedButton === "usage"
                        ? "un uso de reservado"
                        : selectedButton === "fixed"
                        ? "un gasto fijo"
                        : selectedButton === "ocassional"
                        ? "un gasto ocasional"
                        : null
                }
            />
        </>
    );
};