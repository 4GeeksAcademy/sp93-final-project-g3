import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import Vibe from "../../img/Vibe.png"
import { useNavigate } from "react-router-dom";
import '../../styles/navBar.css';

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const user = JSON.parse(localStorage.getItem("user"));

	const handleLog = () => {
		if (store.isLogged) {
			actions.logout(navigate('/'));
		} else {
			navigate('/login')
		}
	}
	const hasNotifications = store.hostRequests && store.hostRequests.length > 0;


	return (
		<nav className="navbar navbar-expand-lg navbar-custom">
			<div className="container">
				<span className="btn navbar-brand" onClick={() => navigate("/")}>
					<img src={Vibe} alt="Logo" className="navbar-logo" />
				</span>

				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse " id="navbarNav">
					<ul className="navbar-nav me-auto">
						<li className="nav-item">
							<a onClick={() => navigate("/get-inspired")} className="nav-link text-white clickable" href="#">Get Inspired</a>
						</li>
						<li className="nav-item">
							<span
								onClick={() => navigate("/find")}
								className="nav-link text-white clickable">
								Find Your Next Adventure
							</span>
						</li>
						<li className="nav-item">
							<span
								onClick={() => navigate("/design-trip")}
								className="nav-link text-white clickable">
								Design Your Trip
							</span>
						</li>
						<li className="nav-item">
							<a onClick={() => navigate("/community")} className="nav-link text-white clickable" href="#">Community</a>
						</li>
					</ul>
					<div className="d-flex align-items-center">
						{store.isLogged ? (
							<div className="d-flex align-items-center gap-3">
								<div className="position-relative">
									<button
										type="button"
										className="btn btn-bell"
										onClick={() => navigate("/notifications")}
									>
										<i className="fas fa-bell"></i>
										{hasNotifications && <span className="notification-badge"></span>}
									</button>
								</div>

								<div className="dropdown">
									<img
										src={store.user.photo || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
										alt="User"
										className="rounded-circle dropdown-toggle user-avatar"
										role="button"
										id="userDropdown"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									/>
									<ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
										<li><span className="dropdown-item" onClick={() => navigate("/profile")}>My Profile</span></li>
										<li><hr className="dropdown-divider" /></li>
										<li><span className="dropdown-item" onClick={handleLog}>Log out</span></li>
									</ul>
								</div>
							</div>
						) : (
							<ul className="navbar-nav me-auto mb-2 mb-lg-0">
								<li className="nav-item">
									<span onClick={() => navigate("/login")} className="btn btn-login me-2">Login</span>
								</li>
								<li className="nav-item">
									<span onClick={() => navigate("/register")} className="btn btn-register me-2">Register</span>
								</li>
							</ul>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};