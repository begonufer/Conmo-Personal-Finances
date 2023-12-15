import React, { useState } from 'react';
import { MovementsListOcassional } from "../component/movementslistocassional.jsx";
import { AddButton } from "../component/addbutton.jsx";
import { Collapse } from 'react-bootstrap';

import peggyConmo from "../../img/peggy-conmo.png";

import { AnualOcassionalTable } from "../component/graphics/ocassionalanualtable.jsx";
import { MonthlyOcassionalTable } from "../component/graphics/ocassionalmonthlytable.jsx";
import { MonthlyOcassionalPie } from "../component/graphics/ocassionalmonthlypie.jsx";
import { AnualOcassionalPie } from "../component/graphics/ocassionalanualpie.jsx";
import { MonthlyOcassionalBar } from "../component/graphics/ocassionalmonthlybar.jsx";
import { AnualOcassionalBar } from "../component/graphics/ocassionalanualbar.jsx";

export const VariableExpenses = () => {

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const todayDate = new Date();
    const currentMonthIndex = todayDate.getMonth();
    const nameCurrentMonth = months[currentMonthIndex];

    const calculatePreviousMonthIndex = (currentIndex) => (currentIndex - 1 + 12) % 12;
    const previousMonthIndex = calculatePreviousMonthIndex(currentMonthIndex);
    const namePreviousMonth = months[previousMonthIndex];
    const currentYear = new Date().getFullYear();

    const [previousMonth, setPreviousMonth] = useState(namePreviousMonth);

    const [selectedMonth, setSelectedMonth] = useState(nameCurrentMonth);

    const [selectedYear, setSelectedYear] = useState(currentYear);

    const [isOpen, setIsOpen] = useState(false);
    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndex);
  
    const handleMonthSelect = (month, monthIndex) => {
        setSelectedMonth(month);
        setSelectedMonthIndex(monthIndex);
        const updatedPreviousMonthIndex = calculatePreviousMonthIndex(monthIndex);
        setPreviousMonth(months[updatedPreviousMonthIndex]);
        setIsOpen(false);
    }

    const [isNext, setIsNext] = useState(true);

    const handleButtonClick = () => {
      setIsNext((prevIsNext) => !prevIsNext);
    };

    const [open, setOpen] = useState(false);

    const handleToggle = () => {
      setOpen(!open);
    };

    return (
        <>
            <div className="text-center text-white" id="left-background">
                <h1 className="header p-1 pb-3 pt-5 mt-5 mb-0">
                    Gastos variables <i className="icon fas fa-info-circle" onClick={handleToggle} ></i>
                </h1>
                <div>
                    <Collapse in={open}>
                        <div className="texto-desplegable">
                            <h2 className="mt-2">Descripción detallada de la sección.</h2>
                            <div className="description-text">
                                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reprehenderit maxime sunt praesentium dolores recusandae vitae ab unde quam neque, doloribus ducimus tenetur ad magnam ratione culpa voluptatum rem accusamus quas.</p>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque fugiat harum neque nostrum facere, incidunt commodi architecto et cum unde sed ab excepturi veritatis ex ut dolor accusamus deserunt rem?</p>
                            </div>
                        </div>
                    </Collapse>
                </div>
            </div>
            <div className="d-block w-100 h-100 align-items-center">
                <div className="custom-dropdown my-4">
                    <div className="dropdown-header" onClick={handleToggleDropdown}>
                        <h1 className="drop-title pt-1">
                            {selectedMonth} <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}><i className="fas fa-chevron-down"></i></span> 
                            <input
                                type="number"
                                min="2000" 
                                max={currentYear}
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                                className="year-selector mx-4"
                            />
                        </h1>
                    </div>
                    {isOpen && (
                        <div className="dropdown-content">
                            {months.map((month, index) => (
                                <div
                                    key={index}
                                    className="dropdown-item"
                                    onClick={() => handleMonthSelect(month, index)}
                                    >
                                    {month}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="row justify-content-center align-items-center m-5">
                    <div className="col-4 text-center align-self-center">
                        <img src={peggyConmo} className="w-100" alt="Conmo" />
                    </div>
                    <div className="col">
                        <div id="tableCarousel" className="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-interval="false">
                            <div className="carousel-inner">
                                <div className="carousel-item active pe-5 text-center">
                                    <MonthlyOcassionalTable selectedMonth={selectedMonth} selectedMonthIndex={selectedMonthIndex} selectedYear={selectedYear} previousMonth={previousMonth} />
                                </div>
                                <div className="carousel-item pe-5 text-center">
                                    <AnualOcassionalTable selectedMonth={selectedMonth} selectedMonthIndex={selectedMonthIndex} selectedYear={selectedYear} previousMonth={previousMonth} />
                                </div>
                            </div>
                            <button
                                className="carousel-control-next d-block text-dark align-items-center"
                                type="button"
                                data-bs-target="#tableCarousel"
                                data-bs-slide={isNext ? 'next' : 'prev'}
                                id="table-carousel-button"
                                onClick={handleButtonClick}
                            >
                                <span className="fs-5">{isNext ? 'Año' : 'Mes'}</span>
                                <span className={`carousel-control-${isNext ? 'next' : 'prev'}-icon`} aria-hidden="true"></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center pb-5 mx-5">
                    <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 mt-3 fs-1 fw-semibold">Mensual</h2>
                    <div className="col-4 text-center my-3">
                        <MonthlyOcassionalPie selectedMonth={selectedMonth} selectedMonthIndex={selectedMonthIndex} selectedYear={selectedYear}/> 
                    </div>
                    <div className="col-7 ms-5 align-self-center my-3">
                        <MonthlyOcassionalBar selectedMonth={selectedMonth} selectedMonthIndex={selectedMonthIndex} selectedYear={selectedYear}/> 
                    </div>
                </div>
                <div className="row justify-content-center pb-5 mx-5">
                    <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 fs-1 fw-semibold">Anual</h2>
                    <div className="col-4 text-center my-3">
                        <AnualOcassionalPie selectedYear={selectedYear}/> 
                    </div>
                    <div className="col-7 ms-5 align-self-center my-3">
                        <AnualOcassionalBar selectedYear={selectedYear}/>   
                    </div>
                </div>
                <MovementsListOcassional />
            </div>
            <AddButton />
        </>
    );
};