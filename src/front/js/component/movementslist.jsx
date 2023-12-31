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

    function getTableRowClass(type) {
        switch (type) {
            case 'Ingreso':
                return 'col income-movements';
            case 'Gasto fijo':
                return 'col fixed-movements';
            case 'Gasto ocasional':
                return 'col ocassional-movements';
            case 'Reservado':
                return 'col saves-movements';
            case 'Uso reservado':
                return 'col usage-movements';
            default:
                return 'col';
        }
    }

    return (
        <>
            <div className="container p-4 mb-5">
                <h2 className="movements-head text-white text-center py-3 shadow rounded-pill p-3 mb-5 fs-1 fw-semibold">Listado de movimientos</h2>
                <div className="container text-center p-5">
                    <div className="row movements-head rounded-pill fs-5 text-white fw-bold py-2 mb-4">
                        <div className="col">Fecha</div>
                        <div className="col">Tipo</div>
                        <div className="col">Categoría</div>
                        <div className="col">Importe</div>
                        <div className="col">Balance</div>
                    </div>
                    {allMovements.map((movement) => (  
                        <div key={movement.index} className="row movements-list lh-lg"> 
                        {/* //cambiado temporalmente de movement.id a movement.index, pendiente de revisión// */}
                            <div className="col">{movement.dateTime.toLocaleDateString()}</div>
                            <div className={getTableRowClass(movement.type)}>{movement.type}</div>
                            <div className="col">{movement.category}</div>
                            <div className={movement.type === 'Ingreso' ? 'col text-success' : 'col text-danger'}>{movement.type === 'Ingreso' ? `${movement.value} €` : `- ${movement.value} €`}</div>
                            <div className="col">{movement.balance} €</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}