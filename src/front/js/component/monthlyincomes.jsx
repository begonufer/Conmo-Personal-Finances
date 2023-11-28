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

export const MonthlyIncomes = () => {

    const { store, actions } = useContext(Context);

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const todayDate = new Date();
    const currentMonthIndex = todayDate.getMonth();
    const nameCurrentMonth = months[currentMonthIndex];

    const calculatePreviousMonthIndex = (currentIndex) => (currentIndex - 1 + 12) % 12;
    const previousMonthIndex = calculatePreviousMonthIndex(currentMonthIndex);
    const namePreviousMonth = months[previousMonthIndex];
    const currentYear = new Date().getFullYear();

    const [previousMonth, setPreviousMonth] = useState(namePreviousMonth);

    const [selectedMonth, setSelectedMonth] = useState(nameCurrentMonth);

    const [selectedYear, setSelectedYear] = useState(currentYear);

    const [isOpen, setIsOpen] = useState(false);
    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndex);
  
    const handleMonthSelect = (month, monthIndex) => {
        setSelectedMonth(month);
        setSelectedMonthIndex(monthIndex);
        const updatedPreviousMonthIndex = calculatePreviousMonthIndex(monthIndex);
        setPreviousMonth(months[updatedPreviousMonthIndex]);
        setIsOpen(false);
    }
    
    return (
        <>
            <div className="w-100 h-100">
                <div className="custom-dropdown">
                    <div className="dropdown-header" onClick={handleToggleDropdown}>
                        <h1 className="drop-title">
                            {selectedMonth} <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}><i className="fas fa-chevron-down"></i></span> 
                            <input
                                type="number"
                                min="2000" 
                                max={currentYear}
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                                className="year-selector mx-4 text-black"
                            />
                        </h1>
                    </div>

                    {isOpen && (
                        <div className="dropdown-content">
                            {months.map((month, index) => (
                                <div
                                    key={index}
                                    className="dropdown-item"
                                    onClick={() => handleMonthSelect(month, index)}
                                    >
                                    {month}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* <h1 className="header text-center p-3 mt-2">{previousMonth}</h1> */}
                {/* <div>
                    <input
                        type="number"
                        min="2000" 
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                    />
                </div> */}
                <div className="row pt-3">
                    <div className="col">
                    <img src={peggyConmo} className="w-100 h-100 mx-5" alt="Conmo" />
                    </div>
                    <div className="col-7 mx-5 mt-5 text-center">
                        <MonthlyIncomeTable selectedMonth={selectedMonth} selectedMonthIndex={selectedMonthIndex} selectedYear={selectedYear} previousMonth={previousMonth} />
                    </div>
                </div>
                <div className="row justify-content-center pb-5 mx-5">
                    <div className="col-4 text-center">
                        <MonthlyIncomePie selectedMonth={selectedMonth} selectedMonthIndex={selectedMonthIndex} selectedYear={selectedYear}/> 
                    </div>
                    <div className="col-7 align-items-center">
                        <MonthlyIncomeBar selectedMonth={selectedMonth} selectedMonthIndex={selectedMonthIndex} selectedYear={selectedYear}/>
                    </div>
                </div>
            </div>
        </>
    );
};





const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"]

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


export const pieData = {
    labels: ['Guardado', 'Gastos fijos', 'Gastos variables'],
    datasets: [
        {
            data: [1800, 1200, 1293],
            backgroundColor: [
                "rgb(147, 40, 90)",
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