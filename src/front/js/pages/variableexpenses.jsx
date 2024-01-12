import React, { useState, useContext } from 'react';
import { Context } from "../store/appContext";
import { incomeColors, savesColors, usageColors, fixedColors, ocassionalColors, ocassionalTypeColor } from "../pages/typescolors.jsx";
import { MovementsListOcassional } from "../component/movementslistocassional.jsx";
import { AddButton } from "../component/addbutton.jsx";
import peggyConmo from "../../img/peggy-conmo.png";
import { Selector } from "../component/graphics/dateselector.jsx";
import { Header } from "../component/header.jsx";
import { AllDataTypeTable } from "../component/alldatatypetable.jsx";
import { MonthlyPie, AnualPie } from "../component/PieCharts.jsx";
import { MonthlyBarTypes, AnualBarTypes } from "../component/BarCharts.jsx";

import { useMonthSelection } from './utils.jsx';

export const VariableExpenses = () => {
    const {
        todayDate,
        currentMonthIndex,
        nameCurrentMonth,
        calculatePreviousMonthIndex,
        previousMonthIndex,
        currentPreviousMonthName,
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
                type={'Gastos ocasionales'}
                descriptionText={
                    <div className="description-text">
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reprehenderit maxime sunt praesentium dolores recusandae vitae ab unde quam neque, doloribus ducimus tenetur ad magnam ratione culpa voluptatum rem accusamus quas.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque fugiat harum neque nostrum facere, incidunt commodi architecto et cum unde sed ab excepturi veritatis ex ut dolor accusamus deserunt rem.</p>
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
            <MainContent
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
            <MovementsListOcassional />
            <AddButton />
        </>
    );
};

const MainContent = ({
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
                <AllDataTypeTable
                    selectedMonth={selectedMonth}
                    selectedMonthIndex={selectedMonthIndex}
                    selectedYear={selectedYear}
                    previousMonth={previousMonth}
                    MonthlyTypeTable={'MonthlyOcassionalTable'}
                    AnualTypeTable={'AnualOcassionalTable'}
                />
            </div>
        </div>
);

const ChartBody = ({ selectedMonth, selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);
    return (
        <>
            <div className="row justify-content-center pb-md-5 pb-4 mx-md-5 mx-3">
                <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 mt-3 fs-1 fw-semibold">Mensual</h2>
                <div className="col-md-4 text-center my-md-3 p-md-4 px-5">
                    <MonthlyPie
                        dataFunctions={[actions.getOcassionals]}
                        types={['ocassionals']}
                        categoryKeys={['ocassionalcategory']}
                        colors={[ocassionalColors]}
                        typeNames={['Gasto ocasional']}
                        selectedMonthIndex={selectedMonthIndex}
                        selectedYear={selectedYear}
                    />
                </div>
                <div className="col-md-7 ms-md-5 align-self-center my-3">
                    <MonthlyBarTypes
                        dataFunctions={[actions.getOcassionals]}
                        types={['ocassionals']}
                        colors={[ocassionalTypeColor]}
                        typeNames={['Gastos ocasionales']}
                        selectedMonthIndex={selectedMonthIndex}
                        selectedYear={selectedYear}
                        renderAsDataBar={true}
                    />
                </div>
            </div>
            <div className="row justify-content-center pb-md-5 pb-4 mx-md-5 mx-3">
                <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 fs-1 fw-semibold">Anual</h2>
                <div className="col-md-4 text-center my-md-3 p-md-4 px-5">
                    <AnualPie
                        dataFunctions={[actions.getOcassionals]}
                        types={['ocassionals']}
                        categoryKeys={['ocassionalcategory']}
                        colors={[ocassionalColors]}
                        typeNames={['Gasto ocasional']}
                        selectedYear={selectedYear}
                    /> 
                </div>
                <div className="col-md-7 ms-md-5 align-self-center my-3">
                    <AnualBarTypes
                        dataFunctions={[actions.getOcassionals]}
                        types={['ocassionals']}
                        colors={[ocassionalTypeColor]}
                        typeNames={['Gastos ocasionales']}
                        selectedYear={selectedYear}
                        renderAsDataBar={true}
                    />
                </div>
            </div>
        </>        
    );
};
