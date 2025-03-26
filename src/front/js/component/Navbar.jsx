import React from "react";
import { Link } from "react-router-dom";
import Vibe from "../../img/Vibe.png"
import { useNavigate } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-expand-lg navbar-custom">
			<div className="container">
				<a className="navbar-brand">
					<img src={Vibe} alt="Logo" width="120" height="60"/> 
				</a>

				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse " id="navbarNav">
					<ul className="navbar-nav me-auto">
						<li className="nav-item">
							<a className="nav-link text-white" href="#">Explore Adventures</a>
						</li>
						<li className="nav-item">
							<a className="nav-link text-white" href="#">Find Your Next Adventure</a>
						</li>
						<li className="nav-item">
							<a className="nav-link text-white" href="#">Design Your Trip</a>
						</li>
						<li className="nav-item">
							<a className="nav-link text-white" href="#">Community</a>
						</li>
					</ul>

					<div className="d-flex align-items-center">
						<button className="btn btn-outline-light me-2">
							<i className="fas fa-heart"></i>
						</button>
						<Link to='/login' className=" btn btn-login me-2">Login</Link>
						<Link to='/register' className=" btn btn-register me-2">Register</Link>
					</div>
				</div>
			</div>
		</nav>

	);
};

