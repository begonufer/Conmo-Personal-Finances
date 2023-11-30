import React, { useState } from 'react';
import { AnualExpenses } from "../component/anualexpenses.jsx";
import { MonthlyExpenses } from "../component/monthlyexpenses.jsx";
import { MovementsList } from "../component/movementslist.jsx";
import { AddButton } from "../component/addbutton.jsx";
import { Collapse } from 'react-bootstrap';

export const Expenses = () => {

    const [open, setOpen] = useState(false);

    const handleToggle = () => {
      setOpen(!open);
    };

    return (
        <>
            <div className="text-center text-white" id="left-background">
                <h1 className="header p-1 pb-3 pt-5 mt-5 mb-0">
                    Gastos <i className="icon fas fa-info-circle" onClick={handleToggle} ></i>
                </h1>
                <div>
                    <Collapse in={open}>
                        <div className="texto-desplegable">
                            <h2 className="mt-2">Descripción detallada de la sección.</h2>
                            <div className="description-text">
                                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reprehenderit maxime sunt praesentium dolores recusandae vitae ab unde quam neque, doloribus ducimus tenetur ad magnam ratione culpa voluptatum rem accusamus quas.</p>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque fugiat harum neque nostrum facere, incidunt commodi architecto et cum unde sed ab excepturi veritatis ex ut dolor accusamus deserunt rem?</p>
                            </div>
                        </div>
                    </Collapse>
                </div>
            </div>
            <div className="d-block w-100 h-100 align-items-center">
                <div id="principalCarousel" className="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-interval="false">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <MonthlyExpenses />
                        </div>
                        <div className="carousel-item">
                            <AnualExpenses />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#principalCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Anterior</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#principalCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Siguiente</span>
                    </button>
                </div>
            </div>
            <MovementsList />
            <AddButton />
        </>
    );
};