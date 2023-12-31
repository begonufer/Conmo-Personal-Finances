import React, { useState } from 'react';

import { AnualOcassionalTable } from "../component/graphics/ocassionalanualtable.jsx";
import { MonthlyOcassionalTable } from "../component/graphics/ocassionalmonthlytable.jsx";

import { AnualFixedTable } from "../component/graphics/fixedanualtable.jsx";
import { MonthlyFixedTable } from "../component/graphics/fixedmonthlytable.jsx";
import { AnualSavesTable } from "../component/graphics/savesanualtable.jsx";
import { MonthlySavesTable } from "../component/graphics/savesmonthlytable.jsx";
import { AnualIncomeTable } from "../component/graphics/incomeanualtable.jsx";
import { MonthlyIncomeTable } from "../component/graphics/incomemonthlytable.jsx";


const DynamicComponent = ({ componentName, ...props }) => {
    switch (componentName) {
        case 'MonthlyOcassionalTable':
            return <MonthlyOcassionalTable {...props} />;
        case 'AnualOcassionalTable':
            return <AnualOcassionalTable {...props} />;
        default:
            return null;
    }
};

export default DynamicComponent;