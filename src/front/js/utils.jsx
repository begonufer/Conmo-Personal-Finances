import React, { useContext, useEffect, useState } from "react";
import { Context } from "./store/appContext";
import { incomeColors, usageColors, fixedColors, ocassionalColors, incomeTypeColor, saveTypeColor, usageTypeColor, fixedTypeColor, ocassionalTypeColor } from "./typescolors.jsx";


//Hook personalizado para la selección del rango de fechas que se va a usar
export const useMonthSelection = () => {

    const { store } = useContext(Context);

    const todayDate = new Date();
    const currentMonthIndex = todayDate.getMonth();
    const nameCurrentMonth = store.months[currentMonthIndex];
    const currentYear = new Date().getFullYear();

    const calculatePreviousMonthIndex = (currentIndex) => (currentIndex - 1 + 12) % 12;
    const currentPreviousMonthIndex = calculatePreviousMonthIndex(currentMonthIndex);
    const currentPreviousMonthName = store.months[currentPreviousMonthIndex];

    const [selectedMonth, setSelectedMonth] = useState(nameCurrentMonth);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndex);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [previousMonth, setPreviousMonth] = useState(currentPreviousMonthName);
    const [previousMonthIndex, setPreviousMonthIndex] = useState(currentPreviousMonthIndex);

    const [openMonthSelect, setOpenMonthSelect] = useState(false);
    
    const openMonthsDropdown = () => {
        setOpenMonthSelect(!openMonthSelect);
    };

    const handleMonthSelect = (month, monthIndex) => {
        setSelectedMonth(month);
        setSelectedMonthIndex(monthIndex);
        const updatedPreviousMonthIndex = calculatePreviousMonthIndex(monthIndex);
        setPreviousMonth(store.months[updatedPreviousMonthIndex]);
        setPreviousMonthIndex(updatedPreviousMonthIndex);
        setOpenMonthSelect(false);
    }

    return {
        previousMonthIndex,
        currentYear,
        previousMonth,
        selectedMonth,
        selectedYear,
        setSelectedYear,
        openMonthSelect,
        selectedMonthIndex,
        openMonthsDropdown,
        handleMonthSelect
    };
};

export const calculatePercentage = (amount, total) => {
    if (total === 0) {
        return 0;
    }

    const result = (amount / total) * 100;
    
    if (isNaN(result) || !isFinite(result)) {
        return 0;
    }

    return result.toFixed(0);
};

export const calculateAverage = (selectedMonthIndex, monthlyValues) => {
    const monthsSelected = selectedMonthIndex +1;
    return (monthlyValues / monthsSelected).toFixed(2); 
};


//Filtra los datos del tipo seleccionado del mes anterior al seleccionado
export const filterAllDataPreviousMonth = ( selectedTypeData, month, year) => {
    return selectedTypeData.filter((typeMovement) => {
        const typeMovementDate = new Date(typeMovement.dateTime);
        const typeMovementMonth = typeMovementDate.getMonth();
        const typeMovementYear = typeMovementDate.getFullYear();
        return typeMovementYear < year || (typeMovementYear === year && typeMovementMonth <= month);
    });
};

//Filtra los datos del tipo seleccionado del mes y año seleccionado
export const filterDataByMonthYear = ( selectedTypeData, selectedMonthIndex, selectedYear) => {
    return selectedTypeData.filter((typeMovement) => {
        const typeMovementDate = new Date(typeMovement.dateTime);
        return typeMovementDate.getMonth() === selectedMonthIndex && typeMovementDate.getFullYear() === selectedYear;
    });
};

//Filtra los datos del tipo seleccionado del año seleccionado
export const filterDataByYear = (selectedTypeData, selectedYear) => {
    return selectedTypeData.filter((typeMovement) => {
        const typeMovementDate = new Date(typeMovement.dateTime);
        return typeMovementDate.getFullYear() === selectedYear;
    });
};

//Construye los colores por categoría dados un grupo de datos, tipo, categoría y colores.
export const buildCategoryColorTotals = (filteredData, typeName, categoryKey, colors) => {
    const categoryColorTotals = {};
    filteredData.forEach(({ value, [categoryKey]: category }, index) => {
        const categoryName = category.name;
        categoryColorTotals[categoryName] = {
            value: (categoryColorTotals[categoryName]?.value || 0) + value,
            color: colors[index % colors.length],
            typeName: typeName,
        };
    });
    return categoryColorTotals;
};

//Devuelve los totales por categoría dado un grupo de datos.
export const calculateCategoryTotals = (filteredData, categoryKey) => {
    const categoryTotals = {};
    filteredData.forEach(({ value, [categoryKey]: category }) => {
      const categoryName = category.name;
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + value;
    });
    return categoryTotals;
};

//Llama a las actions seleccionadas
export const loadData = async (actionFunctions) => {
    const promises = actionFunctions.map((actionFunction) => actionFunction());
    await Promise.all(promises);
};

//Dado un conjunto de datos y su tipo, calcula el total por tipo en un mismo día
export const calculateTypeDayTotals = (filteredData, typeName) => {
    const chartDataMap = new Map();
    filteredData.forEach((movement) => {
        const movementDay = new Date(movement.dateTime).getDate();
        const existingData = chartDataMap.get(movementDay) || { value: 0, type: 'Sin datos' };
        chartDataMap.set(movementDay, {
            day: movementDay,
            value: existingData.value + movement.value,
            type: typeName,
        });
    });
    return chartDataMap;
};

//Dado un conjunto de datos y su tipo, calcula el total por tipo al mes
export const calculateTypeMonthTotals = (filteredData, typeName) => {
    const chartAnualDataMap = new Map();
    filteredData.forEach((movement) => {
        const movementMonth = new Date(movement.dateTime).getMonth() + 1;
        const existingData = chartAnualDataMap.get(movementMonth) || { value: 0, type: 'Sin datos' };
        chartAnualDataMap.set(movementMonth, {
            month: movementMonth,
            value: existingData.value + movement.value,
            type: typeName,
        });
    });
    return chartAnualDataMap;
};

//Dado un tipo devuelve su conjunto de colores correspondiente
export const getTypeColor = (type) => {
    switch (type) {
        case 'Ingresos' :
            return incomeTypeColor;
        case 'Reservado' :
            return saveTypeColor;
        case 'Uso de reservado' :
            return usageTypeColor;
        case 'Gastos fijos' :
            return fixedTypeColor;
        case 'Gastos ocasionales' :
            return ocassionalTypeColor;
        default :
            return 'rgb(0, 0, 0)';
    }
};


export const calculateTypeCategoryTotals = (filteredData, typeName, categoryKey, colors) => {
    const categoryColorTotals = {};
    filteredData.forEach(({ value, [categoryKey]: category, dateTime }, index) => {
        const categoryName = category.name;
        const movementMonth = new Date(dateTime).getMonth() + 1;
        if (!categoryColorTotals[typeName]) {
            categoryColorTotals[typeName] = [];
        }
        const existingEntryIndex = categoryColorTotals[typeName].findIndex(entry => entry.month === movementMonth && entry.category === categoryName);
        if (existingEntryIndex !== -1) {
            categoryColorTotals[typeName][existingEntryIndex].value += value;
        } else {
            categoryColorTotals[typeName].push({
                month: movementMonth,
                category: categoryName,
                value,
                color: colors[index % colors.length],
            });
        }
    });
    return categoryColorTotals;
};

export const calculateTypeCategoryDayTotals = (filteredData, typeName, categoryKey, colors) => {
    const categoryColorTotals = {};
    filteredData.forEach(({ value, [categoryKey]: category, dateTime }, index) => {
        const categoryName = category.name;
        const movementDay = new Date(dateTime).getDate();
        if (!categoryColorTotals[typeName]) {
            categoryColorTotals[typeName] = [];
        }
        const existingEntryIndex = categoryColorTotals[typeName].findIndex(entry => entry.day === movementDay && entry.category === categoryName);
        if (existingEntryIndex !== -1) {
            categoryColorTotals[typeName][existingEntryIndex].value += value;
        } else {
            categoryColorTotals[typeName].push({
                day: movementDay,
                category: categoryName,
                value,
                color: colors[index % colors.length],
            });
        }
    });

    return categoryColorTotals;
};

export const filterDataByYearToSelectedMonth = (selectedTypeData, selectedMonthIndex, selectedYear) => {
    return selectedTypeData.filter((typeMovement) => {
        const typeMovementDate = new Date(typeMovement.dateTime);
        const movementMonth = typeMovementDate.getMonth();
        const movementYear = typeMovementDate.getFullYear();
        if (movementYear === selectedYear && movementMonth <= selectedMonthIndex) {
            const lastDayOfMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
            return typeMovementDate.getDate() <= lastDayOfMonth;
        }
        return false;
    });
};
