import React, { useState, useEffect, useContext, Component } from "react";
import { MovementsListExpenses } from "../component/movementslistexpenses.jsx";
import { AddButton } from "../component/addbutton.jsx";
import { Collapse } from 'react-bootstrap';
import { Context } from "../store/appContext";

import { AnualExpensesTable } from "../component/graphics/expensesanualtable.jsx";
import { MonthlyExpensesTable } from "../component/graphics/expensesmonthlytable.jsx";

import { Bar, Pie, Line } from "react-chartjs-2";
import peggyConmo from "../../img/peggy-conmo.png";

import { ExpensesPieTypes } from "../component/graphics/expensespietypes.jsx";
import { ExpensesPieCategories } from "../component/graphics/expensespiecategories.jsx";
import { ExpensesAnualPieTypes } from "../component/graphics/expensesanualpietypes.jsx";
import { ExpensesAnualPieCategories } from "../component/graphics/expensesanualpiecategories.jsx";

export const Expenses = () => {

    const { store, actions } = useContext(Context);

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const todayDate = new Date();
    const currentMonthIndex = todayDate.getMonth();
    const nameCurrentMonth = months[currentMonthIndex];
    const currentYear = new Date().getFullYear();

    const calculatePreviousMonthIndex = (currentIndex) => (currentIndex - 1 + 12) % 12;
    const currentPreviousMonthIndex = calculatePreviousMonthIndex(currentMonthIndex);
    const namePreviousMonth = months[currentPreviousMonthIndex];


    const [previousMonth, setPreviousMonth] = useState(namePreviousMonth);

    const [selectedMonth, setSelectedMonth] = useState(nameCurrentMonth);

    const [selectedYear, setSelectedYear] = useState(currentYear);

    const [openMonthSelect, setOpenMonthSelect] = useState(false);
    
    const openMonthsDropdown = () => {
        setOpenMonthSelect(!openMonthSelect);
    };

    const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndex);

    const [previousMonthIndex, setPreviousMonthIndex] = useState(currentPreviousMonthIndex);
  
    const handleMonthSelect = (month, monthIndex) => {
        setSelectedMonth(month);
        setSelectedMonthIndex(monthIndex);
        const updatedPreviousMonthIndex = calculatePreviousMonthIndex(monthIndex);
        setPreviousMonth(months[updatedPreviousMonthIndex]);
        setPreviousMonthIndex(updatedPreviousMonthIndex);
        setIsOpen(false);
    }

    const filterDataByMonthYear = (data, selectedMonthIndex, selectedYear) => {
        return data.filter((item) => {
            const date = new Date(item.dateTime);
            return date.getMonth() === selectedMonthIndex && date.getFullYear() === selectedYear;
        });
    };

    const filterAllDataBeforeMonth = (data, month, year) => {
        return data.filter(item => {
            const itemDate = new Date(item.dateTime);
            const itemMonth = itemDate.getMonth();
            const itemYear = itemDate.getFullYear();
            return (itemYear < year || (itemYear === year && itemMonth <= month));
        });
    };

    const allPreviousMonthIncome = filterAllDataBeforeMonth(store.incomes, previousMonthIndex, selectedYear).reduce((total, income) => total + income.value, 0);
    const allPreviousMonthSave = filterAllDataBeforeMonth(store.saves, previousMonthIndex, selectedYear).reduce((total, save) => total + save.value, 0);
    const allPreviousMonthFixed = filterAllDataBeforeMonth(store.fixes, previousMonthIndex, selectedYear).reduce((total, fixed) => total + fixed.value, 0);
    const allPreviousMonthOcassional = filterAllDataBeforeMonth(store.ocassionals, previousMonthIndex, selectedYear).reduce((total, ocassional) => total + ocassional.value, 0);
    
    const previousMonthAmount = allPreviousMonthIncome - allPreviousMonthSave - allPreviousMonthFixed - allPreviousMonthOcassional;

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
        labels: fixedBarData.map((data) => `${data.day}`),
        datasets: [
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
                label: "Reservado",
                data: saveBarData.map((data) => data.value),
                backgroundColor: ["rgb(40, 124, 147)"],
                borderColor: ["rgb(40, 124, 147)"],
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
            const incomeMonth = new Date(income.dateTime).getMonth() + 1;
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
    
        const calculateAnualChartData = () => {
            let accumulatedNetValue = 0;
        
            const monthNames = store.months;
        
            const netDataArray = monthsArray.map((month) => {
                const incomeValue = incomeChartDataMap.get(month)?.value || 0;
                const saveValue = saveChartDataMap.get(month)?.value || 0;
                const fixedValue = fixedChartDataMap.get(month)?.value || 0;
                const ocassionalValue = ocassionalChartDataMap.get(month)?.value || 0;
        
                const netValue = incomeValue - saveValue - fixedValue - ocassionalValue;
                accumulatedNetValue += netValue;
        
                return {
                    month: monthNames[month - 1],
                    netValue: accumulatedNetValue,
                };
            });
        
            setChartAnualData(netDataArray);
        };
    
        calculateAnualChartData();
    };

    const dataAnualBar = {
        labels: chartAnualData.map((data) => `${data.month}`),
        datasets: [
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
                label: "Reservado",
                data: saveBarAnualData.map((data) => data.value),
                backgroundColor: ["rgb(40, 124, 147)"],
                borderColor: ["rgb(40, 124, 147)"],
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

    useEffect(() => {
        buildBarDataChart();
        buildBarAnualDataChart();
    }, [selectedMonthIndex, selectedYear]);

    const [openInfo, setOpenInfo] = useState(false);

    const handleToggle = () => {
      setOpenInfo(!open);
    };

    return (
        <>
            <div className="text-center text-white" id="left-background">
                <h1 className="header p-1 pb-2 pt-5 mt-5 mb-0">
                    Gastos <i className="icon fas fa-info-circle" onClick={handleToggle} ></i>
                </h1>
                <Collapse in={openInfo}>
                    <div className="texto-desplegable">
                        <h2>Aquí podrás encontrar el estado general de tus gastos:</h2>
                        <div className="description-text mt-4">
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reprehenderit maxime sunt praesentium dolores recusandae vitae ab unde quam neque, doloribus ducimus tenetur ad magnam ratione culpa voluptatum rem accusamus quas.</p>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque fugiat harum neque nostrum facere, incidunt commodi architecto et cum unde sed ab excepturi veritatis ex ut dolor accusamus deserunt rem?</p>
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
                                                <ExpensesPieTypes selectedMonth={selectedMonth} selectedMonthIndex={selectedMonthIndex} selectedYear={selectedYear} />
                                            </div>
                                        </div>
                                        <div className="col mx-3 text-center">
                                            <div className="row mt-2">
                                                <h4 className="mb-4">Categorías</h4>
                                                <ExpensesPieCategories selectedMonth={selectedMonth} selectedMonthIndex={selectedMonthIndex} selectedYear={selectedYear} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <div className="row">
                                        <h2 className="text-center pt-3 mt-1">Anual</h2>
                                        <div className="col mx-3 text-center">
                                            <div className="row mt-2">
                                                <h4 className="mb-4">Tipos</h4>
                                                <ExpensesAnualPieTypes selectedYear={selectedYear} />
                                            </div>
                                        </div>    
                                        <div className="col mx-3 text-center">
                                            <div className="row mt-2">
                                                <h4 className="mb-4">Categorías</h4>
                                                <ExpensesAnualPieCategories selectedYear={selectedYear} />
                                            </div>
                                        </div>
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
                        <Line options={optionsLinear} data={allDataBar} />
                    </div>
                    <div className="col text-center">
                        <Line options={optionsLinear} data={anualAllDataBar} />
                    </div>
                </div>


                
                <div className="row align-items-center justify-content-center m-5 mb-0" id="table-of-percentages">
                    <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mt-5 fs-1 fw-semibold">{selectedMonth}</h2>
                    <MonthlyExpensesTable selectedMonth={selectedMonth} selectedMonthIndex={selectedMonthIndex} selectedYear={selectedYear} previousMonth={previousMonth} previousMonthIndex={previousMonthIndex} previousMonthAmount={previousMonthAmount} />
                </div>
                <div className="row align-items-center justify-content-center m-5 mt-0 px-5" id="table-of-percentages">
                    <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mx-5 fs-1 fw-semibold">{selectedYear}</h2>
                    <AnualExpensesTable selectedYear={selectedYear} />
                </div>
                <MovementsListExpenses />
            </div>
            <AddButton />
        </>
    );
};