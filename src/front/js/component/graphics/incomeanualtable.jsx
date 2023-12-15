import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { format } from "date-fns";
import es from "date-fns/locale/es";

export const AnualIncomeTable = (props) => {
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

    const dataFilteredByCategory = (filteredIncome) => {

        const incomeTotals = {};

        filteredIncome.forEach(({ value, incomecategory }) => {
            const categoryName = incomecategory.name;
            incomeTotals[categoryName] = (incomeTotals[categoryName] || 0) + value;
        });

        setIncomeCategoryTotals(incomeTotals);
    }

    useEffect(() => {
        const transformData = async () => {
            await actions.getIncomes();

            const filteredIncome = filterDataByYear(store.incomes, props.selectedYear);
            
            dataFilteredByCategory(filteredIncome);
        };
        transformData();
    }, [props.selectedYear]);

    const totalIncomeAmount = filterDataByYear(store.incomes, props.selectedYear).reduce((total, income) => total + income.value, 0);

    return (
        <>
            <div className="row mx-1 gap-2">
                <div className="col">
                    <div className="row incomes-bg">
                        <div className="col p-3 fw-bold">Total</div>
                        <div className="col p-3 incomes-part-right fw-normal">{totalIncomeAmount} €</div>
                    </div>
                </div>
                <div className="col">
                    <div className="row incomes-bg">
                        <div className="col p-3 fw-bold">Media</div>
                        <div className="col p-3 incomes-part-right fw-normal">{calculateAverage(totalIncomeAmount)} €</div>
                    </div>
                </div>
            </div>
            <div className="m-4">
                {Object.entries(incomeCategoryTotals).map(([category, total]) => (
                    <div className="row fs-4 lh-lg" key={category}>
                        <div className="col fw-bold">{category}</div>
                        <div className="col">{total} €</div>
                        <div className="col">{calculatePercentage(total, totalIncomeAmount)} %</div>
                        <div className="col">{calculateAverage(total)} €</div>                          
                    </div>
                ))}
            </div>
        </>
    );
};