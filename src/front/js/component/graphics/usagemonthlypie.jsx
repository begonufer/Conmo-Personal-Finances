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

export const MonthlyUsagePie = (props) => {
    
    const { store, actions } = useContext(Context);

    const [categoryTotals, setCategoryTotals] = useState({});

    useEffect(() => {
        const transformData = async () => {
        await actions.getUsage();

        const filteredUsage = store.usages.filter((data) => {
            const date = new Date(data.dateTime);
            return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
        });

        const totals = {};
        filteredUsage.forEach(({ value, category }) => {
            const categoryName = category.name;
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
                "rgb(108, 181, 223)",
                "rgb(34, 147, 199)",
                "rgb(3, 104, 144)",
                "rgb(23, 87, 123)",
                "rgb(29, 126, 167)",
                "rgb(8, 168, 212)",
                "rgb(72, 183, 224)",
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
            <div className="row mt-4">
                {Object.keys(categoryTotals).length > 0 ? (
                <>
                    <Pie data={data} options={options} />
                </>
                ) : (
                <p>No hay gastos en este mes.</p>
                )}
            </div>
        </>
    );
};