import React , { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/welcome.css";

export const Navbar = () => {

    const { store, actions } = useContext(Context);

    const logout = () => {
        actions.clearUser();
    }
    
    const calculatePercentage = (amount, total) => {
        if (total === 0) {
            return 0;
        }
        return ((amount / total) * 100).toFixed(0);
    }; //usar esta función como función general

    const filterDataByMonthYear = (data, selectedMonthIndex, selectedYear) => {
        return data.filter((item) => {
            const date = new Date(item.dateTime);
            return date.getMonth() === selectedMonthIndex && date.getFullYear() === selectedYear;
        });
    }; //usar esta función como función general

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const todayDate = new Date();
    const currentMonthIndex = todayDate.getMonth();
    const nameCurrentMonth = months[currentMonthIndex];
    const currentYear = new Date().getFullYear();

    const filterAllDataBeforeMonth = (data, month, year) => {
        return data.filter(item => {
            const itemDate = new Date(item.dateTime);
            const itemMonth = itemDate.getMonth();
            const itemYear = itemDate.getFullYear();
            return (itemYear < year || (itemYear === year && itemMonth <= month));
        });
    };

    const allPreviousMonthSave = filterAllDataBeforeMonth(store.saves, currentMonthIndex, currentYear).reduce((total, save) => total + save.value, 0);
  

    const [saveCategoryTotals, setSaveCategoryTotals] = useState({});
    const [savesBalance, setSavesBalance] = useState({});

    const dataFilteredByCategory = (filteredSave) => {

        const saveTotals = {};
       
        filteredSave.forEach(({ value, category }) => {
            const categoryName = category.name;
            saveTotals[categoryName] = (saveTotals[categoryName] || 0) + value;
        });

        setSaveCategoryTotals(saveTotals);
    }

    useEffect(() => {
        const transformData = async () => {
            await actions.getSaves();

            const filteredSave = filterDataByMonthYear(store.saves, currentMonthIndex, currentYear);

            const filterAllDataBeforeMonth = (data, currentMonthIndex, currentYear) => {
                return data.filter(item => {
                    const itemDate = new Date(item.dateTime);
                    const itemMonth = itemDate.getMonth();
                    const itemYear = itemDate.getFullYear();
            
                    // Filtrar por el año y el mes, incluyendo el mes seleccionado
                    return (itemYear < currentYear || (itemYear === currentYear && itemMonth <= currentMonthIndex));
                });
            };
            
            const allPreviousMonthSaves = filterAllDataBeforeMonth(store.saves, currentMonthIndex, currentYear);
        
            const saveBalance = allPreviousMonthSaves.reduce((acc, { value, category }) => {
                const categoryName = category.name;
                acc[categoryName] = (acc[categoryName] || 0) + value;
                return acc;
            }, {});
            
            setSavesBalance(saveBalance);
            
            dataFilteredByCategory(filteredSave);
        };
        transformData();
    }, []);

    const totalSaveMonthAmount = filterDataByMonthYear(store.saves, currentMonthIndex, currentYear).reduce((total, save) => total + save.value, 0);
    const savesBalanceTotal = Object.values(savesBalance).reduce((total, categoryTotal) => total + categoryTotal, 0);

	return (
        <>
            <nav className="navbar navbar-light fixed-top">
                <div className="container-fluid">
                    <div className="col d-flex justify-content-around px-4">
                        <Link to="/myconmo" className="navbar-brand align-middle align-items-center text-decoration-none">
                            <span className="conmo text-center fs-1 pt-2">CONMO</span>
                        </Link>
                        <button className="btn btn-lg text-white fs-4 align-middle text-decoration-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                            <i className="fa-solid fa-bars"></i>
                        </button>
                    </div>
                    <div className="offcanvas offcanvas-end p-3" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <Link to="/myconmo" className="navbar-brand align-middle align-items-center text-decoration-none">
                                <span className="text-white fs-1">Mi</span><span className="conmo text-center fs-1">CONMO</span>
                            </Link>
                        </div>
                        <div className="offcanvas-body">
                            <div className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <Link to="/incomes" className="nav-item pb-5 px-3 fs-4 p-1">
                                    <i className="fa-solid fa-landmark"> </i> <span>Ingresos</span>
                                </Link>
                                <Link to="/expenses" className="nav-item pb-5 px-3 fs-4 p-1">
                                    <i className="fa-solid fa-receipt"> </i> <span>Gastos</span>
                                </Link>
                                <Link to="/fixedexpenses" className="nav-item pb-5 px-3 fs-4 p-1">
                                    <i className="fa-solid fa-circle-dollar-to-slot"> </i> <span>Gastos fijos</span>
                                </Link>
                                <Link to="/variableexpenses" className="nav-item pb-5 px-3 fs-4 p-1">
                                    <i className="fa-solid fa-cash-register"></i> <span>Gastos variables</span>                       
                                </Link>
                                <Link to="/saves" className="nav-item pb-5 px-3 fs-4 p-1">
                                    <i className="fa-solid fa-box"></i> <span>Reserva</span>                     
                                </Link>
                            </div>
                            <div className="available row rounded-pill text-white pb-2 pt-3 mb-2 align-items-center text-center">
                                <h4 className="col">Disponible</h4>
                                <h4 className="col"><strong>747€</strong></h4>
                            </div>
                            <div className="dropdown">
                                <div 
                                    className="available row rounded-pill text-white pb-2 pt-3 mb-2 align-items-center text-center dropdown-toggle"
                                    type="button"
                                    id="savesDetails"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <h4 className="col">Reservado</h4>
                                    <h4 className="col"><strong>{savesBalanceTotal} €</strong></h4>
                                </div>
                                <ul className="dropdown-menu available p-4 fs-5 text-white" aria-labelledby="savesDetails">
                                    {Object.entries(saveCategoryTotals).map(([category, total]) => (
                                        <li className="row available text-center p-0 m-0" key={category}>
                                            <p className="col text-center">{category}</p>
                                            <p className="col text-center">{total} €</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="d-flex flex-column position-absolute bottom-0 ">
                                <Link to="/settings" className="pb-5 px-3 fs-4 p-1 text-decoration-none">
                                    <i className="fa-solid fa-gear"></i> <span className="ms-1 d-none d-sm-inline">Configuración</span>
                                </Link>
                                <Link to="/" className="pb-5 px-3 fs-4 p-1 mb-3 text-decoration-none" onClick={() => logout()}>
                                    <i className="fa-solid fa-right-from-bracket"></i> <span className="ms-1 d-none d-sm-inline">Sign out</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
	);
};