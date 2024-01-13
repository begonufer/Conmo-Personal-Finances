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
            <div className="row justify-content-center pb-md-5 pb-4 mx-md-5 mx-3">
                <h2 className="movements-head text-white text-center shadow rounded-pill p-3 mx-5 mb-3 fs-1 fw-semibold">Listado de movimientos</h2>
                <div className="col text-center p-md-5 p-3 px-4 mx-md-5  mb-5">
                    <div className="row movements-head rounded-pill fs-5 text-white fw-bold py-2 mb-4">
                        <div className="col mobile-text">Fecha</div>
                        <div className="col mobile-text">Categoría</div>
                        <div className="col mobile-text">Importe</div>
                    </div>
                    {ocassionals.map((movement, index) => (  
                        <div key={index} className="row movements-list lh-lg d-flex align-items-center">
                            <div className="col mobile-text">{movement.dateTime.toLocaleDateString()}</div>
                            <div className="col mobile-text overflow-hidden text-truncate">{movement.category}</div>
                            <div className="col mobile-text text-danger">{`- ${movement.value.toFixed(2)} €`}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}