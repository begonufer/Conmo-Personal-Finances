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

export const AnualFixedBar = (props) => {

    const { store, actions } = useContext(Context);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const transformData = async () => {
            await actions.getFixes();

            const monthsArray = Array.from({ length: 12 }, (_, index) => index + 1);
            const monthNames = store.months;
                
            const filteredFixed = store.fixes.filter((data) => {
                const date = new Date(data.dateTime);
                return date.getFullYear() === props.selectedYear;
            });

            const fixedChartDataMap = new Map();
        
            filteredFixed.forEach((fixed) => {
                const fixedMonth = new Date(fixed.dateTime).getMonth() + 1;
                const existingData = fixedChartDataMap.get(fixedMonth) || { value: 0, category: 'Sin ingresos' };
        
                fixedChartDataMap.set(fixedMonth, {
                    month: monthNames[fixedMonth - 1],
                    value: existingData.value + fixed.value,
                    category: fixed.fixedcategory.name,
                });
            });

            const fixedDataArray = monthsArray.map((month) => fixedChartDataMap.get(month) || { month, value: 0, category: 'Sin ingresos' });
            setChartData(fixedDataArray);
        };
    transformData();
    }, [ props.selectedYear]);

    const data = {
        labels: store.months,
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
            {chartData.length > 0 ? <Bar options={options} data={data} /> : <p>No hay gastos para este mes.</p>}
        </>
    );
};