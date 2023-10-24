import React, { useEffect, useContext } from "react";
import { Context } from "./store/appContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import injectContext from "./store/appContext";

// import { Login } from "./pages/login.jsx";
// import { Signup } from "./pages/signup.jsx";
// import { Income } from "./pages/income.jsx";
// import { FixedExpense } from "./pages/fixedexpenses.jsx";
// import { VariableExpense } from "./pages/variableexpense.jsx";
// import { User } from "./pages/user.jsx";
// import { Cartera } from "./pages/cartera.jsx";
// import { Totalincomes } from "./pages/totalincomes.jsx";
// import { Totalexpenses } from "./pages/totalexpenses.jsx";
// import { Addincome } from "./pages/addincome.jsx";
// import { Addfixedexpense } from "./pages/addfixedexpense.jsx";
// import { Addvariableexpense } from "./pages/addvariableexpense.jsx";
// import { AddExpense } from "./pages/addexpense.jsx";
// import { Principal } from "./pages/principal.jsx";
// import { Expenses } from "./pages/expenses.jsx";
// import { LandingPage } from "./pages/landingpage.jsx";
// import { Sidebar } from "./component/sidebar.jsx";


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
                        <Sidebar />
                        <Routes>
                            {/* <Route element={<LandingPage />} path="/" />
                            <Route element={<Login />} path="/login" />
                            <Route element={<Signup />} path="/signup" />
                            <Route element={<Principal />} path="/principal" />

                            <Route element={<Income />} path="/income" />
                            <Route element={<Totalincomes />} path="/totalincomes" />
                            <Route element={<Addincome />} path="/addincome" />

                            <Route element={<Expenses />} path="/expenses" />
                            <Route element={<Totalexpenses />} path="/totalexpenses" />
                            <Route element={<FixedExpense />} path="/fixedexpense" />
                            <Route element={<VariableExpense />} path="/variableexpense" />
                            <Route element={<Addfixedexpense />} path="/addfixedexpense" />
                            <Route element={<Addvariableexpense />} path="/addvariableexpense" />
                            <Route element={<AddExpense />} path="/addexpense" />

                            <Route element={<User />} path="/user" />
                            <Route element={<Cartera />} path="/cartera" />
                            <Route element={<h1>Not found!</h1>} /> */}
                        </Routes>
                    </div>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
