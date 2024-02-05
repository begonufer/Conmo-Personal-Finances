import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { calculatePercentage, filterDataByMonthYear, filterAllDataPreviousMonth, calculateCategoryTotals, calculateTotals, filterDataByYear, calculateAverage } from "../utils.jsx";

export const MonthlyFixedResume = ({ selectedMonthIndex, selectedYear, previousMonthIndex }) => {

    const { store, actions } = useContext(Context);

    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [totalFixedAmount, setTotalFixedAmount] = useState([]);
    const [fixedCategoryTotals, setFixedCategoryTotals] = useState({});
    const [balanceBeforeFixed, setBalanceBeforeFixed] = useState([]);

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getUsage();
        await actions.getFixes();
        await actions.getOcassionals();

        const filteredIncome = filterDataByMonthYear(store.incomes, selectedMonthIndex, selectedYear);
        const filteredSaved = filterDataByMonthYear(store.saves, selectedMonthIndex, selectedYear);
        const filteredFixed = filterDataByMonthYear(store.fixes, selectedMonthIndex, selectedYear);

        const incomeMonthAmount = filteredIncome.reduce((total, income) => total + income.value, 0);
        const saveMonthAmount = filteredSaved.reduce((total, save) => total + save.value, 0);
        const fixedMonthAmount = filteredFixed.reduce((total, fixed) => total + fixed.value,0);
        setTotalIncomeAmount(incomeMonthAmount.toFixed(2));
        setTotalFixedAmount(fixedMonthAmount.toFixed(2));

        const fixedByCategory = calculateCategoryTotals(filteredFixed,"fixedcategory");
        setFixedCategoryTotals(fixedByCategory);

        let previousYear = selectedYear;
        let previousMonthIndex = selectedMonthIndex - 1;
        if (previousMonthIndex < 0) { previousMonthIndex = 11; previousYear -= 1; }
        const allPreviousMonthIncome = filterAllDataPreviousMonth(store.incomes,previousMonthIndex,previousYear).reduce((total, income) => total + income.value, 0);
        const allPreviousMonthSave = filterAllDataPreviousMonth(store.saves,previousMonthIndex,previousYear).reduce((total, save) => total + save.value, 0);
        const allPreviousMonthFixed = filterAllDataPreviousMonth(store.fixes,previousMonthIndex,previousYear).reduce((total, fixed) => total + fixed.value, 0);
        const allPreviousMonthOcassional = filterAllDataPreviousMonth(store.ocassionals,previousMonthIndex,previousYear).reduce((total, ocassional) => total + ocassional.value, 0);
        const previousMonthAmount = allPreviousMonthIncome - allPreviousMonthSave - allPreviousMonthFixed - allPreviousMonthOcassional;

        const balance = previousMonthAmount + incomeMonthAmount;
        const balanceAtFixed = balance - (fixedMonthAmount + saveMonthAmount);

        setBalanceBeforeFixed(balanceAtFixed.toFixed(2));
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['incomes','saves','usages','fixes','ocassionals'], () => {
            getTableData();
        console.log('Type changed.');
        });
        return () => {
            unsubscribe();
        };
    }, [selectedMonthIndex, selectedYear, previousMonthIndex]);

    return (
        <>
            <div className="row mx-1 gap-2">
                <div className="col">
                    <div className="fixed-bg fs-4 rounded-pill mobile-text text-white p-3">{totalFixedAmount}€</div>
                </div>
                <div className="col">
                    <div className="fixed-bg fs-4 rounded-pill mobile-text text-white p-3">{calculatePercentage(totalFixedAmount, totalIncomeAmount)}%</div>
                </div>
            </div>
            <div className="m-3 my-4">
                {Object.entries(fixedCategoryTotals).map(([category, total]) => (
                    <div key={category} className="row fs-4 lh-lg d-flex align-items-center" >
                        <div className="col mobile-text fw-bold overflow-hidden text-truncate">{category}</div>
                        <div className="col mobile-text">{calculatePercentage(total, totalIncomeAmount)}%</div>
                        <div className="col mobile-text">{total.toFixed(2)}€</div>
                    </div>
                ))}
            </div>
            <div className="row fixed-bg fs-4 rounded-pill text-white mx-1 mt-2">
                <div className="col mobile-text p-3 fw-bold">Libre</div>
                <div className="col mobile-text p-3 fixed-light-bg rounded-right fw-normal">{balanceBeforeFixed}€</div>
            </div>
        </>
    );
};

export const MonthlyFixedTable = ({ selectedMonthIndex, selectedYear, previousMonthIndex }) => {

    const { store, actions } = useContext(Context);

    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [totalFixedAmount, setTotalFixedAmount] = useState([]);
    const [fixedCategoryTotals, setFixedCategoryTotals] = useState({});
    const [balanceBeforeFixed, setBalanceBeforeFixed] = useState([]);

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getUsage();
        await actions.getFixes();
        await actions.getOcassionals();

        const filteredIncome = filterDataByMonthYear(store.incomes, selectedMonthIndex, selectedYear);
        const filteredSaved = filterDataByMonthYear(store.saves, selectedMonthIndex, selectedYear);
        const filteredFixed = filterDataByMonthYear(store.fixes, selectedMonthIndex, selectedYear);

        const incomeMonthAmount = filteredIncome.reduce((total, income) => total + income.value, 0);
        const saveMonthAmount = filteredSaved.reduce((total, save) => total + save.value, 0);
        const fixedMonthAmount = filteredFixed.reduce((total, fixed) => total + fixed.value,0);
        setTotalIncomeAmount(incomeMonthAmount.toFixed(2));
        setTotalFixedAmount(fixedMonthAmount.toFixed(2));

        const fixedByCategory = calculateCategoryTotals(filteredFixed,"fixedcategory");
        setFixedCategoryTotals(fixedByCategory);

        let previousYear = selectedYear;
        let previousMonthIndex = selectedMonthIndex - 1;
        if (previousMonthIndex < 0) { previousMonthIndex = 11; previousYear -= 1; }
        const allPreviousMonthIncome = filterAllDataPreviousMonth(store.incomes,previousMonthIndex,previousYear).reduce((total, income) => total + income.value, 0);
        const allPreviousMonthSave = filterAllDataPreviousMonth(store.saves,previousMonthIndex,previousYear).reduce((total, save) => total + save.value, 0);
        const allPreviousMonthFixed = filterAllDataPreviousMonth(store.fixes,previousMonthIndex,previousYear).reduce((total, fixed) => total + fixed.value, 0);
        const allPreviousMonthOcassional = filterAllDataPreviousMonth(store.ocassionals,previousMonthIndex,previousYear).reduce((total, ocassional) => total + ocassional.value, 0);
        const previousMonthAmount = allPreviousMonthIncome - allPreviousMonthSave - allPreviousMonthFixed - allPreviousMonthOcassional;

        const balance = previousMonthAmount + incomeMonthAmount;
        const balanceAtFixed = balance - (fixedMonthAmount + saveMonthAmount);

        setBalanceBeforeFixed(balanceAtFixed.toFixed(2));
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['incomes','saves','usages','fixes','ocassionals'], () => {
            getTableData();
        console.log('Type changed.');
        });
    
        return () => {
            unsubscribe();
        };
    }, [selectedMonthIndex, selectedYear, previousMonthIndex]);

    return (
        <>
            <div className="col-md col-12 justify-content-center align-items-center pe-0 rounded-1">
                <h4 className="fixed-text text-center type-table-title">FIJOS</h4>
                <div className="fixed-bg table-columns">
                    <div className="row">
                        <div className="col">Total</div>
                        <div className="col">%</div>
                    </div>
                </div>
                <div className="text-center justify-content-center align-items-center p-3">
                    <div className="row mobile-text">
                        <div className="col">{totalFixedAmount}€</div>
                        <div className="col">{calculatePercentage(totalFixedAmount, totalIncomeAmount)}%</div>
                    </div>
                </div>
                <div className="fixed-bg table-columns">
                    <div className="row">
                        <div className="col-4 overflow-hidden text-truncate">Categoría</div>
                        <div className="col">Total</div>
                        <div className="col">%</div>
                    </div>
                </div>
                {Object.entries(fixedCategoryTotals).map(([category, total]) => (
                    <div className="text-center justify-content-center align-items-center p-lg-3 p-1" key={category}>
                        <div className="row mobile-text">
                            <div className="col-4 overflow-hidden text-truncate">{category}</div>
                            <div className="col">{total.toFixed(2)}€</div>
                            <div className="col">{calculatePercentage(total, totalIncomeAmount)}%</div>
                        </div>
                    </div>
                ))}
                <div className="fixed-bg table-columns">
                    <div className="row">
                        <div className="col">LIBRE</div>
                        <div className="col">{balanceBeforeFixed}€</div>
                        <div className="col">{calculatePercentage(balanceBeforeFixed, totalIncomeAmount)}%</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const AnualFixedResume = ({ selectedYear }) => {

    const { store, actions } = useContext(Context);

    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [totalFixedAmount, setTotalFixedAmount] = useState([]);
    const [fixedCategoryTotals, setFixedCategoryTotals] = useState({});
    const [balanceBeforeFixed, setBalanceBeforeFixed] = useState([]);

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getUsage();
        await actions.getFixes();
        await actions.getOcassionals();

        const filteredIncome = filterDataByYear(store.incomes, selectedYear);
        const filteredSaved = filterDataByYear(store.saves, selectedYear);
        const filteredFixed = filterDataByYear(store.fixes, selectedYear);

        const incomeYearAmount = filteredIncome.reduce((total, income) => total + income.value, 0);
        const saveYearAmount = filteredSaved.reduce((total, save) => total + save.value, 0);
        const fixedYearAmount = filteredFixed.reduce((total, fixed) => total + fixed.value,0);
        setTotalIncomeAmount(incomeYearAmount.toFixed(2));
        setTotalFixedAmount(fixedYearAmount.toFixed(2));

        const fixedByCategory = calculateCategoryTotals(filteredFixed,"fixedcategory");
        setFixedCategoryTotals(fixedByCategory);

        const balanceAtFixed = incomeYearAmount - (fixedYearAmount + saveYearAmount);
        setBalanceBeforeFixed(balanceAtFixed.toFixed(2));
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['incomes','saves','usages','fixes','ocassionals'], () => {
            getTableData();
        console.log('Type changed.');
        });
    
        return () => {
            unsubscribe();
        };
    }, [ selectedYear ]);

    return (
        <>
            <div className="row mx-1 gap-2">
                <div className="col-md col-12">
                    <div className="row text-white fixed-light-bg rounded-pill fw-normal fs-4">
                        <div className="col mobile-text p-3 fixed-bg rounded-left fw-bold">Total</div>
                        <div className="col mobile-text py-3 fw-normal">{totalFixedAmount}€</div>
                        <div className="col mobile-text py-3 fw-normal">{calculatePercentage(totalFixedAmount, totalIncomeAmount)}%</div>
                    </div>
                </div>
                <div className="col-md col-12">
                    <div className="row text-white fixed-bg rounded-pill fs-4">
                        <div className="col mobile-text p-3 fw-bold">Media</div>
                        <div className="col mobile-text p-3 fixed-light-bg rounded-right fw-normal">{calculateAverage(totalIncomeAmount)}€</div>
                    </div>
                </div>
            </div>
            <div className="m-4">
                {Object.entries(fixedCategoryTotals).map(([category, total]) => (
                    <div className="row fs-4 lh-lg d-flex align-items-center" key={category}>
                        <div className="col mobile-text fw-bold overflow-hidden text-truncate">{category}</div>
                        <div className="col mobile-text">{total}€</div>
                        <div className="col mobile-text">{calculatePercentage(total, totalIncomeAmount)}%</div>
                        <div className="col mobile-text">{calculateAverage(total)}€</div>                          
                    </div>
                ))}
            </div>
            <div className="row text-white fixed-light-bg rounded-right rounded-pill fw-normal fs-4 mx-1 mt-4">
                <div className="col mobile-text p-3 fixed-bg rounded-left fw-bold">Libre</div>
                <div className="col mobile-text p-3 fw-normal">{balanceBeforeFixed}€</div>
                <div className="col mobile-text p-3 fw-normal">{calculatePercentage(balanceBeforeFixed, totalIncomeAmount)}%</div>
                <div className="col mobile-text p-3 fw-normal">{calculateAverage(balanceBeforeFixed)}€</div>
            </div>
        </>
    );
};

export const AnualFixedTable = ({ selectedYear }) => {

    const { store, actions } = useContext(Context);

    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [totalFixedAmount, setTotalFixedAmount] = useState([]);
    const [fixedCategoryTotals, setFixedCategoryTotals] = useState({});
    const [balanceBeforeFixed, setBalanceBeforeFixed] = useState([]);

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getUsage();
        await actions.getFixes();
        await actions.getOcassionals();

        const filteredIncome = filterDataByYear(store.incomes, selectedYear);
        const filteredSaved = filterDataByYear(store.saves, selectedYear);
        const filteredFixed = filterDataByYear(store.fixes, selectedYear);

        const incomeYearAmount = filteredIncome.reduce((total, income) => total + income.value, 0);
        const saveYearAmount = filteredSaved.reduce((total, save) => total + save.value, 0);
        const fixedYearAmount = filteredFixed.reduce((total, fixed) => total + fixed.value,0);
        setTotalIncomeAmount(incomeYearAmount.toFixed(2));
        setTotalFixedAmount(fixedYearAmount.toFixed(2));

        const fixedByCategory = calculateCategoryTotals(filteredFixed,"fixedcategory");
        setFixedCategoryTotals(fixedByCategory);

        const balanceAtFixed = incomeYearAmount - (fixedYearAmount + saveYearAmount);
        setBalanceBeforeFixed(balanceAtFixed.toFixed(2));
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['incomes','saves','usages','fixes','ocassionals'], () => {
            getTableData();
        console.log('Type changed.');
        });
    
        return () => {
            unsubscribe();
        };
    }, [ selectedYear ]);

    return (
        <>
            <div className="col-md col-12 justify-content-center align-items-center pe-0 rounded-1">
                <h4 className="fixed-text fs-1 fw-bold p-3 mb-0 rounded-1 text-center py-3">FIJOS</h4>
                <div className="fixed-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                    <div className="row text-white mobile-text">
                        <div className="col">Total</div>
                        <div className="col">%</div>
                        <div className="col">Media</div>
                    </div>
                </div>
                <div className="text-center justify-content-center align-items-center p-3">
                    <div className="row mobile-text">
                        <div className="col">{totalFixedAmount}€</div>
                        <div className="col">{calculatePercentage(totalFixedAmount, totalIncomeAmount)}%</div>
                        <div className="col">{calculateAverage(totalFixedAmount)}€</div>
                    </div>
                </div>
                <div className="fixed-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                    <div className="row text-white mobile-text">
                        <div className="col-3 overflow-hidden text-truncate">Categoría</div>
                        <div className="col">Total</div>
                        <div className="col">%</div>
                        <div className="col">Media</div>
                    </div>
                </div>
                {Object.entries(fixedCategoryTotals).map(([category, total]) => (
                    <div className="text-center justify-content-center align-items-center p-lg-3 p-1" key={category}>
                        <div className="row mobile-text">
                            <div className="col-3 overflow-hidden text-truncate">{category}</div>
                            <div className="col">{total.toFixed(2)}€</div>
                            <div className="col">{calculatePercentage(total, totalIncomeAmount)}%</div>
                            <div className="col">{calculateAverage(total)}€</div>
                        </div>
                    </div>
                ))}
                <div className="text-center text-white justify-content-center align-items-center mb-3 p-lg-3 p-2 rounded-pill fixed-bg">
                    <div className="row mobile-text fw-bold fs-6">
                        <div className="col-3 mobile-text overflow-hidden text-truncate">LIBRE</div>
                        <div className="col mobile-text">{balanceBeforeFixed}€</div>
                        <div className="col mobile-text">{calculatePercentage(balanceBeforeFixed,totalIncomeAmount)}%</div>
                        <div className="col mobile-text">{calculateAverage(balanceBeforeFixed)}€</div>
                    </div>
                </div>
            </div>
        </>
    );
};