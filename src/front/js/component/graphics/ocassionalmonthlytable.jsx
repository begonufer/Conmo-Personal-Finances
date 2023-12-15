import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { format } from "date-fns";
import es from "date-fns/locale/es";

export const MonthlyOcassionalTable = (props) => {
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
            await actions.getOcassionals();
            await actions.getIncomes();
            const filteredOcassional = store.ocassionals.filter((data) => {
                const date = new Date(data.dateTime);
                return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
            });

            const totals = {};
            filteredOcassional.forEach(({ value, ocassionalcategory }) => {
                const categoryName = ocassionalcategory.name;
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

    const selectedMonthAmount = store.ocassionals
        .filter((data) => {
            const date = new Date(data.dateTime);
            return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
        })
        .reduce((total, ocassional) => total + ocassional.value, 0);

    const restAmount = incomeMonthAmount - selectedMonthAmount;

    return (
        <>
            <div className="row mx-1 gap-2">
                <div className="col">
                    <div className="ocassional-bg text-white p-3">{selectedMonthAmount} €</div>
                </div>
                <div className="col">
                    <div className="ocassional-bg text-white p-3">{calculatePercentage(selectedMonthAmount, incomeMonthAmount)} %</div>
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
            <div className="row ocassional-bg text-white mx-1 mt-2">
                <div className="col p-3 fw-bold">Restante</div>
                <div className="col p-3 ocassional-part-right fw-normal">{restAmount} €</div>
            </div>
        </>
    );
};