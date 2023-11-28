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
            <div className="row">
                <div className="col mx-3">
                    <p className="incomes-bg p-3">Sobrante de {props.previousMonth} <i className="fas fa-arrow-right"></i> {previousMonthAmount} €</p>
                </div>
                <div className="col mx-3">
                    <p className="incomes-bg p-3">{props.selectedMonth} <i className="fas fa-arrow-right"></i> {selectedMonthAmount} €</p>
                </div>
            </div>
            <div className="text-center">
                <table className="table table-borderless align-middle">
                    <tbody>
                        {Object.entries(categoryTotals).map(([category, total]) => (
                            <tr className="line" key={category}>
                                <th scope="row" className="half-width">{category}</th>
                                <td>{calculatePercentage(total, selectedMonthAmount)} %</td>
                                <td>{total} €</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="incomes-bg p-3 mx-3">Total <i className="fas fa-arrow-right"></i> {totalAmount} €</p>
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