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
                <div className="col p-0">
                    <div className="row text-white saves-part-right rounded-pill fw-normal fs-5 mx-1">
                        <div className="col mobile-text py-3 saves-bold-bg fw-bold">Reservado</div>
                        <div className="col mobile-text py-3 fw-normal"> {selectedMonthAmount.toFixed(2)} €</div>
                    </div>
                </div>
                <div className="col">
                    <div className="row text-white usage-part-right rounded-pill fw-normal fs-5">
                        <div className="col-md col-auto mobile-text p-3 usage-bold-bg fw-bold">Usado</div>
                        <div className="col-md col-auto mobile-text py-3 fw-normal"> {selectedMonthUsageAmount.toFixed(2)} €</div>
                        <div className="col-md col-auto mobile-text py-3 fw-normal">{calculatePercentage(selectedMonthUsageAmount, selectedMonthAmount)} %</div>
                    </div>
                </div>
                <div className="col-md col-12 p-0">
                    <div className="row text-white saves-part-right rounded-pill fw-normal fs-5 mx-0 mx-md-1 my-2 my-md-0">
                        <div className="col mobile-text p-3 saves-bold-bg fw-bold">Balance</div>
                        <div className="col mobile-text p-3 fw-normal">{balance.toFixed(2)} €</div>
                    </div>
                </div>
            </div>
            <div className="row text-white saves-bold-bg rounded-pill fs-5 mx-1 mt-3 mt-md-5">
                <div className="col-md col-3 mobile-text p-2">Categoría</div>
                <div className="col-md col-3 mobile-text p-2">Reservado</div>
                <div className="col-md col-2 mobile-text p-2">%</div>
                <div className="col-md col-2 mobile-text p-2">Usado</div>
                <div className="col-md col-2 mobile-text p-2">%</div>
                <div className="col d-none d-md-block p-2">Balance</div>
            </div>
            <div className="m-2 m-md-3 my-md-4">
                {Object.entries(categoryTotals).map(([category, total]) => (
                    <div key={category} className="row fs-4 lh-lg d-flex align-items-center">
                        <div className="col-md col-3 mobile-text fw-bold overflow-hidden text-truncate">{category}</div>
                        <div className="col-md col-3 mobile-text">{total.toFixed(2)}€</div>
                        <div className="col-md col-2 mobile-text">{calculatePercentage(total, selectedMonthIncomeAmount)}%</div>
                        <div className="col-md col-2 mobile-text">{- ((usageCategoryTotals[category]) || 0).toFixed(2)}€</div>
                        <div className="col-md col-2 mobile-text">{calculatePercentage(usageCategoryTotals[category] || 0, total)}%</div>
                        <div className="col d-none d-md-block">{(total - usageCategoryTotals[category] || 0).toFixed(2)}€</div>
                    </div>
                ))}
            </div>
        </>
    );
};