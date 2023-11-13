import React, { useEffect, useContext } from "react";
import { Context } from "./store/appContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import injectContext from "./store/appContext";

import { LandingPage } from "./pages/landingpage.jsx";
import { Login } from "./pages/login.jsx";
import { Signup } from "./pages/signup.jsx";
import { MyConmo } from "./pages/myconmo.jsx";
import { Incomes } from "./pages/incomes.jsx";
import { Expenses } from "./pages/expenses.jsx";
import { FixedExpenses } from "./pages/fixedexpenses.jsx";
import { VariableExpenses } from "./pages/variableexpenses.jsx";
import { Saves } from "./pages/saves.jsx";
import { Settings } from "./pages/settings.jsx";
import { Navbar } from "./component/navbar.jsx";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    const {store, actions} = useContext(Context)

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div className="h-100 d-inline">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                <div className="main-body justify-content-center align-items-center">
                        <Navbar />
                        <Routes>
                            <Route element={<LandingPage />} path="/" />
                            <Route element={<Login />} path="/login" />
                            <Route element={<Signup />} path="/signup" />
                            <Route element={<MyConmo />} path="/myconmo" />

                            <Route element={<Incomes />} path="/incomes" />
                            <Route element={<Expenses />} path="/expenses" />
                            <Route element={<FixedExpenses />} path="/fixedexpenses" />
                            <Route element={<VariableExpenses />} path="/variableexpenses" />
                            <Route element={<Saves />} path="/saves" />
                            <Route element={<Settings />} path="/settings" />

                            <Route element={<h1>Not found!</h1>} />
                        </Routes>
                    </div>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
