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

export const MonthlyOcassionalBar = (props) => {
    const { store, actions } = useContext(Context);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const transformData = async () => {
            await actions.getOcassionals();

            const daysInMonth = new Date(props.selectedYear, props.selectedMonthIndex + 1, 0).getDate();
            const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);

            const filteredOcassional = store.ocassionals.filter((data) => {
                const date = new Date(data.dateTime);
                return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
            });

            const chartDataArray = daysArray.map((day) => {
                const ocassionalsForDay = filteredOcassional.filter((ocassional) => {
                    const ocassionalDay = new Date(ocassional.dateTime).getDate();
                    return ocassionalDay === day;
                });

                const totalValue = ocassionalsForDay.reduce((total, ocassional) => total + ocassional.value, 0);

                return {
                    day,
                    value: totalValue,
                    category: ocassionalsForDay.length > 0 ? ocassionalsForDay[0].ocassionalcategory.name : 'Sin gastos variables',
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
                    "rgb(175, 200, 62)",
                    "rgb(137, 178, 15)",
                    "rgb(96, 135, 28)",
                    "rgb(81, 110, 32)",
                    "rgb(111, 174, 0)",
                    "rgb(140, 188, 30)",
                    "rgb(177, 217, 0)",
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
            {chartData.length > 0 ? <Bar options={options} data={data} /> : <p>No hay gastos para este mes.</p>}
        </>
    );
};