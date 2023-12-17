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

export const ExpensesAnualPieTypes = (props) => {

    const { store, actions } = useContext(Context);

    const [typesTotals, setTypesTotals] = useState({});

    const filterDataByYear = (data, selectedYear) => {
        return data.filter((item) => {
            const date = new Date(item.dateTime);
            return date.getFullYear() === selectedYear;
        });
    };

    const calculateTotal = (filteredData) => {
        return filteredData.reduce((total, item) => {
            return total + item.value;
        }, 0);
    };

    useEffect(() => {

        const transformData = async () => {

            await actions.getUsage();
            await actions.getFixes();
            await actions.getOcassionals();

            const filteredUsage = filterDataByYear(store.usages, props.selectedYear);
            const filteredFixed = filterDataByYear(store.fixes, props.selectedYear);
            const filteredOcassional = filterDataByYear(store.ocassionals, props.selectedYear);

            const usageTotals = calculateTotal(filteredUsage);
            const fixedTotals = calculateTotal(filteredFixed);
            const ocassionalTotals = calculateTotal(filteredOcassional);

            setTypesTotals({
                "Uso de reservado": usageTotals,
                "Gastos fijos": fixedTotals,
                "Gastos variables": ocassionalTotals,
            });
        };
        transformData();
    }, [props.selectedYear]);
    
    const data = {
        labels:  Object.keys(typesTotals),
        datasets: [
            {
            data: Object.values(typesTotals),
            backgroundColor: [
                "rgb(34, 147, 199)",
                "rgb(147, 40, 90)",
                "rgb(138, 181, 63)",
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
            {Object.keys(typesTotals).length > 0 ? (
                <>
                    <Pie data={data} options={options} />
                </>
                ) : (
            <p>No hay datos en este mes.</p>
            )}
        </>
    );
};