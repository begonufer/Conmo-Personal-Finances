import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { AnualSaves } from "../component/anualsaves.jsx";
import { MonthlySaves } from "../component/monthlysaves.jsx";
import { MovementsList } from "../component/movementslist.jsx";
import { AddButton } from "../component/addbutton.jsx";
import { Collapse } from 'react-bootstrap';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

const gastosVariables = {
    importe: [340, 600, 323, 1200, 300, 1126, 122, 545, 245, 423, 879, 765],
    importe_acumulado: [340, 940, 1263, 2463, 2763, 3889, 4011, 4556, 4801, 5224, 6103, 6868],
    color: "rgb(138, 181, 63)",
}

const gastosFijos = {
    importe: [870, 880, 870, 870, 890, 900, 870, 870, 900, 870, 890, 890],
    importe_acumulado: [870, 1750, 2620, 3490, 4380, 5280, 6150, 7020, 7920, 8790, 9680, 10570],
    color: "rgb(40, 124, 147)",
}

const reservado = {
    importe: [236, 123, 763, 981, 381, 126, 329, 253, 221, 600, 123, 900],
    importe_acumulado: [236, 359, 1122, 2103, 2484, 2610, 2939, 3192, 3413, 4013, 4136, 5036],
    color: "rgb(147, 40, 129)",
}

const ingresos = {
    importe: [1446, 1603, 1956, 3051, 1571, 2152, 1321, 1668, 1366, 1893, 1892, 2555],
    importe_acumulado: [1446, 3049, 5005, 8056, 9627, 11779, 13100, 14768, 16134, 18027, 19919, 22474],
    color:"rgb(207, 193, 44)",
}

export const anualData = {
    labels,
    datasets: [
        {
            label: "Gastos variables",
            data: gastosVariables.importe,
            backgroundColor: gastosVariables.color,
            borderColor: gastosVariables.color,
        },
        {
            label: "Gastos fijos",
            data: gastosFijos.importe,
            backgroundColor: gastosFijos.color,
            borderColor: gastosFijos.color,
        },
        {
            label: "Reservado",
            data: reservado.importe,
            backgroundColor: reservado.color,
            borderColor: reservado.color,
        },
    ],
};

export const acumulateMonthData = {
    labels,
    datasets: [
        {
            label: "Gastos variables",
            data: gastosVariables.importe_acumulado,
            backgroundColor: gastosVariables.color,
            borderColor: gastosVariables.color,
        },
        {
            label: "Gastos fijos",
            data: gastosFijos.importe_acumulado,
            backgroundColor: gastosFijos.color,
            borderColor: gastosFijos.color,
        },
        {
            label: "Reservado",
            data: reservado.importe_acumulado,
            backgroundColor: reservado.color,
            borderColor: reservado.color,
        },
        {
            label: "Ingresos",
            data: ingresos.importe_acumulado,
            backgroundColor: ingresos.color,
            borderColor: ingresos.color,
        },
    ],
};

export const options3 = {
    plugins: {
      title: {
        display: true,
        text: '2023',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

    export const data = {
        labels,
        datasets: [
            {
                label: 'Ingresos',
                data: ingresos.importe,
                backgroundColor: ingresos.color,
            },
            {
                label: 'Gastos variables',
                data: [1235, -3412, -23, -763, 0, -981, -81, -26, 0, 0, -329, -23, -221, -600, -123, -34, 0, -15],
                backgroundColor: ["rgb(147, 40, 129)"],
            },
            {
                label: 'Gastos fijos',
                data: [-1235, -3412, -23, -763, 0, -981, -81, -26, 0, 0, -329, -23, -221, -600, -123, -34, 0, -15],
                backgroundColor: ["rgb(40, 124, 147)"],
            },
        ],
    };

export const options2 = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Octubre',
        },
    },
};

export const data3 = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [123, 32523, 352, 235],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: [123, 32523, 352, 235],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

export const options = {
    plugins: {
        title: {
            display: true,
            text: "2023",
        },
    },
    responsive: true,
    scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },
};

export const pieData = {
    labels: ['Guardado', 'Gastos fijos', 'Gastos variables'],
    datasets: [
    {
      label: 'Ingresos vs Gastos',
      data: [1800, 1200, 1293],
      backgroundColor: [
        "rgb(147, 40, 129)",
        "rgb(40, 124, 147)",
        "rgb(138, 181, 63)",
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
      ],
      borderWidth: 0,
    },
  ],
};

export const Saves = () => {

    const [open, setOpen] = useState(false);

    const handleToggle = () => {
      setOpen(!open);
    };

    return (
        <>
            <div className="text-center text-white" id="left-background">
                <h1 className="header p-1 pb-3 pt-5 mt-5 mb-0">
                    Reservado <i className="icon fas fa-info-circle" onClick={handleToggle} ></i>
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
                            <MonthlySaves />
                        </div>
                        <div className="carousel-item">
                            <AnualSaves />
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