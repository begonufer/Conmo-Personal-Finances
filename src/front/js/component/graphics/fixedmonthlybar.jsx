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

export const MonthlyFixedBar = (props) => {
    const { store, actions } = useContext(Context);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const transformData = async () => {
            await actions.getFixes();

            const daysInMonth = new Date(props.selectedYear, props.selectedMonthIndex + 1, 0).getDate();
            const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);

            const filteredFixed = store.fixes.filter((data) => {
                const date = new Date(data.dateTime);
                return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
            });

            const chartDataArray = daysArray.map((day) => {
                const fixesForDay = filteredFixed.filter((fixed) => {
                    const fixedDay = new Date(fixed.dateTime).getDate();
                    return fixedDay === day;
                });

                const totalValue = fixesForDay.reduce((total, fixed) => total + fixed.value, 0);

                return {
                    day,
                    value: totalValue,
                    category: fixesForDay.length > 0 ? fixesForDay[0].fixedcategory.name : 'Sin gastos fijos',
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
                backgroundColor:  [
                    "rgb(203, 64, 122)",
                    "rgb(183, 73, 124)",
                    "rgb(147, 40, 90)",
                    "rgb(122, 15, 65)",
                    "rgb(156, 13, 80)",
                    "rgb(189, 0, 91)",
                    "rgb(202, 49, 98)",
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
            {chartData.length > 0 ? <Bar options={options} data={data} /> : <p>No hay ingresos para este mes.</p>}
        </>
    );
};