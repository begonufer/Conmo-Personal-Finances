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

    const allPreviousMonthIncome = filterAllDataPreviousMonth(store.incomes, previousMonthIndex, selectedYear).reduce((total, income) => total + income.value, 0);
    const allPreviousMonthSave = filterAllDataPreviousMonth(store.saves, previousMonthIndex, selectedYear).reduce((total, save) => total + save.value, 0);
    const allPreviousMonthFixed = filterAllDataPreviousMonth(store.fixes, previousMonthIndex, selectedYear).reduce((total, fixed) => total + fixed.value, 0);
    const allPreviousMonthOcassional = filterAllDataPreviousMonth(store.ocassionals, previousMonthIndex, selectedYear).reduce((total, ocassional) => total + ocassional.value, 0);

    const previousMonthAmount = allPreviousMonthIncome - allPreviousMonthSave - allPreviousMonthFixed - allPreviousMonthOcassional;

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
            <h2>Aquí podrás encontrar el estado general de tus finanzas:</h2>
            <div className="description-text mt-4">
                <ul>
                    <li>{" "}Cuánta parte de tus ingresos destinas a cada tipo de gasto o a cada categoría.{" "}</li>
                    <li>{" "}Qué días del mes, o meses del año, has gastado más y en qué categorías.{" "}</li>
                    <li>{" "}Balance general de tus ingresos a lo largo del mes y del año.{" "}</li>
                    <li>{" "}En la tabla resumen podrás encontrar los datos de todas las categorías y tipos, desgranados.{" "}</li>
                    <li>{" "}Tendrás una idea general de la media que sueles destinar a cada uno de los apartados para que puedas gestionar tus finanzas de manera óptima, acorde con tus necesidades y objetivos.{" "}</li>
                    <li>{" "}Por último encontrarás el listado de todos tus movimientos, el cual podrás descargar a tu correo electrónico si lo deseas.{" "}</li>
                </ul>
            </div>
        </div>
  );

    const header = (
        <>
            Mi <span className="conmo"> CONMO</span>
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
            <div className="row gap-5 m-5 mb-0" id="table-of-percentages">
                <Resume
                    selectedMonth={selectedMonth}
                    selectedMonthIndex={selectedMonthIndex}
                    selectedYear={selectedYear}
                    previousMonth={previousMonth}
                    previousMonthIndex={previousMonthIndex}
                    previousMonthAmount={previousMonthAmount}
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
                                                dataFunctions={[actions.getSaves, actions.getFixes, actions.getOcassionals]}
                                                types={['saves', 'fixes', 'ocassionals']}
                                                colors={[saveTypeColor, fixedTypeColor, ocassionalTypeColor]}
                                                typeNames={['Reservado', 'Gastos fijos', 'Gastos ocasionales']}
                                                selectedMonthIndex={selectedMonthIndex}
                                                selectedYear={selectedYear}
                                            />
                                        </div>                
                                    </div>
                                    <div className="col mx-3 text-center">
                                        <div className="row mt-2">
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
                            </div>
                            <div className="carousel-item">
                                <div className="row">
                                    <h2 className="text-center pt-3 mt-1">Anual</h2>
                                    <div className="col mx-3 text-center">
                                        <div className="row mt-2">
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
                                    </div>
                                    <div className="col mx-3 text-center">
                                        <div className="row mt-2">
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
        </>
    );
};

const CategoriesCharts = ({ selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);
    return (
        <>
            <div className="row text-center justify-content-center align-items-bottom py-5 mt-3 px-5 mx-5 gap-5">
                <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 bg-body-tertiary fs-1 fw-semibold">Categorías</h2>
                <div className="col text-center">
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
                <div className="col text-center">
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
            <div className="row text-center justify-content-center align-items-bottom py-5 mt-3 px-5 mx-5 gap-5">
                <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 bg-body-tertiary fs-1 fw-semibold">Tipos</h2>
                <div className="col text-center">
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
                <div className="col text-center">
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
            <div className="row text-center justify-content-center align-items-bottom py-5 mt-3 px-5 mx-5 gap-5">
                <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 bg-body-tertiary fs-1 fw-semibold">Evolución</h2>
                <div className="col text-center">
                    <MonthlyLineTypes
                        dataFunctions={[actions.getIncomes, actions.getSaves, actions.getFixes, actions.getOcassionals]}
                        types={['incomes', 'saves', 'fixes', 'ocassionals']}
                        colors={[incomeTypeColor, saveTypeColor, fixedTypeColor, ocassionalTypeColor]}
                        typeNames={['Ingresos', 'Reservado', 'Gastos fijos', 'Gastos ocasionales']}
                        selectedMonthIndex={selectedMonthIndex}
                        selectedYear={selectedYear}
                    />                    
                </div>
                <div className="col text-center">
                    <AnualLineTypes
                        dataFunctions={[actions.getIncomes, actions.getSaves, actions.getFixes, actions.getOcassionals]}
                        types={['incomes', 'saves', 'fixes', 'ocassionals']}
                        colors={[incomeTypeColor, saveTypeColor, fixedTypeColor, ocassionalTypeColor]}
                        typeNames={['Ingresos', 'Reservado', 'Gastos fijos', 'Gastos ocasionales']}
                        selectedYear={selectedYear}
                    />                    
                </div>
            </div>
            <div className="row text-center justify-content-center align-items-bottom py-5 mt-3 px-5 mx-5 gap-5">
                <div className="col text-center">
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
                <div className="col text-center">
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
