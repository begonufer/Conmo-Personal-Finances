import React, { useState, useEffect, useContext } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
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

export const MonthlySaveBar = (props) => {
    const { store, actions } = useContext(Context);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const transformData = async () => {
            await actions.getSaves();

            const daysInMonth = new Date(props.selectedYear, props.selectedMonthIndex + 1, 0).getDate();
            const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);

            const filteredSave = store.saves.filter((data) => {
                const date = new Date(data.dateTime);
                return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
            });

            const chartDataArray = daysArray.map((day) => {
                const savesForDay = filteredSave.filter((save) => {
                    const saveDay = new Date(save.dateTime).getDate();
                    return saveDay === day;
                });

                const totalValue = savesForDay.reduce((total, save) => total + save.value, 0);

                return {
                    day,
                    value: totalValue,
                    category: savesForDay.length > 0 ? savesForDay[0].category.name : 'Sin reservas',
                };
            });

            setChartData(chartDataArray);
        };
        transformData();
    }, [props.selectedMonthIndex, props.selectedYear]);

    const data = {
        labels: chartData.map((data) => `${data.day}`),
        datasets: [
            {
                label: chartData.category,
                data: chartData.map((data) => data.value),
                backgroundColor: [
                    "rgb(40, 130, 150)",
                    "rgb(40, 140, 160)",
                    "rgb(40, 150, 170)",
                    "rgb(40, 160, 180)"
                ],
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false,
            }
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false,
                }
            },
            y: {
                stacked: true,
                display: false,
                grid: {
                    display: false,
                }
            },
        },
    };

    return (
        <>
            <div className="col text-center">
                <h3>Reservas</h3>
                <p>Qué días tenemos cada reserva.</p>
                {chartData.length > 0 ? <Bar options={options} data={data} /> : <p>No hay reservas para este mes.</p>}
            </div>
        </>
    );
};