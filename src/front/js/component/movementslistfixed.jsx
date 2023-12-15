import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const MovementsListFixed = () => {

    const { store, actions } = useContext(Context);

    const [fixes, setFixes] = useState([]);
  
    useEffect(() => {
      async function transformData() {
        await actions.getFixes();

        const fixesData = store.fixes.map((fixed) => ({ ...fixed, dateTime: new Date(fixed.dateTime), category: fixed.fixedcategory.name }));

        const sortedData = fixesData.sort((a, b) => b.dateTime - a.dateTime);

        setFixes(sortedData);
      } 
      transformData();
    }, []);

    return (
        <>
            <div className="mb-5">
                <h2 className="movements-head text-white text-center shadow rounded-pill p-3 mx-5 mb-3 fs-1 fw-semibold">Listado de movimientos</h2>
                <div className="container text-center p-5">
                    <div className="row movements-head rounded-pill fs-5 text-white fw-bold py-2 mb-4">
                        <div className="col">Fecha</div>
                        <div className="col">Categoría</div>
                        <div className="col">Importe</div>
                    </div>
                    {fixes.map((movement) => (  
                        <div key={movement.id} className="row movements-list lh-lg">
                            <div className="col">{movement.dateTime.toLocaleDateString()}</div>
                            <div className="col">{movement.category}</div>
                            <div className="col text-danger">{`- ${movement.value} €`}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}