import React, { useState } from "react";
import { Collapse } from 'react-bootstrap';

export const Header = (props) => {

    const [openInfo, setOpenInfo] = useState(false);

    const handleToggle = () => {
      setOpenInfo(!openInfo);
    };

    return (
        <>
            <div className="text-center text-white" id="left-background">
                <h1 className="header p-1 pb-3 pt-5 mt-5 mb-0">
                    {props.type} <i className="icon fas fa-info-circle" onClick={handleToggle} ></i>
                </h1>
                <div>
                    <Collapse in={openInfo}>
                        <div className="texto-desplegable">
                            <h2 className="mt-2">Descripción detallada de la sección.</h2>
                            {props.descriptionText}
                        </div>
                    </Collapse>
                </div>
            </div>
        </>
    );
}
