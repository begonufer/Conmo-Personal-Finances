import React, { useContext , useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

import { Spinner } from "../component/Spinner.jsx";

export const Signup =()=>{
    const [name,setName] = useState('');
    const [surname,setSurname] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const updateName = (nameInputValue) => {
        setName(nameInputValue)
    }

    const updateSurname= (surnameInputValue) => {
        setSurname(surnameInputValue)
    }
    const updateEmail = (emailInputValue) => {
        setEmail(emailInputValue)
    }

    const updatePassword = (passwordInputValue) => {
        setPassword(passwordInputValue)
    }

    const { actions } = useContext(Context);
    const signup = async() => {
        setLoading(true);
        await actions.setNewUser(name,surname,email,password);
        await actions.setUser(email, password);
        navigate('/myconmo');
        setLoading(false);
    }
    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
            <div className="w-100">
                <div className="m-0 vh-100 row justify-content-center align-items-center">
                    <div className="col-auto conmo-bg p-0 rounded shadow">
                        <div className="row p-md-5 p-2 m-0 text-center justify-content-center align-items-center rounded-1">
                            <div className="col-auto p-md-5 p-3 text-center rounded-1">
                                <h1 className="conmo-lg m-0 text-center">CONMO</h1>
                                <h3 className="text-white pb-md-0 pb-3 text-center">Control your money</h3>
                            </div>
                            <div className="col-auto m-0 p-md-5 py-5 text-center rounded-1 conmo-light-bg">
                                <div className="mb-3">
                                    <h1 className="title-in pb-5">Registro</h1>                                    
                                </div>
                                <div className="mt-3">
                                    <input type="text" onChange={(e)=>{updateName(e.target.value)}} id="inputName" className="w-100 my-3 border-0 border-bottom border-color-light rounded-0 text-center" aria-describedby="passwordHelpBlock" placeholder="Nombre"/>
                                    <input type="text" onChange={(e)=>{updateSurname(e.target.value)}} id="inputSurname" className="w-100 my-3 border-0 border-bottom border-color-light rounded-0 text-center" aria-describedby="passwordHelpBlock" placeholder="Apellidos"/>
                                    <input type="email" onChange={(e)=>{updateEmail(e.target.value)}} id="inputEmail" className="w-100 my-3 border-0 border-bottom border-color-light rounded-0 text-center" aria-describedby="passwordHelpBlock" placeholder="Email"/>
                                    <input type="password" onChange={(e)=>{updatePassword(e.target.value)}} id="inputPassword" className="w-100 my-3 border-0 border-bottom border-color-light rounded-0 text-center" aria-describedby="passwordHelpBlock" placeholder="Contraseña"/>
                                    {/* <small id="passwordHelpBlock" className="form-text text-white">
                                        Tu contraseña debe tener un mínimo de 8 carácteres, contener letras y números, y no puede contener espacios ni carácteres especiales.
                                    </small>
                                    <input type="password" id="inputPasswordConfirm" className="w-100 my-3 border-0 border-bottom border-color-light rounded-0 text-center" aria-describedby="passwordHelpBlock" placeholder="Confirma contraseña"/> */}
                                </div>
                                <div className="ml-auto mb-md-0 mb-5">
                                    <button id="button-confirm" className="btn btn-lg mt-5 mb-3 text-white fs-4" onClick={signup}>Aceptar</button>
                                </div>
                                <span className="text-white">¿Ya tienes cuenta? <a href="/login"> Entrar </a> </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    )
}