import React, { useContext, useEffect, useState } from "react";
import { Context } from "./store/appContext";

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
            display: false,
        }
    },
    responsive: true,
    scales: {
        x: {
            stacked: true,
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
            stacked: true,
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
                maxRotation: 0,
                minRotation: 0,
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
                font: {
                    size: 8,
                },
                maxRotation: 0,
                minRotation: 0,
            },
        },
    },
};