import React , { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/welcome.css";

export const Navbar = () => {

    const { store, actions } = useContext(Context);

    const calculatePercentage = (amount, total) => {
        if (total === 0) {
            return 0;
        }
        return ((amount / total) * 100).toFixed(0);
    };

    const calculateAverage = (monthlyValues) => {
        return (monthlyValues / 12).toFixed(2); 
    };

    const [categoryTotals, setCategoryTotals] = useState({});
    const [usageCategoryTotals, setUsageCategoryTotals] = useState({});


    useEffect(() => {
        const transformData = async () => {
            
            await actions.getIncomes();
            await actions.getSaves();
            await actions.getUsage();

            const filteredSave = store.saves
            const filteredUsage = store.usages

            const totals = {};
            filteredSave.forEach(({ value, category }) => {
                const categoryName = category.name;
                totals[categoryName] = (totals[categoryName] || 0) + value;
            });

            const usageTotals = {};
            filteredUsage.forEach(({ value, category }) => {
                const categoryName = category.name;
                usageTotals[categoryName] = (usageTotals[categoryName] || 0) + value;
            });

            setCategoryTotals(totals);
            setUsageCategoryTotals(usageTotals);
        };

        transformData();
    }, []);


    const selectedAmount = store.saves.reduce((total, save) => total + save.value, 0);

    const selectedUsageAmount = store.usages.reduce((total, usage) => total + usage.value, 0);

    const selectedIncomeAmount = store.incomes.reduce((total, income) => total + income.value, 0);

    const balance = selectedAmount - selectedUsageAmount;

    const totalIncomes = store.incomes.reduce((sum, income) => sum + income.value, 0);
    const totalFixedExpenses = store.fixes.reduce((sum, fix) => sum + fix.value, 0);
    const totalSaves = store.saves.reduce((sum, save) => sum + save.value, 0);
    const totalOcassionals = store.ocassionals.reduce((sum, ocassional) => sum + ocassional.value, 0);

    const currentBalance = totalIncomes - (totalFixedExpenses + totalSaves + totalOcassionals);


    const logout = () => {
        actions.clearUser();
    }
    

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
                        <Link to="/myconmo" className="navbar-brand d-flex align-middle align-items-center text-decoration-none">
                            <span className="conmo text-center pt-2">CONMO</span>
                        </Link>
                        <button
                            className="btn btn-lg text-white fs-4 align-middle text-decoration-none"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasNavbar"
                            aria-controls="offcanvasNavbar"
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>
                    </div>
                    <div className="offcanvas offcanvas-end p-3" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <Link to="/myconmo" className="navbar-brand align-middle align-items-center text-decoration-none">
                                <span className="text-white fs-1">Mi</span><span className="conmo text-center fs-1">CONMO</span>
                            </Link>
                            <button 
                                type="button" 
                                className="btn text-white fs-2 px-4 py-3 d-md-none" 
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasNavbar"
                                aria-controls="offcanvasNavbar"
                            >
                                <i className="fa-solid fa-close"> </i>
                            </button>
                        </div>
                        <div className="offcanvas-body d-flex flex-column">
                            <div className="navbar-nav pe-3">
                                <Link to="/incomes" className="nav-item pb-4 px-3 fs-4 p-1">
                                    <i className="fa-solid fa-landmark"> </i> <span>Ingresos</span>
                                </Link>
                                <Link to="/expenses" className="nav-item pb-4 px-3 fs-4 p-1">
                                    <i className="fa-solid fa-receipt"> </i> <span>Gastos</span>
                                </Link>
                                <Link to="/fixedexpenses" className="nav-item pb-4 px-3 fs-4 p-1">
                                    <i className="fa-solid fa-circle-dollar-to-slot"> </i> <span>Gastos fijos</span>
                                </Link>
                                <Link to="/variableexpenses" className="nav-item pb-4 px-3 fs-4 p-1">
                                    <i className="fa-solid fa-cash-register"></i> <span>Gastos variables</span>                       
                                </Link>
                                <Link to="/saves" className="nav-item pb-4 px-3 fs-4 p-1">
                                    <i className="fa-solid fa-box"></i> <span>Reserva</span>                     
                                </Link>
                            </div>
                            <div className="available row rounded-pill text-white pb-2 pt-3 mt-3 mb-2 align-items-center text-center">
                                <h4 className="col">Disponible</h4>
                                <h4 className="col"><strong>{currentBalance.toFixed(2)} €</strong></h4>
                            </div>
                            <div className="accordion accordion-flush" id="savedBalance">
                                <div 
                                    className="available row rounded-pill text-white pb-2 pt-3 mb-2 align-items-center text-center"
                                    type="button"
                                    id="categoriesBalance"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseBalance"
                                    aria-expanded="false"
                                    aria-controls="collapseBalance"
                                >
                                    <h4 className="col">Reservado</h4>
                                    <h4 className="col"><strong>{balance.toFixed(2)} €</strong></h4>
                                </div>
                                <div id="collapseBalance" className="available collapse p-2 text-white" aria-labelledby="categoriesBalance" data-bs-parent="#savedBalance">
                                    {Object.entries(categoryTotals).map(([category, total]) => (
                                        <div key={category} className="row fs-5 px-3 lh-lg">
                                            <div className="col-8 fw-bold">{category}</div>
                                            <div className="col-4 text-end">{(total - usageCategoryTotals[category] || total).toFixed(2)} €</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="d-flex flex-column justify-content-end flex-grow-1 mt-auto">
                                {/* <Link to="/settings" className="pb-5 px-3 fs-4 p-1 text-decoration-none">
                                    <i className="fa-solid fa-gear"></i> <span className="ms-1 d-none d-sm-inline">Configuración</span>
                                </Link> */}
                                <Link to="/" className="pb-md-3 pb-1 mt-5 px-3 fs-4 p-1 mb-md-3 text-decoration-none" onClick={() => logout()}>
                                    <i className="fa-solid fa-right-from-bracket"></i> <span className="ms-1 d-inline">Cerrar sesión</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
	);
};