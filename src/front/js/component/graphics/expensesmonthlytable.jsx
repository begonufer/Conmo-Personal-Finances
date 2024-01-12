import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

export const MonthlyExpensesTable = (props) => {
    
    const { store, actions } = useContext(Context);

    const calculatePercentage = (amount, total) => {
        if (total === 0) {
            return 0;
        }
        return ((amount / total) * 100).toFixed(0);
    }; //usar esta función como función general

    const filterDataByMonthYear = (data, selectedMonthIndex, selectedYear) => {
        return data.filter((item) => {
            const date = new Date(item.dateTime);
            return date.getMonth() === selectedMonthIndex && date.getFullYear() === selectedYear;
        });
    }; //usar esta función como función general

    const [incomeCategoryTotals, setIncomeCategoryTotals] = useState({});
    const [fixedCategoryTotals, setFixedCategoryTotals] = useState({});
    const [ocassionalCategoryTotals, setOcassionalCategoryTotals] = useState({});
    const [saveCategoryTotals, setSaveCategoryTotals] = useState({});
    const [usageCategoryTotals, setUsageCategoryTotals] = useState({});

    const [savesBalance, setSavesBalance] = useState({});

    const dataFilteredByCategory = (filteredIncome, filteredSave, filteredUsage, filteredFixed, filteredOcassional) => {

        const incomeTotals = {};
        const saveTotals = {};
        const usageTotals = {};
        const fixedTotals = {};
        const ocassionalTotals = {};

        filteredIncome.forEach(({ value, incomecategory }) => {
            const categoryName = incomecategory.name;
            incomeTotals[categoryName] = (incomeTotals[categoryName] || 0) + value;
        });
        filteredSave.forEach(({ value, category }) => {
            const categoryName = category.name;
            saveTotals[categoryName] = (saveTotals[categoryName] || 0) + value;
        });
        filteredUsage.forEach(({ value, category }) => {
            const categoryName = category.name;
            usageTotals[categoryName] = (usageTotals[categoryName] || 0) + value;
        });
        filteredFixed.forEach(({ value, fixedcategory }) => {
            const categoryName = fixedcategory.name;
            fixedTotals[categoryName] = (fixedTotals[categoryName] || 0) + value;
        });
        filteredOcassional.forEach(({ value, ocassionalcategory }) => {
            const categoryName = ocassionalcategory.name;
            ocassionalTotals[categoryName] = (ocassionalTotals[categoryName] || 0) + value;
        });

        setIncomeCategoryTotals(incomeTotals);
        setSaveCategoryTotals(saveTotals);
        setUsageCategoryTotals(usageTotals);
        setFixedCategoryTotals(fixedTotals);
        setOcassionalCategoryTotals(ocassionalTotals);
    }

    useEffect(() => {
        const transformData = async () => {
            await actions.getIncomes();
            await actions.getSaves();
            await actions.getUsage();
            await actions.getFixes();
            await actions.getOcassionals();

            const filteredIncome = filterDataByMonthYear(store.incomes, props.selectedMonthIndex, props.selectedYear);
            const filteredSave = filterDataByMonthYear(store.saves, props.selectedMonthIndex, props.selectedYear);
            const filteredUsage = filterDataByMonthYear(store.usages, props.selectedMonthIndex, props.selectedYear);
            const filteredFixed = filterDataByMonthYear(store.fixes, props.selectedMonthIndex, props.selectedYear);
            const filteredOcassional = filterDataByMonthYear(store.ocassionals, props.selectedMonthIndex, props.selectedYear);

            const filterAllDataBeforeMonth = (data, selectedMonthIndex, selectedYear) => {
                return data.filter(item => {
                    const itemDate = new Date(item.dateTime);
                    const itemMonth = itemDate.getMonth();
                    const itemYear = itemDate.getFullYear();
            
                    return (itemYear < selectedYear || (itemYear === selectedYear && itemMonth <= selectedMonthIndex));
                });
            };
            
            const allPreviousMonthSaves = filterAllDataBeforeMonth(store.saves, props.selectedMonthIndex, props.selectedYear);

            const saveBalance = allPreviousMonthSaves.reduce((acc, { value, category }) => {
                const categoryName = category.name;
                acc[categoryName] = (acc[categoryName] || 0) + value;
                return acc;
            }, {});
            
            setSavesBalance(saveBalance);
            
            dataFilteredByCategory(filteredIncome, filteredSave, filteredUsage, filteredFixed, filteredOcassional);
        };
        transformData();
    }, [props.selectedMonthIndex, props.selectedYear, props.previousMonthIndex]);

    const totalIncomeMonthAmount = filterDataByMonthYear(store.incomes, props.selectedMonthIndex, props.selectedYear).reduce((total, income) => total + income.value, 0);
    const totalSaveMonthAmount = filterDataByMonthYear(store.saves, props.selectedMonthIndex, props.selectedYear).reduce((total, save) => total + save.value, 0);
    const totalUsageMonthAmount = filterDataByMonthYear(store.usages, props.selectedMonthIndex, props.selectedYear).reduce((total, usage) => total + usage.value, 0);
    const totalFixedMonthAmount = filterDataByMonthYear(store.fixes, props.selectedMonthIndex, props.selectedYear).reduce((total, fixed) => total + fixed.value, 0);
    const totalOcassionalMonthAmount = filterDataByMonthYear(store.ocassionals, props.selectedMonthIndex, props.selectedYear).reduce((total, ocassional) => total + ocassional.value, 0);
 
    const previousMonthAmount = props.previousMonthAmount;

    const balance = previousMonthAmount + totalIncomeMonthAmount;
    const balanceBeforeSaves = balance - totalSaveMonthAmount;
    const balanceBeforeFixed = balanceBeforeSaves - totalFixedMonthAmount;
    const totalExpenses = totalFixedMonthAmount + totalOcassionalMonthAmount + totalUsageMonthAmount; //sumar uso reservado también
    const calculateMonthResult = balance - totalSaveMonthAmount - totalExpenses;
    
    const savesBalanceTotal = Object.values(savesBalance).reduce((total, categoryTotal) => total + categoryTotal, 0);

    return (
        <>
            <div className="row align-self-center text-center justify-content-center align-items-bottom mt-2">
                <div className="wrap flex-column justify-content-center align-items-center pb-2 rounded-1">
                    <h4 className="text-expenses fs-1 fw-bold p-3 mb-0">GASTOS</h4>
                    <div className="expense-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                        <div className="row text-white mobile-text">
                            <div className="col">Total</div>
                            <div className="col">%</div>
                        </div>
                    </div>
                    <div className="text-center justify-content-center align-items-center pt-3">
                        <div className="row mobile-text">
                            <div className="col text-center">{totalExpenses} €</div>
                            <div className="col text-center">{calculatePercentage(totalExpenses, totalIncomeMonthAmount)} %</div>
                        </div>
                    </div>
                    <div>
                        <div className="d-lg-flex pb-2 rounded-1">
                            <div className="col-lg col-12 justify-content-center align-items-center pe-0 rounded-1">
                                <h4 className="text-fixed fs-1 fw-bold p-3 mb-0 rounded-1 text-center py-3">FIJOS</h4>
                                <div className="fixed-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                                    <div className="row text-white mobile-text">
                                        <div className="col">Total</div>
                                        <div className="col">%</div>
                                    </div>
                                </div>
                                <div className="text-center justify-content-center align-items-center p-3">
                                    <div className="row mobile-text">
                                        <div className="col">{totalFixedMonthAmount} €</div>
                                        <div className="col">{calculatePercentage(totalFixedMonthAmount, totalIncomeMonthAmount)} %</div>
                                    </div>
                                </div>
                                <div className="fixed-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                                    <div className="row text-white mobile-text">
                                        <div className="col">Categoría</div>
                                        <div className="col">Total</div>
                                        <div className="col">%</div>
                                    </div>
                                </div>
                                {Object.entries(fixedCategoryTotals).map(([category, total]) => (
                                    <div className="text-center justify-content-center align-items-center p-lg-3 p-1" key={category}>
                                        <div className="row mobile-text">
                                            <div className="col">{category}</div>
                                            <div className="col">{total} €</div>
                                            <div className="col">{calculatePercentage(total, totalIncomeMonthAmount)} %</div>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center text-white justify-content-center align-items-center mb-3 p-lg-3 p-2 rounded-pill" id="table-fixed">
                                    <div className="row mobile-text fw-bold fs-6">
                                        <div className="col">LIBRE</div>
                                        <div className="col">{balanceBeforeFixed.toFixed(2)} €</div>
                                        <div className="col">{calculatePercentage(balanceBeforeFixed, totalIncomeMonthAmount)} %</div>
                                    </div>
                                </div>                                
                            </div>
                            <div className="col-lg col-12 wrap flex-column justify-content-center align-items-center rounded-1">
                                <h4 className="text-ocassional fs-1 fw-bold p-3 mb-0 text-center py-3">OCASIONALES</h4>
                                <div className="ocassional-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                                    <div className="row text-white mobile-text">
                                        <div className="col">Total</div>
                                        <div className="col">%</div>
                                    </div>
                                </div>
                                <div className="text-center justify-content-center align-items-center p-3">
                                    <div className="row mobile-text">
                                        <div className="col">{totalOcassionalMonthAmount} €</div>
                                        <div className="col">{calculatePercentage(totalOcassionalMonthAmount, totalIncomeMonthAmount)} %</div>
                                    </div>
                                </div>
                                <div className="ocassional-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                                    <div className="row text-white mobile-text">
                                        <div className="col">Categoría</div>
                                        <div className="col">Total</div>
                                        <div className="col">%</div>
                                    </div>
                                </div>
                                {Object.entries(ocassionalCategoryTotals).map(([category, total]) => (
                                    <div className="text-center justify-content-center align-items-center p-lg-3 p-1" key={category}>
                                        <div className="row mobile-text">
                                            <div className="col">{category}</div>
                                            <div className="col">{total} €</div>
                                            <div className="col">{calculatePercentage(total, totalIncomeMonthAmount)} %</div>
                                        </div>
                                    </div>
                                ))} 
                                <div className="text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill" id="table-ocassional">
                                    <div className="row mobile-text text-white fw-bold fs-6">
                                        <div className="col">RESTANTE</div>
                                        <div className="col">{calculateMonthResult.toFixed(2)} €</div>
                                        <div className="col">{calculatePercentage(calculateMonthResult, totalIncomeMonthAmount)} %</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg col-12 wrap flex-column justify-content-center align-items-center rounded-1">
                                <h4 className="text-usage fs-1 fw-bold p-3 mb-0 rounded-1 text-center py-3">USO RESERVADO</h4>
                                <div className="usage-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                                    <div className="row text-white mobile-text">
                                        <div className="col">Total</div>
                                        <div className="col">%</div>
                                    </div>
                                </div>
                                <div className="text-center justify-content-center align-items-center p-3">
                                    <div className="row mobile-text">
                                        <div className="col">{totalUsageMonthAmount} €</div>
                                        <div className="col">{calculatePercentage(totalUsageMonthAmount, totalIncomeMonthAmount)} %</div>
                                    </div>
                                </div>
                                <div className="usage-light-bg text-center justify-content-center align-items-center p-lg-3 p-2 rounded-pill">
                                    <div className="row text-white mobile-text">
                                        <div className="col">Categoría</div>
                                        <div className="col">Total</div>
                                        <div className="col">%</div>
                                    </div>
                                </div>
                                {Object.entries(usageCategoryTotals).map(([category, total]) => (
                                    <div className="text-center justify-content-center align-items-center p-lg-3 p-1" key={category}>
                                        <div className="row mobile-text">
                                            <div className="col">{category}</div>
                                            <div className="col">{total} €</div>
                                            <div className="col">{calculatePercentage(total, totalIncomeMonthAmount)} %</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>                    
                    </div>
                </div>
            </div>
        </>
    );
};



// import React, { useContext, useEffect, useState } from "react";
// import { Context } from "../../store/appContext";
// import { format } from "date-fns";
// import es from "date-fns/locale/es";


// export const MonthlyExpensesTable = (props) => {
    
//     const { store, actions } = useContext(Context);

//     const calculatePercentage = (amount, total) => {
//         if (total === 0) {
//             return 0;
//         }
//         return ((amount / total) * 100).toFixed(0);
//     }; //usar esta función como función general

//     const filterDataByMonthYear = (data, selectedMonthIndex, selectedYear) => {
//         return data.filter((item) => {
//             const date = new Date(item.dateTime);
//             return date.getMonth() === selectedMonthIndex && date.getFullYear() === selectedYear;
//         });
//     }; //usar esta función como función general

//     const [incomeCategoryTotals, setIncomeCategoryTotals] = useState({});
//     const [fixedCategoryTotals, setFixedCategoryTotals] = useState({});
//     const [ocassionalCategoryTotals, setOcassionalCategoryTotals] = useState({});
//     const [saveCategoryTotals, setSaveCategoryTotals] = useState({});
//     const [saveUsageCategoryTotals, setSaveUsageCategoryTotals] = useState({});

//     const [savesBalance, setSavesBalance] = useState({});

//     const dataFilteredByCategory = (filteredIncome, filteredSave, filteredSaveUsage, filteredFixed, filteredOcassional) => {

//         const incomeTotals = {};
//         const saveTotals = {};
//         const saveUsageTotals = {};
//         const fixedTotals = {};
//         const ocassionalTotals = {};

//         filteredIncome.forEach(({ value, incomecategory }) => {
//             const categoryName = incomecategory.name;
//             incomeTotals[categoryName] = (incomeTotals[categoryName] || 0) + value;
//         });
//         filteredSave.forEach(({ value, category }) => {
//             const categoryName = category.name;
//             saveTotals[categoryName] = (saveTotals[categoryName] || 0) + value;
//         });
//         filteredSaveUsage.forEach(({ value, category }) => {
//             const categoryName = category.name;
//             saveUsageTotals[categoryName] = (saveUsageTotals[categoryName] || 0) + value;
//         });
//         filteredFixed.forEach(({ value, fixedcategory }) => {
//             const categoryName = fixedcategory.name;
//             fixedTotals[categoryName] = (fixedTotals[categoryName] || 0) + value;
//         });
//         filteredOcassional.forEach(({ value, ocassionalcategory }) => {
//             const categoryName = ocassionalcategory.name;
//             ocassionalTotals[categoryName] = (ocassionalTotals[categoryName] || 0) + value;
//         });

//         setIncomeCategoryTotals(incomeTotals);
//         setSaveCategoryTotals(saveTotals);
//         setSaveUsageCategoryTotals(saveUsageTotals);
//         setFixedCategoryTotals(fixedTotals);
//         setOcassionalCategoryTotals(ocassionalTotals);
//     }

//     useEffect(() => {
//         const transformData = async () => {
//             await actions.getIncomes();
//             await actions.getSaves();
//             await actions.getSavesUsage();
//             await actions.getFixes();
//             await actions.getOcassionals();

//             const filteredIncome = filterDataByMonthYear(store.incomes, props.selectedMonthIndex, props.selectedYear);
//             const filteredSave = filterDataByMonthYear(store.saves, props.selectedMonthIndex, props.selectedYear);
//             const filteredSaveUsage = filterDataByMonthYear(store.saves_usage, props.selectedMonthIndex, props.selectedYear);
//             const filteredFixed = filterDataByMonthYear(store.fixes, props.selectedMonthIndex, props.selectedYear);
//             const filteredOcassional = filterDataByMonthYear(store.ocassionals, props.selectedMonthIndex, props.selectedYear);

//             const filterAllDataBeforeMonth = (data, selectedMonthIndex, selectedYear) => {
//                 return data.filter(item => {
//                     const itemDate = new Date(item.dateTime);
//                     const itemMonth = itemDate.getMonth();
//                     const itemYear = itemDate.getFullYear();
            
//                     return (itemYear < selectedYear || (itemYear === selectedYear && itemMonth <= selectedMonthIndex));
//                 });
//             };
            
//             const allPreviousMonthSaves = filterAllDataBeforeMonth(store.saves, store.saves_usage, props.selectedMonthIndex, props.selectedYear);

//             const saveBalance = allPreviousMonthSaves.reduce((acc, { value, category }) => {
//                 const categoryName = category.name;
//                 acc[categoryName] = (acc[categoryName] || 0) + value;
//                 return acc;
//             }, {});
            
//             setSavesBalance(saveBalance);
            
//             dataFilteredByCategory(filteredIncome, filteredSave, filteredSaveUsage, filteredFixed, filteredOcassional);
//         };
//         transformData();
//     }, [props.selectedMonthIndex, props.selectedYear, props.previousMonthIndex]);

//     const totalIncomeMonthAmount = filterDataByMonthYear(store.incomes, props.selectedMonthIndex, props.selectedYear).reduce((total, income) => total + income.value, 0);
//     const totalSaveMonthAmount = filterDataByMonthYear(store.saves, props.selectedMonthIndex, props.selectedYear).reduce((total, save) => total + save.value, 0);
//     const totalSaveUsageMonthAmount = filterDataByMonthYear(store.saves_usage, props.selectedMonthIndex, props.selectedYear).reduce((total, save) => total + save.value, 0);
//     const totalFixedMonthAmount = filterDataByMonthYear(store.fixes, props.selectedMonthIndex, props.selectedYear).reduce((total, fixed) => total + fixed.value, 0);
//     const totalOcassionalMonthAmount = filterDataByMonthYear(store.ocassionals, props.selectedMonthIndex, props.selectedYear).reduce((total, ocassional) => total + ocassional.value, 0);
 
//     const previousMonthAmount = props.previousMonthAmount;

//     const balance = previousMonthAmount + totalIncomeMonthAmount;
//     const balanceBeforeSaves = balance - totalSaveMonthAmount;
//     const balanceBeforeFixed = balanceBeforeSaves - totalFixedMonthAmount;
//     const totalExpenses = totalFixedMonthAmount + totalOcassionalMonthAmount + totalSaveUsageMonthAmount; //sumar uso reservado también
//     const calculateMonthResult = balance - totalSaveMonthAmount - totalExpenses;
    
//     const savesBalanceTotal = Object.values(savesBalance).reduce((total, categoryTotal) => total + categoryTotal, 0);

//     return (
//         <>
//             <div className="col align-self-center text-center justify-content-center align-items-bottom mt-2">
//                 <div className="wrap flex-column m-5 justify-content-center align-items-center pb-2 rounded-1">
//                     <div className="row expense-pill text-white fw-normal expense-part-bottom fs-4">
//                         <h4 className="expense-part-top p-3 text-white fs-2 p-3 mb-0">Total gastos</h4>
//                         <div className="col p-3 fw-normal">{totalExpenses} €</div>
//                         <div className="col p-3 fw-normal">{calculatePercentage(totalExpenses, totalIncomeMonthAmount)} %</div>
//                     </div>
//                     <div className="row">
//                         <div className="col wrap flex-column justify-content-center align-items-center rounded-1">
//                             <h4 className="text-white fs-2 p-3 mb-0 rounded-1 text-center py-3" id="table-fixed">FIJOS</h4>
//                             <div className="fixed-light-bg text-center justify-content-center align-items-center p-3">
//                                 <div className="row">
//                                     <div className="col">Total</div>
//                                     <div className="col">%</div>
//                                 </div>
//                             </div>
//                             <div className="text-center justify-content-center align-items-center fixed-content-bg p-3">
//                                 <div className="row">
//                                     <div className="col">{totalFixedMonthAmount} €</div>
//                                     <div className="col">{calculatePercentage(totalFixedMonthAmount, totalIncomeMonthAmount)} %</div>
//                                 </div>
//                             </div>
//                             <div className="fixed-light-bg text-center justify-content-center align-items-center p-3">
//                                 <div className="row">
//                                     <div className="col">Categoría</div>
//                                     <div className="col">Total</div>
//                                     <div className="col">%</div>
//                                 </div>
//                             </div>
//                             {Object.entries(fixedCategoryTotals).map(([category, total]) => (
//                                 <div className="text-center justify-content-center align-items-center fixed-content-bg p-3" key={category}>
//                                     <div className="row">
//                                         <div className="col">{category}</div>
//                                         <div className="col">{total} €</div>
//                                         <div className="col">{calculatePercentage(total, totalIncomeMonthAmount)} %</div>
//                                     </div>
//                                 </div>
//                             ))}
//                             <div className="text-center text-white justify-content-center align-items-center" id="table-fixed">
//                                 <div className="row fw-bold fs-6 p-3">
//                                     <div className="col">LIBRE</div>
//                                     <div className="col">{balanceBeforeFixed} €</div>
//                                     <div className="col">{calculatePercentage(balanceBeforeFixed, totalIncomeMonthAmount)} %</div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="col wrap flex-column justify-content-center align-items-center rounded-1">
//                             <h4 className="text-white fs-2 p-3 mb-0 rounded-1 text-center py-3"  id="table-ocassional">OCASIONALES</h4>
//                             <div className="ocassional-light-bg text-center justify-content-center align-items-center p-3">
//                                 <div className="row">
//                                     <div className="col">Total</div>
//                                     <div className="col">%</div>
//                                 </div>
//                             </div>
//                             <div className="text-center justify-content-center align-items-center ocassional-content-bg p-3">
//                                 <div className="row">
//                                     <div className="col">{totalOcassionalMonthAmount} €</div>
//                                     <div className="col">{calculatePercentage(totalOcassionalMonthAmount, totalIncomeMonthAmount)} %</div>
//                                 </div>
//                             </div>
//                             <div className="ocassional-light-bg text-center justify-content-center align-items-center p-3">
//                                 <div className="row">
//                                     <div className="col">Categoría</div>
//                                     <div className="col">Total</div>
//                                     <div className="col">%</div>
//                                 </div>
//                             </div>
//                             {Object.entries(ocassionalCategoryTotals).map(([category, total]) => (
//                                 <div className="text-center justify-content-center align-items-center ocassional-content-bg p-3" key={category}>
//                                     <div className="row">
//                                         <div className="col">{category}</div>
//                                         <div className="col">{total} €</div>
//                                         <div className="col">{calculatePercentage(total, totalIncomeMonthAmount)} %</div>
//                                     </div>
//                                 </div>
//                             ))} 
//                             <div className="text-center justify-content-center align-items-center p-3" id="table-ocassional">
//                                 <div className="row fw-bold fs-6">
//                                     <div className="col">RESTANTE</div>
//                                     <div className="col">{calculateMonthResult} €</div>
//                                     <div className="col">{calculatePercentage(calculateMonthResult, totalIncomeMonthAmount)} %</div>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         <div className="col wrap flex-column justify-content-center align-items-center rounded-1">
//                             <h4 className="text-white fs-2 p-3 mb-0 rounded-1 text-center py-3" id="table-saves">USO RESERVADO</h4>
//                             <div className="saves-light-bg text-center justify-content-center align-items-center p-3">
//                                 <div className="row">
//                                     <div className="col">Total</div>
//                                     <div className="col">%</div>
//                                 </div>
//                             </div>
//                             <div className="text-center justify-content-center align-items-center saves-content-bg p-3">
//                                 <div className="row">
//                                     <div className="col">{totalSaveUsageMonthAmount} €</div>
//                                     <div className="col">{calculatePercentage(totalSaveUsageMonthAmount, totalIncomeMonthAmount)} %</div>
//                                 </div>
//                             </div>
//                             <div className="saves-light-bg text-center justify-content-center align-items-center p-3">
//                                 <div className="row">
//                                     <div className="col">Categoría</div>
//                                     <div className="col">Total</div>
//                                     <div className="col">%</div>
//                                 </div>
//                             </div>
//                             {Object.entries(saveUsageCategoryTotals).map(([category, total]) => (
//                                 <div className="text-center justify-content-center align-items-center saves-content-bg p-3" key={category}>
//                                     <div className="row">
//                                         <div className="col">{category}</div>
//                                         <div className="col">{total} €</div>
//                                         <div className="col">{calculatePercentage(total, totalIncomeMonthAmount)} %</div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };