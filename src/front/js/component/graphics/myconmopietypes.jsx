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

export const MyConmoPieTypes = (props) => {

    const { store, actions } = useContext(Context);

    const [typesTotals, setTypesTotals] = useState({});

    const filterDataByMonthYear = (data, selectedMonthIndex, selectedYear) => {
        return data.filter((item) => {
            const date = new Date(item.dateTime);
            return date.getMonth() === selectedMonthIndex && date.getFullYear() === selectedYear;
        });
    }; //usar esta función como función general

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

            const filteredSave = filterDataByMonthYear(store.saves, props.selectedMonthIndex, props.selectedYear);
            const filteredFixed = filterDataByMonthYear(store.fixes, props.selectedMonthIndex, props.selectedYear);
            const filteredOcassional = filterDataByMonthYear(store.ocassionals, props.selectedMonthIndex, props.selectedYear);

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
    }, [props.selectedMonthIndex, props.selectedYear]);
    
    const data = {
        labels:  Object.keys(typesTotals),
        datasets: [
            {
            data: Object.values(typesTotals),
            backgroundColor: [
                "rgb(40, 124, 147)",
                "rgb(147, 40, 90)",
                "rgb(138, 181, 63)",
            ],
            borderWidth: 0,
            },
        ],
    };
    
    const options = {
        legend: {
            display: false,
        },
        labels: {
            display: false,
        },
    };

    return (
        <div className="col mx-5 text-center">
            <div className="row mt-5">
                <p>Dónde se ocupa cada parte de los ingresos.</p>
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