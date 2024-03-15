import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { calculatePercentage, filterDataByMonthYear, filterAllDataPreviousMonth, calculateCategoryTotals, filterDataByYear, filterDataByYearToSelectedMonth, calculateAverage } from "../utils.jsx";

export const MonthlySavedResume = ({ selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);

    const [savedCategoryTotals, setSavedCategoryTotals] = useState({});
    const [usageCategoryTotals, setUsageCategoryTotals] = useState({});

    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [totalSavedAmount, setTotalSavedAmount] = useState([]);
    const [totalUsageAmount, setTotalUsageAmount] = useState([]);

    const [savedBalance, setSavedBalance] = useState([]);

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getUsage();

        const filteredIncome = filterDataByMonthYear(store.incomes,selectedMonthIndex,selectedYear);
        const filteredSaved = filterDataByMonthYear(store.saves,selectedMonthIndex,selectedYear);
        const filteredUsage = filterDataByMonthYear(store.usages,selectedMonthIndex,selectedYear);

        const incomeMonthAmount = filteredIncome.reduce((total, income) => total + income.value, 0);
        setTotalIncomeAmount(incomeMonthAmount.toFixed(2));
        const savedMonthAmount = filteredSaved.reduce((total, save) => total + save.value, 0);
        setTotalSavedAmount(savedMonthAmount.toFixed(2));
        const usageMonthAmount = filteredUsage.reduce((total, usage) => total + usage.value, 0);
        setTotalUsageAmount(usageMonthAmount.toFixed(2));

        const savedByCategory = calculateCategoryTotals(filteredSaved, "category");
        setSavedCategoryTotals(savedByCategory);
        const usageByCategory = calculateCategoryTotals(filteredUsage, "category");
        setUsageCategoryTotals(usageByCategory);
        
        const savesBalance = savedMonthAmount - usageMonthAmount;
        setSavedBalance(savesBalance.toFixed(2));
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['saves', 'usages', 'incomes'], () => {
            getTableData();
            console.log('Type changed.');
        });

        return () => {
            unsubscribe();
        };
    }, [selectedMonthIndex, selectedYear]);

    return (
        <>
            <div className="row mx-1 gap-2">
                <div className="col-md col-12 p-0">
                    <div className="row text-white saves-light-bg rounded-pill fw-normal fs-5 mx-1">
                        <div className="col mobile-text py-3 saves-bg rounded-left fw-bold">Reservado</div>
                        <div className="col mobile-text py-3 fw-normal"> {totalSavedAmount}€</div>
                    </div>
                </div>
                <div className="col-md col-12">
                    <div className="row text-white usage-light-bg rounded-pill fw-normal fs-5">
                        <div className="col mobile-text p-3 usage-bg rounded-left fw-bold">Usado</div>
                        <div className="col mobile-text py-3 fw-normal"> {totalUsageAmount}€</div>
                        <div className="col mobile-text py-3 fw-normal">{calculatePercentage(totalUsageAmount, totalSavedAmount)}%</div>
                    </div>
                </div>
                <div className="col-md col-12 p-0">
                    <div className="row text-white saves-light-bg rounded-pill fw-normal fs-5 mx-0 mx-md-1 my-2 my-md-0">
                        <div className="col mobile-text p-3 saves-bg rounded-left fw-bold">Balance</div>
                        <div className="col mobile-text p-3 fw-normal">{savedBalance}€</div>
                    </div>
                </div>
            </div>
            <div className="row text-white saves-bg rounded-left rounded-pill fs-5 mx-1 mt-3 mt-md-5">
                <div className="col-md col-2 overflow-hidden text-truncate mobile-text p-2">Categoría</div>
                <div className="col-md col-3 overflow-hidden text-truncate mobile-text p-2">Reservado</div>
                <div className="col-md col-2 mobile-text p-2">%</div>
                <div className="col-md col-3 mobile-text p-2">Usado</div>
                <div className="col-md col-2 mobile-text p-2">%</div>
                <div className="col d-none d-md-block p-2">Balance</div>
            </div>
            <div className="m-2 m-md-3 my-md-4">
                {Object.entries(savedCategoryTotals).map(([category, total]) => (
                    <div key={category} className="row fs-4 lh-lg d-flex align-items-center">
                        <div className="col-md col-2 mobile-text fw-bold overflow-hidden text-truncate">{category}</div>
                        <div className="col-md col-3 mobile-text">{total.toFixed(2)}€</div>
                        <div className="col-md col-2 mobile-text">{calculatePercentage(total, totalIncomeAmount)}%</div>
                        <div className="col-md col-3 mobile-text">{- ((usageCategoryTotals[category]) || 0).toFixed(2)}€</div>
                        <div className="col-md col-2 mobile-text">{calculatePercentage(usageCategoryTotals[category] || 0, total)}%</div>
                        <div className="col d-none d-md-block">{(total - usageCategoryTotals[category] || total).toFixed(2)}€</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export const MonthlySavedTable = ({ selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);

    const [savedCategoryTotals, setSavedCategoryTotals] = useState({});
    const [usageCategoryTotals, setUsageCategoryTotals] = useState({});

    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [totalSavedAmount, setTotalSavedAmount] = useState([]);
    const [totalUsageAmount, setTotalUsageAmount] = useState([]);

    const [savedBalance, setSavedBalance] = useState([]);

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getUsage();

        const filteredIncome = filterDataByMonthYear(store.incomes,selectedMonthIndex,selectedYear);
        const filteredSaved = filterDataByMonthYear(store.saves,selectedMonthIndex,selectedYear);
        const filteredUsage = filterDataByMonthYear(store.usages,selectedMonthIndex,selectedYear);

        const incomeMonthAmount = filteredIncome.reduce((total, income) => total + income.value, 0);
        setTotalIncomeAmount(incomeMonthAmount.toFixed(2));
        const savedMonthAmount = filteredSaved.reduce((total, save) => total + save.value, 0);
        setTotalSavedAmount(savedMonthAmount.toFixed(2));
        const usageMonthAmount = filteredUsage.reduce((total, usage) => total + usage.value, 0);
        setTotalUsageAmount(usageMonthAmount.toFixed(2));

        const savedByCategory = calculateCategoryTotals(filteredSaved, "category");
        setSavedCategoryTotals(savedByCategory);
        const usageByCategory = calculateCategoryTotals(filteredUsage, "category");
        setUsageCategoryTotals(usageByCategory);
        
        const savesBalance = savedMonthAmount - usageMonthAmount;
        setSavedBalance(savesBalance.toFixed(2));
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['saves', 'usages', 'incomes'], () => {
            getTableData();
            console.log('Type changed.');
        });
        return () => {
            unsubscribe();
        };
    }, [selectedMonthIndex, selectedYear]);

    return (
        <>
            <div className="row">
                <div className="col wrap flex-column justify-content-center align-items-center pb-2 rounded-1">
                    <h4 className="conmo-light-text type-table-title">RESERVADO</h4>
                    <div className="saves-bg table-columns">
                        <div className="row">
                            <div className="col">Total</div>
                            <div className="col">%</div>
                        </div>
                    </div>
                    <div className="text-center justify-content-center align-items-center p-3">
                        <div className="row mobile-text">
                            <div className="col">{totalSavedAmount}€</div>
                            <div className="col">{calculatePercentage(totalSavedAmount, totalIncomeAmount)}%</div>
                        </div>
                    </div>
                    <div className="saves-bg table-columns">
                        <div className="row">
                            <div className="col-4 overflow-hidden text-truncate">Categoría</div>
                            <div className="col">Total</div>
                            <div className="col">%</div>
                        </div>
                    </div>
                    {Object.entries(savedCategoryTotals).map(([category, total]) => (
                        <div className="text-center justify-content-center align-items-center p-lg-3 p-1" key={category}>
                            <div className="row mobile-text">
                                <div className="col-4 overflow-hidden text-truncate">{category}</div>
                                <div className="col">{total.toFixed(2)}€</div>
                                <div className="col">{calculatePercentage(total, totalIncomeAmount)}%</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export const AnualSavedResume = ({ selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);

    const [savedCategoryTotals, setSavedCategoryTotals] = useState({});
    const [usageCategoryTotals, setUsageCategoryTotals] = useState({});

    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [totalSavedAmount, setTotalSavedAmount] = useState([]);
    const [totalUsageAmount, setTotalUsageAmount] = useState([]);

    const [savedBalance, setSavedBalance] = useState([]);

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getUsage();

        const todayDate = new Date();
        const currentMonthIndex = todayDate.getMonth();
        const currentYear = new Date().getFullYear();
        let previousYear = currentYear;
        if (currentMonthIndex < 0) {currentMonthIndex = 11; previousYear -= 1;}

        const filteredIncome = filterDataByYearToSelectedMonth(store.incomes, selectedMonthIndex, selectedYear);
        const filteredSaved = filterDataByYearToSelectedMonth(store.saves, selectedMonthIndex, selectedYear);
        const filteredUsage = filterAllDataPreviousMonth(store.usages, selectedMonthIndex, previousYear);

        const incomeMonthAmount = filteredIncome.reduce((total, income) => total + income.value, 0);
        setTotalIncomeAmount(incomeMonthAmount.toFixed(2));
        const savedMonthAmount = filteredSaved.reduce((total, save) => total + save.value, 0);
        setTotalSavedAmount(savedMonthAmount.toFixed(2));
        const usageMonthAmount = filteredUsage.reduce((total, usage) => total + usage.value, 0);
        setTotalUsageAmount(usageMonthAmount.toFixed(2));

        const savedByCategory = calculateCategoryTotals(filteredSaved, "category");
        setSavedCategoryTotals(savedByCategory);
        const usageByCategory = calculateCategoryTotals(filteredUsage, "category");
        setUsageCategoryTotals(usageByCategory);
        
        const savesBalance = savedMonthAmount - usageMonthAmount;
        setSavedBalance(savesBalance.toFixed(2));
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['saves', 'usages', 'incomes'], () => {
            getTableData();
        });

        return () => {
            unsubscribe();
        };
    }, [selectedMonthIndex, selectedYear]);

    return (
        <>
            <div className="row mx-1 gap-2">
                <div className="col-md col-12 p-0">
                    <div className="row text-white saves-light-bg rounded-pill fw-normal fs-5 mx-1">
                        <div className="col mobile-text py-3 saves-bg rounded-left fw-bold">Reservado</div>
                        <div className="col mobile-text py-3 fw-normal"> {totalSavedAmount}€</div>
                    </div>
                </div>
                <div className="col-md col-12">
                    <div className="row text-white usage-light-bg rounded-pill fw-normal fs-5">
                        <div className="col mobile-text p-3 usage-bg rounded-left fw-bold">Usado</div>
                        <div className="col mobile-text py-3 fw-normal"> {totalUsageAmount}€</div>
                        <div className="col mobile-text py-3 fw-normal">{calculatePercentage(totalUsageAmount, totalSavedAmount)}%</div>
                    </div>
                </div>
                <div className="col-md col-12 p-0">
                    <div className="row text-white saves-light-bg rounded-pill fw-normal fs-5 mx-0 mx-md-1 my-2 my-md-0">
                        <div className="col mobile-text p-3 saves-bg rounded-left fw-bold">Balance</div>
                        <div className="col mobile-text p-3 fw-normal">{savedBalance}€</div>
                    </div>
                </div>
            </div>
            <div className="row text-white saves-bg rounded-left rounded-pill fs-5 mx-1 mt-3 mt-md-5">
                <div className="col-md-3 col-2 overflow-hidden text-truncate mobile-text p-2">Categoría</div>
                <div className="col-md col-3 overflow-hidden text-truncate mobile-text p-2">Reservado</div>
                <div className="col-md col-2 mobile-text p-2">%</div>
                <div className="col d-none d-md-block p-2">Media</div>
                <div className="col-md col-3 mobile-text p-2">Uso</div>
                <div className="col-md col-2 mobile-text p-2">%</div>
                <div className="col d-none d-md-block p-2">Media</div>
                <div className="col d-none d-md-block p-2">Balance</div>
            </div>
            <div className="m-2 m-md-3 my-md-4">
                {Object.entries(savedCategoryTotals).map(([category, total]) => (
                    <div key={category} className="row fs-5 lh-lg d-flex align-items-center">
                        <div className="col-md-3 col-2 mobile-text fw-bold overflow-hidden text-truncate">{category}</div>
                        <div className="col-md col-3 mobile-text">{total.toFixed(2)}€</div>
                        <div className="col-md col-2 mobile-text">{calculatePercentage(total, totalIncomeAmount)}%</div>
                        <div className="col d-none d-md-block">{calculateAverage(selectedMonthIndex, total)}€</div>
                        <div className="col-md col-3 mobile-text">{- ((usageCategoryTotals[category]) || 0).toFixed(2)}€</div>
                        <div className="col-md col-2 mobile-text">{calculatePercentage(usageCategoryTotals[category] || 0, total)}%</div>
                        <div className="col d-none d-md-block">{calculateAverage(selectedMonthIndex, (usageCategoryTotals[category]) || 0)}€</div>
                        <div className="col d-none d-md-block">{(total - usageCategoryTotals[category] || total).toFixed(2)}€</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export const AnualSavedTable = ({ selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);

    const [savedCategoryTotals, setSavedCategoryTotals] = useState({});
    const [usageCategoryTotals, setUsageCategoryTotals] = useState({});

    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [totalSavedAmount, setTotalSavedAmount] = useState([]);
    const [totalUsageAmount, setTotalUsageAmount] = useState([]);

    const [savedBalance, setSavedBalance] = useState([]);

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getUsage();


        const todayDate = new Date();
        const currentMonthIndex = todayDate.getMonth();
        const currentYear = new Date().getFullYear();
        let previousYear = currentYear;
        if (currentMonthIndex < 0) {currentMonthIndex = 11; previousYear -= 1;}

        const filteredIncome = filterDataByYearToSelectedMonth(store.incomes, selectedMonthIndex, selectedYear);
        const filteredSaved = filterDataByYearToSelectedMonth(store.saves, selectedMonthIndex, selectedYear);
        const filteredUsage = filterAllDataPreviousMonth(store.usages, selectedMonthIndex, previousYear);

        const incomeMonthAmount = filteredIncome.reduce((total, income) => total + income.value, 0);
        setTotalIncomeAmount(incomeMonthAmount.toFixed(2));
        const savedMonthAmount = filteredSaved.reduce((total, save) => total + save.value, 0);
        setTotalSavedAmount(savedMonthAmount.toFixed(2));
        const usageMonthAmount = filteredUsage.reduce((total, usage) => total + usage.value, 0);
        setTotalUsageAmount(usageMonthAmount.toFixed(2));

        const savedByCategory = calculateCategoryTotals(filteredSaved, "category");
        setSavedCategoryTotals(savedByCategory);
        const usageByCategory = calculateCategoryTotals(filteredUsage, "category");
        setUsageCategoryTotals(usageByCategory);
        
        const savesBalance = savedMonthAmount - usageMonthAmount;
        setSavedBalance(savesBalance.toFixed(2));
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['saves', 'usages', 'incomes'], () => {
            getTableData();
            console.log('Type changed.');
        });

        return () => {
            unsubscribe();
        };
    }, [selectedMonthIndex, selectedYear]);

    return (
        <>
            <div className="row">
                <div className="col wrap flex-column justify-content-center align-items-center pb-2 rounded-1">
                    <h4 className="conmo-light-text fs-1 fw-bold p-3 mb-0 rounded-1 text-center py-3">RESERVADO</h4>
                    <div className="saves-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                        <div className="row text-white mobile-text">
                            <div className="col">Total</div>
                            <div className="col">%</div>
                            <div className="col">Media</div>
                        </div>
                    </div>
                    <div className="text-center justify-content-center align-items-center p-3">
                        <div className="row mobile-text">
                            <div className="col">{totalSavedAmount}€</div>
                            <div className="col">{calculatePercentage(totalSavedAmount, totalIncomeAmount)}%</div>
                            <div className="col">{calculateAverage(selectedMonthIndex, totalSavedAmount)}€</div>
                        </div>
                    </div>
                    <div className="saves-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                        <div className="row text-white mobile-text">
                            <div className="col-3 overflow-hidden text-truncate">Categoría</div>
                            <div className="col">Total</div>
                            <div className="col">%</div>
                            <div className="col">Media</div>
                        </div>
                    </div>
                    {Object.entries(savedCategoryTotals).map(([category, total]) => (
                        <div className="text-center justify-content-center align-items-center p-lg-3 p-1" key={category}>
                            <div className="row mobile-text">
                                <div className="col-3 overflow-hidden text-truncate">{category}</div>
                                <div className="col">{total.toFixed(2)}€</div>
                                <div className="col">{calculatePercentage(total, totalIncomeAmount)}%</div>
                                <div className="col">{calculateAverage(selectedMonthIndex, total)}€</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col wrap flex-column justify-content-center align-items-center pb-2 rounded-1">
                    <h4 className="usage-text fs-1 fw-bold p-3 mb-0 rounded-1 text-center py-3">USO RESERVADO</h4>
                    <div className="usage-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                        <div className="row text-white mobile-text">
                            <div className="col">Total</div>
                            <div className="col">Media</div>
                        </div>
                    </div>
                    <div className="text-center justify-content-center align-items-center p-3">
                        <div className="row mobile-text">
                            <div className="col">{totalUsageAmount}€</div>
                            <div className="col">{calculateAverage(selectedMonthIndex, totalUsageAmount)}€</div>
                        </div>
                    </div>
                    <div className="usage-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                        <div className="row text-white mobile-text">
                            <div className="col-4 overflow-hidden text-truncate">Categoría</div>
                            <div className="col">Total</div>
                            <div className="col">Media</div>
                        </div>
                    </div>
                    {Object.entries(usageCategoryTotals).map(([category, total]) => (
                        <div className="text-center justify-content-center align-items-center p-lg-3 p-1" key={category}>
                            <div className="row mobile-text">
                                <div className="col-4 overflow-hidden text-truncate">{category}</div>
                                <div className="col">{total.toFixed(2)}€</div>
                                <div className="col">{calculateAverage(selectedMonthIndex, total)}€</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};