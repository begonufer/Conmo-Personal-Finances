import React from "react";
import { Link } from "react-router-dom";
import landingImageUrl from "../../img/landing.png";

export const LandingPage = () => {
	return (
		<>
			<div className="d-block w-100 bg-white">
				<LandingNavbar />
				<div id="landing">
					<img src={landingImageUrl} className="img-fluid h-100 w-100 object-fit-cover" alt="Welcome image"/>
				</div>
			</div>
		</>
	);
};

const LandingNavbar = () => {
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
			<div className="d-flex d-md-none justify-content-center align-items-center conmo-light-bg">
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