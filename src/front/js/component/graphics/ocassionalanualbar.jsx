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

export const AnualOcassionalBar = (props) => {

    const { store, actions } = useContext(Context);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const transformData = async () => {
            await actions.getOcassionals();

            const monthsArray = Array.from({ length: 12 }, (_, index) => index + 1);
            const monthNames = store.months;
                
            const filteredOcassional = store.ocassionals.filter((data) => {
                const date = new Date(data.dateTime);
                return date.getFullYear() === props.selectedYear;
            });

            const ocassionalChartDataMap = new Map();
        
            filteredOcassional.forEach((ocassional) => {
                const ocassionalMonth = new Date(ocassional.dateTime).getMonth() + 1;
                const existingData = ocassionalChartDataMap.get(ocassionalMonth) || { value: 0, category: 'Sin gastos ocasionales' };
        
                ocassionalChartDataMap.set(ocassionalMonth, {
                    month: monthNames[ocassionalMonth - 1],
                    value: existingData.value + ocassional.value,
                    category: ocassional.ocassionalcategory.name,
                });
            });

            const ocassionalDataArray = monthsArray.map((month) => ocassionalChartDataMap.get(month) || { month, value: 0, category: 'Sin gastos ocasionales' });
            setChartData(ocassionalDataArray);
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