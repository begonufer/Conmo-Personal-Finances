import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Anual } from "../component/anual.jsx";
import { Monthly } from "../component/monthly.jsx";
import { Resume } from "../component/resume.jsx";
import { AddButton } from "../component/addbutton.jsx";
import { MovementsList } from "../component/movementslist.jsx";
import { Collapse } from 'react-bootstrap';

export const MyConmo = () => {

    const { store, actions } = useContext(Context);

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const todayDate = new Date();
    const currentMonthIndex = todayDate.getMonth();
    const nameCurrentMonth = months[currentMonthIndex];
    const currentYear = new Date().getFullYear();

    const calculatePreviousMonthIndex = (currentIndex) => (currentIndex - 1 + 12) % 12;
    const currentPreviousMonthIndex = calculatePreviousMonthIndex(currentMonthIndex);
    const namePreviousMonth = months[currentPreviousMonthIndex];


    const [previousMonth, setPreviousMonth] = useState(namePreviousMonth);

    const [selectedMonth, setSelectedMonth] = useState(nameCurrentMonth);

    const [selectedYear, setSelectedYear] = useState(currentYear);

    const [isOpen, setIsOpen] = useState(false);
    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndex);

    const [previousMonthIndex, setPreviousMonthIndex] = useState(currentPreviousMonthIndex);
  
    const handleMonthSelect = (month, monthIndex) => {
        setSelectedMonth(month);
        setSelectedMonthIndex(monthIndex);
        const updatedPreviousMonthIndex = calculatePreviousMonthIndex(monthIndex);
        setPreviousMonth(months[updatedPreviousMonthIndex]);
        setPreviousMonthIndex(updatedPreviousMonthIndex);
        setIsOpen(false);
    }
    const filterDataByMonthYear = (data, selectedMonthIndex, selectedYear) => {
        return data.filter((item) => {
            const date = new Date(item.dateTime);
            return date.getMonth() === selectedMonthIndex && date.getFullYear() === selectedYear;
        });
    };

    const filterAllDataBeforeMonth = (data, month, year) => {
        return data.filter(item => {
            const itemDate = new Date(item.dateTime);
            const itemMonth = itemDate.getMonth();
            const itemYear = itemDate.getFullYear();
            return (itemYear < year || (itemYear === year && itemMonth <= month));
        });
    };

    const allPreviousMonthIncome = filterAllDataBeforeMonth(store.incomes, previousMonthIndex, selectedYear).reduce((total, income) => total + income.value, 0);
    const allPreviousMonthSave = filterAllDataBeforeMonth(store.saves, previousMonthIndex, selectedYear).reduce((total, save) => total + save.value, 0);
    const allPreviousMonthFixed = filterAllDataBeforeMonth(store.fixes, previousMonthIndex, selectedYear).reduce((total, fixed) => total + fixed.value, 0);
    const allPreviousMonthOcassional = filterAllDataBeforeMonth(store.ocassionals, previousMonthIndex, selectedYear).reduce((total, ocassional) => total + ocassional.value, 0);
    
    const previousMonthAmount = allPreviousMonthIncome - allPreviousMonthSave - allPreviousMonthFixed - allPreviousMonthOcassional;

    const [open, setOpen] = useState(false);

    const handleToggle = () => {
      setOpen(!open);
    };

    return (
        <>
            <div className="text-center text-white" id="left-background">
                <h1 className="header p-1 pb-3 pt-5 mt-5 mb-0">
                    Mi<span className="conmo"> CONMO</span> <i className="icon fas fa-info-circle" onClick={handleToggle} ></i>
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
                <div id="principalCarousel" className="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-interval="false">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <Monthly
                                handleToggleDropdown={handleToggleDropdown}
                                selectedMonth={selectedMonth}
                                isOpen={isOpen}
                                currentYear={currentYear}
                                selectedYear={selectedYear}
                                setSelectedYear={setSelectedYear}
                                months={months}
                                handleMonthSelect={handleMonthSelect}
                            />
                        </div>
                        <div className="carousel-item">
                            <Anual />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#principalCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Anterior</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#principalCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Siguiente</span>
                    </button>
                </div>
            </div>
            <Resume selectedMonth={selectedMonth} selectedMonthIndex={selectedMonthIndex} selectedYear={selectedYear} previousMonth={previousMonth} previousMonthIndex={previousMonthIndex} previousMonthAmount={previousMonthAmount} />
            <MovementsList />
            <AddButton />
        </>
    );
};