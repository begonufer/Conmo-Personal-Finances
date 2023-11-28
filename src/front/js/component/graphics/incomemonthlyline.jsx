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
import { Context } from "../../store/appContext";
import { format } from "date-fns";
import es from "date-fns/locale/es";

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

export const MonthlyIncomeLine = () => {

    const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"]

    const options = {
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

    const acumulateMonthData = {
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
    return (
        <>
            <div className="col text-center">
                <h3>Linear</h3>
                <p>Evolución diaria acumulada de cada tipo de gasto o ahorro.</p>
                <Line options={options} data={acumulateMonthData} />  
            </div>
        </>
    );
};