import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { format } from "date-fns";
import es from "date-fns/locale/es";

export const ResumeAnual = (props) => {

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
    const [savesBalance, setSavesBalance] = useState({});

    const dataFilteredByCategory = (filteredIncome, filteredSave, filteredFixed, filteredOcassional) => {

        const incomeTotals = {};
        const saveTotals = {};
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
        setFixedCategoryTotals(fixedTotals);
        setOcassionalCategoryTotals(ocassionalTotals);
    }

    useEffect(() => {
        const transformData = async () => {
            await actions.getIncomes();
            await actions.getSaves();
            await actions.getFixes();
            await actions.getOcassionals();

            const filteredIncome = filterDataByYear(store.incomes, props.selectedYear);
            const filteredSave = filterDataByYear(store.saves, props.selectedYear);
            const filteredFixed = filterDataByYear(store.fixes, props.selectedYear);
            const filteredOcassional = filterDataByYear(store.ocassionals, props.selectedYear);
            
            dataFilteredByCategory(filteredIncome, filteredSave, filteredFixed, filteredOcassional);
        };
        transformData();
    }, [props.selectedYear]);

    const totalIncomeAmount = filterDataByYear(store.incomes, props.selectedYear).reduce((total, income) => total + income.value, 0);
    const totalSaveAmount = filterDataByYear(store.saves, props.selectedYear).reduce((total, save) => total + save.value, 0);
    const totalFixedAmount = filterDataByYear(store.fixes, props.selectedYear).reduce((total, fixed) => total + fixed.value, 0);
    const totalOcassionalAmount = filterDataByYear(store.ocassionals, props.selectedYear).reduce((total, ocassional) => total + ocassional.value, 0);

    const balance = totalIncomeAmount;
    const balanceBeforeSaves = balance - totalSaveAmount;
    const balanceBeforeFixed = balanceBeforeSaves - totalFixedAmount;
    const totalExpenses = totalFixedAmount + totalOcassionalAmount;
    const calculateResult = balance - totalSaveAmount - totalExpenses;

    return (
        <>
            <div className="col" id="resumen">
                <div className="row">
                    <h1 className="text-center py-3">{props.selectedYear}</h1>
                </div>
                <div className="wrap flex-column">
                    <div className="row justify-content-center align-items-center pb-2">
                        <div className="text-center">
                            <h4 className="text-white p-2" id="table-incomes">INGRESOS</h4>
                        </div>
                        <div className="row text-center p-2">
                            <p className="col text-center">{totalIncomeAmount} €</p>
                            <p className="col text-center">{calculateAverage(totalIncomeAmount)} €</p>
                        </div>
                        {Object.entries(incomeCategoryTotals).map(([category, total]) => (
                            <div className="row text-center p-2" key={category}>
                                <p className="col text-center">{category}</p>
                                <p className="col text-center">{total} €</p>
                                <p className="col text-center">{calculatePercentage(total, totalIncomeAmount)} %</p>
                                <p className="col text-center">{calculateAverage(total)} €</p>                          
                            </div>
                        ))}
                    </div>
                    <div className="row pb-2">
                        <div className="col-8">
                            <div className="text-center">
                                <h4 className="text-white p-2" id="table-saves">RESERVADO</h4>
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">{totalSaveAmount} €</p>
                                <p className="col text-center">{calculatePercentage(totalSaveAmount, totalIncomeAmount)} %</p>
                                <p className="col text-center">{calculateAverage(totalSaveAmount)} €</p>
                            </div>
                            {Object.entries(saveCategoryTotals).map(([category, total]) => (
                                <div className="row text-center p-2" key={category}>
                                    <p className="col text-center">{category}</p>
                                    <p className="col text-center">{total} €</p>
                                    <p className="col text-center">{calculatePercentage(total, totalIncomeAmount)} %</p>
                                    <p className="col text-center">{calculateAverage(total)} €</p>                          
                                </div>
                            ))}
                        </div>
                        <div className="col-4 ">
                            <h4 className="text-white text-center p-2" id="table-saves">USO RESERVADO</h4>
                            <div className="row text-center p-2">
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>                            
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>                            
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>                            
                            </div>
                        </div>
                    </div>
                    <div className="row pb-2">
                        <div className="text-center">
                            <h4 className="text-white p-2" id="table-expenses">GASTOS</h4>
                        </div>
                        <div className="row text-center p-2">
                            <p className="col text-center">{totalExpenses} €</p>
                            <p className="col text-center">{calculatePercentage(totalExpenses, totalIncomeAmount)} %</p>
                            <p className="col text-center">{calculateAverage(totalExpenses)} €</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="text-center">
                                <h4 className="text-white p-2" id="table-fixed">GASTOS FIJOS</h4>
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">{totalFixedAmount} €</p>
                                <p className="col text-center">{calculatePercentage(totalFixedAmount, totalIncomeAmount)} %</p>
                                <p className="col text-center">{calculateAverage(totalFixedAmount)} €</p>
                            </div>
                            {Object.entries(fixedCategoryTotals).map(([category, total]) => (
                                <div className="row text-center p-2" key={category}>
                                    <p className="col text-center">{category}</p>
                                    <p className="col text-center">{total} €</p>
                                    <p className="col text-center">{calculatePercentage(total, totalIncomeAmount)} %</p>
                                    <p className="col text-center">{calculateAverage(total)} €</p>                          
                                </div>
                            ))}
                            <div id="table-title" className="row text-center text-white p-2">
                                <p className="col text-center">LIBRE</p>
                                <p className="col text-center">{balanceBeforeFixed} €</p>
                                <p className="col text-center">{calculatePercentage(balanceBeforeFixed, totalIncomeAmount)} %</p>
                                <p className="col text-center">{calculateAverage(balanceBeforeFixed)} €</p>                          
                            </div>
                        </div>
                        <div className="col">
                            <div className="text-center">
                                <h4 className="text-white p-2" id="table-ocassional">GASTOS VARIABLES</h4>
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">{totalOcassionalAmount} €</p>
                                <p className="col text-center">{calculatePercentage(totalOcassionalAmount, totalIncomeAmount)} %</p>
                                <p className="col text-center">{calculateAverage(totalOcassionalAmount)} €</p>
                            </div>
                            {Object.entries(ocassionalCategoryTotals).map(([category, total]) => (
                                <div className="row text-center p-2" key={category}>
                                    <p className="col text-center">{category}</p>
                                    <p className="col text-center">{total} €</p>
                                    <p className="col text-center">{calculatePercentage(total, totalIncomeAmount)} %</p>
                                    <p className="col text-center">{calculateAverage(total)} €</p>                          
                                </div>
                            ))}
                            <div id="table-title" className="row text-center text-white p-2">
                                <p className="col text-center">RESTANTE</p>
                                <p className="col text-center">{calculateResult} €</p>
                                <p className="col text-center">{calculatePercentage(calculateResult, totalIncomeAmount)} %</p>
                                <p className="col text-center">{calculateAverage(calculateResult)} €</p>                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};