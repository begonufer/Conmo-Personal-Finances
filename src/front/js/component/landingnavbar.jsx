/*Cambiar por dos botones para iniciar sesión y registrarse*/
import React from "react";
import { Link } from "react-router-dom";
import "../../styles/welcome.css";

export const LandingNavbar = () => {
	return (
		<nav className="navbar">
			<div className="container">
				<span className="conmo text-decoration-none text-center fs-2">CONMO</span>
				<div className="ml-auto">
					<Link to="/login">
						<button className="btn btn-lg text-white fs-4">Iniciar sesión</button>
					</Link>
					<Link to="/signup">
						<button className="btn btn-lg text-white fs-4">Registrarse</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};