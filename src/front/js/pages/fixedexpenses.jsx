import React from "react";
import { Link } from "react-router-dom";
import { AnualFixed } from "../component/anualfixed.jsx";
import { MonthlyFixed } from "../component/monthlyfixed.jsx";
import { MovementsList } from "../component/movementslist.jsx";
import { AddButton } from "../component/addbutton.jsx";

export const FixedExpenses = () => {
    return (
        <>
            <h1 className="text-center text-white p-1 pb-3 pt-5 mt-5" id="left-background">
                Gastos fijos
            </h1>
            <div className="d-block w-100 h-100 align-items-center">
                <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <MonthlyFixed />
                        </div>
                        <div className="carousel-item">
                            <AnualFixed />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Anterior</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
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