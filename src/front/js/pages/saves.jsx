import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { savesColors, usageColors, saveTypeColor, usageTypeColor } from "../typescolors.jsx";
import { MovementsListSaves } from "../component/MovementsLists.jsx";
import { AddButton } from "../component/AddButton.jsx";
import { Selector } from "../component/DateSelector.jsx";
import { Header } from "../component/Header.jsx";
import { TypeResume } from "../component/TypeResume.jsx";
import { useMonthSelection } from '../utils.jsx';
import { MonthlyPie, AnualPie } from "../component/PieCharts.jsx";
import { MonthlyBarTypes, AnualBarTypes, AnualBarCategories, MonthlyBarCategories } from "../component/BarCharts.jsx";
import { MonthlyLineBalance, AnualLineBalance } from "../component/LineCharts.jsx";

export const Saves = () => {

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
                type={'Reservado'}
                descriptionText={
                    <div className="texto-desplegable">
                        <h3>Estadísticas y tablas sobre tus reservas y el uso que haces de ellas.</h3>
                        <div className="description-text">
                            <ul>
                                <li>Dinero que se reserva mes a mes en una categoría que tu determinas para poder gastarlo en el momento en el que lo necesites.</li>
                                <li>Ejemplos: Fotografía, ropa, muebles...</li>
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

            <MovementsListSaves 
                selectedMonthIndex={selectedMonthIndex}
                selectedYear={selectedYear}
            />

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
        <div className="row justify-content-center align-items-center m-md-5 my-md-5 mb-5 mb-md-0 mx-1">
            <TypeResume
                selectedMonth={selectedMonth}
                selectedMonthIndex={selectedMonthIndex}
                selectedYear={selectedYear}
                previousMonth={previousMonth}
                MonthlyTypeResume={'MonthlySavedResume'}
                AnualTypeResume={'AnualSavedResume'}
            />
        </div>
    </div>
);

const ChartBody = ({ selectedMonthIndex, selectedYear }) => {
    const { actions } = useContext(Context);
    return(
        <>
            <div className="row justify-content-center pb-md-5 pb-4 mx-md-5 mx-3">
                <h2 className="conmo-bg text-white text-center py-3 shadow rounded-pill p-3 mb-5 mt-3 fs-1 fw-semibold">Mensual</h2>
                <div className="col-md-4 text-center my-md-3 justify-content-center align-items-center gap-5">
                    <div className="p-3 mb-5">
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
                    <div className="p-3">
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
                </div>
                <div className="col-md-7 ms-md-5 align-self-center align-items-center my-3">
                    <div className="pb-5 mb-5">
                        <MonthlyBarCategories
                            selectedTypesGetActions={[actions.getSaves, actions.getUsage]}
                            types={['saves', 'usages']}
                            typeNames={['Reservado', 'Uso de reservado']}
                            selectedMonthIndex={selectedMonthIndex}
                            selectedYear={selectedYear}
                            categoryKeys={['category', 'category']}
                            colors={[savesColors, usageColors]}
                            renderDataInOneBar={true}
                        />                    
                    </div>
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
            <div className="row justify-content-center pb-md-5 pb-4 mx-md-5 mx-3">
                <h2 className="conmo-bg text-white text-center py-3 shadow rounded-pill p-3 mb-5 mt-3 fs-1 fw-semibold">Anual</h2>
                <div className="col-md-4 text-center my-md-3 justify-content-center align-items-center gap-5">
                    <div className="p-3 mb-5">
                        <AnualPie
                            dataFunctions={[actions.getSaves]}
                            types={['saves']}
                            categoryKeys={['category']}
                            colors={[savesColors]}
                            typeNames={['Reservado']}
                            selectedYear={selectedYear}
                        />
                    </div>
                    <div className="p-3">
                        <AnualPie
                            dataFunctions={[actions.getUsage]}
                            types={['usages']}
                            categoryKeys={['category']}
                            colors={[usageColors]}
                            typeNames={['Uso de reservado']}
                            selectedYear={selectedYear}
                        />
                    </div>
                </div>
                <div className="col-md-7 ms-md-5 align-self-center align-items-center my-3">
                    <div className="pb-5 mb-5">
                        <AnualBarCategories
                            selectedTypesGetActions={[actions.getSaves, actions.getUsage]}
                            types={['saves', 'usages']}
                            typeNames={['Reservado', 'Uso de reservado']}
                            selectedYear={selectedYear}
                            categoryKeys={['category', 'category']}
                            colors={[savesColors, usageColors]}
                            renderDataInOneBar={true}
                        />
                    </div>
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
        </>
    );
};