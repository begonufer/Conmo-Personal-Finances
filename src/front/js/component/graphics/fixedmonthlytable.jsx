import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useMonthSelection, filterAllDataPreviousMonth, filterDataByMonthYear, calculatePercentage, calculateAverage } from "../../pages/utils.jsx";

export const MonthlyFixedTable = (props) => {

    const { store, actions } = useContext(Context);

    const [categoryTotals, setCategoryTotals] = useState({});
    const getCategoryData = async () => {
        await actions.getFixes();
        const filteredFixed = filterDataByMonthYear(store.fixes, props.selectedMonthIndex, props.selectedYear);
        const totals = {};
        filteredFixed.forEach(({ value, fixedcategory }) => {
            const categoryName = fixedcategory.name;
            totals[categoryName] = (totals[categoryName] || 0) + value;
        });
        setCategoryTotals(totals);
    };

    const [incomeMonthAmount, setIncomeMonthAmount] = useState();
    const [fixedMonthAmount, setFixedMonthAmount] = useState();
    const [restAmount, setRestAmount] = useState();

    const getTotals = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getFixes();

        const filteredIncome = filterDataByMonthYear(store.incomes, props.selectedMonthIndex, props.selectedYear);
        const filteredSaved = filterDataByMonthYear(store.saves, props.selectedMonthIndex, props.selectedYear);
        const filteredFixed = filterDataByMonthYear(store.fixes, props.selectedMonthIndex, props.selectedYear);

        const totalIncome = filteredIncome.reduce((total, income) => total + income.value, 0);
        const totalSaved = filteredSaved.reduce((total, save) => total + save.value, 0);
        const totalFixed = filteredFixed.reduce((total, fixed) => total + fixed.value, 0);
        
        const balanceAtFixed = totalIncome - ( totalSaved + totalFixed );

        setIncomeMonthAmount(totalIncome.toFixed(2));
        setFixedMonthAmount(totalFixed.toFixed(2));
        setRestAmount(balanceAtFixed.toFixed(2));
    };

    useEffect(() => {
        getTotals();
        getCategoryData();
    }, [props.selectedMonthIndex, props.selectedYear]);

    return (
        <>
            <div className="row mx-1 gap-2">
                <div className="col">
                    <div className="fixed-bg mobile-text text-white p-3">{fixedMonthAmount}€</div>
                </div>
                <div className="col">
                    <div className="fixed-bg mobile-text text-white p-3">{calculatePercentage(fixedMonthAmount, incomeMonthAmount)}%</div>
                </div>
            </div> 
            <div className="m-3 my-4">
                {Object.entries(categoryTotals).map(([category, total]) => (
                    <div key={category} className="row fs-4 lh-lg d-flex align-items-center">
                        <div className="col mobile-text fw-bold overflow-hidden text-truncate">{category}</div>
                        <div className="col mobile-text">{calculatePercentage(total, incomeMonthAmount)}%</div>
                        <div className="col mobile-text">{total.toFixed(2)}€</div>
                    </div>
                ))}
            </div>
            <div className="row fixed-bg text-white mx-1 mt-2">
                <div className="col mobile-text p-3 fw-bold">Libre</div>
                <div className="col mobile-text p-3 fixed-part-right fw-normal">{restAmount}€</div>
            </div>
        </>
    );
};