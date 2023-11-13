import React from "react";

export const Resume = () => {
    return (
        <>
            <div className="row gap-5 m-5" id="table-of-percentages">
                    <div className="col"  id="resumen">
                        <div className="row">
                            <h1 className="text-center py-3">OCTUBRE</h1>
                        </div>
                        <div className="wrap flex-column">
                            <div className="row  pb-2">
                                <div className="text-center">
                                    <h4 className="text-white p-2" id="table-incomes">INGRESOS</h4>
                                </div>
                                <div className="row text-center p-2">
                                    <p className="col text-center">Restante mes anterior</p>
                                    <p className="col text-center">Total €</p>
                                </div>
                                <div className="row text-center p-2">
                                    <td className="col-6 text-center">Categoría ingreso</td>
                                    <td className="col-3 text-center">%</td>
                                    <td className="col-3 text-center">€</td>                            
                                </div>
                                <div className="row text-center p-2">
                                    <td className="col-6 text-center">Categoría ingreso</td>
                                    <td className="col-3 text-center">%</td>
                                    <td className="col-3 text-center">€</td>                            
                                </div>
                                <div className="row text-center p-2">
                                    <td className="col-6 text-center">Categoría ingreso</td>
                                    <td className="col-3 text-center">%</td>
                                    <td className="col-3 text-center">€</td>                            
                                </div>
                            </div>
                            <div className="row  pb-2">
                                <div className="col-8 ">
                                    <div className="text-center">
                                        <h4 className="text-white p-2" id="table-saves">RESERVADO</h4>
                                    </div>
                                    <div className="row text-center p-2">
                                        <p className="col text-center">%</p>
                                        <p className="col text-center">€</p>
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col-6 text-center">Categoría reservado</td>
                                        <td className="col-3 text-center">%</td>
                                        <td className="col-3 text-center">€</td>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col-6 text-center">Categoría reservado</td>
                                        <td className="col-3 text-center">%</td>
                                        <td className="col-3 text-center">€</td>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col-6 text-center">Categoría reservado</td>
                                        <td className="col-3 text-center">%</td>
                                        <td className="col-3 text-center">€</td>                            
                                    </div>
                                </div>
                                <div className="col-4 ">
                                    <div className="text-center">
                                        <h4 className="text-white p-2" id="table-saves">USO RESERVADO</h4>
                                    </div>
                                    <div className="row text-center p-2">
                                        <p className="col text-center">%</p>
                                        <p className="col text-center">€</p>
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col text-center">%</td>
                                        <td className="col text-center">€</td>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col text-center">%</td>
                                        <td className="col text-center">€</td>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col text-center">%</td>
                                        <td className="col text-center">€</td>                            
                                    </div>
                                </div>
                            </div>
                            <div className="row  pb-2">
                                <div className="text-center">
                                    <h4 className="text-white p-2" id="table-expenses">GASTOS</h4>
                                </div>
                                <div className="row text-center p-2">
                                    <p className="col text-center">%</p>
                                    <p className="col text-center">Total €</p>
                                </div>
                            </div>
                            <div className="row ">
                                <div className="col ">
                                    <h4 className="text-white text-center p-2" id="table-fixed">GASTOS FIJOS</h4>
                                    <div className="row text-center p-2">
                                        <p className="col text-center">%</p>
                                        <p className="col text-center">€</p>
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col-6 text-center">Categoría gastos fijos</td>
                                        <td className="col-3 text-center">%</td>
                                        <td className="col-3 text-center">€</td>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col-6 text-center">Categoría gastos fijos</td>
                                        <td className="col-3 text-center">%</td>
                                        <td className="col-3 text-center">€</td>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col-6 text-center">Categoría gastos fijos</td>
                                        <td className="col-3 text-center">%</td>
                                        <td className="col-3 text-center">€</td>                            
                                    </div>
                                    <div id="table-title" className="row text-center text-white p-2">
                                        <td className="col text-center">LIBRE</td>
                                        <td className="col text-center">%</td>
                                        <td className="col text-center">€</td>                            
                                    </div>
                                </div>
                                <div className="col ">
                                    <div className="text-center">
                                        <h4 className="text-white p-2" id="table-ocassional">GASTOS VARIABLES</h4>
                                    </div>
                                    <div className="row text-center p-2">
                                        <p className="col text-center">%</p>
                                        <p className="col text-center">€</p>
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col-6 text-center">Categoría gastos variables</td>
                                        <td className="col-3 text-center">%</td>
                                        <td className="col-3 text-center">€</td>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col-6 text-center">Categoría gastos variables</td>
                                        <td className="col-3 text-center">%</td>
                                        <td className="col-3 text-center">€</td>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col-6 text-center">Categoría gastos variables</td>
                                        <td className="col-3 text-center">%</td>
                                        <td className="col-3 text-center">€</td>                            
                                    </div>
                                    <div className="row text-center bg-secondary text-white p-2">
                                        <td className="col text-center">RESTANTE</td>
                                        <td className="col text-center">%</td>
                                        <td className="col text-center">€</td>                            
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col" id="resumen">
                        <div className="row">
                            <h1 className="text-center py-3">2023</h1>
                        </div>
                        <div className="wrap flex-column">
                            <div className="row justify-content-center align-items-center pb-2">
                                <div className="text-center">
                                    <h4 className="text-white p-2" id="table-incomes">INGRESOS</h4>
                                </div>
                                <div className="row text-center p-2">
                                    <p className="col text-center">Media €</p>
                                    <p className="col text-center">Total €</p>
                                </div>
                                <div className="row text-center p-2">
                                    <td className="col text-center">Categoría ingreso</td>
                                    <td className="col text-center">Media €</td>
                                    <td className="col text-center">%</td>                            
                                </div>
                                <div className="row text-center p-2">
                                    <td className="col text-center">Categoría ingreso</td>
                                    <td className="col text-center">Media €</td>
                                    <td className="col text-center">%</td>                            
                                </div>
                                <div className="row text-center p-2">
                                    <td className="col text-center">Categoría ingreso</td>
                                    <td className="col text-center">Media €</td>
                                    <td className="col text-center">%</td>                            
                                </div>
                            </div>
                            <div className="row  pb-2">
                                <div className="col-8">
                                    <div className="text-center">
                                        <h4 className="text-white p-2" id="table-saves">RESERVADO</h4>
                                    </div>
                                    <div className="row text-center p-2">
                                        <p className="col text-center">Media €</p>
                                        <p className="col text-center">Total €</p>
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col text-center">Categoría reservado</td>
                                        <td className="col text-center">Media €</td>
                                        <td className="col text-center">Total €</td>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col text-center">Categoría reservado</td>
                                        <td className="col text-center">Media €</td>
                                        <td className="col text-center">Total €</td>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col text-center">Categoría reservado</td>
                                        <td className="col text-center">Media €</td>
                                        <td className="col text-center">Total €</td>                            
                                    </div>
                                </div>
                                <div className="col-4 ">
                                    <h4 className="text-white text-center p-2" id="table-saves">USO RESERVADO</h4>
                                    <div className="row text-center p-2">
                                        <p className="col text-center">Media €</p>
                                        <p className="col text-center">%</p>
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col text-center">Media €</td>
                                        <td className="col text-center">%</td>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col text-center">Media €</td>
                                        <td className="col text-center">%</td>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col text-center">Media €</td>
                                        <td className="col text-center">%</td>                            
                                    </div>
                                </div>
                            </div>
                            <div className="row pb-2">
                                <div className="text-center">
                                    <h4 className="text-white p-2" id="table-expenses">GASTOS</h4>
                                </div>
                                <div className="row text-center p-2">
                                    <p className="col text-center">Media €</p>
                                    <p className="col text-center">%</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="text-center">
                                        <h4 className="text-white p-2" id="table-fixed">GASTOS FIJOS</h4>
                                    </div>
                                    <div className="row text-center p-2">
                                        <p className="col text-center">Media €</p>
                                        <p className="col text-center">%</p>
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col text-center">Categoría gastos fijos</td>
                                        <td className="col text-center">Media €</td>
                                        <td className="col text-center">%</td>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col text-center">Categoría gastos fijos</td>
                                        <td className="col text-center">Media €</td>
                                        <td className="col text-center">%</td>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col text-center">Categoría gastos fijos</td>
                                        <td className="col text-center">Media €</td>
                                        <td className="col text-center">%</td>                            
                                    </div>
                                    <div id="table-title" className="row text-center text-white p-2">
                                        <td className="col text-center">LIBRE</td>
                                        <td className="col text-center">Media €</td>
                                        <td className="col text-center">%</td>                            
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="text-center">
                                        <h4 className="text-white p-2" id="table-ocassional">GASTOS VARIABLES</h4>
                                    </div>
                                    <div className="row text-center p-2">
                                        <p className="col text-center">Media €</p>
                                        <p className="col text-center">%</p>
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col text-center">Categoría gastos variables</td>
                                        <td className="col text-center">Media €</td>
                                        <td className="col text-center">%</td>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <td className="col text-center">Categoría gastos variables</td>
                                        <td className="col text-center">Media €</td>
                                        <td className="col text-center">%</td>                            
                                </div>
                                <div className="row text-center p-2">
                                    <td className="col text-center">Categoría gastos variables</td>
                                    <td className="col text-center">Media €</td>
                                    <td className="col text-center">%</td>                            
                                </div>
                                <div id="table-title" className="row text-center text-white p-2">
                                    <td className="col text-center">RESTANTE</td>
                                    <td className="col text-center">Media €</td>
                                    <td className="col text-center">%</td>                            
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}