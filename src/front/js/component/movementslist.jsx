import React from "react";
import { Link } from "react-router-dom";

export const MovementsList = () => {
    return (
        <>
            <div id="resumen" className="container p-4 mb-5">
                <div className="row">
                    <h2 className="text-center pt-3">Resumen</h2>
                    <p className="text-center pb-5">Listado de todos las operaciones realizadas en orden cronológico</p>
                </div>
                <div className="wrap flex-column px-5 mx-5">
                    <div className="table row justify-content-center align-items-center">
                        <table className="table text-center p-4">
                            <thead>
                                <tr id="table-title">
                                    <th className="col text-white text-center">Fecha</th>
                                    <th className="col text-white text-center">Tipo</th>
                                    <th className="col text-white text-center">Categoria</th>
                                    <th className="col text-white text-center">Importe</th>
                                    <th className="col text-white text-center">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="col text-center">30/10/2023</td>
                                    <td className="col text-center">Gasto variable</td>
                                    <td className="col text-center">Comida</td>
                                    <td className="col text-center text-danger">-37€</td>
                                    <td className="col text-center">1735€</td>
                                </tr>
                                <tr>
                                    <td className="col text-center">27/10/2023</td>
                                    <td className="col text-center">Gasto fijo</td>
                                    <td className="col text-center">Alquiler</td>
                                    <td className="col text-center text-danger">-237€</td>
                                    <td className="col text-center">1772€</td>
                                </tr>
                                <tr>
                                    <td className="col text-center">23/10/2023</td>
                                    <td className="col text-center">Gasto variable</td>
                                    <td className="col text-center">Comida</td>
                                    <td className="col text-center text-danger">-29€</td>
                                    <td className="col text-center">2009€</td>
                                </tr>
                                <tr>
                                    <td className="col text-center">19/10/2023</td>
                                    <td className="col text-center">Gasto fijo</td>
                                    <td className="col text-center">Luz</td>
                                    <td className="col text-center text-danger">-87€</td>
                                    <td className="col text-center">2038€</td>
                                </tr>
                                <tr>
                                    <td className="col text-center">19/10/2023</td>
                                    <td className="col text-center">Income</td>
                                    <td className="col text-center">Bizum</td>
                                    <td className="col text-center text-success">137€</td>
                                    <td className="col text-center">2125€</td>
                                </tr>
                                <tr>
                                    <td className="col text-center">19/10/2023</td>
                                    <td className="col text-center">Gasto variable</td>
                                    <td className="col text-center">Comida</td>
                                    <td className="col text-center text-danger">-36€</td>
                                    <td className="col text-center">1988€</td>
                                </tr>
                                <tr>
                                    <td className="col text-center">13/10/2023</td>
                                    <td className="col text-center">Income</td>
                                    <td className="col text-center">Salario</td>
                                    <td className="col text-center text-success">1237€</td>
                                    <td className="col text-center">2024€</td>
                                </tr>
                                <tr>
                                    <td className="col text-center">08/10/2023</td>
                                    <td className="col text-center">Gasto fijo</td>
                                    <td className="col text-center">Internet</td>
                                    <td className="col text-center text-danger">-37€</td>
                                    <td className="col text-center">787€</td>
                                </tr>
                                <tr>
                                    <td className="col text-center">04/10/2023</td>
                                    <td className="col text-center">Gasto variable</td>
                                    <td className="col text-center">Comida</td>
                                    <td className="col text-center text-danger">-61€</td>
                                    <td className="col text-center">824€</td>
                                </tr>
                                <tr>
                                    <td className="col text-center">04/10/2023</td>
                                    <td className="col text-center">Gasto variable</td>
                                    <td className="col text-center">Ropa</td>
                                    <td className="col text-center text-danger">-52€</td>
                                    <td className="col text-center">885€</td>
                                </tr>
                                <tr>
                                    <td className="col text-center">01/10/2023</td>
                                    <td className="col text-center">Gasto variable</td>
                                    <td className="col text-center">Tecnología</td>
                                    <td className="col text-center text-danger">-17€</td>
                                    <td className="col text-center">937€</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <Link to="/expenses"> {/*Atención a esta función y/o botón*/}
                    <button
                        id="button-confirm"
                        className="btn btn-lg w-100 text-white fs-4 mt-5"
                    >
                        Descargar en pdf
                    </button>
                </Link>
            </div>
        </>
    )
}