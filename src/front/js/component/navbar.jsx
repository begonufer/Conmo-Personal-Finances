import React from "react";
import { Link } from "react-router-dom";
import "../../styles/welcome.css";

export const Navbar = () => {
	return (
        <>
            <nav className="navbar navbar-light fixed-top">
                <div className="container-fluid">
                    <div className="col d-flex justify-content-around px-4">
                        <Link to="/myconmo" className="navbar-brand align-middle align-items-center text-decoration-none">
                            <span className="conmo text-center fs-1 pt-2">CONMO</span>
                        </Link>
                        <button className="btn btn-lg text-white fs-4 align-middle text-decoration-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                            <i className="fa-solid fa-bars"></i>
                        </button>
                    </div>
                    <div className="offcanvas offcanvas-end p-3" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <Link to="/myconmo" className="navbar-brand align-middle align-items-center text-decoration-none">
                                <span className="text-white fs-1">Mi</span><span className="conmo text-center fs-1">CONMO</span>
                            </Link>
                        </div>
                        <div className="offcanvas-body">
                            <div className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <Link to="/incomes" className="nav-item pb-5 px-3 fs-4 p-1">
                                    <i className="fa-solid fa-landmark"> </i> <span>Ingresos</span>
                                </Link>
                                <Link to="/expenses" className="nav-item pb-5 px-3 fs-4 p-1">
                                    <i className="fa-solid fa-receipt"> </i> <span>Gastos</span>
                                </Link>
                                <Link to="/fixedexpenses" className="nav-item pb-5 px-3 fs-4 p-1">
                                    <i className="fa-solid fa-circle-dollar-to-slot"> </i> <span>Gastos fijos</span>
                                </Link>
                                <Link to="/variableexpenses" className="nav-item pb-5 px-3 fs-4 p-1">
                                    <i className="fa-solid fa-cash-register"></i> <span>Gastos variables</span>                       
                                </Link>
                                <Link to="/saves" className="nav-item pb-5 px-3 fs-4 p-1">
                                    <i className="fa-solid fa-box"></i> <span>Reserva</span>                     
                                </Link>
                            </div>
                            <div className="available row rounded-pill text-white pb-2 pt-3 mb-2 align-items-center text-center">
                                <h4 className="col">Disponible</h4>
                                <h4 className="col"><strong>747€</strong></h4>
                            </div>
                            <div className="dropdown">
                                <div 
                                    className="available row rounded-pill text-white pb-2 pt-3 mb-2 align-items-center text-center dropdown-toggle"
                                    type="button"
                                    id="savesDetails"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <h4 className="col">Reservado</h4>
                                    <h4 className="col"><strong>5437€</strong></h4>
                                </div>
                                <ul className="dropdown-menu available p-4 fs-5 text-white" aria-labelledby="savesDetails">
                                    <li className="row available text-center p-0 m-0">
                                        <td className="col text-center">adsgkjslafg</td>
                                        <td className="col text-center">783€</td>
                                    </li>
                                    <li className="row available mt-1 text-center p-0 m-0">
                                        <td className="col text-center">Categoria</td>
                                        <td className="col text-center">231€</td>
                                    </li>
                                    <li className="row available mt-1 text-center p-0 m-0">
                                        <td className="col text-center">Categoria</td>
                                        <td className="col text-center">400€</td>
                                    </li>
                                    <li className="row available mt-1 text-center p-0 m-0">
                                        <td className="col text-center">DSAGKHSALFGSAK</td>
                                        <td className="col text-center">610€</td>
                                    </li>
                                    <li className="row available mt-1 text-center p-0 m-0">
                                        <td className="col text-center">Categoria</td>
                                        <td className="col text-center">285€</td>
                                    </li>
                                </ul>
                            </div>
                            <div className="d-flex flex-column position-absolute bottom-0 ">
                                <Link to="/settings" className="pb-5 px-3 fs-4 p-1 text-decoration-none">
                                    <i className="fa-solid fa-gear"></i> <span className="ms-1 d-none d-sm-inline">Configuración</span>
                                </Link>
                                <Link to="/login" className="pb-5 px-3 fs-4 p-1 mb-3 text-decoration-none" onClick={() => logout()}>
                                    <i className="fa-solid fa-right-from-bracket"></i> <span className="ms-1 d-none d-sm-inline">Sign out</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
	);
};