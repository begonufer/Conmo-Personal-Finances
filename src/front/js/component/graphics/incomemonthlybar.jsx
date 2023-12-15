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
                const incomesForDay = filteredIncome.filter((income) => {
                    const incomeDay = new Date(income.dateTime).getDate();
                    return incomeDay === day;
                });

                const totalValue = incomesForDay.reduce((total, income) => total + income.value, 0);

                return {
                    day,
                    value: totalValue,
                    category: incomesForDay.length > 0 ? incomesForDay[0].incomecategory.name : 'Sin ingresos',
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













// intento 06/12
// import React, { useState, useEffect, useContext } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar, Pie, Line } from "react-chartjs-2";
// import { Context } from "../../store/appContext";
// import { format } from "date-fns";
// import es from "date-fns/locale/es";

// ChartJS.register(
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export const MonthlyIncomeBar = (props) => {
//   const { store, actions } = useContext(Context);
//   const [categoryTotals, setCategoryTotals] = useState([]);



//   const buildCategoryColorTotals = (filteredData, categoryKey, colors, categoryType) => {
//     const categoryColorTotals = [];

//     filteredData.forEach(({ value, dateTime, [categoryKey]: category }, index) => {
//       const categoryName = category.name;
//       const day = new Date(dateTime).getDate();

//       const existingData = categoryColorTotals.find((data) => data.day === day);

//       if (existingData) {
//         existingData.values.push({
//           value,
//           category: categoryName,
//           color: colors[index % colors.length],
//           type: categoryType,
//         });
//       } else {
//         categoryColorTotals.push({
//           day,
//           values: [
//             {
//               value,
//               category: categoryName,
//               color: colors[index % colors.length],
//               type: categoryType,
//             },
//           ],
//         });
//       }
//     });

//     return categoryColorTotals;
//   };

//   const mergeCategoryTotals = (categoryTotalsArray) => {
//     const mergedTotals = {};

//     categoryTotalsArray.forEach((categoryTotals) => {
//       categoryTotals.forEach((dayData) => {
//         const day = dayData.day;
//         if (!mergedTotals[day]) {
//           mergedTotals[day] = { day, values: [] };
//         }

//         mergedTotals[day].values.push(...dayData.values);
//       });
//     });

//     return Object.values(mergedTotals);
//   };

//   const filterDataByMonthYear = (data, selectedMonthIndex, selectedYear) => {
//     return data.filter((item) => {
//         const date = new Date(item.dateTime);
//         return date.getMonth() === selectedMonthIndex && date.getFullYear() === selectedYear;
//     });
//   };

//   const buildCategoryTotals = async () => {
//     await actions.getIncomes();
//     await actions.getSaves();
//     await actions.getFixes();
//     await actions.getOcassionals();

//     const filteredIncomes = filterDataByMonthYear(store.incomes, props.selectedMonthIndex, props.selectedYear);
//     const filteredSave = filterDataByMonthYear(store.saves, props.selectedMonthIndex, props.selectedYear);
//     const filteredFixed = filterDataByMonthYear(store.fixes, props.selectedMonthIndex, props.selectedYear);
//     const filteredOcassional = filterDataByMonthYear(store.ocassionals, props.selectedMonthIndex, props.selectedYear);

//     const incomesColors = ["rgb(207, 193, 44)", "rgb(188, 207, 44)", "rgb(138, 181, 63)", "rgb(40, 124, 147)", "rgb(29, 174, 159)", "rgb(29, 180, 122)"];
//     const savesColors = ["rgb(40, 130, 150)", "rgb(40, 140, 160)", "rgb(40, 150, 170)", "rgb(40, 160, 180)"];
//     const fixedColors = ["rgb(147, 70, 110)", "rgb(147, 80, 120)", "rgb(147, 90, 130)"];
//     const ocassionalColors = ["rgb(138, 190, 70)", "rgb(138, 200, 80)", "rgb(138, 210, 90)"];

//     const incomesTotals = buildCategoryColorTotals(filteredIncomes, 'incomecategory', incomesColors, 'income');
//     const saveTotals = buildCategoryColorTotals(filteredSave, 'category', savesColors, 'save');
//     const fixedTotals = buildCategoryColorTotals(filteredFixed, 'fixedcategory', fixedColors, 'fixed');
//     const ocassionalTotals = buildCategoryColorTotals(filteredOcassional, 'ocassionalcategory', ocassionalColors, 'ocassional');

//     const mergedTotalsArray = mergeCategoryTotals([incomesTotals, saveTotals, fixedTotals, ocassionalTotals]);

//     setCategoryTotals(mergedTotalsArray);
//   };

//   useEffect(() => {
//     buildCategoryTotals();
//   }, [/* Dependencies */]);

//   const data = {
//     labels: categoryTotals.map((data) => `${data.day}`),
//     datasets: categoryTotals.map((dayData, index) => ({
//       label: dayData.values.map((value) => value.category),
//       data: dayData.values.map((value) => value.value),
//       backgroundColor: dayData.values.map((value) => value.color),
//     })),
//   };

//   const options = {
//     scales: {
//       x: {
//         stacked: true,
//       },
//       y: {
//         stacked: true,
//       },
//     },
//   };

//   return (
//     <>
//       <div className="col text-center">
//         <h3>Ingresos</h3>
//         <p>Qué días tenemos cada ingreso.</p>

//           <Bar options={options} data={data} />
//       </div>
//     </>
//   );
// };