import React, { useState, useEffect, useContext } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
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

export const AnualSaveLine = (props) => {

    const { store, actions } = useContext(Context);

    const [saveBarAnualData, setSaveBarAnualData] = useState([]);
    const [usageBarAnualData, setUsageBarAnualData] = useState([]);
    const [chartAnualData, setChartAnualData] = useState([]);
    
    const buildBarAnualDataChart = async () => {
        await actions.getSaves();
        await actions.getUsage();

        const filteredSave = store.saves.filter((data) => {
            const date = new Date(data.dateTime);
            return date.getFullYear() === props.selectedYear;
        });
        
        const filteredUsage = store.usages.filter((data) => {
            const date = new Date(data.dateTime);
            return date.getFullYear() === props.selectedYear;
        });

        const monthsArray = Array.from({ length: 12 }, (_, index) => index + 1);
    
        const saveChartDataMap = new Map();
        const usageChartDataMap = new Map();

        filteredSave.forEach((save) => {
            const saveMonth = new Date(save.dateTime).getMonth() + 1;
            const existingData = saveChartDataMap.get(saveMonth) || { value: 0, category: 'Sin reservas' };
    
            saveChartDataMap.set(saveMonth, {
                month: saveMonth,
                value: existingData.value + save.value,
                category: save.category.name,
            });
        });    

        filteredUsage.forEach((usage) => {
            const usageMonth = new Date(usage.dateTime).getMonth() + 1;
            const existingData = usageChartDataMap.get(usageMonth) || { value: 0, category: 'Sin reservas' };
    
            usageChartDataMap.set(usageMonth, {
                month: usageMonth,
                value: existingData.value + usage.value,
                category: usage.category.name,
            });
        });
    
        const saveDataArray = monthsArray.map((month) => saveChartDataMap.get(month) || { month, value: 0, category: 'Sin reservas' });
        const usageDataArray = monthsArray.map((month) => usageChartDataMap.get(month) || { month, value: 0, category: 'Sin gastos de reservas' });

        setSaveBarAnualData(saveDataArray);
        setUsageBarAnualData(usageDataArray);
    
        const calculateAnualChartData = () => {
            let accumulatedNetValue = 0;
        
            const monthNames = store.months;
        
            const netDataArray = monthsArray.map((month) => {
                const saveValue = saveChartDataMap.get(month)?.value || 0;
                const usageValue = usageChartDataMap.get(month)?.value || 0;

                const netValue = saveValue - usageValue;
                accumulatedNetValue += netValue;
        
                return {
                    month: monthNames[month - 1],
                    netValue: accumulatedNetValue,
                };
            });
        
            setChartAnualData(netDataArray);
        };
    
        calculateAnualChartData();
    };

    const dataAnualBar = {
        labels: chartAnualData.map((data) => `${data.month}`),
        datasets: [
            {
                label: "Balance de reservado",
                data: chartAnualData.map((data) => data.netValue),
                fill: false,
                backgroundColor: ["rgb(27, 100, 113)"],
                borderColor: ["rgb(27, 100, 113)"],
                pointRadius: 1,
            },
        ],
    };

    const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    margin: 20,
                    display: true,
                    labels: {
                        usePointStyle: true, 
                        pointStyle: 'circle', 
                        font: {
                            size: 11, 
                        },
                        padding: 20,
                    },
                },
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false,
                    },
                    ticks: {
                        font: {
                            size: 10,
                        },
                    },
                },
                y: {
                    stacked: true,
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        callback: function (value) {
                            return value === 0 ? value : '';
                        },
                    },
                },
            },
        };

    useEffect(() => {
        buildBarAnualDataChart();
    }, [props.selectedYear]);

    return (
        <>
            <div className="col text-center">
                {chartAnualData.length > 0 ? <Line options={options} data={dataAnualBar} /> : <p>No hay reservas para este mes.</p>}
            </div>
        </>
    );
};