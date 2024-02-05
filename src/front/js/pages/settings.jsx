import React, { useContext , useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const Settings =()=>{
    return (
        <>
            <div className="container-fluid">
                <div className="m-0 vh-100 row justify-content-center align-items-center">
                    <div className="col-9 p-0 rounded shadow conmo-light-bg">
                        <div className="row d-flex text-center justify-content-between text-center align-items-center rounded-1">
                            <div className="col-8 p-5 text-center rounded" id="right-background">
                                <h1 className="text-white pb-5 mb-5">Configuración</h1>
                                <div className="mt-5">
                                    <input type="text" id="inputName" className="w-100 my-3 border-0 border-bottom border-color-light rounded-0" placeholder="Nombre"/>
                                    <input type="text" id="inputSurname" className="w-100 my-3 border-0 border-bottom border-color-light rounded-0" placeholder="Apellidos"/>
                                    <input type="email" id="inputEmail" className="w-100 my-3 border-0 border-bottom border-color-light rounded-0" placeholder="Email"/>
                                    <input type="password" id="inputPassword" className="w-100 my-3 border-0 border-bottom border-color-light rounded-0" placeholder="Contraseña"/>
                                </div>
                                <button id="button-confirm" className="btn btn-lg ml-auto mt-5 mx-3 mb-3 text-white fs-4">Guardar cambios</button>
                            </div>
                            <div className="col-4 p-5 text-center rounded-1">
                                <h1 className="conmo text-center">CONMO</h1>
                                <h3 className="text-white text-center">Control your money</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}