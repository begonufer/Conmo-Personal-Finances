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

export const AnualSaveBar = (props) => {

    const { store, actions } = useContext(Context);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const transformData = async () => {
            await actions.getSaves();

            const monthsArray = Array.from({ length: 12 }, (_, index) => index + 1);
            const monthNames = store.months;
                
            const filteredSave = store.saves.filter((data) => {
                const date = new Date(data.dateTime);
                return date.getFullYear() === props.selectedYear;
            });

            const saveChartDataMap = new Map();
        
            filteredSave.forEach((save) => {
                const saveMonth = new Date(save.dateTime).getMonth() + 1;
                const existingData = saveChartDataMap.get(saveMonth) || { value: 0, category: 'Sin reservas' };
        
                saveChartDataMap.set(saveMonth, {
                    month: monthNames[saveMonth - 1],
                    value: existingData.value + save.value,
                    category: save.category.name,
                });
            });

            const saveDataArray = monthsArray.map((month) => saveChartDataMap.get(month) || { month, value: 0, category: 'Sin reservas' });
            setChartData(saveDataArray);
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