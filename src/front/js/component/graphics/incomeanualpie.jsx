import React, { useContext, useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import { Context } from "../../store/appContext";
import { format } from "date-fns";
import es from "date-fns/locale/es";

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

export const AnualIncomePie = (props) => {
  
    const { store, actions } = useContext(Context);
    const [categoryTotals, setCategoryTotals] = useState({});

    useEffect(() => {
        const transformData = async () => {
        await actions.getIncomes();

        const filteredIncome = store.incomes.filter((data) => {
            const date = new Date(data.dateTime);
            return date.getFullYear() === props.selectedYear;
        });

        const totals = {};
        filteredIncome.forEach(({ value, incomecategory }) => {
            const categoryName = incomecategory.name;
            totals[categoryName] = (totals[categoryName] || 0) + value;
        });
        setCategoryTotals(totals);
        };

        transformData();
    }, [props.selectedMonthIndex, props.selectedYear]);

    const data = {
        labels: Object.keys(categoryTotals),
        datasets: [
            {
                data: Object.values(categoryTotals),
                backgroundColor: [
                    "rgb(255, 217, 0)",
                    "rgb(191, 159, 0)",
                    "rgb(151, 140, 22)",
                    "rgb(207, 193, 44)",
                    "rgb(215, 211, 20)",
                    "rgb(255, 242, 94)",
                ],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false,
            }
        },
    };

    return (
        <>
            {Object.keys(categoryTotals).length > 0 ? (
                <>
                    <Pie data={data} options={options} />
                </>
                ) : (
                <p>No hay ingresos para este mes.</p>
            )}
        </>
    );
};