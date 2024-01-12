import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const MovementsListIncomes = () => {

    const { store, actions } = useContext(Context);

    const [incomes, setIncomes] = useState([]);
  
    useEffect(() => {
      async function transformData() {
        await actions.getIncomes();
  
        const incomesData = store.incomes.map((income) => ({ ...income, dateTime: new Date(income.dateTime), category: income.incomecategory.name }));
  
        const sortedData = incomesData.sort((a, b) => a.dateTime - b.dateTime);

        const reversedData = sortedData.reverse();

        setIncomes(reversedData);
      }
  
      transformData();
    }, []);

    return (
        <>
            <div className="row justify-content-center pb-md-5 pb-4 mx-md-5 mx-3">
                <h2 className="movements-head text-white text-center shadow rounded-pill p-3 mx-5 mb-3 fs-1 fw-semibold">Listado de movimientos</h2>
                <div className="col text-center p-md-5 p-3 px-4 mx-md-5  mb-5">
                    <div className="row movements-head rounded-pill fs-5 text-white fw-bold py-2 mb-4">
                        <div className="col mobile-text">Fecha</div>
                        <div className="col mobile-text">Categoría</div>
                        <div className="col mobile-text">Importe</div>
                    </div>
                    {incomes.map((movement) => (  
                        <div key={movement.id} className="row movements-list lh-lg d-flex align-items-center">
                            <div className="col mobile-text">{movement.dateTime.toLocaleDateString()}</div>
                            <div className="col mobile-text">{movement.category}</div>
                            <div className="col mobile-text text-success">{`${movement.value} €`}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}