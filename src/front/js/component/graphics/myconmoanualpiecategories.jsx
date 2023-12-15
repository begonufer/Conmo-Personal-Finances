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

export const MyConmoAnualPieCategories = (props) => {
  
    const { store, actions } = useContext(Context);

    const filterDataByYear = (data, selectedYear) => {
        return data.filter((item) => {
            const date = new Date(item.dateTime);
            return date.getFullYear() === selectedYear;
        });
    };

    const [categoryTotals, setCategoryTotals] = useState({});
    
    useEffect(() => {
        const transformData = async () => {
            await actions.getSaves();
            await actions.getFixes();
            await actions.getOcassionals();

            const filteredSave = filterDataByYear(store.saves, props.selectedYear);
            const filteredFixed = filterDataByYear(store.fixes, props.selectedYear);
            const filteredOcassional = filterDataByYear(store.ocassionals, props.selectedYear);

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

            const saveColors = ["rgb(40, 130, 150)", "rgb(40, 140, 160)", "rgb(40, 150, 170)", "rgb(40, 160, 180)"];
            const fixedColors = ["rgb(147, 70, 110)", "rgb(147, 80, 120)", "rgb(147, 90, 130)"];
            const ocassionalColors = ["rgb(138, 190, 70)", "rgb(138, 200, 80)", "rgb(138, 210, 90)"];

            buildCategoryColorTotals(filteredSave, 'category', saveColors);
            buildCategoryColorTotals(filteredFixed, 'fixedcategory', fixedColors);
            buildCategoryColorTotals(filteredOcassional, 'ocassionalcategory', ocassionalColors);

            setCategoryTotals(categoryColorTotals);
        };

        transformData();
    }, [props.selectedYear]);

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
        <div className="col mx-3 text-center">
            <div className="row mt-2">
                <h4 className="mb-4">Categorías</h4>
                {Object.keys(categoryTotals).length > 0 ? (
                    <>
                        <Pie data={data} options={options} />
                    </>
                ) : (
                <p>No hay datos en este mes.</p>
                )}
            </div>
        </div>
    );
};