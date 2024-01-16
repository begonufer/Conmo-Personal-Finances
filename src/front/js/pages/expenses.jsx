import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { incomeColors, savesColors, usageColors, fixedColors, ocassionalColors, usageTypeColor, fixedTypeColor, ocassionalTypeColor } from "../pages/typescolors.jsx";
import { MovementsListExpenses } from "../component/movementslistexpenses.jsx";
import { AddButton } from "../component/addbutton.jsx";
import peggyConmo from "../../img/peggy-conmo.png";
import { Selector } from "../component/graphics/dateselector.jsx";
import { Header } from "../component/header.jsx";
import { AnualExpensesTable } from "../component/graphics/expensesanualtable.jsx";
import { MonthlyExpensesTable } from "../component/graphics/expensesmonthlytable.jsx";
import {
    useMonthSelection,
    filterDataByMonthYear,
    filterAllDataBeforeMonth,
    loadData,
    calculateCategoryDayTotals,
    filterDataByYear,
    calculateCategoryMonthTotals,
    setCategoryDailyData,
    useCategoryDailyAccumulated
} from './utils.jsx';

import { MonthlyPie, MonthlyPieTypes, AnualPie, AnualPieTypes } from "../component/PieCharts.jsx";
import { MonthlyBarTypes, AnualBarTypes } from "../component/BarCharts.jsx";
import { MonthlyLineTypes, AnualLineTypes } from "../component/LineCharts.jsx";

export const Expenses = () => {

    const { store, actions } = useContext(Context);
    // const [incomeBarData, setIncomeBarData] = useState([]);
    // const [saveBarData, setSaveBarData] = useState([]);
    // const [usageBarData, setUsageBarData] = useState([]);
    // const [fixedBarData, setFixedBarData] = useState([]);
    // const [ocassionalBarData, setOcassionalBarData] = useState([]);
    
    // const [chartData, setChartData] = useState([]);

    // const [incomeBarAnualData, setIncomeBarAnualData] = useState([]);
    // const [saveBarAnualData, setSaveBarAnualData] = useState([]);
    // const [usageBarAnualData, setUsageBarAnualData] = useState([]);
    // const [fixedBarAnualData, setFixedBarAnualData] = useState([]);
    // const [ocassionalBarAnualData, setOcassionalBarAnualData] = useState([]);
    // const [chartAnualData, setChartAnualData] = useState([]);
    
    // const buildBarAnualDataChart = async () => {
    //     await actions.getIncomes();
    //     await actions.getSaves();
    //     await actions.getUsage();
    //     await actions.getFixes();
    //     await actions.getOcassionals();
    
    //     const filteredIncome = filterDataByYear(store.incomes, selectedYear);
    //     const filteredSave = filterDataByYear(store.saves, selectedYear);        
    //     const filteredUsage = filterDataByYear(store.usages, selectedYear);
    //     const filteredFixed = filterDataByYear(store.fixes, selectedYear);
    //     const filteredOcassional = filterDataByYear(store.ocassionals, selectedYear);
    
    //     const monthsArray = Array.from({ length: 12 }, (_, index) => index + 1);
    
    //     const incomeTotalCategoryMonthly = calculateCategoryMonthTotals(filteredIncome, 'incomecategory');
    //     const saveTotalCategoryMonthly = calculateCategoryMonthTotals(filteredSave, 'category');
    //     const usageTotalCategoryMonthly = calculateCategoryMonthTotals(filteredUsage, 'category');
    //     const fixedTotalCategoryMonthly = calculateCategoryMonthTotals(filteredFixed, 'fixedcategory');
    //     const ocassionalTotalCategoryMonthly = calculateCategoryMonthTotals(filteredOcassional, 'ocassionalcategory');
    
    //     const incomeDataArray = monthsArray.map((month) => incomeTotalCategoryMonthly.get(month) || { month, value: 0, category: 'Sin ingresos' });
    //     const saveDataArray = monthsArray.map((month) => saveTotalCategoryMonthly.get(month) || { month, value: 0, category: 'Sin reservas' });
    //     const usageDataArray = monthsArray.map((month) => usageTotalCategoryMonthly.get(month) || { month, value: 0, category: 'Sin gastos de reservas' });
    //     const fixedDataArray = monthsArray.map((month) => fixedTotalCategoryMonthly.get(month) || { month, value: 0, category: 'Sin gastos fijos' });
    //     const ocassionalDataArray = monthsArray.map((month) => ocassionalTotalCategoryMonthly.get(month) || { month, value: 0, category: 'Sin gastos ocasionales' });
    
    //     setIncomeBarAnualData(incomeDataArray);
    //     setSaveBarAnualData(saveDataArray);
    //     setUsageBarAnualData(usageDataArray);
    //     setFixedBarAnualData(fixedDataArray);
    //     setOcassionalBarAnualData(ocassionalDataArray);
    
    //     const calculateAnualChartData = () => {
    //         let accumulatedNetValue = 0;
        
    //         const monthNames = store.months;
        
    //         const netDataArray = monthsArray.map((month) => {
    //             const incomeValue = incomeTotalCategoryMonthly.get(month)?.value || 0;
    //             const saveValue = saveTotalCategoryMonthly.get(month)?.value || 0;
    //             const usageValue = usageTotalCategoryMonthly.get(month)?.value || 0;
    //             const fixedValue = fixedTotalCategoryMonthly.get(month)?.value || 0;
    //             const ocassionalValue = ocassionalTotalCategoryMonthly.get(month)?.value || 0;
        
    //             const netValue = incomeValue - saveValue - usageValue - fixedValue - ocassionalValue;
    //             accumulatedNetValue += netValue;
        
    //             return {
    //                 month: monthNames[month - 1],
    //                 netValue: accumulatedNetValue,
    //             };
    //         });
        
    //         setChartAnualData(netDataArray);
    //     };
    
    //     calculateAnualChartData();
    // };

    // const dataAnualBar = {
    //     labels: chartAnualData.map((data) => `${data.month}`),
    //     datasets: [
    //         {
    //             label: "Uso de reservado",
    //             data: usageBarAnualData.map((data) => data.value),
    //             backgroundColor: ["rgb(34, 147, 199)"],
    //         },
    //         {
    //             label: "Gastos fijos",
    //             data: fixedBarAnualData.map((data) => data.value),
    //             backgroundColor: ["rgb(147, 40, 90)"],
    //         },
    //         {
    //             label: "Gastos ocasionales",
    //             data: ocassionalBarAnualData.map((data) => data.value),
    //             backgroundColor: ["rgb(138, 181, 63)"],
    //         },
    //     ],
    // };

    // const anualAllDataBar = {
    //     labels: chartAnualData.map((data) => `${data.month}`),
    //     datasets: [
    //         {
    //             label: "Uso de reservado",
    //             data: usageBarAnualData.map((data) => data.value),
    //             backgroundColor: ["rgb(34, 147, 199)"],
    //             borderColor: ["rgb(34, 147, 199)"],
    //             tension: 0.2,
    //             pointRadius: 1,
    //         },
    //         {
    //             label: "Gastos fijos",
    //             data: fixedBarAnualData.map((data) => data.value),
    //             backgroundColor: ["rgb(147, 40, 90)"],
    //             borderColor: ["rgb(147, 40, 90)"],
    //             tension: 0.2,
    //             pointRadius: 1,
    //         },
    //         {
    //             label: "Gastos ocasionales",
    //             data: ocassionalBarAnualData.map((data) => data.value),
    //             backgroundColor: ["rgb(138, 181, 63)"],
    //             borderColor: ["rgb(138, 181, 63)"],
    //             tension: 0.2,
    //             pointRadius: 1,
    //         },
    //     ],
    // };

    // useEffect(() => {
    //     buildBarAnualDataChart();
    // }, [selectedMonthIndex, selectedYear]);

    const {
        todayDate,
        currentMonthIndex,
        nameCurrentMonth,
        calculatePreviousMonthIndex,
        previousMonthIndex,
        currentPreviousMonthName,
        currentPreviousMonthIndex,
        currentYear,
        previousMonth,
        selectedMonth,
        selectedYear,
        setSelectedYear,
        openMonthSelect,
        selectedMonthIndex,
        openMonthsDropdown,
        handleMonthSelect
    } = useMonthSelection();

    const descriptionText = (
        <div className="texto-desplegable">
            <h3>Estado general de tus gastos.</h3>
            <div className="description-text">
                <p>Comparando gastos fijos, ocasionales y gasto realizado sobre las reservas</p>
            </div>
        </div>
    );
    
    const header = 'Gastos';

    return (
        <>
            <Header
                type={header}
                descriptionText={descriptionText}
            />
            <Selector
                openMonthsDropdown={openMonthsDropdown}
                selectedMonth={selectedMonth}
                openMonthSelect={openMonthSelect}
                currentYear={currentYear}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                handleMonthSelect={handleMonthSelect}
            />
            <PieChart
                peggyConmo={peggyConmo}
                selectedMonth={selectedMonth}
                selectedMonthIndex={selectedMonthIndex}
                selectedYear={selectedYear}
            />
            <BarChart
                selectedMonthIndex={selectedMonthIndex}
                selectedYear={selectedYear}
            />
            <LineChart
                selectedMonthIndex={selectedMonthIndex}
                selectedYear={selectedYear}
            />
            <ExpensesTables
                selectedMonth={selectedMonth}
                selectedMonthIndex={selectedMonthIndex}
                selectedYear={selectedYear}
                previousMonth={previousMonth}
                previousMonthIndex={previousMonthIndex}
            />
            <MovementsListExpenses />
            <AddButton />
        </>
    );
};

const PieChart = ({peggyConmo, selectedMonth, selectedMonthIndex, selectedYear}) => {
    const { store, actions } = useContext(Context);
    return(
        <>
            <div className="d-block w-100 h-100 align-items-center">
                <div className="row justify-content-center align-items-center mx-5">
                    <div className="col-4 text-center d-none d-md-block align-self-center">
                        <img src={peggyConmo} className="w-100" alt="Conmo" />
                    </div>
                    <div className="col">
                        <div id="pieCarousel" className="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-interval="false">
                            <div className="carousel-inner">
                                <div className="carousel-item active pb-md-0 pb-4 text-center">
                                    <div className="row">
                                        <h2 className="text-center pt-3 mt-1">Mensual</h2>
                                        <div className="col-md-6 col mt-2 text-center">
                                            <h4 className="mb-4">Tipos</h4>
                                            <MonthlyPieTypes
                                                dataFunctions={[actions.getUsage, actions.getFixes, actions.getOcassionals]}
                                                types={['usages', 'fixes', 'ocassionals']}
                                                colors={[usageTypeColor, fixedTypeColor, ocassionalTypeColor]}
                                                typeNames={['Uso de reservado', 'Gastos fijos', 'Gastos ocasionales']}
                                                selectedMonthIndex={selectedMonthIndex}
                                                selectedYear={selectedYear}
                                            />
                                        </div>
                                        <div className="col-md-6 col mt-2 text-center">
                                            <h4 className="mb-4">Categorías</h4>
                                            <MonthlyPie
                                                dataFunctions={[actions.getUsage, actions.getFixes, actions.getOcassionals]}
                                                types={['usages', 'fixes', 'ocassionals']}
                                                categoryKeys={['category', 'fixedcategory', 'ocassionalcategory']}
                                                colors={[usageColors, fixedColors, ocassionalColors]}
                                                typeNames={['Uso de reservado', 'Gasto fijo', 'Gasto ocasional']}
                                                selectedMonthIndex={selectedMonthIndex}
                                                selectedYear={selectedYear}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="carousel-item pb-md-0 pb-4 text-center">
                                    <div className="row">
                                        <h2 className="text-center pt-3 mt-1">Anual</h2>
                                        <div className="col-md-6 col-12 mt-2 text-center">
                                            <h4 className="mb-4">Tipos</h4>
                                            <AnualPieTypes
                                                dataFunctions={[actions.getUsage, actions.getFixes, actions.getOcassionals]}
                                                types={['usages', 'fixes', 'ocassionals']}
                                                colors={[usageTypeColor, fixedTypeColor, ocassionalTypeColor]}
                                                typeNames={['Uso de reservado', 'Gastos fijos', 'Gastos ocasionales']}
                                                selectedYear={selectedYear}
                                            />
                                        </div>
                                        <div className="col-md-6 col-12 mt-2 text-center">
                                            <h4 className="mb-4">Categorías</h4>
                                            <AnualPie
                                                dataFunctions={[actions.getUsage, actions.getFixes, actions.getOcassionals]}
                                                types={['usages', 'fixes', 'ocassionals']}
                                                categoryKeys={['category', 'fixedcategory', 'ocassionalcategory']}
                                                colors={[usageColors, fixedColors, ocassionalColors]}
                                                typeNames={['Uso de reservado', 'Gasto fijo', 'Gasto ocasional']}
                                                selectedYear={selectedYear}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="carousel-control-prev m-0" type="button" data-bs-target="#pieCarousel" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Anterior</span>
                            </button>
                            <button className="carousel-control-next m-0" type="button" data-bs-target="#pieCarousel" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Siguiente</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const BarChart = ({ selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);
    return(
        <>
            <div className="row text-center justify-content-center align-items-bottom py-5 mt-3 px-lg-5 mx-lg-5 mx-3 gap-5">
                <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-lg-5 bg-body-tertiary fs-1 fw-semibold">Categorías</h2>
                <div className="col-lg col-md-8 col-12 text-center">
                    <MonthlyBarTypes
                        dataFunctions={[actions.getUsage, actions.getFixes, actions.getOcassionals]}
                        types={['usages', 'fixes', 'ocassionals']}
                        colors={[usageTypeColor, fixedTypeColor, ocassionalTypeColor]}
                        typeNames={['Uso de reservado', 'Gastos fijos', 'Gastos ocasionales']}
                        selectedMonthIndex={selectedMonthIndex}
                        selectedYear={selectedYear}
                        renderAsDataBar={true}
                    />                    
                </div>
                <div className="col-lg col-md-8 col-12 text-center">
                    <AnualBarTypes
                        dataFunctions={[actions.getUsage, actions.getFixes, actions.getOcassionals]}
                        types={['usages', 'fixes', 'ocassionals']}
                        colors={[usageTypeColor, fixedTypeColor, ocassionalTypeColor]}
                        typeNames={['Uso de reservado', 'Gastos fijos', 'Gastos ocasionales']}
                        selectedYear={selectedYear}
                        renderAsDataBar={true}
                    />                    
                </div>
            </div>
        </>
    );
};

const LineChart = ({ selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);
    return (
        <>
            <div className="row text-center justify-content-center align-items-bottom py-lg-5 mt-lg-3 px-lg-5 mx-lg-5 mx-3 gap-5">
                <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 bg-body-tertiary fs-1 fw-semibold">Tipos</h2>
                <div className="col-lg col-md-8 col-12 text-center">
                    <MonthlyLineTypes
                        dataFunctions={[actions.getUsage, actions.getFixes, actions.getOcassionals]}
                        types={['usages', 'fixes', 'ocassionals']}
                        colors={[usageTypeColor, fixedTypeColor, ocassionalTypeColor]}
                        typeNames={['Uso de reservado', 'Gastos fijos', 'Gastos ocasionales']}
                        selectedMonthIndex={selectedMonthIndex}
                        selectedYear={selectedYear}
                    />                    
                </div>
                <div className="col-lg col-md-8 col-12 text-center">
                    <AnualLineTypes
                        dataFunctions={[actions.getUsage, actions.getFixes, actions.getOcassionals]}
                        types={['usages', 'fixes', 'ocassionals']}
                        colors={[usageTypeColor, fixedTypeColor, ocassionalTypeColor]}
                        typeNames={['Uso de reservado', 'Gastos fijos', 'Gastos ocasionales']}
                        selectedMonthIndex={selectedMonthIndex}
                        selectedYear={selectedYear}
                    />                    
                </div>
            </div>
        </>
    );
};

const ExpensesTables = ({ selectedMonth, selectedMonthIndex, selectedYear }) => (
    <>
        <div className="row align-items-center justify-content-center m-lg-5 mx-3 px-lg-5" id="table-of-percentages">
            <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mt-5 fs-1 fw-semibold">{selectedMonth}</h2>
            <MonthlyExpensesTable selectedMonth={selectedMonth} selectedMonthIndex={selectedMonthIndex} selectedYear={selectedYear}/>
        </div>
        <div className="row align-items-center justify-content-center m-lg-5 mx-3 px-lg-5" id="table-of-percentages">
            <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mt-5 fs-1 fw-semibold">{selectedYear}</h2>
            <AnualExpensesTable selectedYear={selectedYear} />
        </div>
    </>
);