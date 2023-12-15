import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { format } from "date-fns";
import es from "date-fns/locale/es";

export const MonthlySavesTable = (props) => {
    const { store, actions } = useContext(Context);

    const calculatePercentage = (amount, total) => {
        if (total === 0) {
            return 0;
        }
        return ((amount / total) * 100).toFixed(0);
    };

    const [categoryTotals, setCategoryTotals] = useState({});

    useEffect(() => {
        const transformData = async () => {
            await actions.getSaves();
            const filteredSave = store.saves.filter((data) => {
                const date = new Date(data.dateTime);
                return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
            });

            const totals = {};
            filteredSave.forEach(({ value, category }) => {
                const categoryName = category.name;
                totals[categoryName] = (totals[categoryName] || 0) + value;
            });

            setCategoryTotals(totals);
        };

        transformData();
    }, [props.selectedMonthIndex, props.selectedYear]);

    const previousMonthAmount = 587;
    const selectedMonthAmount = store.saves
        .filter((data) => {
            const date = new Date(data.dateTime);
            return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
        })
        .reduce((total, save) => total + save.value, 0);

    const totalAmount = previousMonthAmount + selectedMonthAmount;

    return (
        <>
            <div className="row">
                <div className="col mx-3">
                    <p className="incomes-bg p-3">Sobrante de {props.previousMonth} <i className="fas fa-arrow-right"></i> {previousMonthAmount} €</p>
                </div>
                <div className="col mx-3">
                    <p className="incomes-bg p-3">{props.selectedMonth} <i className="fas fa-arrow-right"></i> {selectedMonthAmount} €</p>
                </div>
            </div>
            <div className="text-center">
                <table className="table table-borderless align-middle">
                    <tbody>
                        {Object.entries(categoryTotals).map(([category, total]) => (
                            <tr className="line" key={category}>
                                <th scope="row" className="half-width">{category}</th>
                                <td>{calculatePercentage(total, selectedMonthAmount)} %</td>
                                <td>{total} €</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="incomes-bg p-3 mx-3">Total <i className="fas fa-arrow-right"></i> {totalAmount} €</p>
        </>
    );
};