import React, {useContext} from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import Vibe from "../../img/Vibe.png"
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const user = JSON.parse(localStorage.getItem("user"));

	const handleLog = () => {
		if (store.isLogged) {
			actions.logout();
		} else {
			navigate('/login')
		}
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-custom">
			<div className="container">
				<span className="btn navbar-brand" OnClick={ () => navigate("/")}>
					<img src={Vibe} alt="Logo" width="120" height="60"/> 
				</span>

				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse " id="navbarNav">
					<ul className="navbar-nav me-auto">
						<li className="nav-item">
							<a className="nav-link text-white" href="#">Explore Adventures</a>
						</li>
						<li className="nav-item">
							<a onClick={ () => navigate("/find")} className="nav-link text-white" href="#">Find Your Next Adventure</a>
						</li>
						<li className="nav-item">
							<a onClick={ () => navigate("/design-trip")} className="nav-link text-white" href="#">Design Your Trip</a>
						</li>
						<li className="nav-item">
							<a className="nav-link text-white" href="#">Community</a>
						</li>
					</ul>

					<div className="d-flex align-items-center">
						<button className="btn btn-outline-light me-2">
							<i className="fas fa-heart"></i>
						</button>
						{store.isLogged ? (
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<span className="nav-link text-light me-3">Welcome, {store.user.first_name}</span>
							</li>
							<li className="nav-item">
								<span onClick={handleLog} className="nav-link">Logout</span>
							</li>
						</ul>
					) : (
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<span onClick={ () => navigate("/login")} className="btn btn-login me-2">Login</span>
							</li>
							<li className="nav-item">
								<span onClick={ () => navigate("/register")} className="btn btn-register me-2">Register</span>
							</li>
						</ul>
					)}
					</div>
				</div>
			</div>
		</nav>

	);
};

