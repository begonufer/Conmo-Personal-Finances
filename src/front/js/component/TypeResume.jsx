import React, { useState } from "react";
import { AnualOcassionalResume, MonthlyOcassionalResume } from "../component/OcassionalTables.jsx";
import { AnualFixedResume, MonthlyFixedResume } from "../component/FixedTables.jsx";
import { AnualSavedResume, MonthlySavedResume } from "../component/SavedTables.jsx";
import { AnualIncomeResume, MonthlyIncomeResume } from "../component/IncomeTables.jsx";

export const TypeResume = ({ MonthlyTypeResume, selectedMonth, selectedMonthIndex, selectedYear, previousMonth, AnualTypeResume }) => {
    const [isNext, setIsNext] = useState(true);
    const handleButtonClick = () => {
        setIsNext((prevIsNext) => !prevIsNext);
    };
    return (
        <>
            <div className="col">
                <div id="tableCarousel" className="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-interval="false">
                    <div className="carousel-inner">
                        <div className="carousel-item active pe-md-5 pe-0 pb-md-0 pb-4 text-center">
                            <MonthlyTable
                                componentName={MonthlyTypeResume}
                                selectedMonth={selectedMonth}
                                selectedMonthIndex={selectedMonthIndex}
                                selectedYear={selectedYear}
                                previousMonth={previousMonth}
                            />
                        </div>
                        <div className="carousel-item pe-md-5 pe-0 pb-md-0 pb-4 text-center">
                            <AnualTable
                                componentName={AnualTypeResume}
                                selectedYear={selectedYear}
                                selectedMonthIndex={selectedMonthIndex}
                            />
                        </div>
                    </div>
                    <button className="carousel-control-next d-md-block text-dark align-items-center" type="button" data-bs-target="#tableCarousel" data-bs-slide={isNext ? "next" : "prev"} id="table-carousel-button" onClick={handleButtonClick}>
                        <span className="fs-5 text-center">{isNext ? "Ver\u00a0año" : "Ver\u00a0mes"}</span>
                        <span className={`carousel-control-${isNext ? "next" : "prev"}-icon text-center`} aria-hidden="true"></span>
                    </button>
                </div>
            </div>
        </>
    );
};

const MonthlyTable = ({ componentName, ...props }) => {
    switch (componentName) {
        case "MonthlyIncomeResume":
            return <MonthlyIncomeResume {...props} />;
        case "MonthlySavedResume":
            return <MonthlySavedResume {...props} />;
        case "MonthlyFixedResume":
            return <MonthlyFixedResume {...props} />;
        case "MonthlyOcassionalResume":
            return <MonthlyOcassionalResume {...props} />;
        default:
            return null;
    }
};


const AnualTable = ({ componentName, ...props }) => {
    switch (componentName) {
        case "AnualIncomeResume":
            return <AnualIncomeResume {...props} />;
        case "AnualSavedResume":
            return <AnualSavedResume {...props} />;
        case "AnualFixedResume":
            return <AnualFixedResume {...props} />;
        case "AnualOcassionalResume":
            return <AnualOcassionalResume {...props} />;
        default:
            return null;
    }
};