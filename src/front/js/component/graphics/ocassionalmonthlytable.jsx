import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { calculatePercentage, filterDataByMonthYear, calculateCategoryTotals, calculateTotals } from '../../pages/utils.jsx';

export const MonthlyOcassionalTable = (props) => {

    const { store, actions } = useContext(Context);

    const [ocassionalCategoryTotals, setOcassionalCategoryTotals] = useState({});

    const [ocassionalMonthAmount, setOcassionalMonthAmount] = useState([]);
    const [incomeMonthAmount, setIncomeMonthAmount] = useState([]);

    const setTableData = async () => {
        await actions.getOcassionals();
        await actions.getIncomes();

        const filterMonthlyOcassional = filterDataByMonthYear(store.ocassionals, props.selectedMonthIndex, props.selectedYear);

        const ocassionalCategoriesData = calculateCategoryTotals(filterMonthlyOcassional, 'ocassionalcategory');
        setOcassionalCategoryTotals(ocassionalCategoriesData);

        const calculateOcassionalMonthAmount = calculateTotals(filterMonthlyOcassional);

        setOcassionalMonthAmount(calculateOcassionalMonthAmount);
        const filterMonthlyIncome = filterDataByMonthYear(store.incomes, props.selectedMonthIndex, props.selectedYear);

        const calculateIncomeMonthAmount = calculateTotals(filterMonthlyIncome);
        setIncomeMonthAmount(calculateIncomeMonthAmount);
    };

    const restAmount = incomeMonthAmount - ocassionalMonthAmount;
    
    useEffect(() => {
        setTableData();
    }, [props.selectedMonthIndex, props.selectedYear]);
 
    return (
        <>
            <div className="row mx-1 gap-2">
                <div className="col">
                    <div className="ocassional-bg mobile-text text-white p-3">{ocassionalMonthAmount} €</div>
                </div>
                <div className="col">
                    <div className="ocassional-bg mobile-text text-white p-3">{calculatePercentage(ocassionalMonthAmount, incomeMonthAmount)} %</div>
                </div>
            </div>
            <div className="m-3 my-4">
                {Object.entries(ocassionalCategoryTotals).map(([category, total]) => (
                    <div key={category} className="row fs-4 lh-lg d-flex align-items-center">
                        <div className="col mobile-text fw-bold ">{category}</div>
                        <div className="col mobile-text">{calculatePercentage(total, incomeMonthAmount)} %</div>
                        <div className="col mobile-text">{total} €</div>
                    </div>
                ))}
            </div>
            <div className="row ocassional-bg text-white mx-1 mt-2">
                <div className="col mobile-text p-3 fw-bold">Restante</div>
                <div className="col mobile-text p-3 ocassional-part-right fw-normal">{restAmount} €</div>
            </div>
        </>
    );
};