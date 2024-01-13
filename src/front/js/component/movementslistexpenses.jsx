import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const MovementsListExpenses = () => {

    const { store, actions } = useContext(Context);

    const [allMovements, setAllMovements] = useState([]);
  
    useEffect(() => {
      async function transformData() {
        await actions.getUsage();
        await actions.getFixes();
        await actions.getOcassionals();
  
        const usageData = store.usages.map((usage) => ({ ...usage, type: 'Uso de reservado', dateTime: new Date(usage.dateTime), category: usage.category.name }));

        const fixesData = store.fixes.map((fixed) => ({ ...fixed, type: 'Gasto fijo', dateTime: new Date(fixed.dateTime), category: fixed.fixedcategory.name }));
  
        const ocassionalData = store.ocassionals.map((ocassional) => ({ ...ocassional, type: 'Gasto ocasional', dateTime: new Date(ocassional.dateTime), category: ocassional.ocassionalcategory.name }));

        const allData = [...usageData, ...fixesData, ...ocassionalData];

            const sortedData = allData.sort((a, b) => b.dateTime - a.dateTime);

            setAllMovements(sortedData);
      }
  
      transformData();
    }, []);

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 767); // Estado para seguir el tamaño de la pantalla

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
                return 'col mobile-text usage-movements';
            case 'Gasto fijo':
                return 'col mobile-text fixed-movements';
            case 'Gasto ocasional':
                return 'col mobile-text ocassional-movements';
            default:
                return 'col mobile-text';
        }
    }

    return (
        <>
            <div className="row justify-content-center pb-lg-5 pb-4 mx-lg-5 mx-3 mt-5">
                <h2 className="movements-head text-white text-center shadow rounded-pill p-3 mx-5 mb-3 fs-1 fw-semibold">Listado de movimientos</h2>
                <div className="col text-center p-lg-5 p-3 px-4 mx-lg-5 mb-5">
                    <div className="row movements-head rounded-pill fs-5 text-white fw-bold py-2 mb-4">
                        <div className="col mobile-text">Fecha</div>
                        <div className="col mobile-text">Tipo</div>
                        <div className="col mobile-text">Categoría</div>
                        <div className="col mobile-text">Importe</div>
                    </div>
                    {allMovements.map((movement, index) => (  
                        <div key={index} className="row movements-list lh-lg d-flex align-items-center">
                            <div className="col-md col mobile-text">{movement.dateTime.toLocaleDateString()}</div>
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
                            <div className="col mobile-text text-danger">{`- ${movement.value.toFixed(2)} €`}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}