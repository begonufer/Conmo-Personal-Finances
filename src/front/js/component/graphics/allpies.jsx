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
import { Pie } from "react-chartjs-2";
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

export const AllPies = (props) => {
  
    const { store, actions } = useContext(Context);

    const filterDataByMonthYear = (data, selectedMonthIndex, selectedYear) => {
        return data.filter((item) => {
            const date = new Date(item.dateTime);
            return date.getMonth() === selectedMonthIndex && date.getFullYear() === selectedYear;
        });
    };

    const buildCategoryColorTotals = (filteredData, categoryKey, colors, categoryType) => {
        const categoryColorTotals = {};

        filteredData.forEach(({ value, [categoryKey]: category }, index) => {
            const categoryName = category.name;
            categoryColorTotals[categoryName] = {
                value: (categoryColorTotals[categoryName]?.value || 0) + value,
                color: colors[index % colors.length],
                type: categoryType,
            };
        });

        return categoryColorTotals;
    };

    const mergeCategoryTotals = (categoryTotalsObject) => {
        const mergedTotals = {};

        Object.keys(categoryTotalsObject).forEach((categoryKey) => {
            const categoryTotals = categoryTotalsObject[categoryKey];

            Object.keys(categoryTotals).forEach((name) => {
                if (!mergedTotals[name]) {
                    mergedTotals[name] = { value: 0, color: '', type:'' };
                }

                mergedTotals[name].value += categoryTotals[name].value;
                if (categoryTotals[name].color && !mergedTotals[name].color) {
                    mergedTotals[name].color = categoryTotals[name].color;
                }

                if (categoryTotals[name].type && !mergedTotals[name].type) {
                    mergedTotals[name].type = categoryTotals[name].type;
                }
            });
        });

        return mergedTotals;
    };

    const [categoryTotals, setCategoryTotals] = useState({});
    
    const buildCategoryTotals = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getFixes();
        await actions.getOcassionals();
    
        const filteredIncomes = filterDataByMonthYear(store.incomes, props.selectedMonthIndex, props.selectedYear);
        const filteredSave = filterDataByMonthYear(store.saves, props.selectedMonthIndex, props.selectedYear);
        const filteredFixed = filterDataByMonthYear(store.fixes, props.selectedMonthIndex, props.selectedYear);
        const filteredOcassional = filterDataByMonthYear(store.ocassionals, props.selectedMonthIndex, props.selectedYear);
    
        const incomesColors = ["rgb(207, 193, 44)", "rgb(188, 207, 44)", "rgb(138, 181, 63)", "rgb(40, 124, 147)", "rgb(29, 174, 159)", "rgb(29, 180, 122)"];
        const savesColors = ["rgb(40, 130, 150)", "rgb(40, 140, 160)", "rgb(40, 150, 170)", "rgb(40, 160, 180)"];
        const fixedColors = ["rgb(147, 70, 110)", "rgb(147, 80, 120)", "rgb(147, 90, 130)"];
        const ocassionalColors = ["rgb(138, 190, 70)", "rgb(138, 200, 80)", "rgb(138, 210, 90)"];
    
        const incomesTotals = buildCategoryColorTotals(filteredIncomes, 'incomecategory', incomesColors, 'income');
        const saveTotals = buildCategoryColorTotals(filteredSave, 'category', savesColors, 'save');
        const fixedTotals = buildCategoryColorTotals(filteredFixed, 'fixedcategory', fixedColors, 'fixed');
        const ocassionalTotals = buildCategoryColorTotals(filteredOcassional, 'ocassionalcategory', ocassionalColors, 'ocassional');
    
        return { income: incomesTotals, save: saveTotals, fixed: fixedTotals, ocassional: ocassionalTotals };
    };

    const buildChartData = async () => {

        const categoryTotals = await buildCategoryTotals();
    
        delete categoryTotals.save;
    
        const mergedTotals = mergeCategoryTotals(categoryTotals);
    
        return setCategoryTotals(mergedTotals);

    };

    
    useEffect(() => {
        buildChartData();
    }, [props.selectedMonthIndex, props.selectedYear]);

    const data = {
        labels: Object.keys(categoryTotals),
        datasets: [
            {
                data: Object.values(categoryTotals).map(item => item.value),
                backgroundColor: Object.values(categoryTotals).map(item => item.color),
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
        <div className="col mx-5 text-center">
            <div className="row mt-5">
                <p>La parte de los ingresos que ocupa cada categoría de gasto/reserva.</p>
                {Object.keys(categoryTotals).length > 0 ? (
                    <>
                        <Pie data={data} options={options} />
                    </>
                ) : (
                    <p>No hay datos en este mes.</p>
                )}
            </div>
        </div>
    );
};


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
// import { Pie } from "react-chartjs-2";
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

// export const AllPies = (props) => {
  
//     const { store, actions } = useContext(Context);

//     const filterDataByMonthYear = (data, selectedMonthIndex, selectedYear) => {
//         return data.filter((item) => {
//             const date = new Date(item.dateTime);
//             return date.getMonth() === selectedMonthIndex && date.getFullYear() === selectedYear;
//         });
//     };

//     const buildCategoryColorTotals = (filteredData, categoryKey, colors, categoryType) => {
//         const categoryColorTotals = {};

//         filteredData.forEach(({ value, [categoryKey]: category }, index) => {
//             const categoryName = category.name;
//             categoryColorTotals[categoryName] = {
//                 value: (categoryColorTotals[categoryName]?.value || 0) + value,
//                 color: colors[index % colors.length],
//                 type: categoryType,
//             };
//         });

//         return categoryColorTotals;
//     };

//     const mergeCategoryTotals = (categoryTotalsObject) => {
//         const mergedTotals = {};

//         Object.keys(categoryTotalsObject).forEach((categoryKey) => {
//             const categoryTotals = categoryTotalsObject[categoryKey];

//             Object.keys(categoryTotals).forEach((name) => {
//                 if (!mergedTotals[name]) {
//                     mergedTotals[name] = { value: 0, color: '', type:'' };
//                 }

//                 mergedTotals[name].value += categoryTotals[name].value;
//                 // Use color from the first category (incomes in this case)
//                 if (categoryTotals[name].color && !mergedTotals[name].color) {
//                     mergedTotals[name].color = categoryTotals[name].color;
//                 }

//                 if (categoryTotals[name].type && !mergedTotals[name].type) {
//                     mergedTotals[name].type = categoryTotals[name].type;
//                 }
//             });
//         });

//         return mergedTotals;
//     };

//     const [categoryTotals, setCategoryTotals] = useState({});
    
//     const buildChartData = async () => {
//         await actions.getIncomes();
//         await actions.getSaves();
//         await actions.getFixes();
//         await actions.getOcassionals();

//         const filteredIncomes = filterDataByMonthYear(store.incomes, props.selectedMonthIndex, props.selectedYear);
//         const filteredSave = filterDataByMonthYear(store.saves, props.selectedMonthIndex, props.selectedYear);
//         const filteredFixed = filterDataByMonthYear(store.fixes, props.selectedMonthIndex, props.selectedYear);
//         const filteredOcassional = filterDataByMonthYear(store.ocassionals, props.selectedMonthIndex, props.selectedYear);

//         const incomesColors = ["rgb(207, 193, 44)", "rgb(188, 207, 44)", "rgb(138, 181, 63)", "rgb(40, 124, 147)", "rgb(29, 174, 159)", "rgb(29, 180, 122)"];
//         const savesColors = ["rgb(40, 130, 150)", "rgb(40, 140, 160)", "rgb(40, 150, 170)", "rgb(40, 160, 180)"];
//         const fixedColors = ["rgb(147, 70, 110)", "rgb(147, 80, 120)", "rgb(147, 90, 130)"];
//         const ocassionalColors = ["rgb(138, 190, 70)", "rgb(138, 200, 80)", "rgb(138, 210, 90)"];

//         const incomesTotals = buildCategoryColorTotals(filteredIncomes, 'incomecategory', incomesColors, 'income');
//         const saveTotals = buildCategoryColorTotals(filteredSave, 'category', savesColors, 'save');
//         const fixedTotals = buildCategoryColorTotals(filteredFixed, 'fixedcategory', fixedColors, 'fixed');
//         const ocassionalTotals = buildCategoryColorTotals(filteredOcassional, 'ocassionalcategory', ocassionalColors, 'ocassional');

//         const mergedTotals = mergeCategoryTotals({ save: saveTotals, fixed: fixedTotals, ocassional: ocassionalTotals });

//         console.log(mergedTotals)

//         return setCategoryTotals(mergedTotals);
//     };
    
//     useEffect(() => {
//         buildChartData();
//     }, [props.selectedMonthIndex, props.selectedYear]);

//     const data = {
//         labels: Object.keys(categoryTotals),
//         datasets: [
//             {
//                 data: Object.values(categoryTotals).map(item => item.value),
//                 backgroundColor: Object.values(categoryTotals).map(item => item.color),
//                 borderWidth: 0,
//             },
//         ],
//     };

//     const options = {
//         plugins: {
//             legend: {
//                 display: false,
//             }
//         },
//     };

//     return (
//         <div className="col mx-5 text-center">
//             <div className="row mt-5">
//                 <p>La parte de los ingresos que ocupa cada categoría de gasto/reserva.</p>
//                 {Object.keys(categoryTotals).length > 0 ? (
//                     <>
//                         <Pie data={data} options={options} />
//                     </>
//                 ) : (
//                     <p>No hay datos en este mes.</p>
//                 )}
//             </div>
//         </div>
//     );
// };
