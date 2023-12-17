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

export const MonthlySavesPie = (props) => {
    
    const { store, actions } = useContext(Context);

    const [categoryTotals, setCategoryTotals] = useState({});

    useEffect(() => {
        const transformData = async () => {
        await actions.getSaves();

        const filteredSaves = store.saves.filter((data) => {
            const date = new Date(data.dateTime);
            return date.getMonth() === props.selectedMonthIndex && date.getFullYear() === props.selectedYear;
        });

        const totals = {};
        filteredSaves.forEach(({ value, category }) => {
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
                "rgb(62, 229, 237)",
                "rgb(13, 180, 186)",
                "rgb(7, 128, 139)",
                "rgb(27, 100, 113)",
                "rgb(27, 113, 113)",
                "rgb(6, 151, 156)",
                "rgb(64, 170, 184)",
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
                <p>No hay reservas para este mes.</p>
                )}
            </div>
        </>
    );
};