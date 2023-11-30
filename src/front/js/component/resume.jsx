import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { format } from "date-fns";
import es from "date-fns/locale/es";


export const Resume = (props) => {
    
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
    const [savesBalance, setSavesBalance] = useState({});

    const dataFilteredByCategory = (filteredIncome, filteredSave, filteredFixed, filteredOcassional) => {

        const incomeTotals = {};
        const saveTotals = {};
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
        setFixedCategoryTotals(fixedTotals);
        setOcassionalCategoryTotals(ocassionalTotals);
    }

    useEffect(() => {
        const transformData = async () => {
            await actions.getIncomes();
            await actions.getSaves();
            await actions.getFixes();
            await actions.getOcassionals();

            const filteredIncome = filterDataByMonthYear(store.incomes, props.selectedMonthIndex, props.selectedYear);
            const filteredSave = filterDataByMonthYear(store.saves, props.selectedMonthIndex, props.selectedYear);
            const filteredFixed = filterDataByMonthYear(store.fixes, props.selectedMonthIndex, props.selectedYear);
            const filteredOcassional = filterDataByMonthYear(store.ocassionals, props.selectedMonthIndex, props.selectedYear);

            const filterAllDataBeforeMonth = (data, selectedMonthIndex, selectedYear) => {
                return data.filter(item => {
                    const itemDate = new Date(item.dateTime);
                    const itemMonth = itemDate.getMonth();
                    const itemYear = itemDate.getFullYear();
            
                    // Filtrar por el año y el mes, incluyendo el mes seleccionado
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
            
            dataFilteredByCategory(filteredIncome, filteredSave, filteredFixed, filteredOcassional);
        };
        transformData();
    }, [props.selectedMonthIndex, props.selectedYear, props.previousMonthIndex]);

    const totalIncomeMonthAmount = filterDataByMonthYear(store.incomes, props.selectedMonthIndex, props.selectedYear).reduce((total, income) => total + income.value, 0);
    const totalSaveMonthAmount = filterDataByMonthYear(store.saves, props.selectedMonthIndex, props.selectedYear).reduce((total, save) => total + save.value, 0);
    const totalFixedMonthAmount = filterDataByMonthYear(store.fixes, props.selectedMonthIndex, props.selectedYear).reduce((total, fixed) => total + fixed.value, 0);
    const totalOcassionalMonthAmount = filterDataByMonthYear(store.ocassionals, props.selectedMonthIndex, props.selectedYear).reduce((total, ocassional) => total + ocassional.value, 0);
 
    const previousMonthAmount = props.previousMonthAmount;

    const balance = previousMonthAmount + totalIncomeMonthAmount;
    const balanceBeforeSaves = balance - totalSaveMonthAmount;
    const balanceBeforeFixed = balanceBeforeSaves - totalFixedMonthAmount;
    const totalExpenses = totalFixedMonthAmount + totalOcassionalMonthAmount;
    const calculateMonthResult = balance - totalSaveMonthAmount - totalExpenses;
    
    const savesBalanceTotal = Object.values(savesBalance).reduce((total, categoryTotal) => total + categoryTotal, 0);


    return (
        <>
            <div className="col-5"  id="resumen">
                    <div className="row">
                        <h1 className="text-center py-3">{props.selectedMonth.toUpperCase()}</h1>
                    </div>
                    <div className="wrap flex-column">
                        <div className="row  pb-2">
                            <div className="text-center">
                                <h4 className="text-white p-2" id="table-incomes">INGRESOS</h4>
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">{props.previousMonth} <i className="fas fa-arrow-right"></i> {previousMonthAmount} €</p>
                                <p className="col text-center">{totalIncomeMonthAmount} €</p>
                            </div>
                            {Object.entries(incomeCategoryTotals).map(([category, total]) => (
                                <div className="row text-center p-2" key={category}>
                                    <p className="col-6 text-center">{category}</p>
                                    <p className="col-3 text-center">{calculatePercentage(total, totalIncomeMonthAmount)} %</p>
                                    <p className="col-3 text-center">{total} €</p>                            
                                </div>
                            ))}
                        </div>
                            <div className="row  pb-2">
                                <div className="col-8 ">
                                    <div className="text-center">
                                        <h4 className="text-white p-2" id="table-saves">RESERVADO</h4>
                                    </div>
                                    <div className="row text-center p-2">
                                        <p className="col text-center">{calculatePercentage(totalSaveMonthAmount, totalIncomeMonthAmount)} %</p>
                                        <p className="col text-center">{totalSaveMonthAmount} €</p>
                                    </div>
                                    {Object.entries(saveCategoryTotals).map(([category, total]) => (
                                        <div className="row text-center p-2" key={category}>
                                            <p className="col-6 text-center">{category}</p>
                                            <p className="col-3 text-center">{calculatePercentage(total, totalIncomeMonthAmount)} %</p>
                                            <p className="col-3 text-center">{total} €</p>                            
                                        </div>
                                    ))}
                                </div>
                                <div className="col-4 ">
                                    <div className="text-center">
                                        <h4 className="text-white p-2" id="table-saves">BALANCE</h4>
                                    </div>
                                    <div className="row text-center p-2">
                                        <p className="col text-center">{savesBalanceTotal} €</p>                          
                                    </div>
                                    {Object.entries(savesBalance).map(([category, total]) => (
                                        <div className="row text-center p-2" key={category}>
                                            <p className="col text-center">{total} €</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className="row  pb-2">
                            <div className="text-center">
                                <h4 className="text-white p-2" id="table-expenses">GASTOS</h4>
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">{calculatePercentage(totalExpenses, totalIncomeMonthAmount)} %</p>
                                <p className="col text-center">{totalExpenses} €</p>
                            </div>
                        </div>
                        <div className="row ">
                            <div className="col ">
                                <h4 className="text-white text-center p-2" id="table-fixed">GASTOS FIJOS</h4>
                                <div className="row text-center p-2">
                                    <p className="col text-center">{calculatePercentage(totalFixedMonthAmount, totalIncomeMonthAmount)} %</p>
                                    <p className="col text-center">{totalFixedMonthAmount} €</p>
                                </div>
                                {Object.entries(fixedCategoryTotals).map(([category, total]) => (
                                    <div className="row text-center p-2" key={category}>
                                        <p className="col-6 text-center">{category}</p>
                                        <p className="col-3 text-center">{calculatePercentage(total, totalIncomeMonthAmount)} %</p>
                                        <p className="col-3 text-center">{total} €</p>                            
                                    </div>
                                ))}
                                <div id="table-title" className="row text-center text-white p-2">
                                    <p className="col text-center">LIBRE</p>
                                    <p className="col text-center">{calculatePercentage(balanceBeforeFixed, totalIncomeMonthAmount)} %</p>
                                    <p className="col text-center">{balanceBeforeFixed} €</p>                            
                                </div>
                            </div>
                            <div className="col ">
                                <div className="text-center">
                                    <h4 className="text-white p-2" id="table-ocassional">GASTOS VARIABLES</h4>
                                </div>
                                <div className="row text-center p-2">
                                    <p className="col text-center">{calculatePercentage(totalOcassionalMonthAmount, totalIncomeMonthAmount)} %</p>
                                    <p className="col text-center">{totalOcassionalMonthAmount} €</p>
                                </div>
                                {Object.entries(ocassionalCategoryTotals).map(([category, total]) => (
                                    <div className="row text-center p-2" key={category}>
                                        <p className="col-6 text-center">{category}</p>
                                        <p className="col-3 text-center">{calculatePercentage(total, totalIncomeMonthAmount)} %</p>
                                        <p className="col-3 text-center">{total} €</p>                            
                                    </div>
                                ))}            
                                <div className="row text-center bg-secondary text-white p-2">
                                    <p className="col text-center">RESTANTE</p>
                                    <p className="col text-center">{calculatePercentage(calculateMonthResult, totalIncomeMonthAmount)} %</p>
                                    <p className="col text-center">{calculateMonthResult} €</p>                            
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

        </>
    );
};




















export const ResumeAnual = () => {
    return (
        <>
            <div className="col" id="resumen">
                <div className="row">
                    <h1 className="text-center py-3">2023</h1>
                </div>
                <div className="wrap flex-column">
                    <div className="row justify-content-center align-items-center pb-2">
                        <div className="text-center">
                            <h4 className="text-white p-2" id="table-incomes">INGRESOS</h4>
                        </div>
                        <div className="row text-center p-2">
                            <p className="col text-center">Media €</p>
                            <p className="col text-center">Total €</p>
                        </div>
                        <div className="row text-center p-2">
                            <p className="col text-center">Categoría ingreso</p>
                            <p className="col text-center">Media €</p>
                            <p className="col text-center">%</p>                            
                        </div>
                        <div className="row text-center p-2">
                            <p className="col text-center">Categoría ingreso</p>
                            <p className="col text-center">Media €</p>
                            <p className="col text-center">%</p>                            
                        </div>
                        <div className="row text-center p-2">
                            <p className="col text-center">Categoría ingreso</p>
                            <p className="col text-center">Media €</p>
                            <p className="col text-center">%</p>                            
                        </div>
                    </div>
                    <div className="row  pb-2">
                        <div className="col-8">
                            <div className="text-center">
                                <h4 className="text-white p-2" id="table-saves">RESERVADO</h4>
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">Total €</p>
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Categoría reservado</p>
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">Total €</p>                            
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Categoría reservado</p>
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">Total €</p>                            
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Categoría reservado</p>
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">Total €</p>                            
                            </div>
                        </div>
                        <div className="col-4 ">
                            <h4 className="text-white text-center p-2" id="table-saves">USO RESERVADO</h4>
                            <div className="row text-center p-2">
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>                            
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>                            
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>                            
                            </div>
                        </div>
                    </div>
                    <div className="row pb-2">
                        <div className="text-center">
                            <h4 className="text-white p-2" id="table-expenses">GASTOS</h4>
                        </div>
                        <div className="row text-center p-2">
                            <p className="col text-center">Media €</p>
                            <p className="col text-center">%</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="text-center">
                                <h4 className="text-white p-2" id="table-fixed">GASTOS FIJOS</h4>
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Categoría gastos fijos</p>
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>                            
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Categoría gastos fijos</p>
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>                            
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Categoría gastos fijos</p>
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>                            
                            </div>
                            <div id="table-title" className="row text-center text-white p-2">
                                <p className="col text-center">LIBRE</p>
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>                            
                            </div>
                        </div>
                        <div className="col">
                            <div className="text-center">
                                <h4 className="text-white p-2" id="table-ocassional">GASTOS VARIABLES</h4>
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Categoría gastos variables</p>
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>                            
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Categoría gastos variables</p>
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>                            
                            </div>
                            <div className="row text-center p-2">
                                <p className="col text-center">Categoría gastos variables</p>
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>                            
                            </div>
                            <div id="table-title" className="row text-center text-white p-2">
                                <p className="col text-center">RESTANTE</p>
                                <p className="col text-center">Media €</p>
                                <p className="col text-center">%</p>                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};



// export const Resume = () => {
//     return (
//         <>
//             <div className="row gap-5 m-5" id="table-of-percentages">
//                     <div className="col"  id="resumen">
//                         <div className="row">
//                             <h1 className="text-center py-3">OCTUBRE</h1>
//                         </div>
//                         <div className="wrap flex-column">
//                             <div className="row  pb-2">
//                                 <div className="text-center">
//                                     <h4 className="text-white p-2" id="table-incomes">INGRESOS</h4>
//                                 </div>
//                                 <div className="row text-center p-2">
//                                     <p className="col text-center">Restante mes anterior</p>
//                                     <p className="col text-center">Total €</p>
//                                 </div>
//                                 <div className="row text-center p-2">
//                                     <p className="col-6 text-center">Categoría ingreso</p>
//                                     <p className="col-3 text-center">%</p>
//                                     <p className="col-3 text-center">€</p>                            
//                                 </div>
//                                 <div className="row text-center p-2">
//                                     <p className="col-6 text-center">Categoría ingreso</p>
//                                     <p className="col-3 text-center">%</p>
//                                     <p className="col-3 text-center">€</p>                            
//                                 </div>
//                                 <div className="row text-center p-2">
//                                     <p className="col-6 text-center">Categoría ingreso</p>
//                                     <p className="col-3 text-center">%</p>
//                                     <p className="col-3 text-center">€</p>                            
//                                 </div>
//                             </div>
//                             <div className="row  pb-2">
//                                 <div className="col-8 ">
//                                     <div className="text-center">
//                                         <h4 className="text-white p-2" id="table-saves">RESERVADO</h4>
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">%</p>
//                                         <p className="col text-center">€</p>
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col-6 text-center">Categoría reservado</p>
//                                         <p className="col-3 text-center">%</p>
//                                         <p className="col-3 text-center">€</p>                            
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col-6 text-center">Categoría reservado</p>
//                                         <p className="col-3 text-center">%</p>
//                                         <p className="col-3 text-center">€</p>                            
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col-6 text-center">Categoría reservado</p>
//                                         <p className="col-3 text-center">%</p>
//                                         <p className="col-3 text-center">€</p>                            
//                                     </div>
//                                 </div>
//                                 <div className="col-4 ">
//                                     <div className="text-center">
//                                         <h4 className="text-white p-2" id="table-saves">USO RESERVADO</h4>
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">%</p>
//                                         <p className="col text-center">€</p>
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">%</p>
//                                         <p className="col text-center">€</p>                            
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">%</p>
//                                         <p className="col text-center">€</p>                            
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">%</p>
//                                         <p className="col text-center">€</p>                            
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="row  pb-2">
//                                 <div className="text-center">
//                                     <h4 className="text-white p-2" id="table-expenses">GASTOS</h4>
//                                 </div>
//                                 <div className="row text-center p-2">
//                                     <p className="col text-center">%</p>
//                                     <p className="col text-center">Total €</p>
//                                 </div>
//                             </div>
//                             <div className="row ">
//                                 <div className="col ">
//                                     <h4 className="text-white text-center p-2" id="table-fixed">GASTOS FIJOS</h4>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">%</p>
//                                         <p className="col text-center">€</p>
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col-6 text-center">Categoría gastos fijos</p>
//                                         <p className="col-3 text-center">%</p>
//                                         <p className="col-3 text-center">€</p>                            
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col-6 text-center">Categoría gastos fijos</p>
//                                         <p className="col-3 text-center">%</p>
//                                         <p className="col-3 text-center">€</p>                            
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col-6 text-center">Categoría gastos fijos</p>
//                                         <p className="col-3 text-center">%</p>
//                                         <p className="col-3 text-center">€</p>                            
//                                     </div>
//                                     <div id="table-title" className="row text-center text-white p-2">
//                                         <p className="col text-center">LIBRE</p>
//                                         <p className="col text-center">%</p>
//                                         <p className="col text-center">€</p>                            
//                                     </div>
//                                 </div>
//                                 <div className="col ">
//                                     <div className="text-center">
//                                         <h4 className="text-white p-2" id="table-ocassional">GASTOS VARIABLES</h4>
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">%</p>
//                                         <p className="col text-center">€</p>
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col-6 text-center">Categoría gastos variables</p>
//                                         <p className="col-3 text-center">%</p>
//                                         <p className="col-3 text-center">€</p>                            
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col-6 text-center">Categoría gastos variables</p>
//                                         <p className="col-3 text-center">%</p>
//                                         <p className="col-3 text-center">€</p>                            
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col-6 text-center">Categoría gastos variables</p>
//                                         <p className="col-3 text-center">%</p>
//                                         <p className="col-3 text-center">€</p>                            
//                                     </div>
//                                     <div className="row text-center bg-secondary text-white p-2">
//                                         <p className="col text-center">RESTANTE</p>
//                                         <p className="col text-center">%</p>
//                                         <p className="col text-center">€</p>                            
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col" id="resumen">
//                         <div className="row">
//                             <h1 className="text-center py-3">2023</h1>
//                         </div>
//                         <div className="wrap flex-column">
//                             <div className="row justify-content-center align-items-center pb-2">
//                                 <div className="text-center">
//                                     <h4 className="text-white p-2" id="table-incomes">INGRESOS</h4>
//                                 </div>
//                                 <div className="row text-center p-2">
//                                     <p className="col text-center">Media €</p>
//                                     <p className="col text-center">Total €</p>
//                                 </div>
//                                 <div className="row text-center p-2">
//                                     <p className="col text-center">Categoría ingreso</p>
//                                     <p className="col text-center">Media €</p>
//                                     <p className="col text-center">%</p>                            
//                                 </div>
//                                 <div className="row text-center p-2">
//                                     <p className="col text-center">Categoría ingreso</p>
//                                     <p className="col text-center">Media €</p>
//                                     <p className="col text-center">%</p>                            
//                                 </div>
//                                 <div className="row text-center p-2">
//                                     <p className="col text-center">Categoría ingreso</p>
//                                     <p className="col text-center">Media €</p>
//                                     <p className="col text-center">%</p>                            
//                                 </div>
//                             </div>
//                             <div className="row  pb-2">
//                                 <div className="col-8">
//                                     <div className="text-center">
//                                         <h4 className="text-white p-2" id="table-saves">RESERVADO</h4>
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">Media €</p>
//                                         <p className="col text-center">Total €</p>
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">Categoría reservado</p>
//                                         <p className="col text-center">Media €</p>
//                                         <p className="col text-center">Total €</p>                            
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">Categoría reservado</p>
//                                         <p className="col text-center">Media €</p>
//                                         <p className="col text-center">Total €</p>                            
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">Categoría reservado</p>
//                                         <p className="col text-center">Media €</p>
//                                         <p className="col text-center">Total €</p>                            
//                                     </div>
//                                 </div>
//                                 <div className="col-4 ">
//                                     <h4 className="text-white text-center p-2" id="table-saves">USO RESERVADO</h4>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">Media €</p>
//                                         <p className="col text-center">%</p>
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">Media €</p>
//                                         <p className="col text-center">%</p>                            
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">Media €</p>
//                                         <p className="col text-center">%</p>                            
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">Media €</p>
//                                         <p className="col text-center">%</p>                            
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="row pb-2">
//                                 <div className="text-center">
//                                     <h4 className="text-white p-2" id="table-expenses">GASTOS</h4>
//                                 </div>
//                                 <div className="row text-center p-2">
//                                     <p className="col text-center">Media €</p>
//                                     <p className="col text-center">%</p>
//                                 </div>
//                             </div>
//                             <div className="row">
//                                 <div className="col">
//                                     <div className="text-center">
//                                         <h4 className="text-white p-2" id="table-fixed">GASTOS FIJOS</h4>
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">Media €</p>
//                                         <p className="col text-center">%</p>
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">Categoría gastos fijos</p>
//                                         <p className="col text-center">Media €</p>
//                                         <p className="col text-center">%</p>                            
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">Categoría gastos fijos</p>
//                                         <p className="col text-center">Media €</p>
//                                         <p className="col text-center">%</p>                            
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">Categoría gastos fijos</p>
//                                         <p className="col text-center">Media €</p>
//                                         <p className="col text-center">%</p>                            
//                                     </div>
//                                     <div id="table-title" className="row text-center text-white p-2">
//                                         <p className="col text-center">LIBRE</p>
//                                         <p className="col text-center">Media €</p>
//                                         <p className="col text-center">%</p>                            
//                                     </div>
//                                 </div>
//                                 <div className="col">
//                                     <div className="text-center">
//                                         <h4 className="text-white p-2" id="table-ocassional">GASTOS VARIABLES</h4>
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">Media €</p>
//                                         <p className="col text-center">%</p>
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">Categoría gastos variables</p>
//                                         <p className="col text-center">Media €</p>
//                                         <p className="col text-center">%</p>                            
//                                     </div>
//                                     <div className="row text-center p-2">
//                                         <p className="col text-center">Categoría gastos variables</p>
//                                         <p className="col text-center">Media €</p>
//                                         <p className="col text-center">%</p>                            
//                                 </div>
//                                 <div className="row text-center p-2">
//                                     <p className="col text-center">Categoría gastos variables</p>
//                                     <p className="col text-center">Media €</p>
//                                     <p className="col text-center">%</p>                            
//                                 </div>
//                                 <div id="table-title" className="row text-center text-white p-2">
//                                     <p className="col text-center">RESTANTE</p>
//                                     <p className="col text-center">Media €</p>
//                                     <p className="col text-center">%</p>                            
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }