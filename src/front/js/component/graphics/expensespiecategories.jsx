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

export const ExpensesPieCategories = (props) => {
  
    const { store, actions } = useContext(Context);

    const filterDataByMonthYear = (data, selectedMonthIndex, selectedYear) => {
        return data.filter((item) => {
            const date = new Date(item.dateTime);
            return date.getMonth() === selectedMonthIndex && date.getFullYear() === selectedYear;
        });
    };

    const [categoryTotals, setCategoryTotals] = useState({});
    
    useEffect(() => {
        const transformData = async () => {
            await actions.getUsage();
            await actions.getFixes();
            await actions.getOcassionals();

            const filteredUsage = filterDataByMonthYear(store.usages, props.selectedMonthIndex, props.selectedYear);
            const filteredFixed = filterDataByMonthYear(store.fixes, props.selectedMonthIndex, props.selectedYear);
            const filteredOcassional = filterDataByMonthYear(store.ocassionals, props.selectedMonthIndex, props.selectedYear);

            const categoryColorTotals = {};

            const buildCategoryColorTotals = (filteredData, categoryKey, colors) => {
                filteredData.forEach(({ value, [categoryKey]: category }, index) => {
                    const categoryName = category.name;
                    categoryColorTotals[categoryName] = {
                        value: (categoryColorTotals[categoryName]?.value || 0) + value,
                        color: colors[index % colors.length],
                    };
                });
            };
            const usageColors = [
                "rgb(108, 181, 223)",
                "rgb(34, 147, 199)",
                "rgb(3, 104, 144)",
                "rgb(23, 87, 123)",
                "rgb(29, 126, 167)",
                "rgb(8, 168, 212)",
                "rgb(72, 183, 224)",
            ];
            const fixedColors = [
                "rgb(203, 64, 122)",
                "rgb(183, 73, 124)",
                "rgb(147, 40, 90)",
                "rgb(122, 15, 65)",
                "rgb(156, 13, 80)",
                "rgb(189, 0, 91)",
                "rgb(202, 49, 98)",
            ];
            const ocassionalColors = [
                "rgb(175, 200, 62)",
                "rgb(137, 178, 15)",
                "rgb(96, 135, 28)",
                "rgb(81, 110, 32)",
                "rgb(111, 174, 0)",
                "rgb(140, 188, 30)",
                "rgb(177, 217, 0)",
            ];

            buildCategoryColorTotals(filteredUsage, 'category', usageColors);
            buildCategoryColorTotals(filteredFixed, 'fixedcategory', fixedColors);
            buildCategoryColorTotals(filteredOcassional, 'ocassionalcategory', ocassionalColors);

            setCategoryTotals(categoryColorTotals);
        };

        transformData();
    }, [props.selectedMonthIndex, props.selectedYear]);

    const data = {
        labels: Object.keys(categoryTotals),
        datasets: [
            {
                data: Object.values(categoryTotals).map(item => item.value),
                backgroundColor: Object.values(categoryTotals).map(item => item.color),
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
                <p>No hay datos en este mes.</p>
            )}
        </>
    );
};