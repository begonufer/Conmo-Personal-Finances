import React from "react";
import { AnualIncomeTable, MonthlyIncomeTable } from "../component/IncomeTables.jsx";
import { AnualSavedTable, MonthlySavedTable } from "../component/SavedTables.jsx";
import { AnualExpenseTable, MonthlyExpenseTable } from "../component/ExpenseTables.jsx";

export const Resume = ({ selectedMonth, selectedMonthIndex, selectedYear, previousMonthIndex }) => {
    return (
        <>
            <div className="col-lg-5 text-center justify-content-center align-items-bottom mx-2 fs-1-2-em">
                <h2 className="conmo-bg text-white text-center py-3 shadow rounded-pill p-3 mb-5 fs-1 fw-semibold">{selectedMonth}</h2>
                <MonthlyIncomeTable
                    selectedMonthIndex={selectedMonthIndex}
                    selectedYear={selectedYear}
                    previousMonthIndex={previousMonthIndex}
                />
                <MonthlySavedTable
                    selectedMonthIndex={selectedMonthIndex}
                    selectedYear={selectedYear}
                />
                <MonthlyExpenseTable
                    selectedMonthIndex={selectedMonthIndex}
                    selectedYear={selectedYear}
                    previousMonthIndex={previousMonthIndex}
                />
            </div>
        </>
    );
};

export const ResumeAnual = ({ selectedMonthIndex, selectedYear }) => {
    return (
        <>
            <div className="col text-center justify-content-center align-items-bottom mx-2 fs-1-2-em">
                <h2 className="conmo-bg text-white text-center fs-1 fw-semibold shadow rounded-pill p-3 mb-5">{selectedYear}</h2>
                <AnualIncomeTable 
                    selectedMonthIndex={selectedMonthIndex}
                    selectedYear={selectedYear}
                />
                <AnualSavedTable
                    selectedMonthIndex={selectedMonthIndex}
                    selectedYear={selectedYear}
                />
                <AnualExpenseTable
                    selectedMonthIndex={selectedMonthIndex}
                    selectedYear={selectedYear}
                />
            </div>
        </>
    );
}