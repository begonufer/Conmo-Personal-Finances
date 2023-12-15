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

export const AnualFixedPie = (props) => {
    
    const { store, actions } = useContext(Context);

    const [categoryTotals, setCategoryTotals] = useState({});

    const filterDataByYear = (data, selectedYear) => {
        return data.filter((item) => {
            const date = new Date(item.dateTime);
            return date.getFullYear() === selectedYear;
        });
    };

    useEffect(() => {
        const transformData = async () => {
        await actions.getFixes();

        const filteredFixed = filterDataByYear(store.fixes, props.selectedYear);

        const totals = {};
        filteredFixed.forEach(({ value, fixedcategory }) => {
            const categoryName = fixedcategory.name;
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
                "rgb(203, 64, 122)",
                "rgb(183, 73, 124)",
                "rgb(147, 40, 90)",
                "rgb(122, 15, 65)",
                "rgb(156, 13, 80)",
                "rgb(189, 0, 91)",
                "rgb(202, 49, 98)",
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
                <p>No hay gastos fijos en este año.</p>
            )}
        </>
    );
};