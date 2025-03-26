import React from "react";
import "../../styles/login.css"; // Importamos el CSS de Login

export const Login = () => {
    return (
        <main className="bg-login">
            <form className="form-box">
                <h1 className="h3 mb-3 fw-bold text-center text-primary-custom">Login</h1>
                <p className="text-center" style={{ color: "#FF5942" }}>
                    Discover your next adventure
                </p>

                <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="floatingInput" placeholder="Input your email" />
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="input-group mb-4 form-floating">
                    <input className="form-control" id="floatingPassword" placeholder="Password" />
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                
                <button className="btn btn-submit w-100 py-2 p-4" type="submit">Log in</button>

                <div className="text-center mt-3">
                    <span className="text-primary-custom">You already have an account? </span>
                    <a href="#" className="text-link">Register</a>
                </div>
            </form>
        </main>
    );
};