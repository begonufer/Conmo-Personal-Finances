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
import { OcassionalExpenses } from "./pages/ocassionalexpenses.jsx";
import { Saves } from "./pages/saves.jsx";
import { Settings } from "./pages/settings.jsx";
import { Navbar } from "./component/Navbar.jsx";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    const {store, actions} = useContext(Context)

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    const userIsLogged = () => {
        fetch(process.env.BACKEND_URL+`api/logged`, { 
            method: "GET",
            headers: { "Content-Type": "application/json",
            'Authorization':'Bearer'+' '+ localStorage.getItem('token')},
        })
        .then(res=>res.json())
        .then(data=>{
            if (data.Logged) {
                actions.setLogged(true)
            }else {
                actions.setLogged(false)
            }
        })
    }

    useEffect(()=>{
        if(localStorage.getItem('token')) {
            userIsLogged()
        }
    },[])

    return (
        <div className="h-100 d-inline">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                <div className="main-body justify-content-center align-items-center">
                    {store.logged ? <Navbar /> : ''}
                        <Routes>
                            {store.logged ?
                                <>
                                    <Route element={<MyConmo />} path="/myconmo" />
                                    <Route element={<Incomes />} path="/incomes" />
                                    <Route element={<Expenses />} path="/expenses" />
                                    <Route element={<FixedExpenses />} path="/fixedexpenses" />
                                    <Route element={<OcassionalExpenses />} path="/ocassionalexpenses" />
                                    <Route element={<Saves />} path="/saves" />
                                    <Route element={<Settings />} path="/settings" />
                                </>
                            : true}
                            <Route element={<LandingPage />} path="/" />
                            <Route element={<Login />} path="/login" />
                            <Route element={<Signup />} path="/signup" />
                            <Route element={<h1>Not found!</h1>} />
                        </Routes>
                    </div>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
