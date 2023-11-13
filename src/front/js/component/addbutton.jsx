import React from "react";
import "../../styles/addbutton.css";
import { AddIncomeModal } from "../component/addincomemodal.jsx";
import { AddVariableModal } from "../component/addvariablemodal.jsx";
import { AddFixedModal } from "../component/addfixedmodal.jsx";

export const AddButton = () => {
    return (
        <>
            <div className="group-floating-button">
                <ul className="sub-buttons">
                    <input type="checkbox" id="all-buttons-up" className="all-buttons-up-toggle" name="all-buttons-up-toggle" />
                    <li className="boton" id="boton3">
                        <a href="javascript:void(0)" title="Añadir ingreso" type="button" data-bs-toggle="modal" data-bs-target="#incomeModal">
                            <i className="fa-solid fa-landmark"></i>
                        </a>
                    </li>
                    <li className="boton" id="boton2">
                        <a href="javascript:void(0)" title="Añadir gasto fijo" type="button" data-bs-toggle="modal" data-bs-target="#fixedModal">
                            <i className="fa-solid fa-circle-dollar-to-slot"> </i>
                        </a>
                    </li>
                    <li className="boton boton-first" id="boton1">
                        <a href="javascript:void(0)" title="Añadir gasto variable" type="button" data-bs-toggle="modal" data-bs-target="#variableModal">
                            <i className="fa-solid fa-cash-register"></i>
                        </a>
                    </li>
                    <li className="main-button">
                        <a href="javascript:void(0)">
                            <label className="all-buttons-up-toggle-lbl" for="all-buttons-up">
                                <span className="fa fa-plus"></span>
                            </label>
                        </a>
                    </li>
                </ul>
            </div>
            <AddIncomeModal />
            <AddVariableModal />
            <AddFixedModal />
        </>
    );
};