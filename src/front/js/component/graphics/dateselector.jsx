import React, { useContext } from "react";
import { Context } from "../../store/appContext";

export const Selector = (props) => {

    const { store } = useContext(Context);

    return (
        <>
            <div className="d-block w-100 h-100 align-items-center">
                <div className="custom-dropdown my-4">
                    <div className="dropdown-header" onClick={props.openMonthsDropdown}>
                        <h1 className="drop-title pt-1">
                            {props.selectedMonth} <span className={`dropdown-arrow ${props.openMonthSelect ? 'open' : ''}`}><i className="fas fa-chevron-down"></i></span> 
                            <input
                                type="number"
                                min="2000" 
                                max={props.currentYear}
                                value={props.selectedYear}
                                onChange={(e) => props.setSelectedYear(parseInt(e.target.value, 10))}
                                className="year-selector mx-4"
                            />
                        </h1>
                    </div>
                    {props.openMonthSelect && (
                        <div className="dropdown-content">
                            {store.months.map((month, index) => (
                                <div
                                    key={index}
                                    className="dropdown-item"
                                    onClick={() => props.handleMonthSelect(month, index)}
                                    >
                                    {month}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};