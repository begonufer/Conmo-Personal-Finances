import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { incomeColors, savesColors, usageColors, fixedColors, ocassionalColors, balanceColor, incomeTypeColor, saveTypeColor, fixedTypeColor, ocassionalTypeColor } from "../pages/typescolors.jsx";
import { Resume } from "../component/resume.jsx";
import { ResumeAnual } from "../component/resumeanual.jsx";
import { AddButton } from "../component/addbutton.jsx";
import { MovementsList } from "../component/movementslist.jsx";
import peggyConmo from "../../img/peggy-conmo.png";
import { Selector } from "../component/graphics/dateselector.jsx";
import { Header } from "../component/header.jsx";
import { AllDataTypeTable } from "../component/alldatatypetable.jsx";
import { useMonthSelection, filterAllDataPreviousMonth } from "./utils.jsx";

import { MonthlyPie, MonthlyPieTypes, AnualPie, AnualPieTypes } from "../component/PieCharts.jsx";
import { MonthlyBarTypes, AnualBarTypes } from "../component/BarCharts.jsx";
import { MonthlyLineTypes, MonthlyLineBalance, AnualLineTypes, AnualLineBalance } from "../component/LineCharts.jsx";

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
  Legend
);

export const MyConmo = () => {
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
        handleMonthSelect,
    } = useMonthSelection();

    const descriptionText = (
        <div className="texto-desplegable">
            <h3>
                Aquí encontrarás el estado general de tus finanzas
            </h3>
            <h3>y podrás comparar tus gastos e ingresos:</h3>
            <div className="description-text mt-4">
                <p>Gráficas de los tipos de gastos e ingresos.</p>
                <p>Balance general.</p>
                <div>Tabla resumen con todos los tipos de movimientos:
                    <ul>
                        <li>● Ingresos</li>
                        <li>● Reservado</li>
                        <li>● Uso de reservado</li>
                        <li>● Gastos fijos</li>
                        <li>● Gastos ocasionales</li>
                    </ul>
                </div>
                <p className="mt-3">Listado de todos los movimientos.</p>
            </div>
        </div>
    );

    const header = (
        <>
            Mi <span className="conmo-title"> CONMO</span>
        </>
    );

    return (
        <>
            <Header type={header} descriptionText={descriptionText} />
            <Selector
                openMonthsDropdown={openMonthsDropdown}
                selectedMonth={selectedMonth}
                openMonthSelect={openMonthSelect}
                currentYear={currentYear}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                handleMonthSelect={handleMonthSelect}
            />
            <div className="d-block w-100 h-100 align-items-center">
                <PieCharts 
                    selectedMonthIndex={selectedMonthIndex}
                    selectedYear={selectedYear}
                />
                <CategoriesCharts
                    selectedMonthIndex={selectedMonthIndex}
                    selectedYear={selectedYear}
                />
                <TypesCharts
                    selectedMonthIndex={selectedMonthIndex}
                    selectedYear={selectedYear}
                />
                <LineCharts
                    selectedMonthIndex={selectedMonthIndex}
                    selectedYear={selectedYear}
                />
            </div>
            <div className="row gap-5 m-lg-5 mb-0 justify-content-center pb-lg-5 pb-4 mx-3" id="table-of-percentages">
                <Resume
                    selectedMonth={selectedMonth}
                    selectedMonthIndex={selectedMonthIndex}
                    selectedYear={selectedYear}
                    previousMonth={previousMonth}
                    previousMonthIndex={previousMonthIndex}
                />
                <ResumeAnual selectedYear={selectedYear} />
            </div>
            <MovementsList />
            <AddButton />
        </>
    );
};

const PieCharts = ({selectedMonthIndex, selectedYear}) => {
    const { store, actions } = useContext(Context);
    return(
        <>
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
                                            dataFunctions={[actions.getSaves, actions.getFixes, actions.getOcassionals]}
                                            types={['saves', 'fixes', 'ocassionals']}
                                            colors={[saveTypeColor, fixedTypeColor, ocassionalTypeColor]}
                                            typeNames={['Reservado', 'Gastos fijos', 'Gastos ocasionales']}
                                            selectedMonthIndex={selectedMonthIndex}
                                            selectedYear={selectedYear}
                                        />               
                                    </div>
                                    <div className="col-md-6 col mt-2 text-center">
                                        <h4 className="mb-4">Categorías</h4>
                                        <MonthlyPie
                                            dataFunctions={[actions.getSaves, actions.getFixes, actions.getOcassionals]}
                                            types={['saves', 'fixes', 'ocassionals']}
                                            categoryKeys={['category', 'fixedcategory', 'ocassionalcategory']}
                                            colors={[savesColors, fixedColors, ocassionalColors]}
                                            typeNames={['Reservado', 'Gasto fijo', 'Gasto ocasional']}
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
                                            dataFunctions={[actions.getSaves, actions.getFixes, actions.getOcassionals]}
                                            types={['saves', 'fixes', 'ocassionals']}
                                            categoryKeys={['category', 'fixedcategory', 'ocassionalcategory']}
                                            colors={[saveTypeColor, fixedTypeColor, ocassionalTypeColor]}
                                            typeNames={['Reservado', 'Gastos fijos', 'Gastos ocasionales']}
                                            selectedYear={selectedYear}
                                        />               
                                    </div>
                                    <div className="col-md-6 col-12 mt-2 text-center">
                                        <h4 className="mb-4">Categorías</h4>
                                        <AnualPie
                                            dataFunctions={[actions.getSaves, actions.getFixes, actions.getOcassionals]}
                                            types={['saves', 'fixes', 'ocassionals']}
                                            categoryKeys={['category', 'fixedcategory', 'ocassionalcategory']}
                                            colors={[savesColors, fixedColors, ocassionalColors]}
                                            typeNames={['Reservado', 'Gasto fijo', 'Gasto ocasional']}
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
        </>
    );
};

const CategoriesCharts = ({ selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);
    return (
        <>
            <div className="row justify-content-center pb-lg-5 pb-4 mx-lg-5 mx-3 mt-lg-5 ">
                <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 mt-5 fs-1 fw-semibold">Categorías</h2>
                <div className="col-lg col-md-8 col-12 mt-lg-5 text-center">
                    <MonthlyBarTypes
                        dataFunctions={[actions.getSaves, actions.getFixes, actions.getOcassionals]}
                        types={['saves', 'fixes', 'ocassionals']}
                        colors={[saveTypeColor, fixedTypeColor, ocassionalTypeColor]}
                        typeNames={['Reservado', 'Gastos fijos', 'Gastos ocasionales']}
                        selectedMonthIndex={selectedMonthIndex}
                        selectedYear={selectedYear}
                        renderAsDataBar={true}
                    />                    
                </div>
                <div className="col-lg col-md-8 col-12 mt-5 text-center">
                    <AnualBarTypes 
                        dataFunctions={[actions.getSaves, actions.getFixes, actions.getOcassionals]}
                        types={['saves', 'fixes', 'ocassionals']}
                        colors={[saveTypeColor, fixedTypeColor, ocassionalTypeColor]}
                        typeNames={['Reservado', 'Gastos fijos', 'Gastos ocasionales']}
                        selectedYear={selectedYear}
                        renderAsDataBar={true}
                    />                    
                </div>
            </div>
        </>
    );
};

const TypesCharts = ({ selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);
    return (
        <>
            <div className="row justify-content-center pb-lg-5 pb-4 mx-lg-5 mx-3 mt-lg-5 ">
                <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 mt-5 fs-1 fw-semibold">Tipos</h2>
                <div className="col-lg col-md-8 col-12 mt-lg-5 text-center">
                    <MonthlyBarTypes
                        dataFunctions={[actions.getIncomes, actions.getSaves, actions.getFixes, actions.getOcassionals]}
                        types={['incomes', 'saves', 'fixes', 'ocassionals']}
                        colors={[incomeTypeColor, saveTypeColor, fixedTypeColor, ocassionalTypeColor]}
                        typeNames={['Ingresos', 'Reservado', 'Gastos fijos', 'Gastos ocasionales']}
                        selectedMonthIndex={selectedMonthIndex}
                        selectedYear={selectedYear}
                        renderAsDataBar={false}
                    />                    
                </div>
                <div className="col-lg col-md-8 col-12 mt-5 text-center">
                    <AnualBarTypes 
                        dataFunctions={[actions.getIncomes, actions.getSaves, actions.getFixes, actions.getOcassionals]}
                        types={['incomes', 'saves', 'fixes', 'ocassionals']}
                        colors={[incomeTypeColor, saveTypeColor, fixedTypeColor, ocassionalTypeColor]}
                        typeNames={['Ingresos', 'Reservado', 'Gastos fijos', 'Gastos ocasionales']}
                        selectedYear={selectedYear}
                        renderAsDataBar={false}
                    />                    
                </div>
            </div>
        </>
    );
};

const LineCharts = ({ selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);
    return (
        <>
            <div className="row justify-content-center pb-lg-5 pb-4 mx-lg-5 mx-3 mt-lg-5 mb-3">
                <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 mt-5 fs-1 fw-semibold">Evolución</h2>
                <div className="col-lg-6 col-md-8 col-12 mt-lg-5 text-center">
                    <MonthlyLineTypes
                        dataFunctions={[actions.getIncomes, actions.getSaves, actions.getFixes, actions.getOcassionals]}
                        types={['incomes', 'saves', 'fixes', 'ocassionals']}
                        colors={[incomeTypeColor, saveTypeColor, fixedTypeColor, ocassionalTypeColor]}
                        typeNames={['Ingresos', 'Reservado', 'Gastos fijos', 'Gastos ocasionales']}
                        selectedMonthIndex={selectedMonthIndex}
                        selectedYear={selectedYear}
                    />                    
                </div>
                <div className="col-lg-6 col-md-8 col-12 mt-5 text-center">
                    <AnualLineTypes
                        dataFunctions={[actions.getIncomes, actions.getSaves, actions.getFixes, actions.getOcassionals]}
                        types={['incomes', 'saves', 'fixes', 'ocassionals']}
                        colors={[incomeTypeColor, saveTypeColor, fixedTypeColor, ocassionalTypeColor]}
                        typeNames={['Ingresos', 'Reservado', 'Gastos fijos', 'Gastos ocasionales']}
                        selectedYear={selectedYear}
                    />                    
                </div>
                <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-md-5 mt-5 fs-1 fw-semibold">Balance</h2>
                <div className="col-lg-6 col-md-8 col-12 mt-5 text-center">
                    <MonthlyLineBalance
                        dataFunctions={[actions.getIncomes, actions.getSaves, actions.getFixes, actions.getOcassionals]}
                        types={['incomes', 'saves', 'fixes', 'ocassionals']}
                        colors={[incomeTypeColor, saveTypeColor, fixedTypeColor, ocassionalTypeColor]}
                        typeNames={['Ingresos', 'Reservado', 'Gastos fijos', 'Gastos ocasionales']}
                        selectedMonthIndex={selectedMonthIndex}
                        selectedYear={selectedYear}
                        color={[balanceColor]}
                    />                    
                </div>
                <div className="col-lg-6 col-md-8 col-12 mt-5 text-center">
                    <AnualLineBalance
                        dataFunctions={[actions.getIncomes, actions.getSaves, actions.getFixes, actions.getOcassionals]}
                        types={['incomes', 'saves', 'fixes', 'ocassionals']}
                        colors={[incomeTypeColor, saveTypeColor, fixedTypeColor, ocassionalTypeColor]}
                        typeNames={['Ingresos', 'Reservado', 'Gastos fijos', 'Gastos ocasionales']}
                        selectedYear={selectedYear}
                        color={[balanceColor]}
                    />                    
                </div>
            </div>
        </>
    );
};
