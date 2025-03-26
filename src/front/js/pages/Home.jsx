import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { InputSearch } from "../component/InputSearch.jsx";


export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<h1>Hola que tal?</h1>
			<InputSearch/>
		</div>
	);
};
