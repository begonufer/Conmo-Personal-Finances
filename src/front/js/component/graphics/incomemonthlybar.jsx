import React, { useState, useEffect, useContext } from "react";
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

export const MonthlyIncomeBar = (props) => {
    const { store, actions } = useContext(Context);
    const [chartData, setChartData] = useState([]);
  
    useEffect(() => {
      const transformData = async () => {
        await actions.getIncomes();
  
        const daysInMonth = new Date(props.selectedYear, props.selectedMonthIndex + 1, 0).getDate();
        const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  
        const filteredIncome = store.incomes.filter((data) => {
          const date = new Date(data.dateTime);
          return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
        });
  
        const chartDataArray = daysArray.map((day) => {
          const incomeForDay = filteredIncome.find((income) => {
            const incomeDay = new Date(income.dateTime).getDate();
            return incomeDay === day;
          });
  
          return {
            day,
            value: incomeForDay ? incomeForDay.value : 0,
            category: incomeForDay ? incomeForDay.incomecategory.name : 'Sin ingresos',
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
          label: 'Ingresos',
          data: chartData.map((data) => data.value),
          backgroundColor: [
            "rgb(40, 124, 147)",
            "rgb(29, 174, 159)",
            "rgb(29, 180, 122)",
            "rgb(138, 181, 63)",
            "rgb(188, 207, 44)",
            "rgb(207, 193, 44)",
          ],
        },
      ],
    };
  
    const options = {
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    };
  
    return (
      <>
        <div className="col text-center">
          <h3>Ingresos</h3>
          <p>Qué días tenemos cada ingreso.</p>
          {chartData.length > 0 ? <Bar options={options} data={data} /> : <p>No hay ingresos para este mes.</p>}
        </div>
      </>
    );
  };
  
//este es el código sin corregir -->

// export const MonthlyIncomeBar = (props) => {
//     const { store, actions } = useContext(Context);
//     const [chartData, setChartData] = useState([]);
  
//     useEffect(() => {
//         const transformData = async () => {
//             await actions.getIncomes();
    
//             const daysInMonth = new Date(props.selectedYear, props.selectedMonthIndex + 1, 0).getDate();
//             const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);

//             const filteredIncome = store.incomes.filter((data) => {
//             const date = new Date(data.dateTime);
//             return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
//             });

//             const chartDataArray = daysArray.map((day) => {
//             const incomeForDay = filteredIncome.find((income) => {
//                 const incomeDay = new Date(income.dateTime).getDate();
//                 return incomeDay === day;
//             });
    
//             return {
//                 day,
//                 value: incomeForDay ? incomeForDay.value : 0,
//                 category: incomeForDay ? incomeForDay.incomecategory.name : 'Sin ingresos',
//             };
//             });
//             setChartData(chartDataArray);
//         };    
//         transformData();
//         }, [props.selectedMonthIndex, props.selectedYear]);
  
//     const data = {
//         labels: chartData.map((data) => `${data.day}`),
//         datasets: [
//             {
//                 label: 'Ingresos',
//                 data: chartData.map((data) => data.value),
//                 backgroundColor: [
//                     "rgb(40, 124, 147)",
//                     "rgb(29, 174, 159)",
//                     "rgb(29, 180, 122)",
//                     "rgb(138, 181, 63)",
//                     "rgb(188, 207, 44)",
//                     "rgb(207, 193, 44)",
//                 ]
//             },
//         ],
//     };

//     const options = {
//         scales: {
//         x: {
//             stacked: true,
//         },
//         y: {
//             stacked: true,
//         },
//         },
//     };

//     return (
//         <>
//             <div className="col text-center">
//                 <h3>Ingresos</h3>
//                 <p>Qué días tenemos cada ingreso.</p>
//                 <Bar options={options} data={data} />
//             </div>
//         </>
//     );
// };



// import React, { useState, useEffect, useContext, Component } from "react";
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
// import { Bar, Pie, Line } from "react-chartjs-2";
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

// export const MonthlyIncomeBar = (props) => {

//     const { store, actions } = useContext(Context);

//     const options = {
//       plugins: {
//         title: {
//           display: false,
//           text: props.selectedMonth, // Mostrar el mes y el año seleccionados en el título
//         },
//       },
//       responsive: true,
//       scales: {
//         x: {
//           stacked: false,
//         },
//         y: {
//           stacked: false,
//         },
//       },
//     };

//     const [ bardata, setBardata ] = useState({
//         labels: [],
//         datasets: [
//             {
//                 label: props.selectedMonth,
//                 data: [],
//                 backgroundColor: [
//                 "rgb(40, 124, 147)"
//                 ]
//             },
//         ],
//     });
        
//     useEffect(() => {
//         const transformData = async () => {
//             await actions.getIncomes();
//             const data = store.incomes.map((income) => {
//                 const dateTime = new Date(income.dateTime);
//                 const day = format(dateTime, "dd", { locale: es });
//                 return { ...income, dateTime, day };
//             });

//             const currentDate = new Date();
//             const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//             const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

//             const daysOfMonth = [];
//             for (let date = new Date(firstDayOfMonth); date <= lastDayOfMonth; date.setDate(date.getDate() + 1)) {
//                 daysOfMonth.push(format(date, "dd", { locale: es }));
//             }

//             const valueByDay = daysOfMonth.map((day) =>
//             data.reduce((totalByDay, income) => {
//                 if (income.day === day) {
//                     totalByDay += income.value;
//                 }
//                 return totalByDay;
//             }, 0));
            
//             const graphdata = {
//                 labels: daysOfMonth,
//                 datasets: [
//                     {
//                         label: props.selectedMonth,
//                         data: valueByDay,
//                         backgroundColor: [
//                             "rgb(40, 124, 147)",
//                             "rgb(29, 174, 159)",
//                             "rgb(29, 180, 122)",
//                             "rgb(138, 181, 63)",
//                             "rgb(188, 207, 44)",
//                             "rgb(207, 193, 44)",
//                             ]
//                     },
//                 ],
//             };
//             setBardata(graphdata);
//         };
//         transformData();
//     }, [setBardata]);

//     return (
//         <>
//             <div className="col text-center">
//                 <h3>Ingresos</h3>
//                 <p>Qué días tenemos cada ingreso.</p>
//                 <Bar options={options} data={bardata} />
//             </div>
//         </>
//     );
// };