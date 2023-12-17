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

export const MyConmoAnualPieTypes = (props) => {

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

            await actions.getSaves();
            await actions.getFixes();
            await actions.getOcassionals();

            const filteredSave = filterDataByYear(store.saves, props.selectedYear);
            const filteredFixed = filterDataByYear(store.fixes, props.selectedYear);
            const filteredOcassional = filterDataByYear(store.ocassionals, props.selectedYear);

            const saveTotals = calculateTotal(filteredSave);
            const fixedTotals = calculateTotal(filteredFixed);
            const ocassionalTotals = calculateTotal(filteredOcassional);

            setTypesTotals({
                "Reservado": saveTotals,
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
                "rgb(27, 100, 113)",
                "rgb(156, 13, 80)",
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
        <div className="col mx-3 text-center">
            <div className="row mt-2">
                <h4 className="mb-4">Tipos</h4>
                {Object.keys(typesTotals).length > 0 ? (
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