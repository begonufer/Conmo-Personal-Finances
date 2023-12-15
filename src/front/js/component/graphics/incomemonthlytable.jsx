import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { format } from "date-fns";
import es from "date-fns/locale/es";

export const MonthlyIncomeTable = (props) => {
    const { store, actions } = useContext(Context);

    const calculatePercentage = (amount, total) => {
        if (total === 0) {
            return 0;
        }
        return ((amount / total) * 100).toFixed(0);
    };

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

    const previousMonthAmount = 587;
    const selectedMonthAmount = store.incomes
        .filter((data) => {
            const date = new Date(data.dateTime);
            return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
        })
        .reduce((total, income) => total + income.value, 0);

    const totalAmount = previousMonthAmount + selectedMonthAmount;

    return (
        <>
            <div className="row mx-1 gap-2">
                <div className="col">
                    <div className="row incomes-bg">
                        <div className="col p-3 fw-bold">Restos</div>
                        <div className="col p-3 incomes-part-right fw-normal"> {previousMonthAmount} €</div>
                    </div>
                </div>
                <div className="col">
                    <div className="row incomes-bg">
                        <div className="col p-3 fw-bold">{props.selectedMonth}</div>
                        <div className="col p-3 incomes-part-right fw-normal"> {selectedMonthAmount} €</div>
                    </div>
                </div>
            </div>
            <div className="m-3 my-4">
                {Object.entries(categoryTotals).map(([category, total]) => (
                    <div key={category} className="row fs-4 lh-lg">
                        <div className="col-6 fw-bold ">{category}</div>
                        <div className="col">{calculatePercentage(total, selectedMonthAmount)} %</div>
                        <div className="col">{total} €</div>
                    </div>
                ))}
            </div>
            <div className="row incomes-bg mx-1 mt-2">
                <div className="col p-3 fw-bold">Total</div>
                <div className="col p-3 incomes-part-right fw-normal"> {totalAmount} €</div>
            </div>
        </>
    );
};



































// export const ExampleTable = () => {
//     const { store, actions } = useContext(Context);
//     const [incomes, setIncomes] = useState([]);
//     const [categoryTotals, setCategoryTotals] = useState({});

//     useEffect(() => {
//          function transformData() {
//             await actions.getIncomes();
//             const data = store.incomes.map((income) => ({ ...income, dateTime: format(new Date(income.dateTime), 'dd/MM/yyyy' )}))
//             setIncomes(data);

//             // Calcular totales por categoría
//             const totals = {};
//             data.forEach(({ value, incomecategory }) => {
//                 const categoryName = incomecategory.name;
//                 totals[categoryName] = (totals[categoryName] || 0) + value;
//             });
//             setCategoryTotals(totals);
//         }

//         transformData();
//     }, [])

//     return (
//         <>
//             <div className="text-center">
//                 <h3>Totales por Categoría</h3>
//                 <ul>
//                     {Object.entries(categoryTotals).map(([category, total]) => (
//                         <li key={category}>{category}: {total}</li>
//                     ))}
//                 </ul>
//             </div>
//         </>
//     )
// }