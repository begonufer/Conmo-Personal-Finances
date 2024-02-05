import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { calculatePercentage, filterDataByMonthYear, filterAllDataPreviousMonth, calculateCategoryTotals, calculateTotals, filterDataByYear, calculateAverage } from "../utils.jsx";

export const MonthlyOcassionalResume = ({ selectedMonthIndex, selectedYear, previousMonthIndex }) => {

    const { store, actions } = useContext(Context);

    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [totalOcassionalAmount, setTotalOcassionalAmount] = useState([]);
    const [ocassionalCategoryTotals, setOcassionalCategoryTotals] = useState({});
    const [totalRestAmount, setTotalRestAmount] = useState([]);

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getFixes();
        await actions.getOcassionals();

        const filteredIncome = filterDataByMonthYear(store.incomes, selectedMonthIndex, selectedYear);
        const filteredSaved = filterDataByMonthYear(store.saves, selectedMonthIndex, selectedYear);
        const filteredFixed = filterDataByMonthYear(store.fixes, selectedMonthIndex, selectedYear);
        const filteredOcassional = filterDataByMonthYear(store.ocassionals, selectedMonthIndex, selectedYear);

        const incomeMonthAmount = filteredIncome.reduce((total, income) => total + income.value, 0);
        const saveMonthAmount = filteredSaved.reduce((total, save) => total + save.value, 0);
        const fixedMonthAmount = filteredFixed.reduce((total, fixed) => total + fixed.value,0);
        const ocassionalMonthAmount = filteredOcassional.reduce((total, ocassional) => total + ocassional.value,0);

        setTotalIncomeAmount(incomeMonthAmount.toFixed(2));
        setTotalOcassionalAmount(ocassionalMonthAmount.toFixed(2));

        const ocassionalByCategory = calculateCategoryTotals(filteredOcassional,"ocassionalcategory");
        setOcassionalCategoryTotals(ocassionalByCategory);

        let previousYear = selectedYear;
        let previousMonthIndex = selectedMonthIndex - 1;
        if (previousMonthIndex < 0) { previousMonthIndex = 11; previousYear -= 1; }

        const allPreviousMonthIncome = filterAllDataPreviousMonth(store.incomes,previousMonthIndex,previousYear).reduce((total, income) => total + income.value, 0);
        const allPreviousMonthSave = filterAllDataPreviousMonth(store.saves,previousMonthIndex,previousYear).reduce((total, save) => total + save.value, 0);
        const allPreviousMonthFixed = filterAllDataPreviousMonth(store.fixes,previousMonthIndex,previousYear).reduce((total, fixed) => total + fixed.value, 0);
        const allPreviousMonthOcassional = filterAllDataPreviousMonth(store.ocassionals,previousMonthIndex,previousYear).reduce((total, ocassional) => total + ocassional.value, 0);

        const previousMonthAmount = allPreviousMonthIncome - allPreviousMonthSave - allPreviousMonthFixed - allPreviousMonthOcassional;

        const balance = previousMonthAmount + incomeMonthAmount;
        const allExpenses = fixedMonthAmount + ocassionalMonthAmount;
        const restAmount = balance - saveMonthAmount - allExpenses;

        setTotalRestAmount(restAmount.toFixed(2));
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['ocassionals'], () => {
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
                    <div className="ocassional-bg rounded-pill mobile-text text-white p-3 fs-4">{totalOcassionalAmount}€</div>
                </div>
                <div className="col">
                    <div className="ocassional-bg rounded-pill mobile-text text-white p-3 fs-4">{calculatePercentage(totalOcassionalAmount, totalIncomeAmount)}%</div>
                </div>
            </div>
            <div className="m-3 my-4">
                {Object.entries(ocassionalCategoryTotals).map(([category, total]) => (
                    <div key={category} className="row fs-4 lh-lg d-flex align-items-center">
                        <div className="col mobile-text fw-bold overflow-hidden text-truncate">{category}</div>
                        <div className="col mobile-text">{calculatePercentage(total, totalIncomeAmount)}%</div>
                        <div className="col mobile-text">{total.toFixed(2)}€</div>
                    </div>
                ))}
            </div>
            <div className="row ocassional-bg rounded-pill fs-4 text-white mx-1 mt-2">
                <div className="col mobile-text p-3 fw-bold">Restante</div>
                <div className="col mobile-text p-3 ocassional-light-bg rounded-right fw-normal">{totalRestAmount}€</div>
            </div>
        </>
    );
};

export const MonthlyOcassionalTable = ({ selectedMonthIndex, selectedYear, previousMonthIndex }) => {
      
    const { store, actions } = useContext(Context);

    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [totalOcassionalAmount, setTotalOcassionalAmount] = useState([]);
    const [ocassionalCategoryTotals, setOcassionalCategoryTotals] = useState({});
    const [totalRestAmount, setTotalRestAmount] = useState([]);

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getFixes();
        await actions.getOcassionals();

        const filteredIncome = filterDataByMonthYear(store.incomes, selectedMonthIndex, selectedYear);
        const filteredSaved = filterDataByMonthYear(store.saves, selectedMonthIndex, selectedYear);
        const filteredFixed = filterDataByMonthYear(store.fixes, selectedMonthIndex, selectedYear);
        const filteredOcassional = filterDataByMonthYear(store.ocassionals, selectedMonthIndex, selectedYear);

        const incomeMonthAmount = filteredIncome.reduce((total, income) => total + income.value, 0);
        const saveMonthAmount = filteredSaved.reduce((total, save) => total + save.value, 0);
        const fixedMonthAmount = filteredFixed.reduce((total, fixed) => total + fixed.value,0);
        const ocassionalMonthAmount = filteredOcassional.reduce((total, ocassional) => total + ocassional.value,0);

        setTotalIncomeAmount(incomeMonthAmount.toFixed(2));
        setTotalOcassionalAmount(ocassionalMonthAmount.toFixed(2));

        const ocassionalByCategory = calculateCategoryTotals(filteredOcassional,"ocassionalcategory");
        setOcassionalCategoryTotals(ocassionalByCategory);

        let previousYear = selectedYear;
        let previousMonthIndex = selectedMonthIndex - 1;
        if (previousMonthIndex < 0) { previousMonthIndex = 11; previousYear -= 1; }

        const allPreviousMonthIncome = filterAllDataPreviousMonth(store.incomes,previousMonthIndex,previousYear).reduce((total, income) => total + income.value, 0);
        const allPreviousMonthSave = filterAllDataPreviousMonth(store.saves,previousMonthIndex,previousYear).reduce((total, save) => total + save.value, 0);
        const allPreviousMonthFixed = filterAllDataPreviousMonth(store.fixes,previousMonthIndex,previousYear).reduce((total, fixed) => total + fixed.value, 0);
        const allPreviousMonthOcassional = filterAllDataPreviousMonth(store.ocassionals,previousMonthIndex,previousYear).reduce((total, ocassional) => total + ocassional.value, 0);

        const previousMonthAmount = allPreviousMonthIncome - allPreviousMonthSave - allPreviousMonthFixed - allPreviousMonthOcassional;

        const balance = previousMonthAmount + incomeMonthAmount;
        const allExpenses = fixedMonthAmount + ocassionalMonthAmount;
        const restAmount = balance - saveMonthAmount - allExpenses;

        setTotalRestAmount(restAmount.toFixed(2));
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['ocassionals'], () => {
            getTableData();
            console.log('Type changed.');
        });
        return () => {
            unsubscribe();
        };
    }, [selectedMonthIndex, selectedYear, previousMonthIndex]);

    return (
        <>
            <div className="col-md col-12 wrap flex-column justify-content-center align-items-center rounded-1">
                <h4 className="ocassional-text text-center mt-4 type-table-title">OCASIONALES</h4>
                <div className="ocassional-bg table-columns">
                    <div className="row">
                        <div className="col">Total</div>
                        <div className="col">%</div>
                    </div>
                </div>
                <div className="text-center justify-content-center align-items-center p-3">
                    <div className="row mobile-text">
                        <div className="col">{totalOcassionalAmount}€</div>
                        <div className="col">{calculatePercentage(totalOcassionalAmount, totalIncomeAmount)}%</div>
                    </div>
                </div>
                <div className="ocassional-bg table-columns">
                    <div className="row">
                        <div className="col-4 overflow-hidden text-truncate mobile">Categoría</div>
                        <div className="col">Total</div>
                        <div className="col">%</div>
                    </div>
                </div>
                {Object.entries(ocassionalCategoryTotals).map(([category, total]) => (
                    <div className="text-center justify-content-center align-items-center p-lg-3 p-1" key={category}>
                        <div className="row mobile-text">
                            <div className="col-4 overflow-hidden text-truncate">{category}</div>
                            <div className="col">{total.toFixed(2)}€</div>
                            <div className="col">{calculatePercentage(total, totalIncomeAmount)}%</div>
                        </div>
                    </div>
                ))}
                <div className="ocassional-bg table-columns">
                    <div className="row">
                        <div className="col">RESTANTE</div>
                        <div className="col">{totalRestAmount}€</div>
                        <div className="col">{calculatePercentage(totalRestAmount, totalIncomeAmount)}%</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const AnualOcassionalResume = ({ selectedYear }) => {

    const { store, actions } = useContext(Context);

    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [totalOcassionalAmount, setTotalOcassionalAmount] = useState([]);
    const [ocassionalCategoryTotals, setOcassionalCategoryTotals] = useState({});
    const [totalRestAmount, setTotalRestAmount] = useState([]);

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getFixes();
        await actions.getOcassionals();

        const filteredIncome = filterDataByYear(store.incomes, selectedYear);
        const filteredSaved = filterDataByYear(store.saves, selectedYear);
        const filteredFixed = filterDataByYear(store.fixes, selectedYear);
        const filteredOcassional = filterDataByYear(store.ocassionals, selectedYear);

        const incomeYearAmount = filteredIncome.reduce((total, income) => total + income.value, 0);
        const saveYearAmount = filteredSaved.reduce((total, save) => total + save.value, 0);
        const fixedYearAmount = filteredFixed.reduce((total, fixed) => total + fixed.value,0);
        const ocassionalYearAmount = filteredOcassional.reduce((total, ocassional) => total + ocassional.value,0);
        setTotalIncomeAmount(incomeYearAmount.toFixed(2));
        setTotalOcassionalAmount(ocassionalYearAmount.toFixed(2));

        const ocassionalByCategory = calculateCategoryTotals(filteredOcassional,"ocassionalcategory");
        setOcassionalCategoryTotals(ocassionalByCategory);

        const allExpenses = fixedYearAmount + ocassionalYearAmount;
        const restAmount = incomeYearAmount - saveYearAmount - allExpenses;
        setTotalRestAmount(restAmount.toFixed(2));
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['ocassionals'], () => {
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
                    <div className="row text-white ocassional-light-bg rounded-right rounded-pill fw-normal fs-4">
                        <div className="col-md col-3 overflow-hidden text-truncate mobile-text p-3 ocassional-bg rounded-left fw-bold">Total</div>
                        <div className="col mobile-text py-3 fw-normal">{totalOcassionalAmount}€</div>
                        <div className="col mobile-text py-3 fw-normal">{calculatePercentage(totalOcassionalAmount, totalIncomeAmount)}%</div>
                    </div>
                </div>
                <div className="col-md col-12">
                    <div className="row text-white ocassional-bg rounded-pill fs-4">
                        <div className="col mobile-text p-3 fw-bold">Media</div>
                        <div className="col mobile-text p-3 ocassional-light-bg rounded-right fw-normal">{calculateAverage(totalOcassionalAmount)}€</div>
                    </div>
                </div>
            </div>
            <div className="m-4">
                {Object.entries(ocassionalCategoryTotals).map(([category, total]) => (
                    <div className="row fs-4 lh-lg d-flex align-items-center" key={category}>
                        <div className="col mobile-text fw-bold overflow-hidden text-truncate">{category}</div>
                        <div className="col mobile-text">{total.toFixed(2)}€</div>
                        <div className="col mobile-text">{calculatePercentage(total, totalIncomeAmount)}%</div>
                        <div className="col mobile-text">{calculateAverage(total)}€</div>                          
                    </div>
                ))}
            </div>
            <div className="row text-white ocassional-light-bg rounded-right rounded-pill fw-normal fs-4 mx-1 mt-4">
                <div className="col mobile-text p-3 overflow-hidden text-truncate ocassional-bg rounded-left fw-bold">Restante</div>
                <div className="col mobile-text p-3 fw-normal">{totalRestAmount}€</div>
                <div className="col mobile-text p-3 fw-normal">{calculatePercentage(totalRestAmount, totalIncomeAmount)}%</div>
                <div className="col mobile-text p-3 fw-normal">{calculateAverage(totalRestAmount)}€</div>
            </div>
        </>
    );
};

export const AnualOcassionalTable = ({ selectedYear }) => {
      
    const { store, actions } = useContext(Context);

    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [totalOcassionalAmount, setTotalOcassionalAmount] = useState([]);
    const [ocassionalCategoryTotals, setOcassionalCategoryTotals] = useState({});
    const [totalRestAmount, setTotalRestAmount] = useState([]);

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getFixes();
        await actions.getOcassionals();

        const filteredIncome = filterDataByYear(store.incomes, selectedYear);
        const filteredSaved = filterDataByYear(store.saves, selectedYear);
        const filteredFixed = filterDataByYear(store.fixes, selectedYear);
        const filteredOcassional = filterDataByYear(store.ocassionals, selectedYear);

        const incomeYearAmount = filteredIncome.reduce((total, income) => total + income.value, 0);
        const saveYearAmount = filteredSaved.reduce((total, save) => total + save.value, 0);
        const fixedYearAmount = filteredFixed.reduce((total, fixed) => total + fixed.value,0);
        const ocassionalYearAmount = filteredOcassional.reduce((total, ocassional) => total + ocassional.value,0);
        setTotalIncomeAmount(incomeYearAmount.toFixed(2));
        setTotalOcassionalAmount(ocassionalYearAmount.toFixed(2));

        const ocassionalByCategory = calculateCategoryTotals(filteredOcassional,"ocassionalcategory");
        setOcassionalCategoryTotals(ocassionalByCategory);

        const allExpenses = fixedYearAmount + ocassionalYearAmount;
        const restAmount = incomeYearAmount - saveYearAmount - allExpenses;
        setTotalRestAmount(restAmount.toFixed(2));
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['ocassionals'], () => {
            getTableData();
            console.log('Type changed.');
        });
        return () => {
            unsubscribe();
        };
    }, [ selectedYear ]);

    return (
        <>
            <div className="col-md col-12 wrap flex-column justify-content-center align-items-center rounded-1">
                <h4 className="ocassional-text fs-1 fw-bold p-3 mb-0 text-center py-3">OCASIONALES</h4>
                <div className="ocassional-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                    <div className="row text-white mobile-text">
                        <div className="col">Total</div>
                        <div className="col">%</div>
                        <div className="col">Media</div>
                    </div>
                </div>
                <div className="text-center justify-content-center align-items-center p-3">
                    <div className="row mobile-text">
                        <div className="col">{totalOcassionalAmount}€</div>
                        <div className="col">{calculatePercentage(totalOcassionalAmount,totalIncomeAmount)}%</div>
                        <div className="col">{calculateAverage(totalOcassionalAmount)}€</div>
                    </div>
                </div>
                <div className="ocassional-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                    <div className="row text-white mobile-text">
                        <div className="col-3 overflow-hidden text-truncate">Categoría</div>
                        <div className="col">Total</div>
                        <div className="col">%</div>
                        <div className="col">Media</div>
                    </div>
                </div>
                {Object.entries(ocassionalCategoryTotals).map(([category, total]) => (
                    <div className="text-center justify-content-center align-items-center p-lg-3 p-1" key={category}>
                        <div className="row mobile-text">
                            <div className="col-3 overflow-hidden text-truncate">{category}</div>
                            <div className="col">{total.toFixed(2)}€</div>
                            <div className="col">{calculatePercentage(total, totalIncomeAmount)}%</div>
                            <div className="col">{calculateAverage(total)}€</div>
                        </div>
                    </div>
                ))}
                <div className="text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill ocassional-bg">
                    <div className="row mobile-text text-white fw-bold fs-6">
                        <div className="col-3 mobile-text overflow-hidden text-truncate">RESTANTE</div>
                        <div className="col mobile-text">{totalRestAmount}€</div>
                        <div className="col mobile-text">{calculatePercentage(totalRestAmount, totalIncomeAmount)}%</div>
                        <div className="col mobile-text">{calculateAverage(totalRestAmount)}€</div>
                    </div>
                </div>
            </div>
        </>
    );
};