import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import { useMonthSelection, filterAllDataPreviousMonth, filterDataByYear, calculatePercentage, calculateAverage } from "../pages/utils.jsx";

export const ResumeAnual = (props) => {

    const { store, actions } = useContext(Context);
    
    const [incomeCategoryTotals, setIncomeCategoryTotals] = useState({});
    const [fixedCategoryTotals, setFixedCategoryTotals] = useState({});
    const [ocassionalCategoryTotals, setOcassionalCategoryTotals] = useState({});
    const [saveCategoryTotals, setSaveCategoryTotals] = useState({});
    const [usageCategoryTotals, setUsageCategoryTotals] = useState({});

    const dataFilteredByCategory = (filteredIncome, filteredSave, filteredUsage, filteredFixed, filteredOcassional) => {

        const incomeTotals = {};
        const saveTotals = {};
        const usageTotals = {};
        const fixedTotals = {};
        const ocassionalTotals = {};

        filteredIncome.forEach(({ value, incomecategory }) => {
            const categoryName = incomecategory.name;
            incomeTotals[categoryName] = (incomeTotals[categoryName] || 0) + value;
        });
        filteredSave.forEach(({ value, category }) => {
            const categoryName = category.name;
            saveTotals[categoryName] = (saveTotals[categoryName] || 0) + value;
        });
        filteredUsage.forEach(({ value, category }) => {
            const categoryName = category.name;
            usageTotals[categoryName] = (usageTotals[categoryName] || 0) + value;
        });
        filteredFixed.forEach(({ value, fixedcategory }) => {
            const categoryName = fixedcategory.name;
            fixedTotals[categoryName] = (fixedTotals[categoryName] || 0) + value;
        });
        filteredOcassional.forEach(({ value, ocassionalcategory }) => {
            const categoryName = ocassionalcategory.name;
            ocassionalTotals[categoryName] = (ocassionalTotals[categoryName] || 0) + value;
        });

        setIncomeCategoryTotals(incomeTotals);
        setSaveCategoryTotals(saveTotals);
        setUsageCategoryTotals(usageTotals);
        setFixedCategoryTotals(fixedTotals);
        setOcassionalCategoryTotals(ocassionalTotals);
    }

    const getCategoryData = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getUsage();
        await actions.getFixes();
        await actions.getOcassionals();

        const filteredIncome = filterDataByYear(store.incomes, props.selectedYear);
        const filteredSave = filterDataByYear(store.saves, props.selectedYear);
        const filteredUsage = filterDataByYear(store.usages, props.selectedYear);
        const filteredFixed = filterDataByYear(store.fixes, props.selectedYear);
        const filteredOcassional = filterDataByYear(store.ocassionals, props.selectedYear);
        
        dataFilteredByCategory(filteredIncome, filteredSave, filteredUsage, filteredFixed, filteredOcassional);
    };

    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [totalSavedAmount, setTotalSavedAmount] = useState([]);
    const [totalUsageAmount, setTotalUsageAmount] = useState([]);
    const [totalFixedAmount, setTotalFixedAmount] = useState([]);
    const [totalOcassionalAmount, setTotalOcassionalAmount] = useState([]);

    const [totalExpenses, setTotalExpenses] = useState([]);
    const [balanceBeforeFixed, setBalanceBeforeFixed] = useState([]);
    const [totalRestAmount, setTotalRestAmount] = useState([]);

    const getTypesTotals = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getUsage();
        await actions.getFixes();
        await actions.getOcassionals();

        const filteredIncome = filterDataByYear(store.incomes, props.selectedYear);
        const filteredSaved = filterDataByYear(store.saves, props.selectedYear);
        const filteredUsage = filterDataByYear(store.usages, props.selectedYear);
        const filteredFixed = filterDataByYear(store.fixes, props.selectedYear);
        const filteredOcassional = filterDataByYear(store.ocassionals, props.selectedYear);

        const incomeYearAmount = filteredIncome.reduce((total, income) => total + income.value, 0);
        const saveYearAmount = filteredSaved.reduce((total, save) => total + save.value, 0);
        const usageYearAmount = filteredUsage.reduce((total, usage) => total + usage.value, 0);
        const fixedYearAmount = filteredFixed.reduce((total, fixed) => total + fixed.value, 0);
        const ocassionalYearAmount = filteredOcassional.reduce((total, ocassional) => total + ocassional.value, 0);

        const balanceAtFixed = incomeYearAmount - ( fixedYearAmount + saveYearAmount );
        const allExpenses = fixedYearAmount + ocassionalYearAmount;
        const restAmount = incomeYearAmount - saveYearAmount - allExpenses;

        setTotalIncomeAmount(incomeYearAmount.toFixed(2));
        setTotalSavedAmount(saveYearAmount.toFixed(2));
        setTotalUsageAmount(usageYearAmount.toFixed(2));
        setTotalFixedAmount(fixedYearAmount.toFixed(2));
        setTotalOcassionalAmount(ocassionalYearAmount.toFixed(2));

        setTotalExpenses(allExpenses.toFixed(2));
        setBalanceBeforeFixed(balanceAtFixed.toFixed(2));
        setTotalRestAmount(restAmount.toFixed(2));
    };

    useEffect(() => {
        getCategoryData();
        getTypesTotals();
    }, [props.selectedYear]);

    return (
        <>
            <div className="col text-center justify-content-center align-items-bottom mx-2 income-content-text">
                <h2 className="movements-head text-white text-center fs-1 fw-semibold shadow rounded-pill p-3 mb-5">{props.selectedYear}</h2>
                <div className="wrap flex-column mobile-text justify-content-center align-items-center pb-2 rounded-1">
                    <h4 className="textincomes fs-1 fw-bold p-2 mb-2" id="table-incomes">INGRESOS</h4>
                    <div className="income-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                        <div className="row text-white mobile-text">
                            <div className="col">Total</div>
                            <div className="col">Media</div>
                        </div>
                    </div>
                    <div className="text-center justify-content-center align-items-center p-3">
                        <div className="row">
                            <div className="col">{totalIncomeAmount} €</div>
                            <div className="col">{calculateAverage(totalIncomeAmount)} €</div>
                        </div>
                    </div>
                    <div className="income-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                        <div className="row text-white mobile-text">
                            <div className="col">Categoría</div>
                            <div className="col">Total</div>
                            <div className="col">%</div>
                            <div className="col">Media</div>
                        </div>
                    </div>
                    {Object.entries(incomeCategoryTotals).map(([category, total]) => (
                        <div className="text-center justify-content-center align-items-center p-lg-3 p-1" key={category}>
                            <div className="row mobile-text align-items-center">
                                <div className="col">{category}</div>
                                <div className="col">{total.toFixed(2)} €</div>
                                <div className="col">{calculatePercentage(total, totalIncomeAmount)} %</div>
                                <div className="col">{calculateAverage(total)} €</div>                          
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <div className="row">
                        <div className="col wrap flex-column justify-content-center align-items-center pb-2 rounded-1">
                            <h4 className="text-saves fs-1 fw-bold p-3 mb-0 rounded-1 text-center py-3">RESERVADO</h4>
                            <div className="saves-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                                <div className="row text-white mobile-text">
                                    <div className="col">Total</div>
                                    <div className="col">%</div>
                                    <div className="col">Media</div>
                                </div>
                            </div>
                            <div className="text-center justify-content-center align-items-center p-3">
                                <div className="row mobile-text">
                                    <div className="col">{totalSavedAmount} €</div>
                                    <div className="col">{calculatePercentage(totalSavedAmount, totalIncomeAmount)} %</div>
                                    <div className="col">{calculateAverage(totalSavedAmount)} €</div>
                                </div>
                            </div>
                            <div className="saves-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                                <div className="row text-white mobile-text">
                                    <div className="col">Categoría</div>
                                    <div className="col">Total</div>
                                    <div className="col">%</div>
                                    <div className="col">Media</div>
                                </div>
                            </div>
                            {Object.entries(saveCategoryTotals).map(([category, total]) => (
                                <div className="text-center justify-content-center align-items-center p-lg-3 p-1" key={category}>
                                <div className="row mobile-text">
                                        <div className="col">{category}</div>
                                        <div className="col">{total.toFixed(2)} €</div>
                                        <div className="col">{calculatePercentage(total, totalIncomeAmount)} %</div>
                                        <div className="col">{calculateAverage(total)} €</div>                            
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col wrap flex-column justify-content-center align-items-center pb-2 rounded-1">
                            <h4 className="text-usage fs-1 fw-bold p-3 mb-0 rounded-1 text-center py-3">USO RESERVADO</h4>
                            <div className="usage-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                                <div className="row text-white mobile-text">
                                    <div className="col">Total</div>
                                    <div className="col">Media</div>
                                </div>
                            </div>
                            <div className="text-center justify-content-center align-items-center p-3">
                                <div className="row mobile-text">
                                    <div className="col">{totalUsageAmount} €</div>
                                    <div className="col">{calculateAverage(totalUsageAmount)} €</div>
                                </div>
                            </div>
                            <div className="usage-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                                <div className="row text-white mobile-text">
                                    <div className="col">Categoría</div>
                                    <div className="col">Total</div>
                                    <div className="col">Media</div>
                                </div>
                            </div>
                            {Object.entries(usageCategoryTotals).map(([category, total]) => (
                                <div className="text-center justify-content-center align-items-center p-lg-3 p-1" key={category}>
                                    <div className="row mobile-text">
                                        <div className="col">{category}</div>
                                        <div className="col">{total.toFixed(2)} €</div>
                                        <div className="col">{calculateAverage(total)} €</div>                            
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>                    
                </div>
                <div className="wrap flex-column justify-content-center align-items-center pb-2 rounded-1">
                    <h4 className="text-expenses fs-1 fw-bold p-3 mb-0">GASTOS</h4>
                    <div className="expense-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                        <div className="row text-white mobile-text">
                            <div className="col">Total</div>
                            <div className="col">%</div>
                            <div className="col">Media</div>
                        </div>
                    </div>
                    <div className="text-center justify-content-center align-items-center pt-3">
                        <div className="row mobile-text">
                            <div className="col text-center">{totalExpenses} €</div>
                            <div className="col text-center">{calculatePercentage(totalExpenses, totalIncomeAmount)} %</div>
                            <div className="col text-center">{calculateAverage(totalExpenses)} €</div>
                        </div>
                    </div>
                    <div>
                        <div className="d-md-flex pb-2 rounded-1">
                            <div className="col-md col-12 justify-content-center align-items-center pe-0 rounded-1">
                                <h4 className="text-fixed fs-1 fw-bold p-3 mb-0 rounded-1 text-center py-3">FIJOS</h4>
                                <div className="fixed-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                                    <div className="row text-white mobile-text">
                                        <div className="col">Total</div>
                                        <div className="col">%</div>
                                        <div className="col">Media</div>
                                    </div>
                                </div>
                                <div className="text-center justify-content-center align-items-center p-3">
                                    <div className="row mobile-text">
                                        <div className="col">{totalFixedAmount} €</div>
                                        <div className="col">{calculatePercentage(totalFixedAmount, totalIncomeAmount)} %</div>
                                        <div className="col">{calculateAverage(totalFixedAmount)} €</div>
                                    </div>
                                </div>
                                <div className="fixed-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                                    <div className="row text-white mobile-text">
                                        <div className="col">Categoría</div>
                                        <div className="col">Total</div>
                                        <div className="col">%</div>
                                        <div className="col">Media</div>
                                    </div>
                                </div>
                                {Object.entries(fixedCategoryTotals).map(([category, total]) => (
                                    <div className="text-center justify-content-center align-items-center p-lg-3 p-1" key={category}>
                                        <div className="row mobile-text">
                                            <div className="col">{category}</div>
                                            <div className="col">{total.toFixed(2)} €</div>
                                            <div className="col">{calculatePercentage(total, totalIncomeAmount)} %</div>
                                            <div className="col">{calculateAverage(total)} €</div>                            
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center text-white justify-content-center align-items-center mb-3 p-lg-3 p-2 rounded-pill" id="table-fixed">
                                    <div className="row mobile-text fw-bold fs-6">
                                        <div className="col">LIBRE</div>
                                        <div className="col">{balanceBeforeFixed} €</div>
                                        <div className="col">{calculatePercentage(balanceBeforeFixed, totalIncomeAmount)} %</div>
                                        <div className="col">{calculateAverage(balanceBeforeFixed)} €</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md col-12 wrap flex-column justify-content-center align-items-center rounded-1">
                                <h4 className="text-ocassional fs-1 fw-bold p-3 mb-0 text-center py-3">OCASIONALES</h4>
                                <div className="ocassional-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                                    <div className="row text-white mobile-text">
                                        <div className="col">Total</div>
                                        <div className="col">%</div>
                                        <div className="col">Media</div>
                                    </div>
                                </div>
                                <div className="text-center justify-content-center align-items-center p-3">
                                    <div className="row mobile-text">
                                        <div className="col">{totalOcassionalAmount} €</div>
                                        <div className="col">{calculatePercentage(totalOcassionalAmount, totalIncomeAmount)} %</div>
                                        <div className="col">{calculateAverage(totalOcassionalAmount)} €</div>
                                    </div>
                                </div>
                                <div className="ocassional-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                                    <div className="row text-white mobile-text">
                                        <div className="col">Categoría</div>
                                        <div className="col">Total</div>
                                        <div className="col">%</div>
                                        <div className="col">Media</div>
                                    </div>
                                </div>
                                {Object.entries(ocassionalCategoryTotals).map(([category, total]) => (
                                    <div className="text-center justify-content-center align-items-center p-lg-3 p-1" key={category}>
                                    <div className="row mobile-text">
                                            <div className="col">{category}</div>
                                            <div className="col">{total.toFixed(2)} €</div>
                                            <div className="col">{calculatePercentage(total, totalIncomeAmount)} %</div>
                                            <div className="col">{calculateAverage(total)} €</div>                            
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill" id="table-ocassional">
                                    <div className="row mobile-text text-white fw-bold fs-6">
                                        <div className="col">RESTANTE</div>
                                        <div className="col">{totalRestAmount} €</div>
                                        <div className="col">{calculatePercentage(totalRestAmount, totalIncomeAmount)} %</div>
                                        <div className="col">{calculateAverage(totalRestAmount)} €</div>
                                    </div>
                                </div>
                            </div>
                        </div>                    
                    </div>
                </div>
            </div>
        </>
    );
};