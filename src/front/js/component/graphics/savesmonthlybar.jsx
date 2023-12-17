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

    const dataBar = {
        labels: saveBarData.map((data) => `${data.day}`),
        datasets: [
            {
                label: "Reservado",
                data: saveBarData.map((data) => data.value),
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
                data: usageBarData.map((data) => data.value),
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
        buildBarDataChart();
    }, [props.selectedMonthIndex, props.selectedYear]);

    return (
        <>
            <div className="col text-center">
                {chartData.length > 0 ? <Bar options={options} data={dataBar} /> : <p>No hay reservas para este mes.</p>}
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

// export const MonthlySaveBar = (props) => {
//     const { store, actions } = useContext(Context);
//     const [chartData, setChartData] = useState([]);

//     useEffect(() => {
//         const transformData = async () => {
//             await actions.getSaves();

//             const daysInMonth = new Date(props.selectedYear, props.selectedMonthIndex + 1, 0).getDate();
//             const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);

//             const filteredSave = store.saves.filter((data) => {
//                 const date = new Date(data.dateTime);
//                 return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
//             });

//             const chartDataArray = daysArray.map((day) => {
//                 const savesForDay = filteredSave.filter((save) => {
//                     const saveDay = new Date(save.dateTime).getDate();
//                     return saveDay === day;
//                 });

//                 const totalValue = savesForDay.reduce((total, save) => total + save.value, 0);

//                 return {
//                     day,
//                     value: totalValue,
//                     category: savesForDay.length > 0 ? savesForDay[0].category.name : 'Sin reservas',
//                 };
//             });

//             setChartData(chartDataArray);
//         };
//         transformData();
//     }, [props.selectedMonthIndex, props.selectedYear]);

//     const data = {
//         labels: chartData.map((data) => `${data.day}`),
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

