import React, { useContext, useState, useEffect, useLayoutEffect } from "react";
import { Context } from "../store/appContext";
import { optionsLinear, optionsLinearMobile, optionsBalanceLinear, optionsBalanceLinearMobile } from "../chartoptions.jsx";
import { incomeColors, usageColors, fixedColors, ocassionalColors, incomeTypeColor, saveTypeColor, usageTypeColor, fixedTypeColor, ocassionalTypeColor } from "../typescolors.jsx";
import { Line } from "react-chartjs-2";
import { Spinner } from "../component/Spinner.jsx";
import { filterDataByMonthYear, filterDataByYear, loadData, calculateTypeDayTotals, calculateTypeMonthTotals, getTypeColor } from '../utils.jsx';

export const MonthlyLineTypes = ({ selectedTypesGetActions, types, typeNames, selectedMonthIndex, selectedYear }) => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(false);        
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useLayoutEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const isMobile = windowWidth <= 768;
    const getOptionsByWindowSize = () => {
        return isMobile ? optionsLinearMobile : optionsLinear;
    };

    const [typeBarData, setTypeBarData] = useState([]);
    const buildBarDataChart = async () => {
        setLoading(true);
        const calculateNumberOfDaysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
        const arrayOfDays = Array.from({ length: calculateNumberOfDaysInMonth }, (_, index) => index + 1);
        const typeDataArray = await Promise.all(selectedTypesGetActions.map(async (selectedTypeGetAction, index) => {
            await loadData([selectedTypeGetAction]);
            const filteredType = filterDataByMonthYear(store[types[index]], selectedMonthIndex, selectedYear);
            const typeDailyTotals = calculateTypeDayTotals(filteredType, typeNames[index]);
            return {
                label: typeNames[index],
                data: arrayOfDays.map((day) => typeDailyTotals.get(day) || { day, value: 0, type: `Sin datos` }),
                backgroundColor: getTypeColor(typeNames[index]),
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
    }, [selectedMonthIndex, selectedYear]);

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

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {typeBarData.length > 0 ? (
                        <Line options={getOptionsByWindowSize()} data={barsByCategories} />
                    ) : (
                        <p>No hay datos en este mes.</p>
                    )}
                </>
            )}
        </>
    );
};

export const MonthlyLineBalance = ({ dataFunctions, types, typeNames, selectedMonthIndex, selectedYear, color }) => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useLayoutEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const isMobile = windowWidth <= 768;
    const getOptions = () => {
        return isMobile ? optionsBalanceLinearMobile : optionsBalanceLinear;
    };

    const [typeBarData, setTypeBarData] = useState([]);
    const [chartData, setChartData] = useState([]);

    const buildBarDataChart = async () => {
        
        setLoading(true);

        const daysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
        const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);
        const typeDataArray = await Promise.all(dataFunctions.map(async (dataFunction, index) => {
            await loadData([dataFunction]);
            const filteredType = filterDataByMonthYear(store[types[index]], selectedMonthIndex, selectedYear);
            const totalDailyType = calculateTypeDayTotals(filteredType, typeNames[index]);
            let cumulativeValue = 0;
            const cumulativeData = daysArray.map((day) => {
                const dailyValue = totalDailyType.get(day)?.value || 0;
                cumulativeValue += dailyValue;
                return {
                    day,
                    value: cumulativeValue,
                    type: typeNames[index],
                };
            });
            return {
                label: typeNames[index],
                data: cumulativeData,
                backgroundColor: color,
            };
        }));
        setTypeBarData(typeDataArray);

        const netChartData = daysArray.map((day) => {
            const netValue = typeDataArray.reduce((acc, typeData, index) => {
                return acc + (index === 0 ? 1 : -1) * (typeData.data.find((data) => data.day === day)?.value || 0);
            }, 0);
            return {
                day,
                netValue,
            };
        });
        setChartData(netChartData);
        
        setLoading(false);
    };
    useEffect(() => {
        buildBarDataChart();
        const unsubscribe = actions.subscribeToType(types, () => {
            buildBarDataChart();
        console.log('Type changed.');
        });
        return () => {
            unsubscribe();
        };
    }, [selectedMonthIndex, selectedYear]);

    const chartDataBar = {
        labels: chartData.map((data) => `${data.day}`),
        datasets: [
            {
                label: "Balance",
                data: chartData.map((data) => data.netValue),
                fill: false,
                backgroundColor: color,
                borderColor: color,
                tension: 0.2,
                pointRadius: 1,
            },
        ],
    };

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {typeBarData.length > 0 ? (
                        <Line options={getOptions()} data={chartDataBar} />
                    ) : (
                        <p>No hay datos en este mes.</p>
                    )}
                </>
            )}
        </>
    )
};

export const AnualLineTypes = ({ dataFunctions, types, typeNames, selectedYear }) => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useLayoutEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const isMobile = windowWidth <= 768;
    const getOptions = () => {
        return isMobile ? optionsLinearMobile : optionsLinear;
    };

    const [typeBarData, setTypeBarData] = useState([]);
    const buildBarDataChart = async () => {
        
        setLoading(true);

        const monthsArray = Array.from({ length: 12 }, (_, index) => index + 1);
        const typeDataArray = await Promise.all(dataFunctions.map(async (dataFunction, index) => {
            await loadData([dataFunction]);
            const filteredType = filterDataByYear(store[types[index]], selectedYear);
            const totalMonthlyType = calculateTypeMonthTotals(filteredType, typeNames[index]);
            return {
                label: typeNames[index],
                data: monthsArray.map((month) => totalMonthlyType.get(month) || { month, value: 0, type: `Sin datos` }),
                backgroundColor: getTypeColor(typeNames[index]),
            };
        }));
        console.log(typeDataArray)
        setTypeBarData(typeDataArray);
        
        setLoading(false);
    };
    useEffect(() => {
        buildBarDataChart();
        const unsubscribe = actions.subscribeToType(types, () => {
            buildBarDataChart();
        console.log('Type changed.');
        });
        return () => {
            unsubscribe();
        };
    }, [selectedYear]);
    const getTypeColor = (type) => {
        if (type === 'Ingresos') {
            return incomeTypeColor;
        } else if (type === 'Reservado') {
            return saveTypeColor;
        } else if (type === 'Uso de reservado') {
            return usageTypeColor;
        } else if (type === 'Gastos fijos') {
            return fixedTypeColor;
        } else if (type === 'Gastos ocasionales') {
            return ocassionalTypeColor;
        }
        return 'rgb(0, 0, 0)';
    };

    const customizeLabels = (labels) => {
        if (isMobile) {
            return labels.map(label => label.substring(0, 2));
        }
        return labels;
    };

    const daTabarras = {
        labels: customizeLabels(store.months),
        datasets: typeBarData.map((typeData, index) => ({
            label: typeNames[index],
            data: typeData.data.map((data) => data.value),
            backgroundColor: [getTypeColor(typeNames[index])],
            borderColor: [getTypeColor(typeNames[index])],
            tension: 0.2,
            pointRadius: 1,
        })),
    };

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {typeBarData.length > 0 ? (
                        <Line options={getOptions()} data={daTabarras} />
                    ) : (
                        <p>No hay datos en este mes.</p>
                    )}
                </>
            )}
        </>
    )
};

export const AnualLineBalance = ({ dataFunctions, types, typeNames, selectedYear, color }) => {
    const { store, actions } = useContext(Context);
    
    const [loading, setLoading] = useState(false);
    
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useLayoutEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const isMobile = windowWidth <= 768;
    const getOptions = () => {
        return isMobile ? optionsBalanceLinearMobile : optionsBalanceLinear;
    };

    const [typeBarData, setTypeBarData] = useState([]);
    const [chartData, setChartData] = useState([]);

    const buildBarDataChart = async () => {
        
        setLoading(true);
        
        const monthsArray = Array.from({ length: 12 }, (_, index) => index + 1);

        const typeDataArray = await Promise.all(dataFunctions.map(async (dataFunction, index) => {
            await loadData([dataFunction]);
            const filteredType = filterDataByYear(store[types[index]], selectedYear);
            const totalMonthlyType = calculateTypeMonthTotals(filteredType, typeNames[index]);
            let cumulativeValue = 0;
            const cumulativeData = monthsArray.map((month) => {
                const monthlyValue = totalMonthlyType.get(month)?.value || 0;
                cumulativeValue += monthlyValue;
                return {
                    month,
                    value: cumulativeValue,
                    type: typeNames[index],
                };
            });
            return {
                label: typeNames[index],
                data: cumulativeData,
                backgroundColor: color,
            };
        }));

        setTypeBarData(typeDataArray);

        const netChartData = monthsArray.map((month) => {
            const netValue = typeDataArray.reduce((acc, typeData, index) => {
                return acc + (index === 0 ? 1 : -1) * (typeData.data.find((data) => data.month === month)?.value || 0);
            }, 0);
            return {
                month,
                netValue,
            };
        });

        setChartData(netChartData);
        
        setLoading(false);
    };

    useEffect(() => {
        buildBarDataChart();
        const unsubscribe = actions.subscribeToType(types, () => {
            buildBarDataChart();
        console.log('Type changed.');
        });
        return () => {
            unsubscribe();
        };
    }, [selectedYear]);

    const customizeLabels = (labels) => {
        if (isMobile) {
            return labels.map(label => label.substring(0, 2));
        }
        return labels;
    };

    const chartDataBar = {
        labels: customizeLabels(store.months),
        datasets: [
            {
                label: "Balance",
                data: chartData.map((data) => data.netValue),
                fill: false,
                backgroundColor: color,
                borderColor: color,
                tension: 0.2,
                pointRadius: 1,
            },
        ],
    };

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {typeBarData.length > 0 ? (
                        <Line options={getOptions()} data={chartDataBar} />
                    ) : (
                        <p>No hay datos en este mes.</p>
                    )}
                </>
            )}
        </>
    )
};