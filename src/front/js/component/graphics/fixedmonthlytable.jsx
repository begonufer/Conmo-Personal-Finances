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
            <div className="row mx-1 gap-2">
                <div className="col">
                    <div className="fixed-bg text-white p-3">{selectedMonthAmount} €</div>
                </div>
                <div className="col">
                    <div className="fixed-bg text-white p-3">{calculatePercentage(selectedMonthAmount, incomeMonthAmount)} %</div>
                </div>
            </div>
            <div className="m-3 my-4">
                {Object.entries(categoryTotals).map(([category, total]) => (
                    <div key={category} className="row fs-4 lh-lg">
                        <div className="col-6 fw-bold ">{category}</div>
                        <div className="col">{calculatePercentage(total, incomeMonthAmount)} %</div>
                        <div className="col">{total} €</div>
                    </div>
                ))}
            </div>
            {/* <p className="fixed-bg text-white p-3 mx-3">Libre <i className="fas fa-arrow-right"></i>{calculatePercentage(restAmount, incomeMonthAmount)} %<i className="fas fa-arrow-right"></i> {restAmount} €</p> */}
            <div className="row fixed-bg text-white mx-1 mt-2">
                <div className="col p-3 fw-bold">Libre</div>
                <div className="col p-3 fixed-part-right fw-normal">{restAmount} €</div>
            </div>
        </>
    );
};