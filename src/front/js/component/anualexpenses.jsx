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
            label: "Gastos",
            data: [236, 23, 763, 981, 81, 26, 329, 23, 221, 600, 123, 1200, 300, 1226, 122, 145, 45, 23, 879, 35, 874, 160, 28, 572, 98, 300, 34, 100, 29, 58],
            backgroundColor: ["rgb(147, 40, 90)"],
            borderColor: ["rgb(147, 40, 90)"],
        },
        {
            label: "Gastos fijos",
            data: [500, 1300, 120, 1000, 23, 123, 325, 56, 231, 35, 874, 160, 28, 572, 98, 300, 1226, 122, 145, 45, 23, 879, 765, 34, 100, 29, 58, 87, 340, 201],
            backgroundColor: ["rgb(40, 124, 147)"],
            borderColor: ["rgb(40, 124, 147)"],
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
            label: "Gastos",
            data: [236, 23, 763, 981, 81, 26, 329, 23, 221, 600, 123, 1200, 300, 1226, 122, 145, 45, 23, 879, 35, 874, 160, 28, 572, 98, 300, 34, 100, 29, 58],
            backgroundColor: ["rgb(147, 40, 90)"],
            borderColor: ["rgb(147, 40, 90)"],
        },
        {
            label: "Gastos fijos",
            data: [1236, 1225, 1225, 1225, 1225, 1206, 1206, 1206, 821, 700, 623, 600, 600, 526, 522, 145, 45, 23, 879, 35, 874, 160, 28, 572, 98, 300, 34, 100, 29, 58],
            backgroundColor: ["rgb(40, 124, 147)"],
            borderColor: ["rgb(40, 124, 147)"],
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
                label: 'Categoría 1',
                data: [876, 0, 0, 0, 0, 0, 0, 0, 0, 412, 0, 0, 543, 0, 0, 56],
                backgroundColor: ["rgb(207, 193, 44)"],
            },
            {
                label: 'Categoría 2',
                data: [1235, 3412, 23, 763, 0, 981, 81, 26, 0, 0, 329, 23, 221, 600, 123, 34, 0, 15],
                backgroundColor: ["rgb(138, 181, 63)"],
            },
            {
                label: 'Categoría 3',
                data: [1235, 3412, 23, 763, 0, 981, 81, 26, 0, 0, 329, 23, 221, 600, 123, 34, 0, 15],
                backgroundColor: ["rgb(40, 124, 147)"],
            },
            {
                label: 'Categoría 4',
                data: [1235, 3412, 23, 763, 0, 981, 81, 26, 0, 0, 329, 23, 221, 600, 123, 34, 0, 15],
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
    labels: ['Gastos fijos', 'Gastos variables'],
    datasets: [
        {
            data: [1800, 1200],
            backgroundColor: [
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
    labels: ['Ahorros', 'Veterinario', 'Casa', 'Imprevistos',   'Alquiler', 'Facturas', 'Comida', 'Crédito',   'Regalos', 'Ropa', 'Ocio'],
    datasets: [
        {
            label: "€",
            data: [1847, 632, 1276, 1340, 998, 3672, 3672, 1200, 1023, 678, 4560],
            backgroundColor: [

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

export const AnualExpenses = () => {
    return (
        <>
            <div className="d-block w-100">
                <h1 className="text-center pt-3">2023</h1>
                <div className="row pb-5">
                    <div className="col mx-5 text-center">
                        <div className="row mt-5">
                            <h3>Gastos</h3>
                            <p>Qué tipo de gasto %</p>
                            <Pie data={pieData} />
                        </div>
                    </div>
                    <div className="col-3 mx-5 text-center">
                        <h2 className="mt-5">Descripción detallada de la sección.</h2>
                        <p>Descripción interpretar cada una de las gráficas y aprovecharlas.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque fugiat harum neque nostrum facere, incidunt commodi architecto et cum unde sed ab excepturi veritatis ex ut dolor accusamus deserunt rem?</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis odio enim rerum incidunt dicta tenetur, voluptatem sed nostrum. Autem ratione, asperiores totam blanditiis repudiandae eaque excepturi cumque atque voluptate mollitia.</p>
                    </div>
                    <div className="col mx-5 text-center">
                        <div className="row mt-5">
                            <h3>Gastos</h3>
                            <p>Dónde se ocupa cada parte de los gastos por categoria.</p>
                            <Pie data={pieDataDetalle} />
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center align-items-center py-5 mx-5">
                    <div className="col text-center">
                        <h3>Gastos</h3>
                        <p>Qué días tenemos más gasto de cada tipo. Cuánto gasto tenemos con más frecuencia.</p>
                        <Bar options={options} data={monthData} />
                    </div>
                    <div className="col text-center">
                        <h3>Gastos</h3>
                        <p>Qué día tenemos más gasto por categoria.</p>
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
                <div className="p-4 m-4 bg-light">
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
                                        <p className="col text-center">Categoría gastos fijos</p>
                                        <p className="col text-center">Media €</p>
                                        <p className="col text-center">%</p>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <p className="col text-center">Categoría gastos fijos</p>
                                        <p className="col text-center">Media €</p>
                                        <p className="col text-center">%</p>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <p className="col text-center">Categoría gastos fijos</p>
                                        <p className="col text-center">Media €</p>
                                        <p className="col text-center">%</p>                            
                                    </div>
                                    <div id="table-title" className="row text-center text-white p-2">
                                        <p className="col text-center">LIBRE</p>
                                        <p className="col text-center">Media €</p>
                                        <p className="col text-center">%</p>                            
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
                                        <p className="col text-center">Categoría gastos variables</p>
                                        <p className="col text-center">Media €</p>
                                        <p className="col text-center">%</p>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <p className="col text-center">Categoría gastos variables</p>
                                        <p className="col text-center">Media €</p>
                                        <p className="col text-center">%</p>                            
                                    </div>
                                    <div className="row text-center p-2">
                                        <p className="col text-center">Categoría gastos variables</p>
                                        <p className="col text-center">Media €</p>
                                        <p className="col text-center">%</p>                            
                                    </div>
                                    <div id="table-title" className="row text-center text-white p-2">
                                        <p className="col text-center">RESTANTE</p>
                                        <p className="col text-center">Media €</p>
                                        <p className="col text-center">%</p>                            
                                    </div>
                                </div>
                            </div>
                </div>
            </div>
        </>
    )
}