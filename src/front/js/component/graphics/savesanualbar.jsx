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
                label: "Reservado",
                data: saveBarAnualData.map((data) => data.value),
                backgroundColor: [
                    "rgb(62, 229, 237)",
                    "rgb(13, 180, 186)",
                    "rgb(7, 128, 139)",
                    "rgb(27, 100, 113)",
                    "rgb(27, 113, 113)",
                    "rgb(6, 151, 156)",
                    "rgb(64, 170, 184)",
                ],
            },
            {
                label: "Uso de reservado",
                data: usageBarAnualData.map((data) => data.value),
                backgroundColor: [
                    "rgb(108, 181, 223)",
                    "rgb(34, 147, 199)",
                    "rgb(3, 104, 144)",
                    "rgb(23, 87, 123)",
                    "rgb(29, 126, 167)",
                    "rgb(8, 168, 212)",
                    "rgb(72, 183, 224)",
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

    useEffect(() => {
        buildBarAnualDataChart();
    }, [props.selectedYear]);

    return (
        <>
            <div className="col text-center">
                {chartAnualData.length > 0 ? <Bar options={options} data={dataAnualBar} /> : <p>No hay reservas para este mes.</p>}
            </div>
        </>
    );
};

// import React, { useState, useEffect, useContext } from "react";
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
// import { Bar } from "react-chartjs-2";
// import { Context } from "../../store/appContext";
// import { format } from "date-fns";
// import es from "date-fns/locale/es";

// ChartJS.register(
//     ArcElement,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
// );

// export const AnualSaveBar = (props) => {

//     const { store, actions } = useContext(Context);
//     const [chartData, setChartData] = useState([]);

//     useEffect(() => {
//         const transformData = async () => {
//             await actions.getSaves();

//             const monthsArray = Array.from({ length: 12 }, (_, index) => index + 1);
//             const monthNames = store.months;
                
//             const filteredSave = store.saves.filter((data) => {
//                 const date = new Date(data.dateTime);
//                 return date.getFullYear() === props.selectedYear;
//             });

//             const saveChartDataMap = new Map();
        
//             filteredSave.forEach((save) => {
//                 const saveMonth = new Date(save.dateTime).getMonth() + 1;
//                 const existingData = saveChartDataMap.get(saveMonth) || { value: 0, category: 'Sin reservas' };
        
//                 saveChartDataMap.set(saveMonth, {
//                     month: monthNames[saveMonth - 1],
//                     value: existingData.value + save.value,
//                     category: save.category.name,
//                 });
//             });

//             const saveDataArray = monthsArray.map((month) => saveChartDataMap.get(month) || { month, value: 0, category: 'Sin reservas' });
//             setChartData(saveDataArray);
//         };
//     transformData();
//     }, [ props.selectedYear]);

//     const data = {
//         labels: store.months,
//         datasets: [
//             {
//                 label: chartData.category,
//                 data: chartData.map((data) => data.value),
//                 backgroundColor: [
//                     "rgb(99, 177, 191)",
//                     "rgb(0, 168, 197)",
//                     "rgb(40, 124, 147)",
//                     "rgb(27, 100, 113)",
//                     "rgb(27, 113, 113)",
//                     "rgb(7, 128, 139)",
//                     "rgb(0, 165, 171)",
//                 ],
//             },
//         ],
//     };

//     const options = {
//         plugins: {
//             legend: {
//                 display: false,
//             }
//         },
//         scales: {
//             x: {
//                 stacked: true,
//                 grid: {
//                     display: false,
//                 }
//             },
//             y: {
//                 stacked: true,
//                 display: false,
//                 grid: {
//                     display: false,
//                 }
//             },
//         },
//     };

//     return (
//         <>
//             <div className="col text-center">
//                 <h3>Reservas</h3>
//                 <p>Qué días tenemos cada reserva.</p>
//                 {chartData.length > 0 ? <Bar options={options} data={data} /> : <p>No hay reservas para este mes.</p>}
//             </div>
//         </>
//     );
// };