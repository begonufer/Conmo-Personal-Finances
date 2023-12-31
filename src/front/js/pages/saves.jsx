import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { incomeColors, savesColors, usageColors, fixedColors, ocassionalColors, saveTypeColor, usageTypeColor, fixedTypeColor, ocassionalTypeColor } from "../pages/typescolors.jsx";
import { MovementsListSaves } from "../component/movementslistsaves.jsx";
import { AddButton } from "../component/addbutton.jsx";
import { Selector } from "../component/graphics/dateselector.jsx";
import { Header } from "../component/header.jsx";
import { AllDataTypeTable } from "../component/alldatatypetable.jsx";
import { useMonthSelection } from './utils.jsx';
import { MonthlyPie, AnualPie } from "../component/PieCharts.jsx";
import { MonthlyBarTypes, AnualBarTypes } from "../component/BarCharts.jsx";
import { MonthlyLineBalance, AnualLineBalance } from "../component/LineCharts.jsx";

export const Saves = () => {

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
                type={'Reservado'}
                descriptionText={
                    <div className="texto-desplegable">
                        <h2 className="mt-2">Descripción detallada de la sección.</h2>
                        <div className="description-text">
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reprehenderit maxime sunt praesentium dolores recusandae vitae ab unde quam neque, doloribus ducimus tenetur ad magnam ratione culpa voluptatum rem accusamus quas.</p>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque fugiat harum neque nostrum facere, incidunt commodi architecto et cum unde sed ab excepturi veritatis ex ut dolor accusamus deserunt rem?</p>
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

            <MovementsListSaves />

            <AddButton />
        </>
    );
};

const TypeTables = ({
    selectedMonth,
    selectedMonthIndex,
    selectedYear,
    previousMonth
}) => (
    <div className="d-block w-100 h-100 align-items-center">
        <div className="row justify-content-center align-items-center m-5">
            <AllDataTypeTable
                selectedMonth={selectedMonth}
                selectedMonthIndex={selectedMonthIndex}
                selectedYear={selectedYear}
                previousMonth={previousMonth}
                MonthlyTypeTable={'MonthlySavesTable'}
                AnualTypeTable={'AnualSavesTable'}
            />
        </div>
    </div>
);

const ChartBody = ({ selectedMonth, selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);
    return(
        <>
            <div className="d-block w-100 h-100 align-items-center">
                <div className="row justify-content-center pb-5 mx-5">
                    <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 mt-3 fs-1 fw-semibold">Mensual</h2>
                    <div className="col-4 text-center my-3 p-4">
                        <h3>Reservado</h3>
                        <MonthlyPie
                            dataFunctions={[actions.getSaves]}
                            types={['saves']}
                            categoryKeys={['category']}
                            colors={[savesColors]}
                            typeNames={['Reservado']}
                            selectedMonthIndex={selectedMonthIndex}
                            selectedYear={selectedYear}
                        />
                    </div>
                    <div className="col-7 ms-5 align-self-center my-3">
                        <MonthlyBarTypes
                            dataFunctions={[actions.getSaves, actions.getUsage]}
                            types={['saves', 'usages']}
                            colors={[saveTypeColor, usageTypeColor]}
                            typeNames={['Reservado', 'Uso de reservado']}
                            selectedMonthIndex={selectedMonthIndex}
                            selectedYear={selectedYear}
                            renderAsDataBar={true}
                        />
                    </div>
                </div>
                <div className="row justify-content-center pb-5 mx-5">
                    <div className="col-4 text-center my-3 p-4">
                        <h3>Uso reservado</h3>
                        <MonthlyPie
                            dataFunctions={[actions.getUsage]}
                            types={['usages']}
                            categoryKeys={['category']}
                            colors={[usageColors]}
                            typeNames={['Uso de reservado']}
                            selectedMonthIndex={selectedMonthIndex}
                            selectedYear={selectedYear}
                        />
                    </div>
                    <div className="col-7 ms-5 align-self-center my-3">
                        <MonthlyLineBalance
                            dataFunctions={[actions.getSaves, actions.getUsage]}
                            types={['saves', 'usages']}
                            colors={[saveTypeColor, usageTypeColor]}
                            typeNames={['Reservado', 'Uso de reservado']}
                            selectedMonthIndex={selectedMonthIndex}
                            selectedYear={selectedYear}
                            color={[saveTypeColor]}
                        />
                    </div>
                </div>
                <div className="row justify-content-center pb-5 mx-5">
                    <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 mt-3 fs-1 fw-semibold">Anual</h2>
                    <div className="col-4 text-center my-3 p-4">
                        <h3>Reservado</h3>
                        <AnualPie
                            dataFunctions={[actions.getSaves]}
                            types={['saves']}
                            categoryKeys={['category']}
                            colors={[savesColors]}
                            typeNames={['Reservado']}
                            selectedYear={selectedYear}
                        /> 
                    </div>
                    <div className="col-7 ms-5 align-self-center my-3">
                        <AnualBarTypes
                            dataFunctions={[actions.getSaves, actions.getUsage]}
                            types={['saves', 'usages']}
                            colors={[saveTypeColor, usageTypeColor]}
                            typeNames={['Reservado', 'Uso de reservado']}
                            selectedYear={selectedYear}
                            renderAsDataBar={true}
                        />
                    </div>
                </div>
                <div className="row justify-content-center pb-5 mx-5">
                    <div className="col-4 text-center my-3 p-4">
                        <h3>Uso reservado</h3>
                        <AnualPie
                            dataFunctions={[actions.getUsage]}
                            types={['usages']}
                            categoryKeys={['category']}
                            colors={[usageColors]}
                            typeNames={['Uso de reservado']}
                            selectedYear={selectedYear}
                        /> 
                    </div>
                    <div className="col-7 ms-5 align-self-center my-3">
                        <AnualLineBalance
                            dataFunctions={[actions.getSaves, actions.getUsage]}
                            types={['saves', 'usages']}
                            colors={[saveTypeColor, usageTypeColor]}
                            typeNames={['Reservado', 'Uso de reservado']}
                            selectedYear={selectedYear}
                            color={[saveTypeColor]}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};