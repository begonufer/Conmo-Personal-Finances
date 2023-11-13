import React from "react";
import { Link } from "react-router-dom";
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
        label: 'Ingreso',
        data: [123, 32523, 352, 235],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Gasto',
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

export const AnualIncomes = () => {
    return (
        <>
            <div id="login" className="w-100 h-100">
                <h1 className="text-center pt-3">2023</h1>
                <div className="row pb-5">
                    <div className="col mx-5 text-center">
                        <h2 className="mt-5">Descripción detallada de la sección.</h2>
                        <p>Como interpretar cada una de las gráficas y aprovecharlas de la mejor manera posible.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque fugiat harum neque nostrum facere, incidunt commodi architecto et cum unde sed ab excepturi veritatis ex ut dolor accusamus deserunt rem?</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis odio enim rerum incidunt dicta tenetur, voluptatem sed nostrum. Autem ratione, asperiores totam blanditiis repudiandae eaque excepturi cumque atque voluptate mollitia.</p>
                        <div className="row mt-5">
                            <div className="col"  id="resumen">
                                <div className="row">
                                    <h1 className="text-center py-3">2023</h1>
                                </div>
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
                            </div>
                        </div>
                    </div>
                    <div className="col-4 mx-5 text-center">
                        <div className="row mt-5">
                            <h3>Ingresos</h3>
                            <p>Dónde se ocupa cada parte de los ingresos.</p>
                            <Pie data={pieData} />
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center align-items-center py-5 mx-5">
                    <div className="col text-center">
                        <h3>Ingresos</h3>
                        <p>Qué días tenemos cada ingreso.</p>
                        <Bar options={options} data={anualData} />
                    </div>
                    <div className="col text-center">
                        <h3>Linear</h3>
                        <p>Evolución diaria acumulada de cada tipo de gasto o ahorro.</p>
                        <Line options={options2} data={acumulateMonthData} />  
                    </div>
                </div>
            </div>
        </>
    )
}