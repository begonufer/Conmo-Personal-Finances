import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { incomeColors, savesColors, usageColors, fixedColors, ocassionalColors, saveTypeColor, fixedTypeColor } from "../typescolors.jsx";
import { MovementsListFixed } from "../component/MovementsLists.jsx";
import { AddButton } from "../component/AddButton.jsx";
import peggyConmo from "../../img/peggy-conmo.png";
import { Selector } from "../component/DateSelector.jsx";
import { Header } from "../component/Header.jsx";
import { TypeResume } from "../component/TypeResume.jsx";
import { useMonthSelection } from '../utils.jsx';
import { MonthlyPie, AnualPie } from "../component/PieCharts.jsx";
import { MonthlyBarTypes, AnualBarTypes, MonthlyBarCategories, AnualBarCategories } from "../component/BarCharts.jsx";

export const FixedExpenses = () => {

    const {
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

    return (
        <>
            <Header
                type={'Gastos fijos'}
                descriptionText={
                    <div className="texto-desplegable">
                        <h3>Estadísticas en relación a tus gastos fijos mensuales y anuales.</h3>
                        <div className="description-text">
                            <ul>
                                <li>Gastos recurrentes y obligatorios.</li>
                                <li>Ejemplos: Gasto de supermercado, factura de la luz, alquiler, hipoteca...</li>
                            </ul>
                        </div>
                    </div>
                }
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

            <TypeTables
                peggyConmo={peggyConmo}
                selectedMonth={selectedMonth}
                selectedMonthIndex={selectedMonthIndex}
                selectedYear={selectedYear}
                previousMonth={previousMonth}
            />

            <ChartBody
                selectedMonth={selectedMonth}
                selectedMonthIndex={selectedMonthIndex}
                selectedYear={selectedYear}
            />

            <MovementsListFixed 
                selectedMonthIndex={selectedMonthIndex}
                selectedYear={selectedYear}
            />

            <AddButton />
        </>
    );
};


const TypeTables = ({
    peggyConmo,
    selectedMonth,
    selectedMonthIndex,
    selectedYear,
    previousMonth
}) => (
    <div className="d-block w-100 h-100 align-items-center">
        <div className="row justify-content-center align-items-center m-md-5 my-5 mx-1">
            <div className="col-4 text-center d-none d-md-block align-self-center">
                <img src={peggyConmo} className="w-100" alt="Conmo" />
            </div>
            <TypeResume
                selectedMonth={selectedMonth}
                selectedMonthIndex={selectedMonthIndex}
                selectedYear={selectedYear}
                previousMonth={previousMonth}
                MonthlyTypeResume={'MonthlyFixedResume'}
                AnualTypeResume={'AnualFixedResume'}
            />
        </div>
    </div>
);

const ChartBody = ({ selectedMonth, selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);
    return(
        <>
            <div className="row justify-content-center pb-md-5 pb-4 mx-md-5 mx-3">
                <h2 className="conmo-bg text-white text-center py-3 shadow rounded-pill p-3 mb-5 mt-3 fs-1 fw-semibold">Mensual</h2>
                <div className="col-md-4 text-center my-md-3 p-md-4 px-5">
                    <MonthlyPie
                        dataFunctions={[actions.getFixes]}
                        types={['fixes']}
                        categoryKeys={['fixedcategory']}
                        colors={[fixedColors]}
                        typeNames={['Gasto fijo']}
                        selectedMonthIndex={selectedMonthIndex}
                        selectedYear={selectedYear}
                    />
                </div>
                <div className="col-md-7 ms-md-5 align-self-center my-3">
                    <MonthlyBarCategories
                        selectedTypesGetActions={[actions.getFixes]}
                        types={['fixes']}
                        typeNames={['Gastos fijos']}
                        selectedMonthIndex={selectedMonthIndex}
                        selectedYear={selectedYear}
                        categoryKeys={['fixedcategory']}
                        colors={[fixedColors]}
                        renderDataInOneBar={true}
                    />
                </div>
            </div>
            <div className="row justify-content-center pb-md-5 pb-4 mx-md-5 mx-3">
                <h2 className="conmo-bg text-white text-center py-3 shadow rounded-pill p-3 mb-5 fs-1 fw-semibold">Anual</h2>
                <div className="col-md-4 text-center my-md-3 p-md-4 px-5">
                    <AnualPie
                        dataFunctions={[actions.getFixes]}
                        types={['fixes']}
                        categoryKeys={['fixedcategory']}
                        colors={[fixedColors]}
                        typeNames={['Gasto fijo']}
                        selectedYear={selectedYear}
                    /> 
                </div>
                <div className="col-md-7 ms-md-5 align-self-center my-3">
                    <AnualBarCategories
                        selectedTypesGetActions={[actions.getFixes]}
                        types={['fixes']}
                        typeNames={['Gastos fijos']}
                        selectedYear={selectedYear}
                        categoryKeys={['fixedcategory']}
                        colors={[fixedColors]}
                        renderDataInOneBar={true}
                    /> 
                </div>
            </div>
        </>
    );
};