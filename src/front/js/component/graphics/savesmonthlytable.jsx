import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { format } from "date-fns";
import es from "date-fns/locale/es";

export const MonthlySavesTable = (props) => {
    const { store, actions } = useContext(Context);

    const calculatePercentage = (amount, total) => {
        if (total === 0) {
            return 0;
        }
        return ((amount / total) * 100).toFixed(0);
    };

    const [categoryTotals, setCategoryTotals] = useState({});
    const [usageCategoryTotals, setUsageCategoryTotals] = useState({});

    useEffect(() => {
        const transformData = async () => {
            
            await actions.getIncomes();
            await actions.getSaves();
            await actions.getUsage();

            const filteredSave = store.saves.filter((data) => {
                const date = new Date(data.dateTime);
                return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
            });
            const filteredUsage = store.usages.filter((data) => {
                const date = new Date(data.dateTime);
                return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
            });

            const totals = {};
            filteredSave.forEach(({ value, category }) => {
                const categoryName = category.name;
                totals[categoryName] = (totals[categoryName] || 0) + value;
            });

            const usageTotals = {};
            filteredUsage.forEach(({ value, category }) => {
                const categoryName = category.name;
                usageTotals[categoryName] = (usageTotals[categoryName] || 0) + value;
            });

            setCategoryTotals(totals);
            setUsageCategoryTotals(usageTotals);
        };

        transformData();
    }, [props.selectedMonthIndex, props.selectedYear]);


    const selectedMonthAmount = store.saves
        .filter((data) => {
            const date = new Date(data.dateTime);
            return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
        })
        .reduce((total, save) => total + save.value, 0);

    const selectedMonthUsageAmount = store.usages
    .filter((data) => {
        const date = new Date(data.dateTime);
        return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
    })
    .reduce((total, usage) => total + usage.value, 0);
        
    
    const selectedMonthIncomeAmount = store.incomes
        .filter((data) => {
            const date = new Date(data.dateTime);
            return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
        })
        .reduce((total, income) => total + income.value, 0);

    const balance = selectedMonthAmount - selectedMonthUsageAmount;



    return (
        <>
            <div className="row mx-1 gap-2">
                <div className="col">
                    <div className="row text-white saves-part-right rounded-pill fw-normal fs-5 mx-1">
                        <div className="col py-3 saves-bold-bg fw-bold">Reservado</div>
                        <div className="col py-3 fw-normal"> {selectedMonthAmount} €</div>
                    </div>
                </div>
                <div className="col">
                    <div className="row text-white usage-part-right rounded-pill fw-normal fs-5">
                        <div className="col p-3 usage-bold-bg fw-bold">Usado</div>
                        <div className="col p-3 fw-normal"> {selectedMonthUsageAmount} €</div>
                        <div className="col p-3 fw-normal">{calculatePercentage(selectedMonthUsageAmount, selectedMonthAmount)} %</div>
                    </div>
                </div>
                <div className="col">
                    <div className="row text-white saves-part-right rounded-pill fw-normal fs-5 mx-1">
                        <div className="col p-3 saves-bold-bg fw-bold">Balance</div>
                        <div className="col p-3 fw-normal">{balance} €</div>
                    </div>
                </div>
            </div>
            <div className="row text-white saves-bold-bg rounded-pill fs-5 mx-1 mt-5">
                <div className="col p-2">Categoría</div>
                <div className="col p-2">Reservado</div>
                <div className="col p-2">%</div>
                <div className="col p-2">Usado</div>
                <div className="col p-2">%</div>
                <div className="col p-2">Balance</div>
            </div>
            <div className="m-3 my-4">
                {Object.entries(categoryTotals).map(([category, total]) => (
                    <div key={category} className="row fs-5 lh-lg">
                        <div className="col fw-bold ">{category}</div>
                        <div className="col">{total} €</div>
                        <div className="col">{calculatePercentage(total, selectedMonthIncomeAmount)} %</div>
                        <div className="col">{- (usageCategoryTotals[category]) || 0} €</div>
                        <div className="col">{calculatePercentage(usageCategoryTotals[category] || 0, total)} %</div>
                        <div className="col">{(total - usageCategoryTotals[category] || 0).toFixed(2)} €</div>
                    </div>
                ))}
            </div>
        </>
    );
};