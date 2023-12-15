import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { format } from "date-fns";
import es from "date-fns/locale/es";

export const AnualOcassionalTable = (props) => {

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
            <div className="row mx-1 gap-2">
                <div className="col">
                    <div className="row text-white ocassional-part-right rounded-pill fw-normal fs-4">
                        <div className="col p-3 ocassional-bold-bg fw-bold">Total</div>
                        <div className="col p-3 fw-normal">{totalOcassionalAmount} €</div>
                        <div className="col p-3 fw-normal">{calculatePercentage(totalOcassionalAmount, totalIncomeAmount)} %</div>
                    </div>
                </div>
                <div className="col">
                    <div className="row text-white ocassional-bg">
                        <div className="col p-3 fw-bold">Media</div>
                        <div className="col p-3 ocassional-part-right fw-normal">{calculateAverage(totalOcassionalAmount)} €</div>
                    </div>
                </div>
            </div>
            <div className="m-4">
                {Object.entries(ocassionalCategoryTotals).map(([category, total]) => (
                    <div className="row fs-4 lh-lg" key={category}>
                        <div className="col fw-bold">{category}</div>
                        <div className="col">{total} €</div>
                        <div className="col">{calculatePercentage(total, totalIncomeAmount)} %</div>
                        <div className="col">{calculateAverage(total)} €</div>                          
                    </div>
                ))}
            </div>
            <div className="row text-white ocassional-part-right rounded-pill fw-normal fs-4 mx-1 mt-4">
                <div className="col p-3 ocassional-bold-bg fw-bold">Restante</div>
                <div className="col p-3 fw-normal">{calculateResult} €</div>
                <div className="col p-3 fw-normal">{calculatePercentage(calculateResult, totalIncomeAmount)} %</div>
                <div className="col p-3 fw-normal">{calculateAverage(calculateResult)} €</div>
            </div>
        </>
    );
};