import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { format } from "date-fns";

export const MovementsListSaves = () => {

    const { store, actions } = useContext(Context);

    const [allMovements, setAllMovements] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [saves, setSaves] = useState([]);
  
    useEffect(() => {
      async function transformData() {
        await actions.getIncomes();
        await actions.getSaves();
  
        const incomesData = store.incomes.map((income) => ({ ...income, type: 'Ingreso', balance: -income.value, dateTime: new Date(income.dateTime), category: income.incomecategory.name }));
        setIncomes(incomesData);
  
        const savesData = store.saves.map((save) => ({ ...save, type: 'Reservado', balance: save.value, dateTime: new Date(save.dateTime), category: save.category.name }));
        setSaves(savesData);

        const allData = [...incomesData, ...savesData];

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
            case 'Reservado':
                return 'col saves-movements';
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
                        <div className="col">Balance</div>
                    </div>
                    {allMovements.map((movement) => (  
                        <div key={movement.id} className="row movements-list lh-lg">
                            <div className="col">{movement.dateTime.toLocaleDateString()}</div>
                            <div className={getTableRowClass(movement.type)}>{movement.type}</div>
                            <div className="col">{movement.category}</div>
                            <div className={movement.type === 'Ingreso' ? 'col text-danger' : 'col text-success'}>{movement.type === 'Ingreso' ? `- ${movement.value} €` : `${movement.value} €`}</div>
                            <div className="col">{movement.balance} €</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}