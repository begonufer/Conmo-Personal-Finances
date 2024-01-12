import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const MovementsList = () => {

    const { store, actions } = useContext(Context);

    const [allMovements, setAllMovements] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [saves, setSaves] = useState([]);
    const [usage, setUsage] = useState([]);
    const [fixes, setFixes] = useState([]);
    const [ocassionals, setOcassionals] = useState([]);
  
    useEffect(() => {
      async function transformData() {
        await actions.getIncomes();
        await actions.getSaves();
        await actions.getUsage();
        await actions.getFixes();
        await actions.getOcassionals();
  
        const incomesData = store.incomes.map((income) => ({ ...income, type: 'Ingreso', balance: income.value, dateTime: new Date(income.dateTime), category: income.incomecategory.name }));
        setIncomes(incomesData);
  
        const savesData = store.saves.map((save) => ({ ...save, type: 'Reservado', balance: -save.value, dateTime: new Date(save.dateTime), category: save.category.name }));
        setSaves(savesData);  

        const usageData = store.usages.map((usage) => ({ ...usage, type: 'Uso reservado', balance: usage.balance ?? 0, dateTime: new Date(usage.dateTime), category: usage.category.name }));
        setUsage(usageData);
  
        const fixesData = store.fixes.map((fixed) => ({ ...fixed, type: 'Gasto fijo', balance: -fixed.value, dateTime: new Date(fixed.dateTime), category: fixed.fixedcategory.name }));
        setFixes(fixesData);
  
        const ocassionalData = store.ocassionals.map((ocassional) => ({ ...ocassional, type: 'Gasto ocasional', balance: -ocassional.value, dateTime: new Date(ocassional.dateTime), category: ocassional.ocassionalcategory.name }));
        setOcassionals(ocassionalData);

        const allData = [...incomesData, ...savesData, ...usageData, ...fixesData, ...ocassionalData];

            const sortedData = allData.sort((a, b) => a.dateTime - b.dateTime);

            sortedData.forEach((movement, index) => {
                if (index > 0) {
                    movement.balance += sortedData[index - 1].balance;
                }
            });
            
            const reversedData = sortedData.reverse();

            setAllMovements(reversedData);
      }
  
      transformData();
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
                return 'col-md col-1 p-0 income-movements';
            case 'Gasto fijo':
                return 'col-md col-1 p-0 fixed-movements';
            case 'Gasto ocasional':
                return 'col-md col-1 p-0 ocassional-movements';
            case 'Reservado':
                return 'col-md col-1 p-0 saves-movements';
            case 'Uso reservado':
                return 'col-md col-1 p-0 usage-movements';
            default:
                return 'col';
        }
    }

    return (
        <>
            <div className="row justify-content-center pb-md-5 pb-4 mx-md-5 mx-3">
                <h2 className="movements-head text-white text-center shadow rounded-pill p-3 mx-5 mb-3 fs-1 fw-semibold">Listado de movimientos</h2>
                <div className="col text-center p-lg-5 p-3 px-4 mx-lg-5 mb-5">
                    <div className="row movements-head rounded-pill fs-5 text-white fw-bold py-2 mb-4">
                        <div className="col mobile-text">Fecha</div>
                        <div className="col-md col-1 p-0 mobile-text">Tipo</div>
                        <div className="col-md col-3 mobile-text">Categoría</div>
                        <div className="col mobile-text">Importe</div>
                        <div className="col mobile-text">Balance</div>
                    </div>
                    {allMovements.map((movement) => (  
                        <div key={movement.value} className="row movements-list lh-lg d-flex align-items-center">
                            {isSmallScreen
                                ? <div className="col mobile-text">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
                                : <div className="col mobile-text">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                            }
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
                            <div className="col-md col-3 mobile-text">{movement.category}</div>
                            <div className={movement.type === 'Ingreso' ? 'col mobile-text text-success' : 'col mobile-text text-danger'}>{movement.type === 'Ingreso' ? `${movement.value} €` : `- ${movement.value} €`}</div>
                            <div className="col mobile-text">{movement.balance} €</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}