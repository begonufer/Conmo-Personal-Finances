import React, { useState, useEffect, useContext, Component } from "react";
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
import { Context } from "../store/appContext";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import peggyConmo from "../../img/peggy-conmo.png";

import { MonthlyIncomePie } from "../component/graphics/incomemonthlypie.jsx";
import { MonthlyIncomeBar } from "../component/graphics/incomemonthlybar.jsx";
import { MonthlyIncomeLine } from "../component/graphics/incomemonthlyline.jsx";
import { SpanningTable } from "../component/graphics/incomemonthlytable.jsx";
import { MonthlyIncomeTable } from "../component/graphics/incomemonthlytable.jsx";
import { MyConmoPieTypes } from "../component/graphics/myconmopietypes.jsx";
import { MyConmoPieCategories } from "../component/graphics/myconmopiecategories.jsx";


ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"]

export const monthData = {
    labels,
    datasets: [
        {
            label: "Gastos variables",
            data: [221, 600, 123, 1200, 300, 1226, 122, 145, 45, 23, 879, 765, 34, 100, 29, 58, 87, 340, 201, 347, 1000, 23, 123, 325, 56, 231, 35, 874, 160, 81],
            backgroundColor: ["rgb(138, 181, 63)"],
            borderColor: ["rgb(138, 181, 63)"],
        },
        {
            label: "Gastos fijos",
            data: [500, 1300, 120, 1000, 23, 123, 325, 56, 231, 35, 874, 160, 28, 572, 98, 300, 1226, 122, 145, 45, 23, 879, 765, 34, 100, 29, 58, 87, 340, 201],
            backgroundColor: ["rgb(40, 124, 147)"],
            borderColor: ["rgb(40, 124, 147)"],
        },
        {
            label: "Reservado",
            data: [236, 23, 763, 981, 81, 26, 329, 23, 221, 600, 123, 1200, 300, 1226, 122, 145, 45, 23, 879, 35, 874, 160, 28, 572, 98, 300, 34, 100, 29, 58],
            backgroundColor: ["rgb(147, 40, 90)"],
            borderColor: ["rgb(147, 40, 90)"],
        },
    ],
};

export const monthData2 = {
    labels,
    datasets: [
        {
            label: "Gastos variables",
            data: [221, 600, 123, 1200, 300, 1226, 122, 145, 45, 23, 879, 765, 34, 100, 29, 58, 87, 340, 201, 347, 1000, 23, 123, 325, 56, 231, 35, 874, 160, 81],
            backgroundColor: ["rgb(138, 181, 63)"],
            borderColor: ["rgb(138, 181, 63)"],
        },
        {
            label: "Gastos fijos",
            data: [500, 1300, 120, 1000, 23, 123, 325, 56, 231, 35, 874, 160, 28, 572, 98, 300, 1226, 122, 145, 45, 23, 879, 765, 34, 100, 29, 58, 87, 340, 201],
            backgroundColor: ["rgb(40, 124, 147)"],
            borderColor: ["rgb(40, 124, 147)"],
        },
        {
            label: "Reservado",
            data: [236, 23, 763, 981, 81, 26, 329, 23, 221, 600, 123, 1200, 300, 1226, 122, 145, 45, 23, 879, 35, 874, 160, 28, 572, 98, 300, 34, 100, 29, 58],
            backgroundColor: ["rgb(147, 40, 90)"],
            borderColor: ["rgb(147, 40, 90)"],
        },
        {
            label: "Ingresos",
            data: [1236, 0, 0, 0, 0, 0, 0, 0, 1225, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 45, 0, 0, 0, 0, 98, 0, 0, 0, 0, 0, 0, 58],
            backgroundColor: ["rgb(207, 193, 44)"],
            borderColor: ["rgb(207, 193, 44)"],
        },
    ],
};

export const acumulateMonthData = {
    labels,
    datasets: [
        {
            label: "Gastos variables",
            data: [21, 30, 57, 120, 300, 300, 300, 300, 326, 352, 445, 445, 523, 679, 765, 834, 834, 834, 900, 929, 929, 958, 958, 958, 987, 340, 201, 347, 1000, 23, 123, 325, 56, 231, 35, 874, 160, 81],
            backgroundColor: ["rgb(138, 181, 63)"],
            borderColor: ["rgb(138, 181, 63)"],
        },
        {
            label: "Gastos fijos",
            data: [500, 1300, 120, 1000, 23, 123, 325, 56, 231, 35, 874, 160, 28, 572, 98, 300, 1226, 122, 145, 45, 23, 879, 765, 34, 100, 29, 58, 87, 340, 201],
            backgroundColor: ["rgb(40, 124, 147)"],
            borderColor: ["rgb(40, 124, 147)"],
        },
        {
            label: "Reservado",
            data: [236, 23, 763, 981, 81, 26, 329, 23, 221, 600, 123, 1200, 300, 1226, 122, 145, 45, 23, 879, 35, 874, 160, 28, 572, 98, 300, 34, 100, 29, 58],
            backgroundColor: ["rgb(147, 40, 90)"],
            borderColor: ["rgb(147, 40, 90)"],
        },
        {
            label: "Ingresos",
            data: [1236, 1225, 1225, 1225, 1225, 1206, 1206, 1206, 821, 700, 623, 600, 600, 526, 522, 145, 45, 23, 879, 35, 874, 160, 28, 572, 98, 300, 34, 100, 29, 58],
            backgroundColor: ["rgb(207, 193, 44)"],
            borderColor: ["rgb(207, 193, 44)"],
        },
    ],
};

export const options3 = {
    plugins: {
      title: {
        display: true,
        text: 'Octubre',
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
                data: [6876, 0, 0, 0, 0, 0, 0, 0, 0, 3412],
                backgroundColor: ["rgb(207, 193, 44)"],
            },
            {
                label: 'Gastos variables',
                data: [-1235, -3412, -23, -763, 0, -981, -81, -26, 0, 0, -329, -23, -221, -600, -123, -34, 0, -15],
                backgroundColor: ["rgb(138, 181, 63)"],
            },
            {
                label: 'Gastos fijos',
                data: [-1235, -3412, -23, -763, 0, -981, -81, -26, 0, 0, -329, -23, -221, -600, -123, -34, 0, -15],
                backgroundColor: ["rgb(40, 124, 147)"],
            },
            {
                label: 'Reservado',
                data: [-1235, 3412, -23, -763, 0, -981, 81, -26, 0, 0, -329, 23, -221, -600, -123, -34, 0, -15],
                backgroundColor: ["rgb(147, 40, 90)"],
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

export const options = {
    plugins: {
        title: {
            display: true,
            text: "Octubre",
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

// export const pieData = {
//     labels: ['Guardado', 'Gastos fijos', 'Gastos variables'],
//     datasets: [
//         {
//             data: [1800, 1200, 1293],
//             backgroundColor: [
//                 "rgb(147, 40, 90)",
//                 "rgb(40, 124, 147)",
//                 "rgb(138, 181, 63)",
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//             ],
//             borderWidth: 0,
//         },
//     ],
// };

//     const pieDataDetalle = {
//         labels: ['Ahorros', 'Veterinario', 'Casa', 'Imprevistos',   'Alquiler', 'Facturas', 'Comida', 'Crédito',   'Regalos', 'Ropa', 'Ocio'],
//         datasets: [
//             {
//                 label: "€",
//                 data: [1847, 632, 1276, 1340, 998, 3672, 3672, 1200, 1023, 678, 4560],
//                 backgroundColor: [
//                     "rgb(147, 60, 100)",
//                     "rgb(147, 70, 110)",
//                     "rgb(147, 80, 120)",
//                     "rgb(147, 90, 130)",
//                     "rgb(40, 130, 150)",
//                     "rgb(40, 140, 160)",
//                     "rgb(40, 150, 170)",
//                     "rgb(40, 160, 180)",
//                     "rgb(138, 190, 70)",
//                     "rgb(138, 200, 80)",
//                     "rgb(138, 210, 90)",
//                 ],
//                 borderWidth: 0,
//             },
//         ],
//     };

    export const Monthly = (props) => {
   
        return (
            <>
                <div className="w-100 h-100">
                    <div className="custom-dropdown">
                        <div className="dropdown-header" onClick={props.handleToggleDropdown}>
                            <h1 className="drop-title">
                                {props.selectedMonth} <span className={`dropdown-arrow ${props.isOpen ? 'open' : ''}`}><i className="fas fa-chevron-down"></i></span> 
                                <input
                                    type="number"
                                    min="2000" 
                                    max={props.currentYear}
                                    value={props.selectedYear}
                                    onChange={(e) => props.setSelectedYear(parseInt(e.target.value, 10))}
                                    className="year-selector mx-4 text-black"
                                />
                            </h1>
                        </div>
    
                        {props.isOpen && (
                            <div className="dropdown-content">
                                {props.months.map((month, index) => (
                                    <div
                                        key={index}
                                        className="dropdown-item"
                                        onClick={() => props.handleMonthSelect(month, index)}
                                        >
                                        {month}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="row pb-5">
                        <div className="col-4 text-center align-self-center">
                            <img src={peggyConmo} className="w-100" alt="Conmo" />
                        </div>
                        <MyConmoPieTypes selectedMonth={props.selectedMonth} selectedMonthIndex={props.selectedMonthIndex} selectedYear={props.selectedYear} />
                        <MyConmoPieCategories selectedMonth={props.selectedMonth} selectedMonthIndex={props.selectedMonthIndex} selectedYear={props.selectedYear} />
                        {/* <div className="col mx-5 text-center">
                            <div className="row mt-5">
                                <h3>Ingresos</h3>
                                <p>Dónde se ocupa cada parte de los ingresos.</p>
                                <Pie data={pieDataDetalle} />
                            </div>
                        </div> */}
                    </div>
                    <div className="row justify-content-center align-items-center py-5 mx-5">
                        <div className="col text-center">
                            <h3>Gastos</h3>
                            <p>Qué días tenemos más gasto de cada tipo. Cuánto gasto tenemos con más frecuencia.</p>
                            <Bar options={options} data={monthData} />
                        </div>
                        <div className="col text-center">
                            <h3>Gastos</h3>
                            <p>Comparación diaria de gasto vs ingreso.</p>
                            <Bar options={options3} data={data} />
                        </div>
                    </div>
                    <div className="row justify-content-center align-items-center py-5 mx-5">
                        <div className="col text-center">
                            <h3>Linear</h3>
                            <p>Evolución día a día de cada tipo de gasto o ahorro.</p>
                            <Line options={options2} data={monthData2} />
                        </div>
                        <div className="col text-center">
                            <h3>Linear</h3>
                            <p>Evolución diaria acumulada de cada tipo de gasto o ahorro.</p>
                            <Line options={options2} data={acumulateMonthData} />  
                        </div>
                    </div>
                </div>
            </>
        );
    };