import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const pieOptions = {
    plugins: {
        legend: {
            display: false,
        }
    },
};

export const barOptions = {
    plugins: {
        legend: {
            display: false,
        }
    },
    responsive: true,
    scales: {
        x: {
            stacked: true,
            grid: {
                display: false,
            },
            ticks: {
                font: {
                    size: 10,
                },
            },
        },
        y: {
            stacked: true,
            display: false,
            grid: {
                display: false, 
            },
        },
    },
};

export const barOptionsMobile = {
    plugins: {
        legend: {
            display: false,
        }
    },
    responsive: true,
    scales: {
        x: {
            stacked: true,
            grid: {
                display: false,
            },
            ticks: {
                font: {
                    size: 10,
                },
                maxRotation: 0,
                minRotation: 0,
            },
        },
        y: {
            stacked: true,
            display: false,
            grid: {
                display: false, 
            },
        },
    },
};

export const allDataBarOptions = {
    plugins: {
        legend: {
            position: "bottom",
            margin: 20,
            display: true,
            labels: {
                usePointStyle: true,
                pointStyle: "circle",
                font: {
                    size: 11,
                },
                padding: 20,
            },
        },
    },
    responsive: true,
    scales: {
        x: {
            stacked: false,
            ticks: {
                font: {
                    size: 10,
                },
            },
        },
        y: {
            stacked: false,
            display: false,
            grid: {
                display: false,
            },
        },
    },
};

export const allDataBarOptionsMobile = {
    plugins: {
        legend: {
            position: "bottom",
            margin: 20,
            display: false,
            labels: {
                usePointStyle: true,
                pointStyle: "circle",
                font: {
                    size: 11,
                },
                maxRotation: 0,
                minRotation: 0,
                padding: 20,
            },
        },
    },
    responsive: true,
    scales: {
        x: {
            stacked: false,
            ticks: {
                font: {
                    size: 10,
                },
            },
        },
        y: {
            stacked: false,
            display: false,
            grid: {
                display: false,
            },
        },
    },
};

//borrar la siguiente option al acabar las bar charts
export const simpleBarOptions = {
    plugins: {
        legend: {
            display: false,
        }
    },
    scales: {
        x: {
            stacked: true,
            grid: {
                display: false,
            }
        },
        y: {
            stacked: true,
            display: false,
            grid: {
                display: false,
            }
        },
    },
};

export const optionsLinear = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
            margin: 20,
            display: true,
            labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                font: {
                    size: 11,
                },
                padding: 20,
            },
        },
    },
    scales: {
        x: {
            stacked: false,
            grid: {
                display: false,
            },
            ticks: {
                font: {
                    size: 10,
                },
            },
        },
        y: {
            stacked: false,
            display: false,
            grid: {
                display: false,
            },
        },
    },
};

export const optionsLinearMobile = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
            margin: 20,
            display: false,
            labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                font: {
                    size: 11,
                },
                padding: 20,
                maxRotation: 0,
                minRotation: 0,
            },
        },
    },
    scales: {
        x: {
            stacked: false,
            grid: {
                display: false,
            },
            ticks: {
                font: {
                    size: 10,
                },
            },
        },
        y: {
            stacked: false,
            display: false,
            grid: {
                display: false,
            },
        },
    },
};

export const optionsBalanceLinear = {
    responsive: true,
    plugins: {
        legend: {
            position: "bottom",
            margin: 20,
            display: true,
            labels: {
                usePointStyle: true,
                pointStyle: "circle",
                font: {
                    size: 11,
                },
                padding: 20,
            },
        },
    },
    scales: {
        x: {
            stacked: true,
            grid: {
                display: false,
            },
            ticks: {
                font: {
                    size: 10,
                },
            },
        },
        y: {
            stacked: true,
            grid: {
                drawOnChartArea: false,
            },
            ticks: {
                callback: function (value) {
                    return value === 0 ? value : "";
                },
            },
        },
    },
};

export const optionsBalanceLinearMobile = {
    responsive: true,
    plugins: {
        legend: {
            position: "bottom",
            margin: 20,
            display: false,
            labels: {
                usePointStyle: true,
                pointStyle: "circle",
                font: {
                    size: 11,
                },
                padding: 20,
                maxRotation: 0,
                minRotation: 0,
            },
        },
    },
    scales: {
        x: {
            stacked: true,
            grid: {
                display: false,
            },
            ticks: {
                font: {
                    size: 10,
                },
                maxRotation: 0,
                minRotation: 0,
            },
        },
        y: {
            stacked: true,
            grid: {
                drawOnChartArea: false,
            },
            ticks: {
                callback: function (value) {
                    return value === 0 ? value : "";
                },
            },
        },
    },
};














const calculateAnualChartData = async () => {

    await loadData([
        actions.getIncomes,
        actions.getSaves,
        actions.getUsage,
        actions.getFixes,
        actions.getOcassionals,
    ]);

    const filteredIncome = filterDataByYear(store.incomes, selectedYear);
    const incomeTotalCategoryMonthly = calculateCategoryMonthTotals(filteredIncome, 'incomecategory');

    const filteredSave = filterDataByYear(store.saves, selectedYear);
    const saveTotalCategoryMonthly = calculateCategoryMonthTotals(filteredSave, 'category');

    const filteredUsage = filterDataByYear(store.usages, selectedYear);
    const usageTotalCategoryMonthly = calculateCategoryMonthTotals(filteredUsage, 'category');

    const filteredFixed = filterDataByYear(store.fixes, selectedYear);
    const fixedTotalCategoryMonthly = calculateCategoryMonthTotals(filteredFixed, 'fixedcategory');

    const filteredOcassional = filterDataByYear(store.ocassionals, selectedYear);
    const ocassionalTotalCategoryMonthly = calculateCategoryMonthTotals(filteredOcassional, 'ocassionalcategory');

    let accumulatedNetValue = 0;

    const monthNames = store.months;

    const monthsArray = Array.from({ length: 12 }, (_, index) => index + 1);

    const netDataArray = monthsArray.map((month) => {
        const incomeValue = incomeTotalCategoryMonthly.get(month)?.value || 0;
        const saveValue = saveTotalCategoryMonthly.get(month)?.value || 0;
        const usageValue = usageTotalCategoryMonthly.get(month)?.value || 0;
        const fixedValue = fixedTotalCategoryMonthly.get(month)?.value || 0;
        const ocassionalValue = ocassionalTotalCategoryMonthly.get(month)?.value || 0;

        const netValue = incomeValue - saveValue - usageValue - fixedValue - ocassionalValue;
        accumulatedNetValue += netValue;

        return {
            month: monthNames[month - 1],
            netValue: accumulatedNetValue,
        };
    });

    setChartAnualData(netDataArray);
};




const buildBarAnualDataChart = async () => {
    await loadData([
        actions.getIncomes,
        actions.getSaves,
        actions.getUsage,
        actions.getFixes,
        actions.getOcassionals,
    ]);

    const incomeMonthCategoryData = setCategoryMonthlyData(store.incomes, 'incomecategory', selectedMonthIndex, selectedYear);
    setIncomeBarAnualData(incomeMonthCategoryData);

    const saveMonthCategoryData = setCategoryMonthlyData(store.saves, 'category', selectedMonthIndex, selectedYear);
    setSaveBarAnualData(saveMonthCategoryData);
    
    const usageMonthCategoryData = setCategoryMonthlyData(store.usages, 'category', selectedMonthIndex, selectedYear);
    setUsageBarAnualData(usageMonthCategoryData);

    const fixedMonthCategoryData = setCategoryMonthlyData(store.fixes, 'fixedcategory', selectedMonthIndex, selectedYear);
    setFixedBarAnualData(fixedMonthCategoryData);

    const ocassionalMonthCategoryData = setCategoryMonthlyData(store.ocassionals, 'ocassionalcategory', selectedMonthIndex, selectedYear);
    setOcassionalBarAnualData(ocassionalMonthCategoryData);
};














const buildBarAnualDataChart2 = async () => {
    await loadData([
        actions.getIncomes,
        actions.getSaves,
        actions.getUsage,
        actions.getFixes,
        actions.getOcassionals,
    ]);

    const incomeMonthCategoryData = setCategoryMonthlyData(store.incomes, 'incomecategory', selectedMonthIndex, selectedYear);
    setIncomeBarAnualData(incomeMonthCategoryData);

    const saveMonthCategoryData = setCategoryMonthlyData(store.saves, 'category', selectedMonthIndex, selectedYear);
    setSaveBarAnualData(saveMonthCategoryData);
    
    const usageMonthCategoryData = setCategoryMonthlyData(store.usages, 'category', selectedMonthIndex, selectedYear);
    setUsageBarAnualData(usageMonthCategoryData);

    const fixedMonthCategoryData = setCategoryMonthlyData(store.fixes, 'fixedcategory', selectedMonthIndex, selectedYear);
    setFixedBarAnualData(fixedMonthCategoryData);

    const ocassionalMonthCategoryData = setCategoryMonthlyData(store.ocassionals, 'ocassionalcategory', selectedMonthIndex, selectedYear);
    setOcassionalBarAnualData(ocassionalMonthCategoryData);
};

const buildAcumulateMonthlyData = async () => {
    await loadData([
        actions.getIncomes,
        actions.getSaves,
        actions.getUsage,
        actions.getFixes,
        actions.getOcassionals,
    ]);

    const filteredIncome = filterDataByYear(store.incomes, selectedYear);
    const filteredSave = filterDataByYear(store.saves, selectedYear);        
    const filteredUsage = filterDataByYear(store.usages, selectedYear);
    const filteredFixed = filterDataByYear(store.fixes, selectedYear);
    const filteredOcassional = filterDataByYear(store.ocassionals, selectedYear);

    const monthsArray = Array.from({ length: 12 }, (_, index) => index + 1);

    let accumulatedNetValue = 0;

    const incomeTotalCategoryMonthly = calculateCategoryMonthTotals(filteredIncome, 'incomecategory');
    const saveTotalCategoryMonthly = calculateCategoryMonthTotals(filteredSave, 'category');
    const usageTotalCategoryMonthly = calculateCategoryMonthTotals(filteredUsage, 'category');
    const fixedTotalCategoryMonthly = calculateCategoryMonthTotals(filteredFixed, 'fixedcategory');
    const ocassionalTotalCategoryMonthly = calculateCategoryMonthTotals(filteredOcassional, 'ocassionalcategory');

    const monthNames = store.months;
    
    const netDataArray = monthsArray.map((month) => {
        const incomeValue = incomeTotalCategoryMonthly.get(month)?.value || 0;
        const saveValue = saveTotalCategoryMonthly.get(month)?.value || 0;
        const usageValue = usageTotalCategoryMonthly.get(month)?.value || 0;
        const fixedValue = fixedTotalCategoryMonthly.get(month)?.value || 0;
        const ocassionalValue = ocassionalTotalCategoryMonthly.get(month)?.value || 0;

        const netValue = incomeValue - saveValue - usageValue - fixedValue - ocassionalValue;
        accumulatedNetValue += netValue;

        return {
            month: monthNames[month - 1],
            netValue: accumulatedNetValue,
        };
    });
    
    setChartAnualData(netDataArray);
};