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

    function getTableRowClass(type) {
        switch (type) {
            case 'Uso de reservado':
                return 'col usage-movements';
            case 'Gasto fijo':
                return 'col fixed-movements';
            case 'Gasto ocasional':
                return 'col ocassional-movements';
            default:
                return 'col';
        }
    }

    return (
        <>
            <div className="mb-5">
                <h2 className="movements-head text-white text-center shadow rounded-pill p-3 mx-5 mb-3 fs-1 fw-semibold">Listado de movimientos</h2>
                <div className="container text-center p-5">
                    <div className="row movements-head rounded-pill fs-5 text-white fw-bold py-2 mb-4">
                        <div className="col">Fecha</div>
                        <div className="col">Tipo</div>
                        <div className="col">Categoría</div>
                        <div className="col">Importe</div>
                    </div>
                    {allMovements.map((movement) => (  
                        <div key={movement.id} className="row movements-list lh-lg">
                            <div className="col">{movement.dateTime.toLocaleDateString()}</div>
                            <div className={getTableRowClass(movement.type)}>{movement.type}</div>
                            <div className="col">{movement.category}</div>
                            <div className="col text-danger">{`- ${movement.value} €`}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}