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
import { MonthlyFixedTable } from "../component/graphics/fixedmonthlytable.jsx";


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

const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"]

export const monthData = {
    labels,
    datasets: [
        {
            label: "Tipo ingreso 1",
            data: [221, 0, 0, 0, 0, 0, 0, 645, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0, 874, 0, 0],
            backgroundColor: ["rgb(138, 181, 63)"],
            borderColor: ["rgb(138, 181, 63)"],
        },
        {
            label: "Tipo ingreso 2",
            data: [0, 0, 0, 700, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: ["rgb(40, 124, 147)"],
            borderColor: ["rgb(40, 124, 147)"],
        },
        {
            label: "Tipo ingreso 3",
            data: [0, 0, 340, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 700, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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

    const pieDataDetalle = {
        labels: ['Categoría fijo 1', 'Categoría fijo 2', 'Categoría fijo 3', 'Categoría fijo 4'],
        datasets: [
            {
                label: "€",
                data: [1847, 632, 1276, 1340],
                backgroundColor: [
                    "rgb(147, 60, 100)",
                    "rgb(147, 70, 110)",
                    "rgb(147, 80, 120)",
                    "rgb(147, 90, 130)",
                    "rgb(40, 130, 150)",
                    "rgb(40, 140, 160)",
                    "rgb(40, 150, 170)",
                    "rgb(40, 160, 180)",
                    "rgb(138, 190, 70)",
                    "rgb(138, 200, 80)",
                    "rgb(138, 210, 90)",
                ],
                borderWidth: 0,
            },
        ],
    };

export const MonthlyFixed = () => {

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

                {/* <h1 className="text-center pt-3">Octubre</h1> */}
                <div className="row pt-3">
                    <div className="col">
                    <img src={peggyConmo} className="w-100 h-100 mx-5" alt="Conmo" />
                    </div>
                    <div className="col-7 mx-5 mt-5 text-center">
                        <MonthlyFixedTable selectedMonth={selectedMonth} selectedMonthIndex={selectedMonthIndex} selectedYear={selectedYear} previousMonth={previousMonth} />
                    </div>
                </div>
                <div className="row pb-5">
                    <div className="col mx-5 text-center">
                        <h2 className="mt-5">Descripción detallada de la sección.</h2>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi quidem vel deleniti et hic sunt, numquam cupiditate? Debitis, recusandae? Suscipit doloribus quaerat inventore perferendis veniam obcaecati voluptate? Quae, doloremque ipsam?</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque fugiat harum neque nostrum facere, incidunt commodi architecto et cum unde sed ab excepturi veritatis ex ut dolor accusamus deserunt rem?</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis odio enim rerum incidunt dicta tenetur, voluptatem sed nostrum. Autem ratione, asperiores totam blanditiis repudiandae eaque excepturi cumque atque voluptate mollitia.</p>
                        <div className="row mt-5">
                            <div className="col" id="resumen">
                                <div className="row">
                                    <h1 className="text-center py-3">OCTUBRE</h1>
                                </div>
                                <div className="col ">
                                    <h4 className="text-white text-center p-2" id="table-fixed">GASTOS FIJOS</h4>
                                    <div className="row text-center p-2">
                                        <p className="col text-center">%</p>
                                        <p className="col text-center">€</p>
                                    </div>
                                    <div className="row text-center p-2">
                                        <p className="col-6 text-center">Categoría gastos fijos</p>
                                        <p className="col-3 text-center">%</p>
                                        <p className="col-3 text-center">€</p>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <p className="col-6 text-center">Categoría gastos fijos</p>
                                        <p className="col-3 text-center">%</p>
                                        <p className="col-3 text-center">€</p>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <p className="col-6 text-center">Categoría gastos fijos</p>
                                        <p className="col-3 text-center">%</p>
                                        <p className="col-3 text-center">€</p>                            
                                    </div>
                                    <div id="table-title" className="row text-center text-white p-2">
                                        <p className="col text-center">LIBRE</p>
                                        <p className="col text-center">%</p>
                                        <p className="col text-center">€</p>                            
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 mx-5 text-center">
                        <div className="row mt-5">
                            <h3>Gastos fijos</h3>
                            <p>Dónde se ocupa cada categoría de gastos fijos.</p>
                            <Pie data={pieDataDetalle} />
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center align-items-center py-5 mx-5">
                    <div className="col text-center">
                        <h3>Gastos</h3>
                        <p>Qué días tenemos cada gasto.</p>
                        <Bar options={options} data={monthData} />
                    </div>
                    <div className="col text-center">
                        <h3>Linear</h3>
                        <p>Evolución diaria acumulada de cada tipo de gasto.</p>
                        <Line options={options2} data={acumulateMonthData} />  
                    </div>
                </div>
            </div>
        </>
    );
};
