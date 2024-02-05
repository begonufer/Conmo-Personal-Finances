import React , { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {

    const { store, actions } = useContext(Context);

    const [categoryTotals, setCategoryTotals] = useState({});
    const [usageCategoryTotals, setUsageCategoryTotals] = useState({});
    const getCategorySavesBalance = async () => {
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

    const [savesBalance, setSavesBalance] = useState([]);
    const [totalBalance, setTotalBalance] = useState([]);

    const getBalances = async () => {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getUsage();
        await actions.getFixes();
        await actions.getOcassionals();

        const incomesAmount = store.incomes.reduce((total, income) => total + income.value, 0);
        const savesAmount = store.saves.reduce((total, save) => total + save.value, 0);
        const usageAmount = store.usages.reduce((total, usage) => total + usage.value, 0);
        const fixesAmount = store.fixes.reduce((total, fixed) => total + fixed.value, 0);
        const ocassionalsAmount = store.ocassionals.reduce((total, ocassional) => total + ocassional.value, 0);

        const balance = savesAmount - usageAmount;
        setSavesBalance(balance.toFixed(2));

        const generalBalance = incomesAmount - (fixesAmount + savesAmount + ocassionalsAmount);
        setTotalBalance(generalBalance.toFixed(2));
    }; 

    useEffect(() => {
        getBalances();
        getCategorySavesBalance();
        const unsubscribe = actions.subscribeToType(['saves','usages'], () => {
            getBalances();
            getCategorySavesBalance();
            console.log('Type changed.');
        });
        return () => {
            unsubscribe();
        };
    }, []);
    
    const logout = () => {
        actions.clearUser();
    }

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
                    <div className="offcanvas offcanvas-end p-3 conmo-bg" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
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
                                <Link to="/ocassionalexpenses" className="nav-item pb-4 ps-3 fs-4 p-1">
                                    <i className="fa-solid fa-cash-register"></i> <span>Gastos ocasionales</span>                       
                                </Link>
                                <Link to="/saves" className="nav-item pb-4 px-3 fs-4 p-1">
                                    <i className="fa-solid fa-box"></i> <span>Reserva</span>                     
                                </Link>
                            </div>
                            <div className="conmo-light-bg row rounded-pill text-white pb-2 pt-3 mt-3 mb-2 align-items-center text-center">
                                <h4 className="col">Disponible</h4>
                                <h4 className="col"><strong>{totalBalance} €</strong></h4>
                            </div>
                            <div className="accordion accordion-flush" id="savedBalance">
                                <div 
                                    className="conmo-light-bg row rounded-pill text-white pb-2 pt-3 mb-2 align-items-center text-center"
                                    type="button"
                                    id="categoriesBalance"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseBalance"
                                    aria-expanded="false"
                                    aria-controls="collapseBalance"
                                >
                                    <h4 className="col">Reservado</h4>
                                    <h4 className="col"><strong>{savesBalance}€</strong></h4>
                                </div>
                                <div id="collapseBalance" className="conmo-light-bg collapse p-2 text-white" aria-labelledby="categoriesBalance" data-bs-parent="#savedBalance">
                                    {Object.entries(categoryTotals).map(([category, total]) => (
                                        <div key={category} className="row fs-5 px-3 lh-lg">
                                            <div className="col-8 mobile-text fw-bold">{category}</div>
                                            <div className="col-4 mobile-text text-end">{(total - usageCategoryTotals[category] || total).toFixed(2)}€</div>
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