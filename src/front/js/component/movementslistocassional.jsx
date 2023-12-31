import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { format } from "date-fns";

export const MovementsListOcassional = () => {

    const { store, actions } = useContext(Context);

    const [ocassionals, setOcassionals] = useState([]);
  
    useEffect(() => {
      async function transformData() {
        await actions.getOcassionals();

        const ocassionalsData = store.ocassionals.map((ocassional) => ({ ...ocassional, dateTime: new Date(ocassional.dateTime), category: ocassional.ocassionalcategory.name }));

        const sortedData = ocassionalsData.sort((a, b) => b.dateTime - a.dateTime);

        setOcassionals(sortedData);
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
                    {ocassionals.map((movement) => (  
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