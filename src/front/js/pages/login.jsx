import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/welcome.css";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const updateEmail = (emailInputValue) => {
        setEmail(emailInputValue);
    };

    const updatePassword = (passwordInputValue) => {
        setPassword(passwordInputValue);
    };

    const { actions } = useContext(Context);
    const login = async () => {
        await actions.setUser(email, password);
        navigate('/myconmo');
    };

    return (
        <>
            {loading}
            {!loading && (<div className="w-100">
                <div className="m-0 vh-100 row justify-content-center align-items-center">
                    <div className="col-auto login p-0 rounded shadow">
                        <div className="row p-md-5 p-2 m-0 text-center justify-content-center align-items-center rounded-1">
                            <div className="col-auto p-md-5 p-3 text-center rounded-1">
                                <h1 className="conmo-lg m-0 text-center">CONMO</h1>
                                <h3 className="text-white pb-md-0 pb-3 text-center">Control your money</h3>
                            </div>
                            <div className="col-auto m-0 p-md-5 py-5 text-center rounded-1" id="left-background">
                                <div className="mb-3">
                                    <h1 className="text-white title-in pb-5">Iniciar sesión</h1>
                                </div>
                                <div className="mt-3">
                                    <input
                                        type="email"
                                        onChange={(e) => {updateEmail(e.target.value)}}
                                        className="w-100 my-3 border-0 border-bottom border-color-light rounded-0 text-center"
                                        id="inputEmail"
                                        aria-describedby="passwordHelpBlock"
                                        placeholder="Email"
                                    />
                                    <input
                                    type="password"
                                    onChange={(e) => {
                                        updatePassword(e.target.value);
                                    }}
                                    id="inputPassword"
                                    className="w-100 mt-3 mb-3 border-0 border-bottom border-color-light rounded-0 text-center"
                                    aria-describedby="passwordHelpBlock"
                                    placeholder="Contraseña"
                                    />
                                    <small
                                        id="passwordHelpBlock"
                                        className="form-text text-white"
                                    >
                                        He olvidado mi contraseña
                                    </small>
                                </div>
                                <div className="ml-auto mb-md-0 mb-5">
                                    <button
                                        id="button-confirm"
                                        className="btn btn-lg mt-5 mb-3 text-white fs-4"
                                        onClick={login}
                                    >
                                        Aceptar
                                    </button>
                                </div>
                                <span className="text-white">
                                    ¿No tienes cuenta? <Link to="/signup"> Regístrate </Link>{" "}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
        </>
    );
};