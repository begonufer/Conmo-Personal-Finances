import React, { useContext } from 'react';
import { Context } from "../store/appContext.js";
import { ocassionalColors, ocassionalTypeColor } from "../typescolors.jsx";
import { MovementsListOcassional } from "../component/MovementsLists.jsx";
import { AddButton } from "../component/AddButton.jsx";
import peggyConmo from "../../img/peggy-conmo.png";
import { Selector } from "../component/DateSelector.jsx";
import { Header } from "../component/Header.jsx";
import { TypeResume } from "../component/TypeResume.jsx";
import { MonthlyPie, AnualPie } from "../component/PieCharts.jsx";
import { MonthlyBarTypes, AnualBarTypes, MonthlyBarCategories, AnualBarCategories } from "../component/BarCharts.jsx";

import { useMonthSelection } from '../utils.jsx';

export const OcassionalExpenses = () => {
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
                type={'Gastos ocasionales'}
                descriptionText={
                    <div className="texto-desplegable">
                        <h3>Estadísticas en relación a tus gastos ocasionales mensuales y anuales.</h3>
                        <div className="description-text">
                            <ul>
                                <li>Gastos puntuales de cualquier tipo.</li>
                                <li>Ejemplos: Ropa, cine, farmacia...</li>
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
            <MovementsListOcassional 
                selectedMonthIndex={selectedMonthIndex}
                selectedYear={selectedYear}
            />
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
                <TypeResume
                    selectedMonth={selectedMonth}
                    selectedMonthIndex={selectedMonthIndex}
                    selectedYear={selectedYear}
                    previousMonth={previousMonth}
                    MonthlyTypeResume={'MonthlyOcassionalResume'}
                    AnualTypeResume={'AnualOcassionalResume'}
                />
            </div>
        </div>
);

const ChartBody = ({ selectedMonthIndex, selectedYear }) => {
    const { actions } = useContext(Context);
    return (
        <>
            <div className="row justify-content-center pb-md-5 pb-4 mx-md-5 mx-3">
                <h2 className="conmo-bg text-white text-center py-3 shadow rounded-pill p-3 mb-5 mt-3 fs-1 fw-semibold">Mensual</h2>
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
                    <MonthlyBarCategories
                        selectedTypesGetActions={[actions.getOcassionals]}
                        types={['ocassionals']}
                        typeNames={['Gastos ocasionales']}
                        selectedMonthIndex={selectedMonthIndex}
                        selectedYear={selectedYear}
                        categoryKeys={['ocassionalcategory']}
                        colors={[ocassionalColors]}
                        renderDataInOneBar={true}
                    />
                </div>
            </div>
            <div className="row justify-content-center pb-md-5 pb-4 mx-md-5 mx-3">
                <h2 className="conmo-bg text-white text-center py-3 shadow rounded-pill p-3 mb-5 fs-1 fw-semibold">Anual</h2>
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
                    <AnualBarCategories
                        selectedTypesGetActions={[actions.getOcassionals]}
                        types={['ocassionals']}
                        typeNames={['Gastos ocasionales']}
                        selectedYear={selectedYear}
                        categoryKeys={['ocassionalcategory']}
                        colors={[ocassionalColors]}
                        renderDataInOneBar={true}
                    />
                </div>
            </div>
        </>        
    );
};
