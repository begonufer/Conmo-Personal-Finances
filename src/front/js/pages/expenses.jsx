import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { incomeColors, savesColors, usageColors, fixedColors, ocassionalColors, usageTypeColor, fixedTypeColor, ocassionalTypeColor } from "../typescolors.jsx";
import { MovementsListExpenses } from "../component/MovementsLists.jsx";
import { AddButton } from "../component/AddButton.jsx";
import peggyConmo from "../../img/peggy-conmo.png";
import { Selector } from "../component/DateSelector.jsx";
import { Header } from "../component/Header.jsx";
import { MonthlyExpenseTable, AnualExpenseTable } from "../component/ExpenseTables.jsx";
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
} from '../utils.jsx';

import { MonthlyPie, MonthlyPieTypes, AnualPie, AnualPieTypes } from "../component/PieCharts.jsx";
import { MonthlyBarTypes, AnualBarTypes } from "../component/BarCharts.jsx";
import { MonthlyLineTypes, AnualLineTypes } from "../component/LineCharts.jsx";

export const Expenses = () => {

    const { store, actions } = useContext(Context);

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
                <h2 className="conmo-bg text-white text-center py-3 shadow rounded-pill p-3 mb-lg-5 bg-body-tertiary fs-1 fw-semibold">Categorías</h2>
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
                <h2 className="conmo-bg text-white text-center py-3 shadow rounded-pill p-3 mb-5 bg-body-tertiary fs-1 fw-semibold">Tipos</h2>
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
        <div className="row align-items-center justify-content-center m-lg-5 mx-3 px-lg-5 fs-small">
            <h2 className="conmo-bg text-white text-center py-3 shadow rounded-pill p-3 mt-5 fs-1 fw-semibold">{selectedMonth}</h2>
            <MonthlyExpenseTable selectedMonth={selectedMonth} selectedMonthIndex={selectedMonthIndex} selectedYear={selectedYear}/>
        </div>
        <div className="row align-items-center justify-content-center m-lg-5 mx-3 px-lg-5 fs-small">
            <h2 className="conmo-bg text-white text-center py-3 shadow rounded-pill p-3 mt-5 fs-1 fw-semibold">{selectedYear}</h2>
            <AnualExpenseTable selectedYear={selectedYear} />
        </div>
    </>
);