import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { format } from "date-fns";
import { Spinner } from "../component/Spinner.jsx";

export const MovementsListOcassional = () => {

    const { store, actions } = useContext(Context);

    const [loading, setLoading] = useState(false);

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

    const [ocassionals, setOcassionals] = useState([]);
  
    useEffect(() => {
      async function transformData() {
        setLoading(true);
        await actions.getOcassionals();

        const ocassionalsData = store.ocassionals.map((ocassional) => ({ ...ocassional, dateTime: new Date(ocassional.dateTime), category: ocassional.ocassionalcategory.name }));

        const sortedData = ocassionalsData.sort((a, b) => b.dateTime - a.dateTime);

        setOcassionals(sortedData);
        setLoading(false);
      } 
      transformData();
    }, []);

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
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
                                    {isSmallScreen
                                        ? <div className="col overflow-hidden text-truncate mobile-text">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
                                        : <div className="col">{movement.dateTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                                    }
                                    <div className="col mobile-text overflow-hidden text-truncate">{movement.category}</div>
                                    <div className="col mobile-text text-danger">{`- ${movement.value.toFixed(2)} €`}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}