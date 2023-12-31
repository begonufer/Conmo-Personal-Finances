import React, { useState } from 'react';

import { AnualOcassionalTable } from "../component/graphics/ocassionalanualtable.jsx";
import { MonthlyOcassionalTable } from "../component/graphics/ocassionalmonthlytable.jsx";

import { AnualFixedTable } from "../component/graphics/fixedanualtable.jsx";
import { MonthlyFixedTable } from "../component/graphics/fixedmonthlytable.jsx";
import { AnualSavesTable } from "../component/graphics/savesanualtable.jsx";
import { MonthlySavesTable } from "../component/graphics/savesmonthlytable.jsx";
import { AnualIncomeTable } from "../component/graphics/incomeanualtable.jsx";
import { MonthlyIncomeTable } from "../component/graphics/incomemonthlytable.jsx";

export const AllDataTypeTable = (props) => {

    const [isNext, setIsNext] = useState(true);

    const handleButtonClick = () => {
        setIsNext((prevIsNext) => !prevIsNext);
    };

    return (
        <>
            <div className="col">
                <div id="tableCarousel" className="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-interval="false">
                    <div className="carousel-inner">
                        <div className="carousel-item active pe-5 text-center">
                            <DynamicComponent componentName={props.MonthlyTypeTable} selectedMonth={props.selectedMonth} selectedMonthIndex={props.selectedMonthIndex} selectedYear={props.selectedYear} previousMonth={props.previousMonth}/>
                        </div>
                        <div className="carousel-item pe-5 text-center">
                            <DynamicComponent componentName={props.AnualTypeTable} selectedYear={props.selectedYear} />
                        </div>
                    </div>
                    <button
                        className="carousel-control-next d-block text-dark align-items-center"
                        type="button"
                        data-bs-target="#tableCarousel"
                        data-bs-slide={isNext ? 'next' : 'prev'}
                        id="table-carousel-button"
                        onClick={handleButtonClick}
                    >
                        <span className="fs-5">{isNext ? 'Año' : 'Mes'}</span>
                        <span className={`carousel-control-${isNext ? 'next' : 'prev'}-icon`} aria-hidden="true"></span>
                    </button>
                </div>
            </div>        
        </>
    );
};

const DynamicComponent = ({ componentName, ...props }) => {
    switch (componentName) {
        case 'MonthlyIncomeTable':
            return <MonthlyIncomeTable {...props} />;
        case 'MonthlySavesTable':
            return <MonthlySavesTable {...props} />;
        case 'MonthlyFixedTable':
            return <MonthlyFixedTable {...props} />;
        case 'MonthlyOcassionalTable':
            return <MonthlyOcassionalTable {...props} />;

        case 'AnualIncomeTable':
            return <AnualIncomeTable {...props} />;
        case 'AnualSavesTable':
            return <AnualSavesTable {...props} />;
        case 'AnualFixedTable':
            return <AnualFixedTable {...props} />;
        case 'AnualOcassionalTable':
            return <AnualOcassionalTable {...props} />;

        default:
            return null;
    }
};