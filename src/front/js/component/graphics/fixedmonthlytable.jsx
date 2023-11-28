import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { format } from "date-fns";
import es from "date-fns/locale/es";

export const MonthlyFixedTable = (props) => {
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
            await actions.getFixes();
            await actions.getIncomes();
            const filteredFixed = store.fixes.filter((data) => {
                const date = new Date(data.dateTime);
                return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
            });

            const totals = {};
            filteredFixed.forEach(({ value, fixedcategory }) => {
                const categoryName = fixedcategory.name;
                totals[categoryName] = (totals[categoryName] || 0) + value;
            });
            setCategoryTotals(totals);
        };
        transformData();
    }, [props.selectedMonthIndex, props.selectedYear]);
 
    const incomeMonthAmount = store.incomes
    .filter((data) => {
        const date = new Date(data.dateTime);
        return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
    })
    .reduce((total, income) => total + income.value, 0);

    const selectedMonthAmount = store.fixes
        .filter((data) => {
            const date = new Date(data.dateTime);
            return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
        })
        .reduce((total, fixed) => total + fixed.value, 0);

    const restAmount = incomeMonthAmount - selectedMonthAmount;

    return (
        <>
            <div className="row">
                <div className="col mx-3">
                    <p className="fixed-bg text-white p-3">{calculatePercentage(selectedMonthAmount, incomeMonthAmount)} %</p>
                </div>
                <div className="col mx-3">
                    <p className="fixed-bg text-white p-3">{selectedMonthAmount} €</p>
                </div>
            </div>
            <div className="text-center">
                <table className="table table-borderless align-middle">
                    <tbody>
                        {Object.entries(categoryTotals).map(([category, total]) => (
                            <tr className="line" key={category}>
                                <th scope="row" className="half-width">{category}</th>
                                <td>{calculatePercentage(total, incomeMonthAmount)} %</td>
                                <td>{total} €</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="fixed-bg text-white p-3 mx-3">Libre <i className="fas fa-arrow-right"></i>{calculatePercentage(restAmount, incomeMonthAmount)} %<i className="fas fa-arrow-right"></i> {restAmount} €</p>
        </>
    );
};