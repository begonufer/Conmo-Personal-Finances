import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { calculatePercentage, filterDataByMonthYear, filterAllDataPreviousMonth, calculateCategoryTotals, calculateAverage, filterDataByYearToSelectedMonth, filterDataByYear } from "../utils.jsx";

export const MonthlyIncomeResume = ({ selectedMonth, selectedMonthIndex, selectedYear, previousMonthIndex }) => {
    
    const { store, actions } = useContext(Context);

    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [incomeCategoryTotals, setIncomeCategoryTotals] = useState({});
    const [previousMonthAmount, setPreviousMonthAmount] = useState([]);
    const [balance, setBalance] = useState([]);

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getFixes();
        await actions.getOcassionals();

        const filteredIncome = filterDataByMonthYear(store.incomes,selectedMonthIndex,selectedYear);

        const incomeMonthAmount = filteredIncome.reduce((total, income) => total + income.value,0);
        setTotalIncomeAmount(incomeMonthAmount.toFixed(2));

        const incomeByCategory = calculateCategoryTotals(filteredIncome, "incomecategory");
        setIncomeCategoryTotals(incomeByCategory);

        let previousYear = selectedYear;
        let previousMonthIndex = selectedMonthIndex - 1;
        if (previousMonthIndex < 0) {previousMonthIndex = 11; previousYear -= 1;}

        const allPreviousMonthIncome = filterAllDataPreviousMonth(store.incomes,previousMonthIndex,previousYear).reduce((total, income) => total + income.value, 0);
        const allPreviousMonthSave = filterAllDataPreviousMonth(store.saves,previousMonthIndex,previousYear).reduce((total, save) => total + save.value, 0);
        const allPreviousMonthFixed = filterAllDataPreviousMonth(store.fixes,previousMonthIndex,previousYear).reduce((total, fixed) => total + fixed.value, 0);
        const allPreviousMonthOcassional = filterAllDataPreviousMonth(store.ocassionals,previousMonthIndex,previousYear).reduce((total, ocassional) => total + ocassional.value, 0);

        const previousMonthAmount = allPreviousMonthIncome - allPreviousMonthSave - allPreviousMonthFixed - allPreviousMonthOcassional;
        setPreviousMonthAmount(previousMonthAmount.toFixed(2));

        const balance = previousMonthAmount + incomeMonthAmount;
        setBalance(balance.toFixed(2));
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['incomes'], () => {
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
                <div className="col-md col-12">
                    <div className="row fs-4 income-bg rounded-pill">
                        <div className="col p-3 mobile-text fw-bold">Restante</div>
                        <div className="col p-3 mobile-text rounded-right income-light-bg fw-normal">{previousMonthAmount}€</div>
                    </div>
                </div>
                <div className="col-md col-12">
                    <div className="row fs-4 income-bg rounded-pill">
                        <div className="col p-3 mobile-text fw-bold">{selectedMonth}</div>
                        <div className="col p-3 mobile-text rounded-right income-light-bg fw-normal">{totalIncomeAmount}€</div>
                    </div>
                </div>
            </div>
            <div className="m-3 my-4">
                {Object.entries(incomeCategoryTotals).map(([category, total]) => (
                    <div key={category} className="row fs-4 lh-lg d-flex align-items-center">
                        <div className="col mobile-text fw-bold overflow-hidden text-truncate">{category}</div>
                        <div className="col mobile-text">{calculatePercentage(total, totalIncomeAmount)}%</div>
                        <div className="col mobile-text">{total.toFixed(2)}€</div>
                    </div>
                ))}
            </div>
            <div className="row fs-4 income-bg rounded-pill mx-1 mt-2">
                <div className="col mobile-text p-3 fw-bold">Total</div>
                <div className="col mobile-text p-3 rounded-right income-light-bg fw-normal">{balance}€</div>
            </div>
        </>
    );
};

export const MonthlyIncomeTable = ({ selectedMonthIndex, selectedYear, previousMonthIndex }) => {

    const { store, actions } = useContext(Context);

    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [incomeCategoryTotals, setIncomeCategoryTotals] = useState({});
    const [previousMonthAmount, setPreviousMonthAmount] = useState([]);
    const [balance, setBalance] = useState([]);

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getFixes();
        await actions.getOcassionals();

        const filteredIncome = filterDataByMonthYear(store.incomes,selectedMonthIndex,selectedYear);

        const incomeMonthAmount = filteredIncome.reduce((total, income) => total + income.value,0);
        setTotalIncomeAmount(incomeMonthAmount.toFixed(2));

        const incomeByCategory = calculateCategoryTotals(filteredIncome, "incomecategory");
        setIncomeCategoryTotals(incomeByCategory);

        let previousYear = selectedYear;
        let previousMonthIndex = selectedMonthIndex - 1;
        if (previousMonthIndex < 0) {previousMonthIndex = 11; previousYear -= 1;}

        const allPreviousMonthIncome = filterAllDataPreviousMonth(store.incomes,previousMonthIndex,previousYear).reduce((total, income) => total + income.value, 0);
        const allPreviousMonthSave = filterAllDataPreviousMonth(store.saves,previousMonthIndex,previousYear).reduce((total, save) => total + save.value, 0);
        const allPreviousMonthFixed = filterAllDataPreviousMonth(store.fixes,previousMonthIndex,previousYear).reduce((total, fixed) => total + fixed.value, 0);
        const allPreviousMonthOcassional = filterAllDataPreviousMonth(store.ocassionals,previousMonthIndex,previousYear).reduce((total, ocassional) => total + ocassional.value, 0);

        const previousMonthAmount = allPreviousMonthIncome - allPreviousMonthSave - allPreviousMonthFixed - allPreviousMonthOcassional;
        setPreviousMonthAmount(previousMonthAmount.toFixed(2));

        const balance = previousMonthAmount + incomeMonthAmount;
        setBalance(balance.toFixed(2));
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['incomes'], () => {
            getTableData();
        console.log('Type changed.');
        });
    
        return () => {
            unsubscribe();
        };
    }, [selectedMonthIndex, selectedYear, previousMonthIndex]);

    return (
        <>
            <div className="wrap flex-column mobile-text justify-content-center align-items-center pb-2 rounded-1">
                <h4 className="income-text type-table-title">INGRESOS</h4>
                <div className="income-bg table-columns">
                    <div className="row">
                        <div className="col">Mes anterior</div>
                        <div className="col">Total</div>
                        <div className="col">Disponible</div>
                    </div>
                </div>
                <div className="text-center justify-content-center align-items-center p-3">
                    <div className="row mobile-text">
                        <div className="col">{previousMonthAmount}€</div>
                        <div className="col">{totalIncomeAmount}€</div>
                        <div className="col">{balance}€</div>
                    </div>
                </div>
                <div className="income-bg table-columns">
                    <div className="row">
                        <div className="col-4 overflow-hidden text-truncate">Categoría</div>
                        <div className="col">Total</div>
                        <div className="col">%</div>
                    </div>
                </div>
                {Object.entries(incomeCategoryTotals).map(([category, total]) => (
                    <div className="text-center justify-content-center align-items-center p-lg-3 p-1" key={category}>
                        <div className="row mobile-text align-items-center">
                            <div className="col-4 overflow-hidden text-truncate">{category}</div>
                            <div className="col">{total.toFixed(2)}€</div>
                            <div className="col">{calculatePercentage(total, totalIncomeAmount)}%</div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export const AnualIncomeResume = ({ selectedMonthIndex, selectedYear }) => {

    const { store, actions } = useContext(Context);

    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [incomeCategoryTotals, setIncomeCategoryTotals] = useState({});

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getFixes();
        await actions.getOcassionals();

        const filteredIncome = filterDataByYearToSelectedMonth(store.incomes, selectedMonthIndex, selectedYear);

        const incomeYearAmount = filteredIncome.reduce((total, income) => total + income.value, 0);
        setTotalIncomeAmount(incomeYearAmount.toFixed(2));

        const incomeByCategory = calculateCategoryTotals(filteredIncome, "incomecategory");
        setIncomeCategoryTotals(incomeByCategory);
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['incomes'], () => {
            getTableData();
        console.log('Type changed.');
        });
        return () => {
            unsubscribe();
        };
    }, [ selectedMonthIndex, selectedYear ]);

    return (
        <>
            <div className="row mx-1 gap-2">
                <div className="col-md col-12">
                    <div className="row fs-4 income-bg rounded-pill">
                        <div className="col mobile-text p-3 fw-bold">Total</div>
                        <div className="col mobile-text p-3 rounded-right income-light-bg fw-normal">{totalIncomeAmount}€</div>
                    </div>
                </div>
                <div className="col-md col-12">
                    <div className="row fs-4 income-bg rounded-pill">
                        <div className="col mobile-text p-3 fw-bold">Media</div>
                        <div className="col mobile-text p-3 rounded-right income-light-bg fw-normal">{calculateAverage(selectedMonthIndex, totalIncomeAmount)}€</div>
                    </div>
                </div>
            </div>
            <div className="m-4">
                {Object.entries(incomeCategoryTotals).map(([category, total]) => (
                    <div className="row fs-4 lh-lg d-flex align-items-center" key={category}>
                        <div className="col mobile-text fw-bold overflow-hidden text-truncate">{category}</div>
                        <div className="col mobile-text">{total.toFixed(2)}€</div>
                        <div className="col mobile-text">{calculatePercentage(total, totalIncomeAmount)}%</div>
                        <div className="col mobile-text">{calculateAverage(selectedMonthIndex, total)}€</div>                          
                    </div>
                ))}
            </div>
        </>
    );
};

export const AnualIncomeTable = ({ selectedMonthIndex, selectedYear }) => {

    const { store, actions } = useContext(Context);

    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [incomeCategoryTotals, setIncomeCategoryTotals] = useState({});

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getFixes();
        await actions.getOcassionals();

        const filteredIncome = filterDataByYearToSelectedMonth(store.incomes, selectedMonthIndex, selectedYear);

        const incomeYearAmount = filteredIncome.reduce((total, income) => total + income.value, 0);
        setTotalIncomeAmount(incomeYearAmount.toFixed(2));

        const incomeByCategory = calculateCategoryTotals(filteredIncome, "incomecategory");
        setIncomeCategoryTotals(incomeByCategory);
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['incomes'], () => {
            getTableData();
        console.log('Type changed.');
        });
    
        return () => {
            unsubscribe();
        };
    }, [ selectedMonthIndex, selectedYear ]);

    return (
        <>
            <div className="wrap flex-column mobile-text justify-content-center align-items-center pb-2 rounded-1">
                <h4 className="income-text fs-1 fw-bold p-2 mb-2" id="table-incomes">INGRESOS</h4>
                <div className="income-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                    <div className="row text-white mobile-text">
                        <div className="col">Total</div>
                        <div className="col">Media</div>
                    </div>
                </div>
                <div className="text-center justify-content-center align-items-center p-3">
                    <div className="row">
                        <div className="col">{totalIncomeAmount}€</div>
                        <div className="col">{calculateAverage(selectedMonthIndex, totalIncomeAmount)}€</div>
                    </div>
                </div>
                <div className="income-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                    <div className="row text-white mobile-text">
                        <div className="col-3 overflow-hidden text-truncate">Categoría</div>
                        <div className="col">Total</div>
                        <div className="col">%</div>
                        <div className="col">Media</div>
                    </div>
                </div>
                {Object.entries(incomeCategoryTotals).map(([category, total]) => (
                    <div className="text-center justify-content-center align-items-center p-lg-3 p-1" key={category}>
                        <div className="row mobile-text align-items-center">
                            <div className="col-3 overflow-hidden text-truncate">{category}</div>
                            <div className="col">{total.toFixed(2)}€</div>
                            <div className="col">{calculatePercentage(total, totalIncomeAmount)}%</div>
                            <div className="col">{calculateAverage(selectedMonthIndex, total)}€</div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};