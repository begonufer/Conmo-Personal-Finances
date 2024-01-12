import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { format } from "date-fns";
import es from "date-fns/locale/es";

export const AnualExpensesTable = (props) => {

    const { store, actions } = useContext(Context);

    const calculatePercentage = (amount, total) => {
        if (total === 0) {
            return 0;
        }
        return ((amount / total) * 100).toFixed(0);
    }; //usar esta función como función general

    const calculateAverage = (monthlyValues) => {
        return (monthlyValues / 12).toFixed(2); 
    };

    const filterDataByYear = (data, selectedYear) => {
        return data.filter((item) => {
            const date = new Date(item.dateTime);
            return date.getFullYear() === selectedYear;
        });
    }; //usar esta función como función general

    const [incomeCategoryTotals, setIncomeCategoryTotals] = useState({});
    const [fixedCategoryTotals, setFixedCategoryTotals] = useState({});
    const [ocassionalCategoryTotals, setOcassionalCategoryTotals] = useState({});
    const [saveCategoryTotals, setSaveCategoryTotals] = useState({});
    const [usageCategoryTotals, setUsageCategoryTotals] = useState({});
    const [savesBalance, setSavesBalance] = useState({});

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

    useEffect(() => {
        const transformData = async () => {
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
        transformData();
    }, [props.selectedYear]);

    const totalIncomeAmount = filterDataByYear(store.incomes, props.selectedYear).reduce((total, income) => total + income.value, 0);
    const totalSaveAmount = filterDataByYear(store.saves, props.selectedYear).reduce((total, save) => total + save.value, 0);
    const totalUsageAmount = filterDataByYear(store.usages, props.selectedYear).reduce((total, save) => total + save.value, 0);
    const totalFixedAmount = filterDataByYear(store.fixes, props.selectedYear).reduce((total, fixed) => total + fixed.value, 0);
    const totalOcassionalAmount = filterDataByYear(store.ocassionals, props.selectedYear).reduce((total, ocassional) => total + ocassional.value, 0);

    const balance = totalIncomeAmount;
    const balanceBeforeSaves = balance - totalSaveAmount;
    const balanceBeforeFixed = balanceBeforeSaves - totalFixedAmount;
    const totalExpenses = totalFixedAmount + totalOcassionalAmount + totalUsageAmount;
    const calculateResult = balance - totalSaveAmount - totalExpenses;

    return (
        <>
            <div className="row align-self-center text-center justify-content-center align-items-bottom mt-2">
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
                </div>
                <div>
                    <div className="d-lg-flex pb-2 rounded-1">
                        <div className="col-lg col-12 justify-content-center align-items-center pe-0 rounded-1">
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
                                        <div className="col">{total} €</div>
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
                        <div className="col-lg col-12 wrap flex-column justify-content-center align-items-center rounded-1">
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
                                        <div className="col">{total} €</div>
                                        <div className="col">{calculatePercentage(total, totalIncomeAmount)} %</div>
                                        <div className="col">{calculateAverage(total)} €</div>                            
                                    </div>
                                </div>
                            ))}
                            <div className="text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill" id="table-ocassional">
                                <div className="row mobile-text text-white fw-bold fs-6">
                                    <div className="col">RESTANTE</div>
                                    <div className="col">{calculateResult} €</div>
                                    <div className="col">{calculatePercentage(calculateResult, totalIncomeAmount)} %</div>
                                    <div className="col">{calculateAverage(calculateResult)} €</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg col-12 wrap flex-column justify-content-center align-items-center pb-2 rounded-1">
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
                                        <div className="col">{total} €</div>
                                        <div className="col">{calculateAverage(total)} €</div>                            
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>                    
                </div>
            </div>
        </>
    );
};