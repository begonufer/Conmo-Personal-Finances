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

export const AnualIncomeBar = (props) => {

    const { store, actions } = useContext(Context);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const transformData = async () => {
            await actions.getIncomes();

            const monthsArray = Array.from({ length: 12 }, (_, index) => index + 1);
            const monthNames = store.months;
                
            const filteredIncome = store.incomes.filter((data) => {
                const date = new Date(data.dateTime);
                return date.getFullYear() === props.selectedYear;
            });

            const incomeChartDataMap = new Map();
        
            filteredIncome.forEach((income) => {
                const incomeMonth = new Date(income.dateTime).getMonth() + 1;
                const existingData = incomeChartDataMap.get(incomeMonth) || { value: 0, category: 'Sin ingresos' };
        
                incomeChartDataMap.set(incomeMonth, {
                    month: monthNames[incomeMonth - 1],
                    value: existingData.value + income.value,
                    category: income.incomecategory.name,
                });
            });

            const incomeDataArray = monthsArray.map((month) => incomeChartDataMap.get(month) || { month, value: 0, category: 'Sin ingresos' });
            setChartData(incomeDataArray);
        };
    transformData();
    }, [ props.selectedYear]);

    const data = {
        labels: store.months,
        datasets: [
            {
                label: chartData.category,
                data: chartData.map((data) => data.value),
                backgroundColor: [
                    "rgb(255, 217, 0)",
                    "rgb(191, 159, 0)",
                    "rgb(151, 140, 22)",
                    "rgb(207, 193, 44)",
                    "rgb(215, 211, 20)",
                    "rgb(255, 242, 94)",
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