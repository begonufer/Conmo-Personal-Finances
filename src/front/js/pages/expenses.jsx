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

    const allPreviousMonthIncome = filterAllDataBeforeMonth(store.incomes, previousMonthIndex, selectedYear).reduce((total, income) => total + income.value, 0);
    const allPreviousMonthSave = filterAllDataBeforeMonth(store.saves, previousMonthIndex, selectedYear).reduce((total, save) => total + save.value, 0);
    const allPreviousMonthUsage = filterAllDataBeforeMonth(store.usages, previousMonthIndex, selectedYear).reduce((total, usage) => total + usage.value, 0);
    const allPreviousMonthFixed = filterAllDataBeforeMonth(store.fixes, previousMonthIndex, selectedYear).reduce((total, fixed) => total + fixed.value, 0);
    const allPreviousMonthOcassional = filterAllDataBeforeMonth(store.ocassionals, previousMonthIndex, selectedYear).reduce((total, ocassional) => total + ocassional.value, 0);
    
    const previousMonthAmount = allPreviousMonthIncome - allPreviousMonthSave - allPreviousMonthUsage - allPreviousMonthFixed - allPreviousMonthOcassional;

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
            <h2>Aquí podrás encontrar el estado general de tus gastos:</h2>
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
                previousMonthAmount={previousMonthAmount}
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
                                                <MonthlyPieTypes
                                                    dataFunctions={[actions.getUsage, actions.getFixes, actions.getOcassionals]}
                                                    types={['usages', 'fixes', 'ocassionals']}
                                                    colors={[usageTypeColor, fixedTypeColor, ocassionalTypeColor]}
                                                    typeNames={['Uso de reservado', 'Gastos fijos', 'Gastos ocasionales']}
                                                    selectedMonthIndex={selectedMonthIndex}
                                                    selectedYear={selectedYear}
                                                />
                                            </div>
                                        </div>
                                        <div className="col mx-3 text-center">
                                            <div className="row mt-2">
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
                                </div>
                                <div className="carousel-item">
                                    <div className="row">
                                        <h2 className="text-center pt-3 mt-1">Anual</h2>
                                        <div className="col mx-3 text-center">
                                            <div className="row mt-2">
                                                <h4 className="mb-4">Tipos</h4>
                                                <AnualPieTypes
                                                    dataFunctions={[actions.getUsage, actions.getFixes, actions.getOcassionals]}
                                                    types={['usages', 'fixes', 'ocassionals']}
                                                    colors={[usageTypeColor, fixedTypeColor, ocassionalTypeColor]}
                                                    typeNames={['Uso de reservado', 'Gastos fijos', 'Gastos ocasionales']}
                                                    selectedYear={selectedYear}
                                                />
                                            </div>
                                        </div>
                                        <div className="col mx-3 text-center">
                                            <div className="row mt-2">
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
            </div>
        </>
    );
};

const BarChart = ({ selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);
    return(
        <>
            <div className="row text-center justify-content-center align-items-bottom py-5 mt-3 px-5 mx-5 gap-5">
                <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 bg-body-tertiary fs-1 fw-semibold">Categorías</h2>
                <div className="col text-center">
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
                <div className="col text-center">
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
            <div className="row text-center justify-content-center align-items-bottom py-5 mt-3 px-5 mx-5 gap-5">
                <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 bg-body-tertiary fs-1 fw-semibold">Tipos</h2>
                <div className="col text-center">
                    <MonthlyLineTypes
                        dataFunctions={[actions.getUsage, actions.getFixes, actions.getOcassionals]}
                        types={['usages', 'fixes', 'ocassionals']}
                        colors={[usageTypeColor, fixedTypeColor, ocassionalTypeColor]}
                        typeNames={['Uso de reservado', 'Gastos fijos', 'Gastos ocasionales']}
                        selectedMonthIndex={selectedMonthIndex}
                        selectedYear={selectedYear}
                    />                    
                </div>
                <div className="col text-center">
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

const ExpensesTables = ({ selectedMonth, selectedMonthIndex, selectedYear, previousMonth, previousMonthIndex, previousMonthAmount }) => (
    <>
        <div className="row align-items-center justify-content-center m-5 mb-0" id="table-of-percentages">
            <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mt-5 fs-1 fw-semibold">{selectedMonth}</h2>
            <MonthlyExpensesTable selectedMonth={selectedMonth} selectedMonthIndex={selectedMonthIndex} selectedYear={selectedYear} previousMonth={previousMonth} previousMonthIndex={previousMonthIndex} previousMonthAmount={previousMonthAmount} />
        </div>
        <div className="row align-items-center justify-content-center m-5 mt-0 px-5" id="table-of-percentages">
            <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mx-5 fs-1 fw-semibold">{selectedYear}</h2>
            <AnualExpensesTable selectedYear={selectedYear} />
        </div>
    </>
);