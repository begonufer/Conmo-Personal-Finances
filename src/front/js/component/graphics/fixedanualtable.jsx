import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import { useMonthSelection, filterAllDataPreviousMonth, filterDataByYear, calculatePercentage, calculateAverage } from "../../pages/utils.jsx";


export const AnualFixedTable = (props) => {

    const { store, actions } = useContext(Context);

    const [fixedCategoryTotals, setFixedCategoryTotals] = useState({});

    const getYearData = async () => {
        await actions.getFixes();
        const filteredFixed = filterDataByYear(store.fixes, props.selectedYear);
        
        const fixedTotals = {};
        filteredFixed.forEach(({ value, fixedcategory }) => {
            const categoryName = fixedcategory.name;
            fixedTotals[categoryName] = (fixedTotals[categoryName] || 0) + value;
        });
        setFixedCategoryTotals(fixedTotals);
    };

    const [freeTotal, setFreeTotal] = useState([]);
    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [totalFixedAmount, setTotalFixedAmount] = useState([]);

    const getTotalTypeData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getFixes();

        const filteredIncome = filterDataByYear(store.incomes, props.selectedYear);
        const filteredSaved = filterDataByYear(store.saves, props.selectedYear);
        const filteredFixed = filterDataByYear(store.fixes, props.selectedYear);

        const incomeYearAmount = filteredIncome.reduce((total, income) => total + income.value, 0);
        const saveYearAmount = filteredSaved.reduce((total, save) => total + save.value, 0);
        const fixedYearAmount = filteredFixed.reduce((total, fixed) => total + fixed.value, 0);
    
        const balanceAtFixed = incomeYearAmount - (fixedYearAmount + saveYearAmount);

        setTotalIncomeAmount(incomeYearAmount.toFixed(2));
        console.log(totalIncomeAmount);
        setFreeTotal(balanceAtFixed.toFixed(2));
        setTotalFixedAmount(fixedYearAmount.toFixed(2));
    };

    useEffect(() => {
        getTotalTypeData();
        getYearData();
    }, [props.selectedYear]);


    return (
        <>
            <div className="row mx-1 gap-2">
                <div className="col">
                    <div className="row text-white fixed-part-right rounded-pill fw-normal fs-4">
                        <div className="col-md col-auto mobile-text p-3 fixed-bold-bg fw-bold">Total</div>
                        <div className="col-md col-auto mobile-text py-3 fw-normal">{totalFixedAmount} €</div>
                        <div className="col-md col-auto mobile-text py-3 fw-normal">{calculatePercentage(totalFixedAmount, totalIncomeAmount)} %</div>
                    </div>
                </div>
                <div className="col">
                    <div className="row text-white fixed-bg">
                        <div className="col mobile-text p-3 fw-bold">Media</div>
                        <div className="col mobile-text p-3 fixed-part-right fw-normal">{calculateAverage(totalIncomeAmount)} €</div>
                    </div>
                </div>
            </div>
            <div className="m-4">
                {Object.entries(fixedCategoryTotals).map(([category, total]) => (
                    <div className="row fs-4 lh-lg d-flex align-items-center" key={category}>
                        <div className="col mobile-text fw-bold overflow-hidden text-truncate">{category}</div>
                        <div className="col mobile-text">{total} €</div>
                        <div className="col mobile-text">{calculatePercentage(total, totalIncomeAmount)} %</div>
                        <div className="col mobile-text">{calculateAverage(total)} €</div>                          
                    </div>
                ))}
            </div>
            <div className="row text-white fixed-part-right rounded-pill fw-normal fs-4 mx-1 mt-4">
                <div className="col mobile-text p-3 fixed-bold-bg fw-bold">Libre</div>
                <div className="col mobile-text p-3 fw-normal">{freeTotal} €</div>
                <div className="col mobile-text p-3 fw-normal">{calculatePercentage(freeTotal, totalIncomeAmount)} %</div>
                <div className="col mobile-text p-3 fw-normal">{calculateAverage(freeTotal)} €</div>
            </div>
        </>
    );
};