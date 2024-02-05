import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Spinner } from "../component/Spinner.jsx";

export const MovementsList = () => {

    const { store, actions } = useContext(Context);

    const [loading, setLoading] = useState(false);

    const [allMovements, setAllMovements] = useState([]);
    
    async function transformData() {
        setLoading(true);
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getUsage();
        await actions.getFixes();
        await actions.getOcassionals();
  
        const incomesData = store.incomes.map((income) => ({ ...income, type: 'Ingreso', balance: income.value, dateTime: new Date(income.dateTime), category: income.incomecategory.name }));
        const savesData = store.saves.map((save) => ({ ...save, type: 'Reservado', balance: -save.value, dateTime: new Date(save.dateTime), category: save.category.name }));
        const usageData = store.usages.map((usage) => ({ ...usage, type: 'Uso reservado', balance: usage.balance ?? 0, dateTime: new Date(usage.dateTime), category: usage.category.name }));
        const fixesData = store.fixes.map((fixed) => ({ ...fixed, type: 'Gasto fijo', balance: -fixed.value, dateTime: new Date(fixed.dateTime), category: fixed.fixedcategory.name }));
        const ocassionalData = store.ocassionals.map((ocassional) => ({ ...ocassional, type: 'Gasto ocasional', balance: -ocassional.value, dateTime: new Date(ocassional.dateTime), category: ocassional.ocassionalcategory.name }));

        const allData = [...incomesData, ...savesData, ...usageData, ...fixesData, ...ocassionalData];

        const sortedData = allData.sort((a, b) => a.dateTime - b.dateTime);

        sortedData.forEach((movement, index) => {
            if (index > 0) {
                movement.balance += sortedData[index - 1].balance;
            }
        });
        
        const reversedData = sortedData.reverse();

        setAllMovements(reversedData);
        setLoading(false);
    } 

    useEffect(() => {
        transformData();
        const unsubscribe = actions.subscribeToType(['incomes','saves','usages','fixes','ocassionals'], () => {
            transformData();
            console.log('Type changed.');
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 767);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 767);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function getTableRowClass(type) {
        switch (type) {
            case 'Ingreso':
                return 'col-md col-1 p-0 income-text';
            case 'Gasto fijo':
                return 'col-md col-1 p-0 fixed-text';
            case 'Gasto ocasional':
                return 'col-md col-1 p-0 ocassional-text';
            case 'Reservado':
                return 'col-md col-1 p-0 saves-text';
            case 'Uso reservado':
                return 'col-md col-1 p-0 usage-text';
            default:
                return 'col';
        }
    }

    const deleteMovement = async (movementId, movementType) => {
        let endpoint = '';
        let typeData = '';
        switch (movementType) {
            case 'Ingreso':
                endpoint = 'income';
                typeData = 'incomes';
                break;
            case 'Reservado':
                endpoint = 'saved';                
                typeData = 'saves';
                break;
            case 'Uso reservado':
                endpoint = 'usage';
                typeData = 'usages';
                break;
            case 'Gasto fijo':
                endpoint = 'fixed';
                typeData = 'fixes';
                break;
            case 'Gasto ocasional':
                endpoint = 'ocassional';
                typeData = 'ocassionals';
                break;
            default:
            console.error('Invalid movement type');
            return;
        }
        await actions.deleteMovement(movementId, endpoint, typeData);
        transformData()
    };

    const [selectedMovement, setSelectedMovement] = useState(null);

    const handleMovementClick = (index) => {
        setSelectedMovement(index === selectedMovement ? null : index);
    };

    return (
        <>
            <div className="row justify-content-center pb-md-5 pb-4 mx-md-5 mx-3">
                <h2 className="conmo-bg text-white text-center shadow rounded-pill p-3 mx-5 mb-3 fs-1 fw-semibold">Listado de movimientos</h2>
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="col text-center p-lg-5 mx-lg-5 mb-5">
                            <div className="row conmo-bg rounded-pill fs-5 text-white fw-bold py-2 mb-4">
                                <div className="col-md col-3 mobile-text">Fecha</div>
                                <div className="col-md col-1 overflow-hidden text-truncate p-0 mobile-text">Tipo</div>
                                <div className="col-md col-3 overflow-hidden text-truncate mobile-text">Categoría</div>
                                <div className="col overflow-hidden text-truncate mobile-text">Importe</div>
                                <div className="col overflow-hidden text-truncate mobile-text">Balance</div>
                            </div>
                            {allMovements.map((movement, index) => (
                                <div
                                    key={index}
                                    className={`row movements-list lh-lg d-flex align-items-center ${selectedMovement === index ? 'selected' : ''}`}
                                    onClick={() => handleMovementClick(index)}
                                >
                                    {isSmallScreen ? (
                                        <>
                                            <div className="col overflow-hidden text-truncate mobile-text">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
                                            <div className={getTableRowClass(movement.type)}>
                                                {isSmallScreen ? (
                                                    (movement.type === 'Ingreso' && 'I') ||
                                                    (movement.type === 'Uso reservado' && 'U') ||
                                                    (movement.type === 'Reservado' && 'R') ||
                                                    (movement.type === 'Gasto fijo' && 'F') ||
                                                    (movement.type === 'Gasto ocasional' && 'O') ||
                                                    movement.type
                                                ) : (
                                                    movement.type
                                                )}
                                            </div>
                                            <div className="col mobile-text overflow-hidden text-truncate">{movement.category}</div>
                                            <div className={movement.type === 'Ingreso' ? 'col mobile-text text-success' : 'col mobile-text text-danger'}>{movement.type === 'Ingreso' ? `${movement.value.toFixed(2)}€` : `-${movement.value.toFixed(2)}€`}</div>
                                            <div className="col mobile-text">{movement.balance.toFixed(2)}€</div>
                                            {selectedMovement === index && (
                                                <div className="col mobile-text conmo-text details" onClick={() => deleteMovement(movement.id, movement.type)}>
                                                    <span className="fa fa-trash"></span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="col-md col-3 overflow-hidden text-truncate mobile-text">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                                            <div className={getTableRowClass(movement.type)}>
                                                {isSmallScreen ? (
                                                    (movement.type === 'Ingreso' && 'I') ||
                                                    (movement.type === 'Uso reservado' && 'U') ||
                                                    (movement.type === 'Reservado' && 'R') ||
                                                    (movement.type === 'Gasto fijo' && 'F') ||
                                                    (movement.type === 'Gasto ocasional' && 'O') ||
                                                    movement.type
                                                ) : (
                                                    movement.type
                                                )}
                                            </div>
                                            <div className="col-md col-2 mobile-text overflow-hidden text-truncate">{movement.category}</div>
                                            <div className={movement.type === 'Ingreso' ? 'col-md col-3 mobile-text text-success' : 'col-md col-3 mobile-text text-danger'}>{movement.type === 'Ingreso' ? `${movement.value.toFixed(2)}€` : `-${movement.value.toFixed(2)}€`}</div>
                                            <div className="col-md col-3 mobile-text">{movement.balance.toFixed(2)}€</div>
                                            {selectedMovement === index && (
                                                <div className="col-md-auto fs-5 conmo-text details" onClick={() => deleteMovement(movement.id, movement.type)}>
                                                    <span className="fa fa-trash"></span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export const MovementsListIncomes = () => {

    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [incomes, setIncomes] = useState([]);

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 767);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    async function transformData() {
        setLoading(true);
        await actions.getIncomes();
  
        const incomesData = store.incomes.map((income) => ({ ...income, dateTime: new Date(income.dateTime), category: income.incomecategory.name }));
  
        const sortedData = incomesData.sort((a, b) => a.dateTime - b.dateTime);

        const reversedData = sortedData.reverse();

        setIncomes(reversedData);
        setLoading(false);
    }
  
    useEffect(() => {
        transformData();
        const unsubscribe = actions.subscribeToType(['incomes'], () => {
            transformData();
        console.log('Type changed.');
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const deleteMovement = async (movementId) => {
        await actions.deleteMovement(movementId, 'income', 'incomes');
        transformData()
    }

    const [selectedMovement, setSelectedMovement] = useState(null);

    const handleMovementClick = (index) => {
        setSelectedMovement(index === selectedMovement ? null : index);
    };
  
    return (
        <>
            <div className="row justify-content-center pb-md-5 pb-4 mx-md-5 mx-3">
                <h2 className="conmo-bg text-white text-center shadow rounded-pill p-3 mx-5 mb-3 fs-1 fw-semibold">Listado de movimientos</h2>
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="col text-center p-md-5 p-3 px-4 mx-md-5  mb-5">
                            <div className="row conmo-bg rounded-pill fs-5 text-white fw-bold py-2 mb-4">
                                <div className="col mobile-text">Fecha</div>
                                <div className="col mobile-text">Categoría</div>
                                <div className="col mobile-text">Importe</div>
                            </div>
                            {incomes.map((movement, index) => (
                                <div
                                    key={index}
                                    className={`row movements-list lh-lg d-flex align-items-center ${selectedMovement === index ? 'selected' : ''}`}
                                    onClick={() => handleMovementClick(index)}
                                >
                                    {isSmallScreen ? (
                                        <>
                                            <div className="col overflow-hidden text-truncate mobile-text">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
                                            <div className="col mobile-text overflow-hidden text-truncate">{movement.category}</div>
                                            <div className="col mobile-text text-success">{`${movement.value.toFixed(2)}€`}</div>
                                            {selectedMovement === index && (
                                                <div className="col mobile-text conmo-text details" onClick={() => deleteMovement(movement.id)}>
                                                    <span className="fa fa-trash"></span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="col">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                                            <div className="col">{movement.category}</div>
                                            <div className="col text-success">{`${movement.value.toFixed(2)} €`}</div>
                                            {selectedMovement === index && (
                                                <div className="col-md-auto fs-5 conmo-text details" onClick={() => deleteMovement(movement.id)}>
                                                    <span className="fa fa-trash"></span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export const MovementsListSaves = () => {

    const { store, actions } = useContext(Context);

    const [loading, setLoading] = useState(false);

    const [allMovements, setAllMovements] = useState([]);
    const [usage, setUsage] = useState([]);
    const [saves, setSaves] = useState([]);
    async function transformData() {
        setLoading(true);
        await actions.getUsage();
        await actions.getSaves();
  
        const usageData = store.usages.map((usage) => ({ ...usage, type: 'Uso de reservado', balance: -usage.value, dateTime: new Date(usage.dateTime), category: usage.category.name }));
        setUsage(usageData);
  
        const savesData = store.saves.map((save) => ({ ...save, type: 'Reservado', balance: save.value, dateTime: new Date(save.dateTime), category: save.category.name }));
        setSaves(savesData);

        const allData = [...usageData, ...savesData];

        const sortedData = allData.sort((a, b) => a.dateTime - b.dateTime);

        sortedData.forEach((movement, index) => {
            if (index > 0) {
                movement.balance += sortedData[index - 1].balance;
            }
        });
            
        const reversedData = sortedData.reverse();
        setAllMovements(reversedData);

        setLoading(false);
    }
    useEffect(() => {
        transformData();
        const unsubscribe = actions.subscribeToType(['saves', 'usages'], () => {
            transformData();
            console.log('Type changed.');
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 767);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 767);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function getTableRowClass(type) {
        switch (type) {
            case 'Uso de reservado':
                return 'col-md col-1 p-0 overflow-hidden text-truncate usage-text';
            case 'Reservado':
                return 'col-md col-1 p-0 overflow-hidden text-truncate saves-text';
            default:
                return 'col';
        }
    }

    const deleteMovement = async (movementId, movementType) => {
        let endpoint = '';
        let typeData = '';
        switch (movementType) {
            case 'Reservado':
                endpoint = 'saved';                
                typeData = 'saves';
                break;
            case 'Uso de reservado':
                endpoint = 'usage';
                typeData = 'usages';
                break;
            default:
            console.error('Invalid movement type');
            return;
        }
        await actions.deleteMovement(movementId, endpoint, typeData);
        transformData()
    };

    const [selectedMovement, setSelectedMovement] = useState(null);

    const handleMovementClick = (index) => {
        setSelectedMovement(index === selectedMovement ? null : index);
    };

    return (
        <>
            <div className="row justify-content-center pb-lg-5 pb-4 mx-lg-5 mx-3">
                <h2 className="conmo-bg text-white text-center shadow rounded-pill p-3 mx-5 mb-3 fs-1 fw-semibold">Listado de movimientos</h2>
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="col text-center p-lg-5 p-3 px-4 mx-lg-5 mb-5">
                            <div className="row conmo-bg rounded-pill fs-5 text-white fw-bold py-2 mb-4">
                                <div className="col mobile-text">Fecha</div>
                                <div className="col-md col-1 overflow-hidden text-truncate p-0 mobile-text">Tipo</div>
                                <div className="col-md col-2 overflow-hidden text-truncate mobile-text">Categoría</div>
                                <div className="col overflow-hidden text-truncate mobile-text">Importe</div>
                                <div className="col overflow-hidden text-truncate mobile-text">Balance</div>
                            </div>
                            {allMovements.map((movement, index) => (
                                <div
                                    key={index}
                                    className={`row movements-list lh-lg d-flex align-items-center ${selectedMovement === index ? 'selected' : ''}`}
                                    onClick={() => handleMovementClick(index)}
                                >
                                    {isSmallScreen ? (
                                        <>
                                            <div className="col overflow-hidden text-truncate mobile-text">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
                                            <div className={getTableRowClass(movement.type)}>
                                                {isSmallScreen ? (
                                                    (movement.type === 'Uso de reservado' && 'U') ||
                                                    (movement.type === 'Reservado' && 'R') ||
                                                    movement.type
                                                ) : (
                                                    movement.type
                                                )}
                                            </div>
                                            <div className="col mobile-text overflow-hidden text-truncate">{movement.category}</div>
                                            <div className={movement.type === 'Uso de reservado' ? 'col mobile-text text-danger' : 'col mobile-text text-success'}>{movement.type === 'Uso de reservado' ? `-${movement.value.toFixed(2)}€` : `${movement.value.toFixed(2)}€`}</div>
                                            <div className="col mobile-text">{(movement.balance).toFixed(2)}€</div>
                                            {selectedMovement === index && (
                                                <div className="col mobile-text conmo-text details" onClick={() => deleteMovement(movement.id, movement.type)}>
                                                    <span className="fa fa-trash"></span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="col-md col-3 overflow-hidden text-truncate mobile-text">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                                            <div className={getTableRowClass(movement.type)}>
                                                {isSmallScreen ? (
                                                    (movement.type === 'Uso de reservado' && 'U') ||
                                                    (movement.type === 'Reservado' && 'R') ||
                                                    movement.type
                                                ) : (
                                                    movement.type
                                                )}
                                            </div>
                                            <div className="col-md col-2 mobile-text overflow-hidden text-truncate">{movement.category}</div>
                                            <div className={movement.type === 'Uso de reservado' ? 'col-md col-3 mobile-text text-danger' : 'col-md col-3 mobile-text text-success'}>{movement.type === 'Uso de reservado' ? `-${movement.value.toFixed(2)}€` : `${movement.value.toFixed(2)}€`}</div>
                                            <div className="col-md col-3 mobile-text">{(movement.balance).toFixed(2)}€</div>
                                            {selectedMovement === index && (
                                                <div className="col-md-auto fs-5 conmo-text details" onClick={() => deleteMovement(movement.id, movement.type)}>
                                                    <span className="fa fa-trash"></span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export const MovementsListExpenses = () => {

    const { store, actions } = useContext(Context);

    const [loading, setLoading] = useState(false);

    const [allMovements, setAllMovements] = useState([]);
    async function transformData() {
        setLoading(true);
        await actions.getUsage();
        await actions.getFixes();
        await actions.getOcassionals();
  
        const usageData = store.usages.map((usage) => ({ ...usage, type: 'Uso de reservado', dateTime: new Date(usage.dateTime), category: usage.category.name }));

        const fixesData = store.fixes.map((fixed) => ({ ...fixed, type: 'Gasto fijo', dateTime: new Date(fixed.dateTime), category: fixed.fixedcategory.name }));
  
        const ocassionalData = store.ocassionals.map((ocassional) => ({ ...ocassional, type: 'Gasto ocasional', dateTime: new Date(ocassional.dateTime), category: ocassional.ocassionalcategory.name }));

        const allData = [...usageData, ...fixesData, ...ocassionalData];

        const sortedData = allData.sort((a, b) => b.dateTime - a.dateTime);

        setAllMovements(sortedData);
        setLoading(false);
    }  
    useEffect(() => {
        transformData();
        const unsubscribe = actions.subscribeToType(['usage','fixes','ocassionals'], () => {
            transformData();
            console.log('Type changed.');
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 767); 

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function getTableRowClass(type) {
        switch (type) {
            case 'Uso de reservado':
                return 'col mobile-text usage-text';
            case 'Gasto fijo':
                return 'col mobile-text fixed-text';
            case 'Gasto ocasional':
                return 'col mobile-text ocassional-text';
            default:
                return 'col mobile-text';
        }
    }

    const deleteMovement = async (movementId, movementType) => {
        let endpoint = '';
        let typeData = '';
        switch (movementType) {
            case 'Uso de reservado':
                endpoint = 'usage';
                typeData = 'usages';
                break;
            case 'Gasto fijo':
                endpoint = 'fixed';
                typeData = 'fixes';
                break;
            case 'Gasto ocasional':
                endpoint = 'ocassional';
                typeData = 'ocassionals';
                break;
            default:
            console.error('Invalid movement type');
            return;
        }
        await actions.deleteMovement(movementId, endpoint, typeData);
        transformData()
    };

    const [selectedMovement, setSelectedMovement] = useState(null);

    const handleMovementClick = (index) => {
        setSelectedMovement(index === selectedMovement ? null : index);
    };

    return (
        <>
            <div className="row justify-content-center pb-lg-5 pb-4 mx-lg-5 mx-3 mt-5">
                <h2 className="conmo-bg text-white text-center shadow rounded-pill p-3 mx-5 mb-3 fs-1 fw-semibold">Listado de movimientos</h2>
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="col text-center p-lg-5 p-3 px-4 mx-lg-5 mb-5">
                            <div className="row conmo-bg rounded-pill fs-5 text-white fw-bold py-2 mb-4">
                                <div className="col mobile-text">Fecha</div>
                                <div className="col mobile-text">Tipo</div>
                                <div className="col overflow-hidden text-truncate mobile-text">Categoría</div>
                                <div className="col mobile-text">Importe</div>
                            </div>
                            {allMovements.map((movement, index) => (
                                <div
                                    key={index}
                                    className={`row movements-list lh-lg d-flex align-items-center ${selectedMovement === index ? 'selected' : ''}`}
                                    onClick={() => handleMovementClick(index)}
                                >
                                    {isSmallScreen ? (
                                        <>
                                            <div className="col overflow-hidden text-truncate mobile-text">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
                                            <div className={getTableRowClass(movement.type)}>
                                            {isSmallScreen ? (
                                                (movement.type === 'Uso de reservado' && 'U') ||
                                                (movement.type === 'Gasto fijo' && 'F') ||
                                                (movement.type === 'Gasto ocasional' && 'O') ||
                                                movement.type
                                            ) : (
                                                movement.type
                                            )}
                                            </div>
                                            <div className="col mobile-text overflow-hidden text-truncate">{movement.category}</div>
                                            <div className="col mobile-text text-danger">{`-${movement.value.toFixed(2)}€`}</div>
                                            {selectedMovement === index && (
                                                <div className="col mobile-text conmo-text details" onClick={() => deleteMovement(movement.id, movement.type)}>
                                                    <span className="fa fa-trash"></span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="col-md col-3 overflow-hidden text-truncate mobile-text">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                                            <div className={getTableRowClass(movement.type)}>
                                                {isSmallScreen ? (
                                                    (movement.type === 'Uso de reservado' && 'U') ||
                                                    (movement.type === 'Reservado' && 'R') ||
                                                    movement.type
                                                ) : (
                                                    movement.type
                                                )}
                                            </div>
                                            <div className="col-md col-2 mobile-text overflow-hidden text-truncate">{movement.category}</div>
                                            <div className="col mobile-text text-danger">{`-${movement.value.toFixed(2)}€`}</div>
                                            {selectedMovement === index && (
                                                <div className="col-md-auto fs-5 conmo-text details" onClick={() => deleteMovement(movement.id, movement.type)}>
                                                    <span className="fa fa-trash"></span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export const MovementsListFixed = () => {

    const { store, actions } = useContext(Context);

    const [loading, setLoading] = useState(false);
    
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 767);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [fixes, setFixes] = useState([]);
    async function transformData() {
        setLoading(true);
        await actions.getFixes();

        const fixesData = store.fixes.map((fixed) => ({ ...fixed, dateTime: new Date(fixed.dateTime), category: fixed.fixedcategory.name }));

        const sortedData = fixesData.sort((a, b) => b.dateTime - a.dateTime);

        setFixes(sortedData);
        setLoading(false);
    } 
    useEffect(() => {
        transformData();
        const unsubscribe = actions.subscribeToType('fixes', () => {
            transformData();
            console.log('Type changed.');
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const deleteMovement = async (movementId) => {
        await actions.deleteMovement(movementId, 'fixed', 'fixes');
        transformData()
    }

    const [selectedMovement, setSelectedMovement] = useState(null);

    const handleMovementClick = (index) => {
        setSelectedMovement(index === selectedMovement ? null : index);
    };

    return (
        <>
            <div className="row justify-content-center pb-md-5 pb-4 mx-md-5 mx-3">
                <h2 className="conmo-bg text-white text-center shadow rounded-pill p-3 mx-5 mb-3 fs-1 fw-semibold">Listado de movimientos</h2>
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="col text-center p-md-5 p-3 px-4 mx-md-5  mb-5">
                            <div className="row conmo-bg rounded-pill fs-5 text-white fw-bold py-2 mb-4">
                                <div className="col mobile-text">Fecha</div>
                                <div className="col mobile-text">Categoría</div>
                                <div className="col mobile-text">Importe</div>
                            </div>
                            {fixes.map((movement, index) => (
                                <div                              
                                    key={index}
                                    className={`row movements-list lh-lg d-flex align-items-center ${selectedMovement === index ? 'selected' : ''}`}
                                    onClick={() => handleMovementClick(index)}
                                >
                                    {isSmallScreen ? (
                                        <>
                                            <div className="col overflow-hidden text-truncate mobile-text">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
                                            <div className="col mobile-text overflow-hidden text-truncate">{movement.category}</div>
                                            <div className="col mobile-text text-danger">{`-${movement.value.toFixed(2)}€`}</div>
                                            {selectedMovement === index && (
                                                <div className="col mobile-text conmo-text details" onClick={() => deleteMovement(movement.id)}>
                                                    <span className="fa fa-trash"></span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="col">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                                            <div className="col mobile-text overflow-hidden text-truncate">{movement.category}</div>
                                            <div className="col mobile-text text-danger">{`- ${movement.value.toFixed(2)} €`}</div>
                                            {selectedMovement === index && (
                                                <div className="col-md-auto fs-5 conmo-text details" onClick={() => deleteMovement(movement.id)}>
                                                    <span className="fa fa-trash"></span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export const MovementsListOcassional = () => {

    const { store, actions } = useContext(Context);

    const [loading, setLoading] = useState(false);

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 767);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [ocassionals, setOcassionals] = useState([]);

    async function transformData() {
        setLoading(true);
        await actions.getOcassionals();

        const ocassionalsData = store.ocassionals.map((ocassional) => ({ ...ocassional, dateTime: new Date(ocassional.dateTime), category: ocassional.ocassionalcategory.name }));

        const sortedData = ocassionalsData.sort((a, b) => b.dateTime - a.dateTime);

        setOcassionals(sortedData);
        setLoading(false);
    } 

    useEffect(() => {
        transformData();
        const unsubscribe = actions.subscribeToType(['ocassionals'], () => {
            transformData();
            console.log('Type changed.');
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const deleteMovement = async (movementId) => {
        await actions.deleteMovement(movementId, 'ocassional', 'ocassionals');
        transformData()
    }

    const [selectedMovement, setSelectedMovement] = useState(null);

    const handleMovementClick = (index) => {
        setSelectedMovement(index === selectedMovement ? null : index);
    };

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <div className="row justify-content-center pb-md-5 pb-4 mx-md-5 mx-3">
                        <h2 className="conmo-bg text-white text-center shadow rounded-pill p-3 mx-5 mb-3 fs-1 fw-semibold">Listado de movimientos</h2>
                        <div className="col text-center p-md-5 p-3 px-4 mx-md-5  mb-5">
                            <div className="row conmo-bg rounded-pill fs-5 text-white fw-bold py-2 mb-4">
                                <div className="col mobile-text">Fecha</div>
                                <div className="col mobile-text">Categoría</div>
                                <div className="col mobile-text">Importe</div>
                            </div>
                            {ocassionals.map((movement, index) => (
                                <div                              
                                    key={index}
                                    className={`row movements-list lh-lg d-flex align-items-center ${selectedMovement === index ? 'selected' : ''}`}
                                    onClick={() => handleMovementClick(index)}
                                >
                                    {isSmallScreen ? (
                                        <>
                                            <div className="col overflow-hidden text-truncate mobile-text">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
                                            <div className="col mobile-text overflow-hidden text-truncate">{movement.category}</div>
                                            <div className="col mobile-text text-danger">{`-${movement.value.toFixed(2)}€`}</div>
                                            {selectedMovement === index && (
                                                <div className="col mobile-text conmo-text details" onClick={() => deleteMovement(movement.id)}>
                                                    <span className="fa fa-trash"></span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="col">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                                            <div className="col mobile-text overflow-hidden text-truncate">{movement.category}</div>
                                            <div className="col mobile-text text-danger">{`- ${movement.value.toFixed(2)} €`}</div>
                                            {selectedMovement === index && (
                                                <div className="col-md-auto fs-5 conmo-text details" onClick={() => deleteMovement(movement.id)}>
                                                    <span className="fa fa-trash"></span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}