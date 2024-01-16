import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { format } from "date-fns";
import { Spinner } from "../component/Spinner.jsx";

export const MovementsListSaves = () => {

    const { store, actions } = useContext(Context);

    const [loading, setLoading] = useState(false);

    const [allMovements, setAllMovements] = useState([]);
    const [usage, setUsage] = useState([]);
    const [saves, setSaves] = useState([]);
  
    useEffect(() => {
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
            case 'Uso de reservado':
                return 'col-md col-1 p-0 overflow-hidden text-truncate usage-movements';
            case 'Reservado':
                return 'col-md col-1 p-0 overflow-hidden text-truncate saves-movements';
            default:
                return 'col';
        }
    }

    return (
        <>
            <div className="row justify-content-center pb-lg-5 pb-4 mx-lg-5 mx-3">
                <h2 className="movements-head text-white text-center shadow rounded-pill p-3 mx-5 mb-3 fs-1 fw-semibold">Listado de movimientos</h2>
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="col text-center p-lg-5 p-3 px-4 mx-lg-5 mb-5">
                            <div className="row movements-head rounded-pill fs-5 text-white fw-bold py-2 mb-4">
                                <div className="col mobile-text">Fecha</div>
                                <div className="col-md col-1 overflow-hidden text-truncate p-0 mobile-text">Tipo</div>
                                <div className="col-md col-2 overflow-hidden text-truncate mobile-text">Categoría</div>
                                <div className="col overflow-hidden text-truncate mobile-text">Importe</div>
                                <div className="col overflow-hidden text-truncate mobile-text">Balance</div>
                            </div>
                            {allMovements.map((movement, index) => (  
                                <div key={index} className="row movements-list lh-lg d-flex align-items-center">
                                    {isSmallScreen
                                        ? <div className="col-md col-3 overflow-hidden text-truncate mobile-text">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
                                        : <div className="col-md col-3 overflow-hidden text-truncate mobile-text">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                                    }
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
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}