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

export const MonthlySaveLine = (props) => {
    const { store, actions } = useContext(Context);

    const [saveBarData, setSaveBarData] = useState([]);
    const [usageBarData, setUsageBarData] = useState([]);
    
    const [chartData, setChartData] = useState([]);

    const buildBarDataChart = async () => {
        await actions.getSaves();
        await actions.getUsage();
    
        const daysInMonth = new Date(props.selectedYear, props.selectedMonthIndex + 1, 0).getDate();
        const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);
    
        const filteredSave = store.saves.filter((data) => {
            const date = new Date(data.dateTime);
            return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
        });

        const filteredUsage = store.usages.filter((data) => {
            const date = new Date(data.dateTime);
            return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
        });

        const saveChartDataMap = new Map();
        const usageChartDataMap = new Map();

        filteredSave.forEach((save) => {
            const saveDay = new Date(save.dateTime).getDate();
            const existingData = saveChartDataMap.get(saveDay) || { value: 0, category: 'Sin reservas' };
            
            saveChartDataMap.set(saveDay, {
                day: saveDay,
                value: existingData.value + save.value,
                category: save.category.name,
            });
        });

        filteredUsage.forEach((usage) => {
            const usageDay = new Date(usage.dateTime).getDate();
            const existingData = usageChartDataMap.get(usageDay) || { value: 0, category: 'Sin reservas' };
            
            usageChartDataMap.set(usageDay, {
                day: usageDay,
                value: existingData.value + usage.value,
                category: usage.category.name,
            });
        });
        
        const saveDataArray = daysArray.map((day) => saveChartDataMap.get(day) || { day, value: 0, category: 'Sin reservas' });
        const usageDataArray = daysArray.map((day) => usageChartDataMap.get(day) || { day, value: 0, category: 'Sin gastos de reservas' });

        setSaveBarData(saveDataArray);
        setUsageBarData(usageDataArray);

        const calculateChartData = () => {
            let accumulatedNetValue = 0;
        
            const netDataArray = daysArray.map((day) => {
                const saveValue = saveChartDataMap.get(day)?.value || 0;
                const usageValue = usageChartDataMap.get(day)?.value || 0;
        
                const netValue = saveValue - usageValue ;
                accumulatedNetValue += netValue;
        
                return {
                    day,
                    netValue: accumulatedNetValue,
                };
            });
        
            setChartData(netDataArray);
        };

        calculateChartData();
    };

    const chartDataBar = {
        labels: chartData.map((data) => `${data.day}`),
        datasets: [
            {
                label: "Balance de reservado",
                data: chartData.map((data) => data.netValue),
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
        buildBarDataChart();
    }, [props.selectedMonthIndex, props.selectedYear]);

    return (
        <>
            <div className="col text-center">
                {chartData.length > 0 ? <Line options={options} data={chartDataBar} /> : <p>No hay reservas para este mes.</p>}
            </div>
        </>
    );
};