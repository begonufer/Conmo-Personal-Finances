import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Resume } from "../component/resume.jsx";
import { ResumeAnual } from "../component/resumeanual.jsx";
import { AddButton } from "../component/addbutton.jsx";
import { MovementsList } from "../component/movementslist.jsx";
import { Collapse } from 'react-bootstrap';


import { Bar, Pie, Line } from "react-chartjs-2";
import peggyConmo from "../../img/peggy-conmo.png";

import { MyConmoAnualPieTypes } from "../component/graphics/myconmoanualpietypes.jsx";
import { MyConmoAnualPieCategories } from "../component/graphics/myconmoanualpiecategories.jsx";

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


export const MyConmo = () => {

    const { store, actions } = useContext(Context);
    
    const todayDate = new Date();
    const currentMonthIndex = todayDate.getMonth();
    const nameCurrentMonth = store.months[currentMonthIndex];
    const currentYear = new Date().getFullYear();
    
    const calculatePreviousMonthIndex = (currentIndex) => (currentIndex - 1 + 12) % 12;
    const currentPreviousMonthIndex = calculatePreviousMonthIndex(currentMonthIndex);
    const currentPreviousMonthName = store.months[currentPreviousMonthIndex];
    
    const [selectedMonth, setSelectedMonth] = useState(nameCurrentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndex);
    const [previousMonth, setPreviousMonth] = useState(currentPreviousMonthName);
    const [previousMonthIndex, setPreviousMonthIndex] = useState(currentPreviousMonthIndex);
      
    const handleMonthSelect = (month, monthIndex) => {
        setSelectedMonth(month);
        setSelectedMonthIndex(monthIndex);
        const updatedPreviousMonthIndex = calculatePreviousMonthIndex(monthIndex);
        setPreviousMonth(store.months[updatedPreviousMonthIndex]);
        setPreviousMonthIndex(updatedPreviousMonthIndex);
        setOpenMonthSelect(false);
    }
    
    const [openMonthSelect, setOpenMonthSelect] = useState(false);
    
    const openMonthsDropdown = () => {
        setOpenMonthSelect(!openMonthSelect);
    };

    const filterDataByMonthYear = (data, selectedMonthIndex, selectedYear) => {
        return data.filter((item) => {
            const date = new Date(item.dateTime);
            return date.getMonth() === selectedMonthIndex && date.getFullYear() === selectedYear;
        });
    };

    const filterAllDataPreviousMonth = (data, month, year) => {
        return data.filter(item => {
            const itemDate = new Date(item.dateTime);
            const itemMonth = itemDate.getMonth();
            const itemYear = itemDate.getFullYear();
            return (itemYear < year || (itemYear === year && itemMonth <= month));
        });
    };

    const allPreviousMonthIncome = filterAllDataPreviousMonth(store.incomes, previousMonthIndex, selectedYear).reduce((total, income) => total + income.value, 0);
    const allPreviousMonthSave = filterAllDataPreviousMonth(store.saves, previousMonthIndex, selectedYear).reduce((total, save) => total + save.value, 0);
    const allPreviousMonthFixed = filterAllDataPreviousMonth(store.fixes, previousMonthIndex, selectedYear).reduce((total, fixed) => total + fixed.value, 0);
    const allPreviousMonthOcassional = filterAllDataPreviousMonth(store.ocassionals, previousMonthIndex, selectedYear).reduce((total, ocassional) => total + ocassional.value, 0);
    
    const previousMonthAmount = allPreviousMonthIncome - allPreviousMonthSave - allPreviousMonthFixed - allPreviousMonthOcassional;

    const calculateTotal = (filteredData) => {
        return filteredData.reduce((total, item) => {
            return total + item.value;
        }, 0);
    };

    const [typesTotals, setTypesTotals] = useState({});
    
    const setTypesData = async () => {
        await actions.getSaves();
        await actions.getFixes();
        await actions.getOcassionals();
    
        const filteredSave = filterDataByMonthYear(store.saves, selectedMonthIndex, selectedYear);
        const filteredFixed = filterDataByMonthYear(store.fixes, selectedMonthIndex, selectedYear);
        const filteredOcassional = filterDataByMonthYear(store.ocassionals, selectedMonthIndex, selectedYear);
    
        const saveTotals = calculateTotal(filteredSave);
        const fixedTotals = calculateTotal(filteredFixed);
        const ocassionalTotals = calculateTotal(filteredOcassional);
    
        setTypesTotals({
            "Reservado": saveTotals,
            "Gastos fijos": fixedTotals,
            "Gastos variables": ocassionalTotals,
        });
    };

    const buildCategoryColorTotals = (filteredData, categoryKey, colors, categoryType) => {
        const categoryColorTotals = {};

        filteredData.forEach(({ value, [categoryKey]: category }, index) => {
            const categoryName = category.name;
            categoryColorTotals[categoryName] = {
                value: (categoryColorTotals[categoryName]?.value || 0) + value,
                color: colors[index % colors.length],
                type: categoryType,
            };
        });

        return categoryColorTotals;
    };

    const mergeCategoryTotals = (categoryTotalsObject) => {
        const mergedTotals = {};

        Object.keys(categoryTotalsObject).forEach((categoryKey) => {
            const categoryTotals = categoryTotalsObject[categoryKey];

            Object.keys(categoryTotals).forEach((name) => {
                if (!mergedTotals[name]) {
                    mergedTotals[name] = { value: 0, color: '', type:'' };
                }

                mergedTotals[name].value += categoryTotals[name].value;
                if (categoryTotals[name].color && !mergedTotals[name].color) {
                    mergedTotals[name].color = categoryTotals[name].color;
                }

                if (categoryTotals[name].type && !mergedTotals[name].type) {
                    mergedTotals[name].type = categoryTotals[name].type;
                }
            });
        });

        return mergedTotals;
    };

    const [categoryTotals, setCategoryTotals] = useState({});
    
    const buildCategoryTotals = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getFixes();
        await actions.getOcassionals();
    
        const filteredIncomes = filterDataByMonthYear(store.incomes, selectedMonthIndex, selectedYear);
        const filteredSave = filterDataByMonthYear(store.saves, selectedMonthIndex, selectedYear);
        const filteredFixed = filterDataByMonthYear(store.fixes, selectedMonthIndex, selectedYear);
        const filteredOcassional = filterDataByMonthYear(store.ocassionals, selectedMonthIndex, selectedYear);
    
        const incomesColors = ["rgb(207, 193, 44)", "rgb(188, 207, 44)", "rgb(138, 181, 63)", "rgb(40, 124, 147)", "rgb(29, 174, 159)", "rgb(29, 180, 122)"];
        const savesColors = [
            "rgb(62, 229, 237)",
            "rgb(13, 180, 186)",
            "rgb(7, 128, 139)",
            "rgb(27, 100, 113)",
            "rgb(27, 113, 113)",
            "rgb(6, 151, 156)",
            "rgb(64, 170, 184)",
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
    
        const incomesTotals = buildCategoryColorTotals(filteredIncomes, 'incomecategory', incomesColors, 'income');
        const saveTotals = buildCategoryColorTotals(filteredSave, 'category', savesColors, 'save');
        const fixedTotals = buildCategoryColorTotals(filteredFixed, 'fixedcategory', fixedColors, 'fixed');
        const ocassionalTotals = buildCategoryColorTotals(filteredOcassional, 'ocassionalcategory', ocassionalColors, 'ocassional');
    
        return { income: incomesTotals, save: saveTotals, fixed: fixedTotals, ocassional: ocassionalTotals };
    };

    const buildChartData = async () => {

        const categoryTotals = await buildCategoryTotals();
    
        delete categoryTotals.income;
    
        const mergedTotals = mergeCategoryTotals(categoryTotals);
    
        return setCategoryTotals(mergedTotals);

    };
    
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

    const sumValuesByType = (categoryTotals) => {
        return Object.values(categoryTotals).reduce((acc, item) => {
            acc[item.type] = (acc[item.type] || 0) + item.value;
            return acc;
        }, {});
    };
    
    const summedValues = sumValuesByType(categoryTotals);
    
    const dataForTypes = {
        labels: ["Reservado", "Gastos fijos", "Gastos ocasionales"],
        datasets: [
            {
                data: Object.values(summedValues),
                backgroundColor:[
                    "rgb(27, 100, 113)",
                    "rgb(156, 13, 80)",
                    "rgb(138, 181, 63)",
                ],
                borderWidth: 0,
            },
        ],
    };
  
    const pieOptions = {
        plugins: {
            legend: {
                display: false,
            }
        },
    };

    const barOptions = {
        plugins: {
            legend: {
                display: false,
            }
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 10,
                    },
                },
            },
            y: {
                stacked: true,
                display: false,
                grid: {
                    display: false, 
                },
            },
        },
    };

    const allDataBarOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                margin: 20,
                display: true,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 11, 
                    },
                    padding: 20,
                },
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: false,
                ticks: {
                    font: {
                        size: 10,
                    },
                },
            },
            y: {
                stacked: false,
                display: false,
                grid: {
                    display: false,
                },
            },
        },
    };

    const optionsLinear = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                margin: 20,
                display: true,
                labels: {
                    usePointStyle: true, 
                    pointStyle: 'circle',
                    font: {
                        size: 11,
                    },
                    padding: 20,
                },
            },
        },
        scales: {
            x: {
                stacked: false,
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 10,
                    },
                },
            },
            y: {
                stacked: false,
                display: false,
                grid: {
                    display: false,
                },
            },
        },
    };
    

    const optionsBalanceLinear = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                margin: 20,
                display: true,
                labels: {
                    usePointStyle: true, 
                    pointStyle: 'circle', 
                    font: {
                        size: 11, 
                    },
                    padding: 20,
                },
            },
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 10,
                    },
                },
            },
            y: {
                stacked: true,
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    callback: function (value) {
                        return value === 0 ? value : '';
                    },
                },
            },
        },
    };

    const [incomeBarData, setIncomeBarData] = useState([]);
    const [saveBarData, setSaveBarData] = useState([]);
    const [fixedBarData, setFixedBarData] = useState([]);
    const [ocassionalBarData, setOcassionalBarData] = useState([]);
    
    const [chartData, setChartData] = useState([]);

    const buildBarDataChart = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getFixes();
        await actions.getOcassionals();
    
        const daysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
        const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);
    
        const filteredIncome = store.incomes.filter((data) => {
            const date = new Date(data.dateTime);
            return date.getMonth() === selectedMonthIndex && date.getFullYear() === selectedYear;
        });
    
        const filteredSave = store.saves.filter((data) => {
            const date = new Date(data.dateTime);
            return date.getMonth() === selectedMonthIndex && date.getFullYear() === selectedYear;
        });

        const filteredFixed = store.fixes.filter((data) => {
            const date = new Date(data.dateTime);
            return date.getMonth() === selectedMonthIndex && date.getFullYear() === selectedYear;
        });

        const filteredOcassional = store.ocassionals.filter((data) => {
            const date = new Date(data.dateTime);
            return date.getMonth() === selectedMonthIndex && date.getFullYear() === selectedYear;
        });
    
        const incomeChartDataMap = new Map();
        const saveChartDataMap = new Map();
        const fixedChartDataMap = new Map();
        const ocassionalChartDataMap = new Map();
    
        filteredIncome.forEach((income) => {
            const incomeDay = new Date(income.dateTime).getDate();
            const existingData = incomeChartDataMap.get(incomeDay) || { value: 0, category: 'Sin ingresos' };
            
            incomeChartDataMap.set(incomeDay, {
                day: incomeDay,
                value: existingData.value + income.value,
                category: income.incomecategory.name,
            });
        });

        filteredSave.forEach((save) => {
            const saveDay = new Date(save.dateTime).getDate();
            const existingData = saveChartDataMap.get(saveDay) || { value: 0, category: 'Sin reservas' };
            
            saveChartDataMap.set(saveDay, {
                day: saveDay,
                value: existingData.value + save.value,
                category: save.category.name,
            });
        });

        filteredFixed.forEach((fixed) => {
            const fixedDay = new Date(fixed.dateTime).getDate();
            const existingData = fixedChartDataMap.get(fixedDay) || { value: 0, category: 'Sin gastos fijos' };
            
            fixedChartDataMap.set(fixedDay, {
                day: fixedDay,
                value: existingData.value + fixed.value,
                category: fixed.fixedcategory.name,
            });
        });

        filteredOcassional.forEach((ocassional) => {
            const ocassionalDay = new Date(ocassional.dateTime).getDate();
            const existingData = ocassionalChartDataMap.get(ocassionalDay) || { value: 0, category: 'Sin gastos variables' };
            
            ocassionalChartDataMap.set(ocassionalDay, {
                day: ocassionalDay,
                value: existingData.value + ocassional.value,
                category: ocassional.ocassionalcategory.name,
            });
        });
        
        const incomeDataArray = daysArray.map((day) => incomeChartDataMap.get(day) || { day, value: 0, category: 'Sin ingresos' });
        const saveDataArray = daysArray.map((day) => saveChartDataMap.get(day) || { day, value: 0, category: 'Sin reservas' });
        const fixedDataArray = daysArray.map((day) => fixedChartDataMap.get(day) || { day, value: 0, category: 'Sin gastos fijos' });
        const ocassionalDataArray = daysArray.map((day) => ocassionalChartDataMap.get(day) || { day, value: 0, category: 'Sin gastos variables' });

        setIncomeBarData(incomeDataArray);
        setSaveBarData(saveDataArray);
        setFixedBarData(fixedDataArray);
        setOcassionalBarData(ocassionalDataArray);

        const calculateChartData = () => {
            let accumulatedNetValue = 0;
        
            const netDataArray = daysArray.map((day) => {
                const incomeValue = incomeChartDataMap.get(day)?.value || 0;
                const saveValue = saveChartDataMap.get(day)?.value || 0;
                const fixedValue = fixedChartDataMap.get(day)?.value || 0;
                const ocassionalValue = ocassionalChartDataMap.get(day)?.value || 0;
        
                const netValue = incomeValue - saveValue - fixedValue - ocassionalValue;
                accumulatedNetValue += netValue;
        
                return {
                    day,
                    netValue: accumulatedNetValue,
                };
            });
        
            setChartData(netDataArray);
        };

        calculateChartData();
    };

    const dataBar = {
        labels: incomeBarData.map((data) => `${data.day}`),
        datasets: [
            {
                label: "Reservado",
                data: saveBarData.map((data) => data.value),
                backgroundColor: ["rgb(27, 100, 113)"],
            },
            {
                label: "Gastos fijos",
                data: fixedBarData.map((data) => data.value),
                backgroundColor: ["rgb(147, 40, 90)"],
            },
            {
                label: "Gastos variables",
                data: ocassionalBarData.map((data) => data.value),
                backgroundColor: ["rgb(138, 181, 63)"],
            },
        ],
    };

    const allDataBar = {
        labels: incomeBarData.map((data) => `${data.day}`),
        datasets: [
            {
                label: "Ingresos",
                data: incomeBarData.map((data) => data.value),
                backgroundColor: ["rgb(207, 193, 44)"],
                borderColor: ["rgb(207, 193, 44)"],
                tension: 0.2,
                pointRadius: 1,
            },
            {
                label: "Reservado",
                data: saveBarData.map((data) => data.value),
                backgroundColor: ["rgb(27, 100, 113)"],
                borderColor: ["rgb(27, 100, 113)"],
                tension: 0.2,
                pointRadius: 1,
            },
            {
                label: "Gastos fijos",
                data: fixedBarData.map((data) => data.value),
                backgroundColor: ["rgb(147, 40, 90)"],
                borderColor: ["rgb(147, 40, 90)"],
                tension: 0.2,
                pointRadius: 1,
            },
            {
                label: "Gastos variables",
                data: ocassionalBarData.map((data) => data.value),
                backgroundColor: ["rgb(138, 181, 63)"],
                borderColor: ["rgb(138, 181, 63)"],
                tension: 0.2,
                pointRadius: 1,
            },
        ],
    };
    const chartDataBar = {
        labels: chartData.map((data) => `${data.day}`),
        datasets: [
            {
                label: "Balance",
                data: chartData.map((data) => data.netValue),
                fill: false,
                backgroundColor: ["rgb(142, 137, 134)"],
                borderColor: ["rgb(142, 137, 134)"],
                pointRadius: 1,
            },
        ],
    };

    const [openInfo, setOpenInfo] = useState(false);
    const moreInfo = () => {
        setOpenInfo(!openInfo);
    };


    const [incomeBarAnualData, setIncomeBarAnualData] = useState([]);
    const [saveBarAnualData, setSaveBarAnualData] = useState([]);
    const [fixedBarAnualData, setFixedBarAnualData] = useState([]);
    const [ocassionalBarAnualData, setOcassionalBarAnualData] = useState([]);
    const [chartAnualData, setChartAnualData] = useState([]);
    
    const buildBarAnualDataChart = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getFixes();
        await actions.getOcassionals();
    
        const filteredIncome = store.incomes.filter((data) => {
            const date = new Date(data.dateTime);
            return date.getFullYear() === selectedYear;
        });
    
        const filteredSave = store.saves.filter((data) => {
            const date = new Date(data.dateTime);
            return date.getFullYear() === selectedYear;
        });
    
        const filteredFixed = store.fixes.filter((data) => {
            const date = new Date(data.dateTime);
            return date.getFullYear() === selectedYear;
        });
    
        const filteredOcassional = store.ocassionals.filter((data) => {
            const date = new Date(data.dateTime);
            return date.getFullYear() === selectedYear;
        });
    
        const monthsArray = Array.from({ length: 12 }, (_, index) => index + 1);
    
        const incomeChartDataMap = new Map();
        const saveChartDataMap = new Map();
        const fixedChartDataMap = new Map();
        const ocassionalChartDataMap = new Map();
    
        filteredIncome.forEach((income) => {
            const incomeMonth = new Date(income.dateTime).getMonth() + 1; // Months are zero-based
            const existingData = incomeChartDataMap.get(incomeMonth) || { value: 0, category: 'Sin ingresos' };
    
            incomeChartDataMap.set(incomeMonth, {
                month: incomeMonth,
                value: existingData.value + income.value,
                category: income.incomecategory.name,
            });
        });
    
        filteredSave.forEach((save) => {
            const saveMonth = new Date(save.dateTime).getMonth() + 1;
            const existingData = saveChartDataMap.get(saveMonth) || { value: 0, category: 'Sin reservas' };
    
            saveChartDataMap.set(saveMonth, {
                month: saveMonth,
                value: existingData.value + save.value,
                category: save.category.name,
            });
        });
    
        filteredFixed.forEach((fixed) => {
            const fixedMonth = new Date(fixed.dateTime).getMonth() + 1;
            const existingData = fixedChartDataMap.get(fixedMonth) || { value: 0, category: 'Sin gastos fijos' };
    
            fixedChartDataMap.set(fixedMonth, {
                month: fixedMonth,
                value: existingData.value + fixed.value,
                category: fixed.fixedcategory.name,
            });
        });
    
        filteredOcassional.forEach((ocassional) => {
            const ocassionalMonth = new Date(ocassional.dateTime).getMonth() + 1;
            const existingData = ocassionalChartDataMap.get(ocassionalMonth) || { value: 0, category: 'Sin gastos variables' };
    
            ocassionalChartDataMap.set(ocassionalMonth, {
                month: ocassionalMonth,
                value: existingData.value + ocassional.value,
                category: ocassional.ocassionalcategory.name,
            });
        });
    
        const incomeDataArray = monthsArray.map((month) => incomeChartDataMap.get(month) || { month, value: 0, category: 'Sin ingresos' });
        const saveDataArray = monthsArray.map((month) => saveChartDataMap.get(month) || { month, value: 0, category: 'Sin reservas' });
        const fixedDataArray = monthsArray.map((month) => fixedChartDataMap.get(month) || { month, value: 0, category: 'Sin gastos fijos' });
        const ocassionalDataArray = monthsArray.map((month) => ocassionalChartDataMap.get(month) || { month, value: 0, category: 'Sin gastos variables' });
    
        setIncomeBarAnualData(incomeDataArray);
        setSaveBarAnualData(saveDataArray);
        setFixedBarAnualData(fixedDataArray);
        setOcassionalBarAnualData(ocassionalDataArray);
    
        const calculateChartData = () => {
            let accumulatedNetValue = 0;
        
            const monthNames = store.months; // Asumiendo que store.months contiene los nombres de los meses
        
            const netDataArray = monthsArray.map((month) => {
                const incomeValue = incomeChartDataMap.get(month)?.value || 0;
                const saveValue = saveChartDataMap.get(month)?.value || 0;
                const fixedValue = fixedChartDataMap.get(month)?.value || 0;
                const ocassionalValue = ocassionalChartDataMap.get(month)?.value || 0;
        
                const netValue = incomeValue - saveValue - fixedValue - ocassionalValue;
                accumulatedNetValue += netValue;
        
                return {
                    month: monthNames[month - 1], // Restamos 1 porque los meses son cero indexados
                    netValue: accumulatedNetValue,
                };
            });
        
            setChartAnualData(netDataArray);
        };
    
        calculateChartData();
    };

    const dataAnualBar = {
        labels: chartAnualData.map((data) => `${data.month}`),
        datasets: [
            {
                label: "Reservado",
                data: saveBarAnualData.map((data) => data.value),
                backgroundColor: ["rgb(27, 100, 113)"],
            },
            {
                label: "Gastos fijos",
                data: fixedBarAnualData.map((data) => data.value),
                backgroundColor: ["rgb(147, 40, 90)"],
            },
            {
                label: "Gastos variables",
                data: ocassionalBarAnualData.map((data) => data.value),
                backgroundColor: ["rgb(138, 181, 63)"],
            },
        ],
    };

    const anualAllDataBar = {
        labels: chartAnualData.map((data) => `${data.month}`),
        datasets: [
            {
                label: "Ingresos",
                data: incomeBarAnualData.map((data) => data.value),
                backgroundColor: ["rgb(207, 193, 44)"],
                borderColor: ["rgb(207, 193, 44)"],
                tension: 0.2,
                pointRadius: 1,
            },
            {
                label: "Reservado",
                data: saveBarAnualData.map((data) => data.value),
                backgroundColor: ["rgb(27, 100, 113)"],
                borderColor: ["rgb(27, 100, 113)"],
                tension: 0.2,
                pointRadius: 1,
            },
            {
                label: "Gastos fijos",
                data: fixedBarAnualData.map((data) => data.value),
                backgroundColor: ["rgb(147, 40, 90)"],
                borderColor: ["rgb(147, 40, 90)"],
                tension: 0.2,
                pointRadius: 1,
            },
            {
                label: "Gastos variables",
                data: ocassionalBarAnualData.map((data) => data.value),
                backgroundColor: ["rgb(138, 181, 63)"],
                borderColor: ["rgb(138, 181, 63)"],
                tension: 0.2,
                pointRadius: 1,
            },
        ],
    };
    const anualChartDataBar = {
        labels: chartAnualData.map((data) => `${data.month}`),
        datasets: [
            {
                label: "Balance",
                data: chartAnualData.map((data) => data.netValue),
                fill: false,
                backgroundColor: ["rgb(142, 137, 134)"],
                borderColor: ["rgb(142, 137, 134)"],
                pointRadius: 1,
            },
        ],
    };

    useEffect(() => {
        buildChartData();
        buildBarDataChart();
        buildBarAnualDataChart();
        setTypesData();
    }, [selectedMonthIndex, selectedYear]);

    return (
        <>
            <div className="text-center text-white" id="left-background">
                <h1 className="header p-1 pb-2 pt-5 mt-5 mb-0">
                    Mi<span className="conmo"> CONMO</span> <i className="icon fas fa-info-circle" onClick={moreInfo} ></i>
                </h1>
                <Collapse in={openInfo}>
                    <div className="texto-desplegable">
                        <h2>Aquí podrás encontrar el estado general de tus finanzas:</h2>
                        <div className="description-text mt-4">
                            <ul>
                                <li> Cuánta parte de tus ingresos destinas a cada tipo de gasto o a cada categoría. </li>
                                <li> Qué días del mes, o meses del año, has gastado más y en qué categorías. </li>
                                <li> Balance general de tus ingresos a lo largo del mes y del año. </li>
                                <li> En la tabla resumen podrás encontrar los datos de todas las categorías y tipos, desgranados. </li>
                                <li> Tendrás una idea general de la media que sueles destinar a cada uno de los apartados para que puedas gestionar tus finanzas de manera óptima, acorde con tus necesidades y objetivos. </li>
                                <li> Por último encontrarás el listado de todos tus movimientos, el cual podrás descargar a tu correo electrónico si lo deseas. </li>
                            </ul>
                        </div>
                    </div>
                </Collapse>
            </div>
            <div className="d-block w-100 h-100 align-items-center">
                <div className="custom-dropdown my-4">
                    <div className="dropdown-header" onClick={openMonthsDropdown}>
                        <h1 className="drop-title pt-1">
                            {selectedMonth} <span className={`dropdown-arrow ${openMonthSelect ? 'open' : ''}`}><i className="fas fa-chevron-down"></i></span> 
                            <input
                                type="number"
                                min="2000" 
                                max={currentYear}
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                                className="year-selector mx-4"
                            />
                        </h1>
                    </div>
                    {openMonthSelect && (
                        <div className="dropdown-content">
                            {store.months.map((month, index) => (
                                <div
                                    key={index}
                                    className="dropdown-item"
                                    onClick={() => handleMonthSelect(month, index)}
                                    >
                                    {month}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="row justify-content-center align-items-center mx-5">
                    <div className="col-4 text-center align-self-center">
                        <img src={peggyConmo} className="w-100" alt="Conmo" />
                    </div>
                    <div className="col">
                        <div id="pieCarousel" className="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-interval="false">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="row">
                                        <h2 className="text-center pt-3 mt-1">Mensual</h2>
                                        <div className="col mx-3 text-center">
                                            <div className="row mt-2">
                                                <h4 className="mb-4">Tipos</h4>
                                                {Object.keys(typesTotals).length > 0 ? (
                                                    <>
                                                        <Pie data={dataForTypes} options={pieOptions} />
                                                    </>
                                                    ) : (
                                                <p>No hay datos en este mes.</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col mx-3 text-center">
                                            <div className="row mt-2">
                                                <h4 className="mb-4">Categorías</h4>
                                                {Object.keys(categoryTotals).length > 0 ? (
                                                    <>
                                                        <Pie data={data} options={pieOptions} />
                                                    </>
                                                ) : (
                                                    <p>No hay datos en este mes.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <div className="row">
                                        <h2 className="text-center pt-3 mt-1">Anual</h2>
                                        <MyConmoAnualPieTypes selectedYear={selectedYear} />
                                        <MyConmoAnualPieCategories selectedYear={selectedYear} />
                                    </div>
                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#pieCarousel" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Anterior</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#pieCarousel" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Siguiente</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row text-center justify-content-center align-items-bottom py-5 mt-3 px-5 mx-5 gap-5">
                    <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 bg-body-tertiary fs-1 fw-semibold">Categorías</h2>
                    <div className="col text-center">
                        {Object.keys(incomeBarData||saveBarData||fixedBarData||ocassionalBarData).length > 0 ? (
                            <>
                                <Bar options={barOptions} data={dataBar} />
                            </>
                            ) : (
                            <p>No hay datos en este mes.</p>
                        )}
                    </div>
                    <div className="col text-center">
                        {Object.keys(incomeBarAnualData||saveBarAnualData||fixedBarAnualData||ocassionalBarAnualData).length > 0 ? (
                            <>
                                <Bar options={barOptions} data={dataAnualBar} />
                            </>
                            ) : (
                            <p>No hay datos en este mes.</p>
                        )}
                    </div>
                </div>
                <div className="row text-center justify-content-center align-items-bottom py-5 mt-3 px-5 mx-5 gap-5">
                    <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 bg-body-tertiary fs-1 fw-semibold">Tipos</h2>
                    <div className="col text-center">
                        <Bar options={allDataBarOptions} data={allDataBar} />
                    </div>
                    <div className="col text-center">
                        <Bar options={allDataBarOptions} data={anualAllDataBar} />
                    </div>
                </div>
                <div className="row text-center justify-content-center align-items-bottom py-5 mt-3 px-5 mx-5 gap-5">
                    <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 bg-body-tertiary fs-1 fw-semibold">Evolución</h2>
                    <div className="col text-center">
                        <Line options={optionsLinear} data={allDataBar} />
                    </div>
                   <div className="col text-center">
                       <Line options={optionsLinear} data={anualAllDataBar} />
                   </div>
               </div>
               <div className="row text-center justify-content-center align-items-bottom py-5 mt-3 px-5 mx-5 gap-5">
                    <div className="col text-center">
                       <Line options={optionsBalanceLinear} data={chartDataBar} />  
                   </div>
                   <div className="col text-center">
                       <Line options={optionsBalanceLinear} data={anualChartDataBar} />  
                   </div>
               </div>
            </div>
            <div className="row gap-5 m-5 mb-0" id="table-of-percentages">
                <Resume selectedMonth={selectedMonth} selectedMonthIndex={selectedMonthIndex} selectedYear={selectedYear} previousMonth={previousMonth} previousMonthIndex={previousMonthIndex} previousMonthAmount={previousMonthAmount} />
                <ResumeAnual selectedYear={selectedYear} />
            </div>
            <MovementsList />
            <AddButton />
        </>
    );
};
