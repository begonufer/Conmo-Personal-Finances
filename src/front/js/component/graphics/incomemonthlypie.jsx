import React, { useContext, useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
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

export const MonthlyIncomePie = (props) => {
  
    const { store, actions } = useContext(Context);
    const [categoryTotals, setCategoryTotals] = useState({});

    useEffect(() => {
        const transformData = async () => {
        await actions.getIncomes();

        const filteredIncome = store.incomes.filter((data) => {
            const date = new Date(data.dateTime);
            return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
        });

        const totals = {};
        filteredIncome.forEach(({ value, incomecategory }) => {
            const categoryName = incomecategory.name;
            totals[categoryName] = (totals[categoryName] || 0) + value;
        });
        setCategoryTotals(totals);
        };

        transformData();
    }, [props.selectedMonthIndex, props.selectedYear]);

    const data = {
        labels: Object.keys(categoryTotals),
        datasets: [
            {
                data: Object.values(categoryTotals),
                backgroundColor: [
                    "rgb(255, 217, 0)",
                    "rgb(191, 159, 0)",
                    "rgb(151, 140, 22)",
                    "rgb(207, 193, 44)",
                    "rgb(215, 211, 20)",
                    "rgb(255, 242, 94)",
                ],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false,
            }
        },
    };

    return (
        <>
            {Object.keys(categoryTotals).length > 0 ? (
                <>
                    <Pie data={data} options={options} />
                </>
                ) : (
                <p>No hay ingresos para este mes.</p>
            )}
        </>
    );
};


// código sin optimizar -->

// export const MonthlyIncomePie = (props) => {
    
//     const { store, actions } = useContext(Context);

//     const [filteredData, setFilteredData] = useState([]);

//     const [categoryTotals, setCategoryTotals] = useState({});

//     const [totalAmount, setTotalAmount] = useState(0);

//     useEffect(() => {
//       const transformData = async () => {
//         await actions.getIncomes();
//         const filteredIncome = store.incomes.filter((data) => {
//           const date = new Date(data.dateTime);
//           return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
//         });
//         setFilteredData(filteredIncome);
        
//         const totals = {};
//         filteredIncome.forEach(({ value, incomecategory }) => {
//           const categoryName = incomecategory.name;
//           totals[categoryName] = (totals[categoryName] || 0) + value;
//         });
//         setCategoryTotals(totals);
//       };
  
//       transformData();
//     }, [props.selectedMonthIndex]);
    
//     const data = {
//       labels: Object.keys(categoryTotals),
//       datasets: [
//         {
//           data: Object.values(categoryTotals),
//           backgroundColor: [
//             "rgb(138, 181, 63)",
//             "rgb(188, 207, 44)",
//             "rgb(207, 193, 44)",
//             "rgb(40, 124, 147)",
//             "rgb(29, 174, 159)",
//             "rgb(29, 180, 122)",
//         ],
//         borderWidth: 0,
//         },
//       ],
//     };

//     const options = {
//         legend: {
//         display: false,
//         },
//         labels: {
//             display: false,
//         }
//     };

//   return (
//     <>
//         <div className="row mt-2">
//             <h3>Ingresos</h3>
//             <p>Dónde se ocupa cada parte de los ingresos.</p>
//             <Pie data={data} options={options} />
//          </div>
//     </>
//   );
// };

// import React, { useContext, useState, useEffect } from 'react';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     BarElement,
//     ArcElement,
//     Title,
//     Tooltip,
//     Legend,
// } from "chart.js";
// import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
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

// export const MonthlyIncomePie = (props) => {

//     const { store, actions } = useContext(Context);

//     const [filteredData, setFilteredData] = useState([]);

//     useEffect(() => {
//         // Filtra los datos por mes y año seleccionados
//         const filteredIncome = store.incomes.filter((data) => {
//             const date = new Date(data.dateTime);
//             return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
//         });
//         setFilteredData(filteredIncome);
//     }, [store.incomes, props.selectedMonthIndex, props.selectedYear]);

//     const data = {
//         labels: filteredData.map((item) => item.income_category),
//         datasets: [
//             {
//                 label: "€",
//                 data: filteredData.map((item) => item.value),
//                 backgroundColor: [
//                     "rgb(40, 124, 147)",
//                     "rgb(29, 174, 159)",
//                     "rgb(29, 180, 122)",
//                     "rgb(138, 181, 63)",
//                     "rgb(188, 207, 44)",
//                     "rgb(207, 193, 44)",
//                 ],
//                 borderWidth: 0,
//             },
//         ],
//     };

//     const options = {
//         legend: {
//         display: false,
//         },
//         labels: {
//             display: false,
//         }
//     };

//   return (
//     <>
//         <div className="row mt-2">
//             <h3>Ingresos</h3>
//             <p>Dónde se ocupa cada parte de los ingresos.</p>
//             <Pie data={data} options={options} />
//          </div>
//     </>
//   );
// };