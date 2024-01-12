/*Cambiar por dos botones para iniciar sesión y registrarse*/
import React from "react";
import { Link } from "react-router-dom";
import "../../styles/welcome.css";

export const LandingNavbar = () => {
	return (
		<>
			<nav className="navbar p-0">
				<div className="container">
					<span className="conmo-m text-decoration-none text-center">CONMO</span>
					<div className="ml-auto d-none d-md-block">
						<Link to="/login">
							<button className="btn btn-lg text-white fs-4">Iniciar sesión</button>
						</Link>
						<Link to="/signup">
							<button className="btn btn-lg text-white fs-4">Registrarse</button>
						</Link>
					</div>
				</div>
			</nav>
			<div className="d-flex d-md-none justify-content-center align-items-center" id="left-background">
				<Link to="/login" className="w-100">
					<button className="btn btn-lg text-white fs-4 w-100">Iniciar sesión</button>
				</Link>
				<Link to="/signup" className="w-100">
					<button className="btn btn-lg text-white fs-4 w-100">Registrarse</button>
				</Link>
			</div>		
		</>
	);
};