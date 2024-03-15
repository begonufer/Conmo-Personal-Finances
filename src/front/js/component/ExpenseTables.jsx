import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { calculatePercentage, filterDataByMonthYear, filterDataByYearToSelectedMonth, calculateAverage } from "../utils.jsx";
import { AnualFixedTable, MonthlyFixedTable } from "../component/FixedTables.jsx";
import { AnualOcassionalTable, MonthlyOcassionalTable } from "../component/OcassionalTables.jsx";

export const MonthlyExpenseTable = ({ selectedMonthIndex, selectedYear, previousMonthIndex }) => {
    const { store, actions } = useContext(Context);
    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState([]);

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getFixes();
        await actions.getOcassionals();

        const filteredIncome = filterDataByMonthYear(store.incomes,selectedMonthIndex,selectedYear);
        const filteredFixed = filterDataByMonthYear(store.fixes,selectedMonthIndex,selectedYear);
        const filteredOcassional = filterDataByMonthYear(store.ocassionals,selectedMonthIndex,selectedYear);

        const incomeMonthAmount = filteredIncome.reduce( (total, income) => total + income.value, 0 );
        setTotalIncomeAmount(incomeMonthAmount.toFixed(2));

        const fixedMonthAmount = filteredFixed.reduce( (total, fixed) => total + fixed.value, 0 );
        const ocassionalMonthAmount = filteredOcassional.reduce( (total, ocassional) => total + ocassional.value, 0);
        const allExpenses = fixedMonthAmount + ocassionalMonthAmount;
        setTotalExpenses(allExpenses.toFixed(2));
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['incomes','fixes','ocassionals'], () => {
            getTableData();
            console.log('Type changed.');
        });
        return () => {
            unsubscribe();
        };
    }, [selectedMonthIndex, selectedYear]);

    return (
        <>
            <div className="wrap flex-column justify-content-center align-items-center pb-2 rounded-1">
                <h4 className="expenses-text text-center type-table-title">GASTOS</h4>
                <div className="expense-bg table-columns">
                    <div className="row">
                        <div className="col">Total</div>
                        <div className="col">%</div>
                    </div>
                </div>
                <div className="text-center justify-content-center align-items-center pt-3">
                    <div className="row mobile-text">
                        <div className="col text-center">{totalExpenses}€</div>
                        <div className="col text-center">{calculatePercentage(totalExpenses, totalIncomeAmount)}%</div>
                    </div>
                </div>
                <div>
                    <div className="d-md-flex pb-2 rounded-1">
                        <MonthlyFixedTable
                            selectedMonthIndex={selectedMonthIndex}
                            selectedYear={selectedYear}
                            previousMonthIndex={previousMonthIndex}
                        />
                        <MonthlyOcassionalTable
                            selectedMonthIndex={selectedMonthIndex}
                            selectedYear={selectedYear}
                            previousMonthIndex={previousMonthIndex}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export const AnualExpenseTable = ({ selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);
    const [totalIncomeAmount, setTotalIncomeAmount] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState([]);

    const getTableData = async () => {
        await actions.getIncomes();
        await actions.getFixes();
        await actions.getOcassionals();

        const filteredIncome = filterDataByYearToSelectedMonth(store.incomes, selectedMonthIndex,selectedYear);
        const filteredFixed = filterDataByYearToSelectedMonth(store.fixes, selectedMonthIndex, selectedYear);
        const filteredOcassional = filterDataByYearToSelectedMonth(store.ocassionals, selectedMonthIndex,selectedYear);

        const incomeMonthAmount = filteredIncome.reduce( (total, income) => total + income.value, 0 );
        setTotalIncomeAmount(incomeMonthAmount.toFixed(2));

        const fixedMonthAmount = filteredFixed.reduce( (total, fixed) => total + fixed.value, 0 );
        const ocassionalMonthAmount = filteredOcassional.reduce( (total, ocassional) => total + ocassional.value, 0);
        const allExpenses = fixedMonthAmount + ocassionalMonthAmount;
        setTotalExpenses(allExpenses.toFixed(2));
    };

    useEffect(() => {
        getTableData();
        const unsubscribe = actions.subscribeToType(['incomes','fixes','ocassionals'], () => {
            getTableData();
            console.log('Type changed.');
        });
        return () => {
            unsubscribe();
        };
    }, [selectedMonthIndex, selectedYear]);

    return (
        <>
            <div className="wrap flex-column justify-content-center align-items-center pb-2 rounded-1">
                <h4 className="expenses-text text-center fs-1 fw-bold p-3 mb-0">GASTOS</h4>
                <div className="expense-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                    <div className="row text-white mobile-text">
                        <div className="col">Total</div>
                        <div className="col">%</div>
                        <div className="col">Media</div>
                    </div>
                </div>
                <div className="text-center justify-content-center align-items-center pt-3">
                    <div className="row mobile-text">
                        <div className="col text-center">{totalExpenses}€</div>
                        <div className="col text-center">{calculatePercentage(totalExpenses, totalIncomeAmount)}%</div>
                        <div className="col text-center">{calculateAverage(selectedMonthIndex, totalExpenses)}€</div>
                    </div>
                </div>
                <div>
                    <div className="d-md-flex pb-2 rounded-1">
                        <AnualFixedTable
                            selectedMonthIndex={selectedMonthIndex}
                            selectedYear={selectedYear}
                        />
                        <AnualOcassionalTable
                            selectedMonthIndex={selectedMonthIndex}
                            selectedYear={selectedYear}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};