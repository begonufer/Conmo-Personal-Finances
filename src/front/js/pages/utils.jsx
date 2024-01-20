import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

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

export const calculateAverage = (monthlyValues) => {
    return (monthlyValues / 12).toFixed(2); 
};

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
        todayDate,
        currentMonthIndex,
        nameCurrentMonth,
        calculatePreviousMonthIndex,
        currentPreviousMonthIndex,
        previousMonthIndex,
        currentPreviousMonthName,
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

export const filterAllDataBeforeMonth = (data, month, year) => {
    return data.filter(item => {
        const itemDate = new Date(item.dateTime);
        const itemMonth = itemDate.getMonth();
        const itemYear = itemDate.getFullYear();
        return (itemYear < year || (itemYear === year && itemMonth <= month));
    });
};

export const filterAllDataPreviousMonth = (data, month, year) => {
    return data.filter((item) => {
        const itemDate = new Date(item.dateTime);
        const itemMonth = itemDate.getMonth();
        const itemYear = itemDate.getFullYear();
        return itemYear < year || (itemYear === year && itemMonth <= month);
    });
};

export const filterDataByMonthYear = (data, selectedMonthIndex, selectedYear) => {
    return data.filter((item) => {
        const date = new Date(item.dateTime);
        return date.getMonth() === selectedMonthIndex && date.getFullYear() === selectedYear;
    });
};

export const filterDataByYear = (data, selectedYear) => {
    return data.filter((item) => {
        const date = new Date(item.dateTime);
        return date.getFullYear() === selectedYear;
    });
};

export const filterAndBuildData = (data, selectedMonthIndex, selectedYear, typeName, category, colors ) => {
    const filteredData = filterDataByMonthYear(data, selectedMonthIndex, selectedYear);
    const categoryTotals = buildCategoryColorTotals(filteredData, typeName, category, colors);
    return categoryTotals;
}

export const calculateCategoryTotals = (data, categoryKey) => {

    const categoryTotals = {};
  
    data.forEach(({ value, [categoryKey]: category }) => {
      const categoryName = category.name;
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + value;
    });
  
    return categoryTotals;
};

export const calculateCategoryDayTotals = (data, categoryData) => {
    const chartDataMap = new Map();
  
    data.forEach((item) => {
        const itemDay = new Date(item.dateTime).getDate();
        const existingData = chartDataMap.get(itemDay) || { value: 0, category: 'Sin datos' };
    
        chartDataMap.set(itemDay, {
            day: itemDay,
            value: existingData.value + item.value,
            category: item[categoryData].name,
        });
    });
  
    return chartDataMap;
};

export const calculateCategoryMonthTotals = (data, categoryData) => {
    const chartAnualDataMap = new Map();

    data.forEach((item) => {
        const itemMonth = new Date(item.dateTime).getMonth() + 1;
        const existingData = chartAnualDataMap.get(itemMonth) || { value: 0, category: 'Sin datos' };

        chartAnualDataMap.set(itemMonth, {
            month: itemMonth,
            value: existingData.value + item.value,
            category: item[categoryData].name,
        });
    });
      
    return chartAnualDataMap;
};

export const setCategoryDailyData = (data, categoryType, selectedMonthIndex, selectedYear) => {
    const daysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  
    const filteredData = filterDataByMonthYear(data, selectedMonthIndex, selectedYear);
    const totalCategoryDaily = calculateCategoryDayTotals(filteredData, categoryType);
  
    return daysArray.map((day) => totalCategoryDaily.get(day) || { day, value: 0, category: 'Sin datos' });
};

export const setCategoryMonthlyData = (data, categoryType, selectedYear) => {

    const monthsArray = Array.from({ length: 12 }, (_, index) => index + 1);

    const filteredData = filterDataByYear(data, selectedYear);

    const totalCategoryMonthly = calculateCategoryMonthTotals(filteredData, categoryType);

    return monthsArray.map((month) => totalCategoryMonthly.get(month) || { month, value: 0, category: 'Sin datos' });
    
};

// export const useCategoryDailyAccumulated = (data, categoryType, selectedMonthIndex, selectedYear) => {

//     let accumulatedNetValue = 0;

//     const daysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
//     const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  
//     const filteredData = filterDataByMonthYear(data, selectedMonthIndex, selectedYear);
//     const totalCategoryDaily = calculateCategoryDayTotals(filteredData, categoryType);
  
//     return daysArray.map((day, index) => {
//         const dayValues = totalCategoryDaily.map((categoryData) => categoryData[index]?.value || 0);
//         const netValue = dayValues.reduce((total, value) => total + value, 0);
        
//         accumulatedNetValue += netValue;
    
//         return {
//             day,
//             netValue: accumulatedNetValue,
//         };
//     });
// };

export const calculateTotals = (data) => {
    return data.reduce((total, type) => total + type.value, 0);
}

// const calculatePropertySum = (data, property) => {
//     return data.reduce((total, item) => total + item[property], 0);
//   };  
// dejo aquí esta función como guia por si en la anterior no funciona correctamente en todos los tipos para usar el atributo property(cambiar por type)


export const loadData = async (actionFunctions) => {
    const promises = actionFunctions.map((actionFunction) => actionFunction());
    await Promise.all(promises);
};

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

export const loadDataAndFilter = async (actions, dataFunction, type, selectedMonthIndex, selectedYear, categoryKey, colors) => {
    try {
        await loadData([dataFunction]);
        const totals = filterAndBuildData(store[type], selectedMonthIndex, selectedYear, categoryKey, colors);
        return totals;
    } catch (error) {
        console.error("Error loading and filtering data:", error);
        return {};
    }
};


export const filterAndBuildAnualData = (data, selectedYear, typeName, category, colors ) => {
    const filteredData = filterDataByYear(data, selectedYear);
    const categoryTotals = buildCategoryColorTotals(filteredData, typeName, category, colors);
    return categoryTotals;
}


export const calculateTypeDayTotals = (data, typeName) => {
    const chartDataMap = new Map();
  
    data.forEach((item) => {
        const itemDay = new Date(item.dateTime).getDate();
        const existingData = chartDataMap.get(itemDay) || { value: 0, type: 'Sin datos' };
    
        chartDataMap.set(itemDay, {
            day: itemDay,
            value: existingData.value + item.value,
            type: typeName,
        });
    });
  
    return chartDataMap;
};

export const calculateTypeMonthTotals = (data, typeName) => {
    const chartAnualDataMap = new Map();
    data.forEach((item) => {
        const itemMonth = new Date(item.dateTime).getMonth() + 1;
        const existingData = chartAnualDataMap.get(itemMonth) || { value: 0, type: 'Sin datos' };

        chartAnualDataMap.set(itemMonth, {
            month: itemMonth,
            value: existingData.value + item.value,
            type: typeName,
        });
    });
    return chartAnualDataMap;
};