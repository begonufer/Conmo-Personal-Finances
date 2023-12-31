import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { allDataBarOptions, barOptions } from "../pages/chartoptions.jsx";
import { incomeColors, usageColors, fixedColors, ocassionalColors, incomeTypeColor, saveTypeColor, usageTypeColor, fixedTypeColor, ocassionalTypeColor } from "../pages/typescolors.jsx";
import { Bar } from "react-chartjs-2";
import {
    filterDataByMonthYear,
    filterDataByYear,
    loadData,
    calculateTypeDayTotals,
    calculateTypeMonthTotals,
  } from '../pages/utils.jsx';

export const MonthlyBarTypes = ({ dataFunctions, types, typeNames, selectedMonthIndex, selectedYear, renderAsDataBar }) => {
    const { store } = useContext(Context);
    const [typeBarData, setTypeBarData] = useState([]);
    const buildBarDataChart = async () => {
        const daysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
        const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);
        const typeDataArray = await Promise.all(dataFunctions.map(async (dataFunction, index) => {
            await loadData([dataFunction]);
            const filteredType = filterDataByMonthYear(store[types[index]], selectedMonthIndex, selectedYear);
            const totalDailyType = calculateTypeDayTotals(filteredType, typeNames[index]);
            return {
                label: typeNames[index],
                data: daysArray.map((day) => totalDailyType.get(day) || { day, value: 0, type: `Sin datos` }),
                backgroundColor: getTypeColor(typeNames[index]),
            };
        }));
        console.log(typeDataArray)
        setTypeBarData(typeDataArray);
    };
    useEffect(() => {
        buildBarDataChart();
    }, [selectedMonthIndex, selectedYear]);
    const getTypeColor = (type) => {
        if (type === 'Ingresos') {
            return incomeTypeColor;
        } else if (type === 'Reservado') {
            return saveTypeColor;
        } else if (type === 'Uso de reservado') {
            return usageTypeColor;
        } else if (type === 'Gastos fijos') {
            return fixedTypeColor;
        } else if (type === 'Gastos ocasionales') {
            return ocassionalTypeColor;
        }
        return 'rgb(0, 0, 0)';
    };
    const dataBar = {
        labels: typeBarData[0]?.data.map((data) => `${data.day}`) || [],
        datasets: typeBarData.map((typeData) => ({
            label: typeData.label,
            data: typeData.data.map((data) => data.value),
            backgroundColor: typeData.backgroundColor,
        })),
    };

    const daTabarras = {
        labels: typeBarData[0]?.data.map((data) => `${data.day}`) || [],
        datasets: typeBarData.map((typeData, index) => ({
            label: typeNames[index],
            data: typeData.data.map((data) => data.value),
            backgroundColor: [getTypeColor(typeNames[index])],
            borderColor: [getTypeColor(typeNames[index])],
            tension: 0.2,
            pointRadius: 1,
        })),
    };

    return (
        <>
            {typeBarData.length > 0 ? (
                renderAsDataBar ? (
                    <Bar options={barOptions} data={dataBar} />
                ) : (
                    <Bar options={allDataBarOptions} data={daTabarras} />
                )
            ) : (
                <p>No hay datos en este mes.</p>
            )}
        </>
    );
};

export const AnualBarTypes = ({ dataFunctions, types, typeNames, selectedYear, renderAsDataBar }) => {
    const { store } = useContext(Context);
    const [typeBarData, setTypeBarData] = useState([]);
    const buildBarDataChart = async () => {
        const monthsArray = Array.from({ length: 12 }, (_, index) => index + 1);
        const typeDataArray = await Promise.all(dataFunctions.map(async (dataFunction, index) => {
            await loadData([dataFunction]);
            const filteredType = filterDataByYear(store[types[index]], selectedYear);
            const totalMonthlyType = calculateTypeMonthTotals(filteredType, typeNames[index]);
            return {
                label: typeNames[index],
                data: monthsArray.map((month) => totalMonthlyType.get(month) || { month, value: 0, type: `Sin datos` }),
                backgroundColor: getTypeColor(typeNames[index]),
            };
        }));
        console.log(typeDataArray)
        setTypeBarData(typeDataArray);
    };
    useEffect(() => {
        buildBarDataChart();
    }, [selectedYear]);
    const getTypeColor = (type) => {
        if (type === 'Ingresos') {
            return incomeTypeColor;
        } else if (type === 'Reservado') {
            return saveTypeColor;
        } else if (type === 'Uso de reservado') {
            return usageTypeColor;
        } else if (type === 'Gastos fijos') {
            return fixedTypeColor;
        } else if (type === 'Gastos ocasionales') {
            return ocassionalTypeColor;
        }
        return 'rgb(0, 0, 0)';
    };
    const dataBar = {
        labels: store.months,
        datasets: typeBarData.map((typeData) => ({
            label: typeData.label,
            data: typeData.data.map((data) => data.value),
            backgroundColor: typeData.backgroundColor,
        })),
    };

    const daTabarras = {
        labels: store.months,
        datasets: typeBarData.map((typeData, index) => ({
            label: typeNames[index],
            data: typeData.data.map((data) => data.value),
            backgroundColor: [getTypeColor(typeNames[index])],
            borderColor: [getTypeColor(typeNames[index])],
            tension: 0.2,
            pointRadius: 1,
        })),
    };

    return (
        <>
            {typeBarData.length > 0 ? (
                renderAsDataBar ? (
                    <Bar options={barOptions} data={dataBar} />
                ) : (
                    <Bar options={allDataBarOptions} data={daTabarras} />
                )
            ) : (
                <p>No hay datos en este mes.</p>
            )}
        </>
    );
};