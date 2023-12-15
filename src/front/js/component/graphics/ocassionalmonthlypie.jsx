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

export const MonthlyOcassionalPie = (props) => {
    
    const { store, actions } = useContext(Context);

    const [categoryTotals, setCategoryTotals] = useState({});

    useEffect(() => {
        const transformData = async () => {
        await actions.getOcassionals();

        const filteredOcassional = store.ocassionals.filter((data) => {
            const date = new Date(data.dateTime);
            return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
        });

        const totals = {};
        filteredOcassional.forEach(({ value, ocassionalcategory }) => {
            const categoryName = ocassionalcategory.name;
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
                "rgb(175, 200, 62)",
                "rgb(137, 178, 15)",
                "rgb(96, 135, 28)",
                "rgb(81, 110, 32)",
                "rgb(111, 174, 0)",
                "rgb(140, 188, 30)",
                "rgb(177, 217, 0)",
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
                <p>No hay gastos ocasionales para este mes.</p>
            )}
        </>
    );
};