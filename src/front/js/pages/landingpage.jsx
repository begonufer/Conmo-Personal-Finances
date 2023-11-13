import React from "react";
import { LandingNavbar } from "../component/landingnavbar.jsx"; /*Cambiar por dos botones para iniciar sesión y registrarse*/
import landingImageUrl from "../../img/landing.png";
import "../../styles/welcome.css";

export const LandingPage = () => {
	return (
		<>
			<div className="d-block w-100 h-100 bg-white">
				<LandingNavbar />
				<div id="landing">
					<img src={landingImageUrl} className="img-fluid" alt="Welcome image" />
				</div>
			</div>
		</>
	);
};