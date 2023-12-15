import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";


export const Resume = (props) => {
    
    const { store, actions } = useContext(Context);

    const calculatePercentage = (amount, total) => {
        if (total === 0) {
            return 0;
        }
        return ((amount / total) * 100).toFixed(0);
    };

    const filterDataByMonthYear = (data, selectedMonthIndex, selectedYear) => {
        return data.filter((item) => {
            const date = new Date(item.dateTime);
            return date.getMonth() === selectedMonthIndex && date.getFullYear() === selectedYear;
        });
    };

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

            const filteredIncome = filterDataByMonthYear(store.incomes, props.selectedMonthIndex, props.selectedYear);
            const filteredSave = filterDataByMonthYear(store.saves, props.selectedMonthIndex, props.selectedYear);
            const filteredFixed = filterDataByMonthYear(store.fixes, props.selectedMonthIndex, props.selectedYear);
            const filteredOcassional = filterDataByMonthYear(store.ocassionals, props.selectedMonthIndex, props.selectedYear);

            const filterAllDataBeforeMonth = (data, selectedMonthIndex, selectedYear) => {
                return data.filter(item => {
                    const itemDate = new Date(item.dateTime);
                    const itemMonth = itemDate.getMonth();
                    const itemYear = itemDate.getFullYear();
            
                    return (itemYear < selectedYear || (itemYear === selectedYear && itemMonth <= selectedMonthIndex));
                });
            };
            
            const allPreviousMonthSaves = filterAllDataBeforeMonth(store.saves, props.selectedMonthIndex, props.selectedYear);

            const saveBalance = allPreviousMonthSaves.reduce((acc, { value, category }) => {
                const categoryName = category.name;
                acc[categoryName] = (acc[categoryName] || 0) + value;
                return acc;
            }, {});
            
            setSavesBalance(saveBalance);
            
            dataFilteredByCategory(filteredIncome, filteredSave, filteredFixed, filteredOcassional);
        };
        transformData();
    }, [props.selectedMonthIndex, props.selectedYear, props.previousMonthIndex]);

    const totalIncomeMonthAmount = filterDataByMonthYear(store.incomes, props.selectedMonthIndex, props.selectedYear).reduce((total, income) => total + income.value, 0);
    const totalSaveMonthAmount = filterDataByMonthYear(store.saves, props.selectedMonthIndex, props.selectedYear).reduce((total, save) => total + save.value, 0);
    const totalFixedMonthAmount = filterDataByMonthYear(store.fixes, props.selectedMonthIndex, props.selectedYear).reduce((total, fixed) => total + fixed.value, 0);
    const totalOcassionalMonthAmount = filterDataByMonthYear(store.ocassionals, props.selectedMonthIndex, props.selectedYear).reduce((total, ocassional) => total + ocassional.value, 0);
 
    const previousMonthAmount = props.previousMonthAmount;

    const balance = previousMonthAmount + totalIncomeMonthAmount;
    const balanceBeforeSaves = balance - totalSaveMonthAmount;
    const balanceBeforeFixed = balanceBeforeSaves - totalFixedMonthAmount;
    const totalExpenses = totalFixedMonthAmount + totalOcassionalMonthAmount;
    const calculateMonthResult = balance - totalSaveMonthAmount - totalExpenses;
    
    const savesBalanceTotal = Object.values(savesBalance).reduce((total, categoryTotal) => total + categoryTotal, 0);

    return (
        <>
            <div className="col-5 text-center justify-content-center align-items-bottom mx-2">
                <h2 className="movements-head text-white text-center fs-1 fw-semibold shadow rounded-pill p-3 mb-5">{props.selectedMonth}</h2>
                <div className="wrap flex-column mb-5 justify-content-center align-items-center income-content-bg pb-2 rounded-1">
                    <h4 className="text-white fs-2 p-3 mb-0 rounded-1" id="table-incomes">INGRESOS</h4>
                    <div className="income-light-bg text-center justify-content-center align-items-center p-3">
                        <div className="row">
                            <div className="col">Mes anterior</div>
                            <div className="col">Total</div>
                        </div>
                    </div>
                    <div className="text-center justify-content-center align-items-center p-3">
                        <div className="row">
                            <div className="col">{props.previousMonth} <i className="fas fa-arrow-right"></i> {previousMonthAmount} €</div>
                            <div className="col">{totalIncomeMonthAmount} €</div>
                        </div>
                    </div>
                    <div className="income-light-bg text-center justify-content-center align-items-center p-3">
                        <div className="row">
                            <div className="col">Categoría</div>
                            <div className="col">Total</div>
                            <div className="col">%</div>
                        </div>
                    </div>
                    {Object.entries(incomeCategoryTotals).map(([category, total]) => (
                        <div className="text-center justify-content-center align-items-center p-3" key={category}>
                            <div className="row">
                                <div className="col">{category}</div>
                                <div className="col">{total} €</div> 
                                <div className="col">{calculatePercentage(total, totalIncomeMonthAmount)} %</div>                         
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <div className="row">
                        <div className="col-8 wrap flex-column justify-content-center align-items-center  pb-2 mb-5 rounded-1">
                            <h4 className="text-white fs-2 p-3 mb-0 rounded-1 text-center py-3" id="table-saves">RESERVADO</h4>
                            <div className="saves-light-bg text-center justify-content-center align-items-center p-3">
                                <div className="row">
                                    <div className="col">Total</div>
                                    <div className="col">%</div>
                                </div>
                            </div>
                            <div className="text-center justify-content-center align-items-center saves-content-bg p-3">
                                <div className="row">
                                    <div className="col">{totalSaveMonthAmount} €</div>
                                    <div className="col">{calculatePercentage(totalSaveMonthAmount, totalIncomeMonthAmount)} %</div>
                                </div>
                            </div>
                            <div className="saves-light-bg text-center justify-content-center align-items-center p-3">
                                <div className="row">
                                    <div className="col">Categoría</div>
                                    <div className="col">Total</div>
                                    <div className="col">%</div>
                                </div>
                            </div>
                            {Object.entries(saveCategoryTotals).map(([category, total]) => (
                                <div className="text-center justify-content-center align-items-center saves-content-bg p-3" key={category}>
                                    <div className="row">
                                        <div className="col">{category}</div>
                                        <div className="col">{total} €</div>
                                        <div className="col">{calculatePercentage(total, totalIncomeMonthAmount)} %</div>                       
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col-4 wrap flex-column justify-content-center align-items-center  pb-2 mb-5 rounded-1">
                            <h4 className="text-white fs-2 p-3 mb-0 rounded-1 text-center py-3" id="table-saves">BALANCE</h4>                        
                            <div className="saves-light-bg text-center justify-content-center align-items-center p-3">
                                <div className="row">
                                    <div className="col">Total</div>
                                </div>
                            </div>
                            <div className="text-center justify-content-center align-items-center saves-content-bg p-3">
                                <div className="row">
                                    <div className="col">{savesBalanceTotal} €</div>
                                </div>
                            </div>
                            <div className="saves-light-bg text-center justify-content-center align-items-center p-3">
                                <div className="row">
                                    <div className="col">Total</div>
                                </div>
                            </div>
                            {Object.entries(saveCategoryTotals).map(([category, total]) => (
                                <div className="text-center justify-content-center align-items-center saves-content-bg p-3" key={category}>
                                    <div className="row">
                                        <div className="col">{total} €</div>                         
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>                    
                </div>
                <div className="wrap flex-column mb-5 justify-content-center align-items-center pb-2 rounded-1">
                    <h4 className="text-white fs-2 p-3 mb-0 rounded-1" id="table-expenses">GASTOS</h4>
                    <div className="expense-light-bg text-center justify-content-center align-items-center p-3">
                        <div className="row">
                            <div className="col">Total</div>
                            <div className="col">%</div>
                        </div>
                    </div>
                    <div className="text-center justify-content-center align-items-center expense-content-bg p-3">
                        <div className="row">
                            <div className="col text-center">{totalExpenses} €</div>
                            <div className="col text-center">{calculatePercentage(totalExpenses, totalIncomeMonthAmount)} %</div>
                        </div>
                    </div>
                    <div>
                        <div className="row">
                            <div className="col wrap flex-column justify-content-center align-items-center pb-2 mb-5 pe-0 rounded-1">
                                <h4 className="text-white fs-2 p-3 mb-0 rounded-1 text-center py-3" id="table-fixed">FIJOS</h4>
                                <div className="fixed-light-bg text-center justify-content-center align-items-center p-3">
                                    <div className="row">
                                        <div className="col">Total</div>
                                        <div className="col">%</div>
                                    </div>
                                </div>
                                <div className="text-center justify-content-center align-items-center fixed-content-bg p-3">
                                    <div className="row">
                                        <div className="col">{totalFixedMonthAmount} €</div>
                                        <div className="col">{calculatePercentage(totalFixedMonthAmount, totalIncomeMonthAmount)} %</div>
                                    </div>
                                </div>
                                <div className="fixed-light-bg text-center justify-content-center align-items-center p-3">
                                    <div className="row">
                                        <div className="col">Categoría</div>
                                        <div className="col">Total</div>
                                        <div className="col">%</div>
                                    </div>
                                </div>
                                {Object.entries(fixedCategoryTotals).map(([category, total]) => (
                                    <div className="text-center justify-content-center align-items-center fixed-content-bg p-3" key={category}>
                                        <div className="row">
                                            <div className="col">{category}</div>
                                            <div className="col">{total} €</div>
                                            <div className="col">{calculatePercentage(total, totalIncomeMonthAmount)} %</div>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center text-white justify-content-center align-items-center p-3" id="table-fixed">
                                    <div className="row fw-bold fs-6">
                                        <div className="col">LIBRE</div>
                                        <div className="col">{balanceBeforeFixed} €</div>
                                        <div className="col">{calculatePercentage(balanceBeforeFixed, totalIncomeMonthAmount)} %</div>
                                    </div>
                                </div>                                
                            </div>
                            <div className="col wrap flex-column justify-content-center align-items-center pb-2 ps-0 rounded-1">
                                <h4 className="text-white fs-2 p-3 mb-0 rounded-1 text-center py-3"  id="table-ocassional">OCASIONALES</h4>
                                <div className="ocassional-light-bg text-center justify-content-center align-items-center p-3">
                                    <div className="row">
                                        <div className="col">Total</div>
                                        <div className="col">%</div>
                                    </div>
                                </div>
                                <div className="text-center justify-content-center align-items-center ocassional-content-bg p-3">
                                    <div className="row">
                                        <div className="col">{totalOcassionalMonthAmount} €</div>
                                        <div className="col">{calculatePercentage(totalOcassionalMonthAmount, totalIncomeMonthAmount)} %</div>
                                    </div>
                                </div>
                                <div className="ocassional-light-bg text-center justify-content-center align-items-center p-3">
                                    <div className="row">
                                        <div className="col">Categoría</div>
                                        <div className="col">Total</div>
                                        <div className="col">%</div>
                                    </div>
                                </div>
                                {Object.entries(ocassionalCategoryTotals).map(([category, total]) => (
                                    <div className="text-center justify-content-center align-items-center ocassional-content-bg p-3" key={category}>
                                        <div className="row">
                                            <div className="col">{category}</div>
                                            <div className="col">{total} €</div>
                                            <div className="col">{calculatePercentage(total, totalIncomeMonthAmount)} %</div>
                                        </div>
                                    </div>
                                ))} 
                                <div className="text-center justify-content-center align-items-center p-3" id="table-ocassional">
                                    <div className="row fw-bold fs-6">
                                        <div className="col">RESTANTE</div>
                                        <div className="col">{calculateMonthResult} €</div>
                                        <div className="col">{calculatePercentage(calculateMonthResult, totalIncomeMonthAmount)} %</div>
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
