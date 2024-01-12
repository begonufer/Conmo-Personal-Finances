import React, { useState } from "react";
import { Collapse } from 'react-bootstrap';

export const Header = (props) => {

    const [openInfo, setOpenInfo] = useState(false);

    const handleToggle = () => {
      setOpenInfo(!openInfo);
    };

    return (
        <>
            <div className="title-m-top text-center text-white pt-2" id="left-background">
                <h1 className="header p-1 pb-3">{props.type}<i className="icon fas fa-info-circle ms-3" onClick={handleToggle}></i></h1>
                <div>
                    <Collapse in={openInfo}>
                        <div className="texto-desplegable">
                            {props.descriptionText}
                        </div>
                    </Collapse>
                </div>
            </div>
        </>
    );
}
