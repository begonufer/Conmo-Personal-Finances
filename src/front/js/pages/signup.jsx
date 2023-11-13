import React, { useContext , useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/welcome.css";

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
        navigate('/income');
        setLoading(false);
    }
    return (
        <>
            {loading}
            {!loading && (<div className="w-100">
                <div className="m-0 vh-100 row justify-content-center align-items-center">
                    <div className="col-9 p-0 rounded shadow" id="left-background">
                        <div className="row d-flex text-center justify-content-between text-center align-items-center rounded-1">
                            <div className="col-4 p-5 text-center rounded-1">
                                <h1 className="conmo text-center">CONMO</h1>
                                <h3 className="text-white text-center">Control your money</h3>
                            </div>
                            <div className="col-8 p-5 text-center rounded" id="right-background">
                                <div className="mb-5">
                                    <h1 className="text-white pb-5">Registro</h1>                                    
                                </div>
                                <div className="mt-5">
                                    <input type="text" onChange={(e)=>{updateName(e.target.value)}} id="inputName" className="w-100 my-3 border-0 border-bottom border-color-light rounded-0" aria-describedby="passwordHelpBlock" placeholder="Nombre"/>
                                    <input type="text" onChange={(e)=>{updateSurname(e.target.value)}} id="inputSurname" className="w-100 my-3 border-0 border-bottom border-color-light rounded-0" aria-describedby="passwordHelpBlock" placeholder="Apellidos"/>
                                    <input type="email" onChange={(e)=>{updateEmail(e.target.value)}} id="inputEmail" className="w-100 my-3 border-0 border-bottom border-color-light rounded-0" aria-describedby="passwordHelpBlock" placeholder="Email"/>
                                    <input type="password" onChange={(e)=>{updatePassword(e.target.value)}} id="inputPassword" className="w-100 my-3 border-0 border-bottom border-color-light rounded-0" aria-describedby="passwordHelpBlock" placeholder="Contraseña"/>
                                    <small id="passwordHelpBlock" className="form-text text-white">
                                        Tu contraseña debe tener un mínimo de 8 carácteres, contener letras y números, y no puede contener espacios ni carácteres especiales.
                                    </small>
                                    <input type="password" id="inputPasswordConfirm" className="w-100 my-3 border-0 border-bottom border-color-light rounded-0" aria-describedby="passwordHelpBlock" placeholder="Confirma contraseña"/>
                                </div>
                                <div className="ml-auto">
                                    <Link to="/signup">
                                        <button id="button-confirm"className="btn btn-lg mt-5 mb-3 text-white fs-4" onClick={signup}>Aceptar</button>
                                    </Link>
                                </div>
                                <span className="text-white">¿Ya tienes cuenta? <a href="/login"> Entrar </a> </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
        </>
    )
}