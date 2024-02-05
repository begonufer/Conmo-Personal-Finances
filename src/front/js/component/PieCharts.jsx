import React, { useContext, useState, useEffect } from 'react';
import { Context } from "../store/appContext";
import { pieOptions } from "../chartoptions.jsx";

import { Spinner } from "../component/Spinner.jsx";
import {
    filterDataByMonthYear,
    loadData,
    filterDataByYear,
    filterAndBuildData,
    filterAndBuildAnualData
} from "../utils.jsx";
import { Pie } from "react-chartjs-2";

export const MonthlyPieTypes = ({ dataFunctions, types, colors, typeNames, selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [typesTotals, setTypesTotals] = useState({});
    const filterAndBuildTypeData = (data, selectedMonthIndex, selectedYear, typeName, color ) => {
        const filteredData = filterDataByMonthYear(data, selectedMonthIndex, selectedYear);
        const typeTotals = buildTypeColorTotals(filteredData, typeName, color);
        return typeTotals;
    }
    const buildTypeColorTotals = (filteredData, typeName, color) => {
        const typeColorTotals = {};
        filteredData.forEach((item) => {
            const value = item.value;
            typeColorTotals[typeName] = {
                value: (typeColorTotals[typeName]?.value || 0) + value,
                color: color,
            };
        });
        return typeColorTotals;
    };
    const loadDataAndFilter = async (actions, dataFunction, type, selectedMonthIndex, selectedYear, typeName, colors) => {
        try {
            await loadData([dataFunction]);
            const totals = filterAndBuildTypeData(store[type], selectedMonthIndex, selectedYear, typeName, colors);
            return totals;
        } catch (error) {
            console.error("Error loading and filtering data:", error);
            return {};
        }
    };
    const transformData = async () => {
        setLoading(true);
        const combinedTotals = {};
        for (let i = 0; i < dataFunctions.length; i++) {
            const totals = await loadDataAndFilter(actions, dataFunctions[i], types[i], selectedMonthIndex, selectedYear, typeNames[i], colors[i]);
            console.log("Totales antes de acumular:", totals);
            Object.keys(totals).forEach(categoryName => {
                const uniqueKey = `${typeNames[i]}`;
                if (!combinedTotals[uniqueKey]) {
                    combinedTotals[uniqueKey] = { value: 0, color: '' };
                }
                combinedTotals[uniqueKey].value += totals[categoryName].value;
                combinedTotals[uniqueKey].color = totals[categoryName].color;
            });
        }
        console.log("Totales después de acumular:", combinedTotals);
        setTypesTotals(combinedTotals);
        setLoading(false);
    };
    useEffect(() => {
        transformData();
        const unsubscribe = actions.subscribeToType(types, () => {
            transformData();
        console.log('Type changed.');
        });
        return () => {
            unsubscribe();
        };
    }, [selectedMonthIndex, selectedYear]);
    const data = {
        labels:  Object.keys(typesTotals),
        datasets: [
            {
            data: Object.values(typesTotals),
            backgroundColor: Object.values(typesTotals).map(item => item.color),
            borderWidth: 0,
            },
        ],
    };
    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {Object.keys(typesTotals).length > 0 ? (
                        <>
                            <Pie data={data} options={pieOptions} />
                        </>
                    ) : (
                        <p>No hay datos en este mes.</p>
                    )}
                </>
            )}
        </>
    );
};

export const MonthlyPie = ({ dataFunctions, types, categoryKeys, colors, typeNames, selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [categoryTotals, setCategoryTotals] = useState({});
    const loadDataAndFilter = async (actions, dataFunction, type, selectedMonthIndex, selectedYear, typeName, categoryKey, colors) => {
        try {
            await loadData([dataFunction]);
            const totals = filterAndBuildData(store[type], selectedMonthIndex, selectedYear, typeName, categoryKey, colors);
            return totals;
        } catch (error) {
            console.error("Error loading and filtering data:", error);
            return {};
        }
    };
    const transformData = async () => {
        setLoading(true);
        const combinedTotals = {};
        for (let i = 0; i < dataFunctions.length; i++) {
            const totals = await loadDataAndFilter(actions, dataFunctions[i], types[i], selectedMonthIndex, selectedYear, typeNames[i], categoryKeys[i], colors[i]);
            console.log("Totales antes de acumular:", totals);
            Object.keys(totals).forEach(categoryName => {
                const uniqueKey = `${typeNames[i]}\n${categoryName}`;
                
                if (!combinedTotals[uniqueKey]) {
                    combinedTotals[uniqueKey] = { value: 0, color: '' };
                }
    
                combinedTotals[uniqueKey].value += totals[categoryName].value;
                combinedTotals[uniqueKey].color = totals[categoryName].color;
            });
        }
        console.log("Totales después de acumular:", combinedTotals);
        setCategoryTotals(combinedTotals);
        setLoading(false);
    };

    useEffect(() => {
        transformData();
        const unsubscribe = actions.subscribeToType(types, () => {
            transformData();
        console.log('Type changed.');
        });
        return () => {
            unsubscribe();
        };
    }, [selectedMonthIndex, selectedYear]);

    const data = {
        labels: Object.keys(categoryTotals),
        datasets: [
            {
                data: Object.values(categoryTotals).map(item => item.value),
                backgroundColor: Object.values(categoryTotals).map(item => item.color),
                borderWidth: 0,
            },
        ],
    };

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {Object.keys(categoryTotals).length > 0 ? (<Pie data={data} options={pieOptions} />) : (<p>No hay datos para este mes.</p>)}
                </>
            )}
        </>
    );
};

export const AnualPieTypes = ({ dataFunctions, types, colors, typeNames, selectedYear }) => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [typesTotals, setTypesTotals] = useState({});
    const filterAndBuildTypeData = (data, selectedYear, typeName, color ) => {
        const filteredData = filterDataByYear(data, selectedYear);
        const typeTotals = buildTypeColorTotals(filteredData, typeName, color);
        return typeTotals;
    }
    const buildTypeColorTotals = (filteredData, typeName, color) => {
        const typeColorTotals = {};
        filteredData.forEach((item) => {
            const value = item.value;
            typeColorTotals[typeName] = {
                value: (typeColorTotals[typeName]?.value || 0) + value,
                color: color,
            };
        });
        return typeColorTotals;
    };
    const loadDataAndFilter = async (actions, dataFunction, type, selectedYear, typeName, colors) => {
        try {
            await loadData([dataFunction]);
            const totals = filterAndBuildTypeData(store[type], selectedYear, typeName, colors);
            return totals;
        } catch (error) {
            console.error("Error loading and filtering data:", error);
            return {};
        }
    };
    const transformData = async () => {
        setLoading(true);
        const combinedTotals = {};
        for (let i = 0; i < dataFunctions.length; i++) {
            const totals = await loadDataAndFilter(actions, dataFunctions[i], types[i], selectedYear, typeNames[i], colors[i]);
            console.log("Totales antes de acumular:", totals);
            Object.keys(totals).forEach(categoryName => {
                const uniqueKey = `${typeNames[i]}`;
                if (!combinedTotals[uniqueKey]) {
                    combinedTotals[uniqueKey] = { value: 0, color: '' };
                }
                combinedTotals[uniqueKey].value += totals[categoryName].value;
                combinedTotals[uniqueKey].color = totals[categoryName].color;
            });
        }
        console.log("Totales después de acumular:", combinedTotals);
        setTypesTotals(combinedTotals);
        setLoading(false);
    };
    useEffect(() => {
        transformData();
        const unsubscribe = actions.subscribeToType(types, () => {
            transformData();
        console.log('Type changed.');
        });
        return () => {
            unsubscribe();
        };
    }, [selectedYear]);
    const data = {
        labels:  Object.keys(typesTotals),
        datasets: [
            {
            data: Object.values(typesTotals),
            backgroundColor: Object.values(typesTotals).map(item => item.color),
            borderWidth: 0,
            },
        ],
    };
    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {Object.keys(typesTotals).length > 0 ? (
                        <>
                            <Pie data={data} options={pieOptions} />
                        </>
                    ) : (
                        <p>No hay datos en este mes.</p>
                    )}
                </>
            )}
        </>
    );
};

export const AnualPie = ({ dataFunctions, types, categoryKeys, colors, typeNames, selectedYear }) => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [categoryTotals, setCategoryTotals] = useState({});
    const loadAnualDataAndFilter = async (actions, dataFunction, type, selectedYear, typeName, categoryKey, colors) => {
        try {
            await loadData([dataFunction]);
            const totals = filterAndBuildAnualData(store[type], selectedYear, typeName, categoryKey, colors);
            return totals;
        } catch (error) {
            console.error("Error loading and filtering data:", error);
            return {};
        }
    };

    const transformData = async () => {
        setLoading(true);
        const combinedTotals = {};
        for (let i = 0; i < dataFunctions.length; i++) {
            const totals = await loadAnualDataAndFilter(actions, dataFunctions[i], types[i], selectedYear, typeNames[i], categoryKeys[i], colors[i]);
            console.log("Totales antes de acumular:", totals);
            Object.keys(totals).forEach(categoryName => {
                const uniqueKey = `${typeNames[i]}\n${categoryName}`;
                
                if (!combinedTotals[uniqueKey]) {
                    combinedTotals[uniqueKey] = { value: 0, color: '' };
                }
    
                combinedTotals[uniqueKey].value += totals[categoryName].value;
                combinedTotals[uniqueKey].color = totals[categoryName].color;
            });
        }
        console.log("Totales después de acumular:", combinedTotals);
        setCategoryTotals(combinedTotals);
        setLoading(false);
    };

    useEffect(() => {
        transformData();
        const unsubscribe = actions.subscribeToType(types, () => {
            transformData();
        console.log('Type changed.');
        });
        return () => {
            unsubscribe();
        };
    }, [selectedYear]);

    const data = {
        labels: Object.keys(categoryTotals),
        datasets: [
            {
                data: Object.values(categoryTotals).map(item => item.value),
                backgroundColor: Object.values(categoryTotals).map(item => item.color),
                borderWidth: 0,
            },
        ],
    };

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <> 
                    {Object.keys(categoryTotals).length > 0 ? (<Pie data={data} options={pieOptions} />) : (<p>No hay datos para este año.</p>)}
                </>
            )}
        </>
    );
};