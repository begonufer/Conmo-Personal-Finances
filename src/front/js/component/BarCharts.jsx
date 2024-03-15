import React, { useContext, useState, useEffect, useLayoutEffect } from "react";
import { Context } from "../store/appContext";
import { allDataBarOptions, barOptions, allDataBarOptionsMobile, barOptionsMobile } from "../chartoptions.jsx";
import { Bar } from "react-chartjs-2";
import { filterDataByMonthYear, filterDataByYear, loadData, calculateTypeDayTotals, calculateTypeMonthTotals, calculateTypeCategoryTotals, calculateTypeCategoryDayTotals, getTypeColor } from "../utils.jsx";
import { Spinner } from "../component/Spinner.jsx";

export const MonthlyBarTypes = ({ selectedTypesGetActions, types, typeNames, selectedMonthIndex, selectedYear, renderDataInOneBar }) => {
    const { store, actions } = useContext(Context);

    const [loading, setLoading] = useState(false);
    const [typeBarData, setTypeBarData] = useState([]);
    const buildBarDataChart = async () => {
        setLoading(true);
        const calculateNumberOfDaysInMonth = new Date( selectedYear, selectedMonthIndex + 1, 0 ).getDate();
        const arrayOfDays = Array.from( { length: calculateNumberOfDaysInMonth }, (_, index) => index + 1 );
        const typeDataArray = await Promise.all( selectedTypesGetActions.map(async (selectedTypeGetAction, index) => {
            await loadData([selectedTypeGetAction]);
            const filteredType = filterDataByMonthYear( store[types[index]], selectedMonthIndex, selectedYear );
            const typeDailyTotals = calculateTypeDayTotals( filteredType, typeNames[index] );
                return {
                    label: typeNames[index],
                    data: arrayOfDays.map( (day) => typeDailyTotals.get(day) || { day, value: 0, type: `Sin datos` }),
                    backgroundColor: getTypeColor(typeNames[index]),
                };
            })
        );
        setTypeBarData(typeDataArray);
        setLoading(false);
    };

    useEffect(() => {
        buildBarDataChart();
        const unsubscribe = actions.subscribeToType(types, () => {
            buildBarDataChart();
        });
        return () => {
            unsubscribe();
        };
    }, [selectedMonthIndex, selectedYear]);

    const barByTypes = {
        labels: typeBarData[0]?.data.map((data) => `${data.day}`) || [],
        datasets: typeBarData.map((typeData) => ({
            label: typeData.label,
            data: typeData.data.map((data) => data.value),
            backgroundColor: typeData.backgroundColor,
        })),
    };

    const barsByCategories = {
        labels: typeBarData[0]?.data.map((data) => `${data.day}`) || [],
        datasets: typeBarData.map((typeData) => ({
            label: typeData.label,
            data: typeData.data.map((data) => data.value),
            backgroundColor: typeData.backgroundColor,
            borderColor: typeData.backgroundColor,
            tension: 0.2,
            pointRadius: 1,
        })),
    };

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useLayoutEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const getOptionsByDataAndWindowSize = () => {
        if (renderDataInOneBar) {
            return windowWidth <= 768 ? barOptionsMobile : barOptions;
        } else {
            return windowWidth <= 768 ? allDataBarOptionsMobile : allDataBarOptions;
        }
    };

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {typeBarData.length > 0 ? (
                        <Bar
                            options={getOptionsByDataAndWindowSize()}
                            data={renderDataInOneBar ? barByTypes : barsByCategories}
                        />
                    ) : (
                        <p>No hay datos en este mes.</p>
                    )}
                </>
            )}
        </>
    );
};

export const AnualBarTypes = ({ selectedTypesGetActions, types, typeNames, selectedYear, renderDataInOneBar }) => {
    const { store, actions } = useContext(Context);

    const [loading, setLoading] = useState(false);
    const [typeBarData, setTypeBarData] = useState([]);
    const buildBarDataChart = async () => {
        setLoading(true);
        const arrayOfMonths = Array.from({ length: 12 }, (_, index) => index + 1);
        const typeDataArray = await Promise.all(
            selectedTypesGetActions.map(async (selectedTypeGetAction, index) => {
                await loadData([selectedTypeGetAction]);
                const filteredType = filterDataByYear( store[types[index]], selectedYear );
                const typeMonthlyTotals = calculateTypeMonthTotals( filteredType, typeNames[index]);
                return {
                    label: typeNames[index],
                    data: arrayOfMonths.map( (month) => typeMonthlyTotals.get(month) || { month, value: 0, type: `Sin datos` } ),
                    backgroundColor: getTypeColor(typeNames[index]),
                };
            })
        );
        setTypeBarData(typeDataArray);
        setLoading(false);
    };

    useEffect(() => {
        buildBarDataChart();
        const unsubscribe = actions.subscribeToType(types, () => {
            buildBarDataChart();
        });
        return () => {
            unsubscribe();
        };
    }, [selectedYear]);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useLayoutEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const isMobile = windowWidth <= 768;

    const customizeLabels = (labels) => {
        if (isMobile) {
            return labels.map((label) => label.substring(0, 2));
        }
        return labels;
    };

    const barByTypes = {
        labels: customizeLabels(store.months),
        datasets: typeBarData.map((typeData) => ({
            label: typeData.label,
            data: typeData.data.map((data) => data.value),
            backgroundColor: typeData.backgroundColor,
        })),
    };

    const barsByCategories = {
        labels: customizeLabels(store.months),
        datasets: typeBarData.map((typeData) => ({
            label: typeData.label,
            data: typeData.data.map((data) => data.value),
            backgroundColor: typeData.backgroundColor,
            borderColor: typeData.backgroundColor,
            tension: 0.2,
            pointRadius: 1,
        })),
    };

    const getOptionsByDataAndWindowSize = () => {
        if (renderDataInOneBar) {
            return isMobile ? barOptionsMobile : barOptions;
        } else {
            return isMobile ? allDataBarOptionsMobile : allDataBarOptions;
        }
    };

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {typeBarData.length > 0 ? 
                    ( <Bar options={getOptionsByDataAndWindowSize()} data={renderDataInOneBar ? barByTypes : barsByCategories} /> )
                    :
                    ( <p>No hay datos en este mes.</p> )}
                </>
            )}
        </>
    );
};

export const MonthlyBarCategories = ({ selectedTypesGetActions, types, typeNames, selectedMonthIndex, selectedYear, categoryKeys, colors, renderDataInOneBar }) => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [typeBarData, setTypeBarData] = useState([]);
    const buildBarDataChart = async () => {
        setLoading(true);
        const typeDataArray = await Promise.all(selectedTypesGetActions.map(async (selectedTypeGetAction, index) => {
            await loadData([selectedTypeGetAction]);
            const filteredType = filterDataByMonthYear(store[types[index]], selectedMonthIndex, selectedYear);
            const typeMonthlyTotals = calculateTypeCategoryDayTotals(filteredType, typeNames[index], categoryKeys[index], colors[index]);
            return {
                [typeNames[index]]: typeMonthlyTotals[typeNames[index]] || [],
            };
        }));
        setTypeBarData(typeDataArray);
        setLoading(false);
    };  
    useEffect(() => {
        buildBarDataChart();
        const unsubscribe = actions.subscribeToType(types, () => {
            buildBarDataChart();
        });
        return () => {
            unsubscribe();
        };
    }, [ selectedMonthIndex, selectedYear]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useLayoutEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    const isMobile = windowWidth <= 768;
    const customizeLabels = (labels) => {
        if (isMobile) {
            return labels.map((label) => label.substring(0, 2));
        }
        return labels;
    };  
    const getOptionsByDataAndWindowSize = () => {
        if (renderDataInOneBar) {
            return isMobile ? barOptionsMobile : barOptions;
        } else {
            return isMobile ? allDataBarOptionsMobile : allDataBarOptions;
        }
    };
    const calculateNumberOfDaysInMonth = new Date( selectedYear, selectedMonthIndex + 1, 0).getDate();
    const arrayOfDays = Array.from({ length: calculateNumberOfDaysInMonth }, (_, index) => index + 1);
  
    const dataBarByCategories = {
        labels: customizeLabels(arrayOfDays),
        datasets: typeBarData.flatMap((type) => {
            return Object.entries(type).flatMap(([typeName, typeData]) => {
                return typeData.map((categoryData) => ({
                    label: categoryData.category,
                    data: arrayOfDays.map((day) => day === categoryData.day ? categoryData.value : 0),
                    backgroundColor: categoryData.color,
                    stack: typeName,
                }));
            });
        }),
    };
    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {typeBarData.length > 0 ? 
                    ( <Bar options={getOptionsByDataAndWindowSize()} data={dataBarByCategories} /> ) : ( <p>No hay datos en este mes.</p> )}
                </>
            )}
        </>
    );
};

export const AnualBarCategories = ({ selectedTypesGetActions, types, typeNames, selectedYear, categoryKeys, colors, renderDataInOneBar }) => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [typeBarData, setTypeBarData] = useState([]);
    const buildBarDataChart = async () => {
        setLoading(true);
        const typeDataArray = await Promise.all(selectedTypesGetActions.map(async (selectedTypeGetAction, index) => {
            await loadData([selectedTypeGetAction]);
            const filteredType = filterDataByYear(store[types[index]], selectedYear);
            const typeMonthlyTotals = calculateTypeCategoryTotals(filteredType, typeNames[index], categoryKeys[index], colors[index]);
            return {
                [typeNames[index]]: typeMonthlyTotals[typeNames[index]] || [],
            };
        }));
        setTypeBarData(typeDataArray);
        setLoading(false);
    };  
    useEffect(() => {
        buildBarDataChart();
        const unsubscribe = actions.subscribeToType(types, () => {
            buildBarDataChart();
        });
        return () => {
            unsubscribe();
        };
    }, [selectedYear]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useLayoutEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    const isMobile = windowWidth <= 768;
    const customizeLabels = (labels) => {
        if (isMobile) {
            return labels.map((label) => label.substring(0, 2));
        }
        return labels;
    };  
    const getOptionsByDataAndWindowSize = () => {
        if (renderDataInOneBar) {
            return isMobile ? barOptionsMobile : barOptions;
        } else {
            return isMobile ? allDataBarOptionsMobile : allDataBarOptions;
        }
    };
    const arrayOfMonths = Array.from({ length: 12 }, (_, index) => index + 1);
    const dataBarByCategories = {
        labels: customizeLabels(store.months),
        datasets: typeBarData.flatMap((type) => {
            return Object.entries(type).flatMap(([typeName, typeData]) => {
                return typeData.map((categoryData) => ({
                    label: categoryData.category,
                    data: arrayOfMonths.map((month) => month === categoryData.month ? categoryData.value : 0),
                    backgroundColor: categoryData.color,
                    stack: typeName,
                }));
            });
        }),
    };
    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {typeBarData.length > 0 ? 
                    ( <Bar options={getOptionsByDataAndWindowSize()} data={dataBarByCategories} /> ) : ( <p>No hay datos en este mes.</p> )}
                </>
            )}
        </>
    );
};