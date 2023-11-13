import React from "react";
import { Anual } from "../component/anual.jsx";
import { Monthly } from "../component/monthly.jsx";
import { Resume } from "../component/resume.jsx";
import { AddButton } from "../component/addbutton.jsx";
import { MovementsList } from "../component/movementslist.jsx";

export const MyConmo = () => {
    return (
        <>
            <h1 className="text-center text-white p-2 pt-5 mt-5" id="left-background">
                Mi<span className="conmo"> CONMO</span>
            </h1>
            <div className="d-block w-100 h-100 align-items-center">
                <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <Monthly />
                        </div>
                        <div className="carousel-item">
                            <Anual />
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
            <Resume />
            <MovementsList />
            <AddButton />
        </>
    );
};