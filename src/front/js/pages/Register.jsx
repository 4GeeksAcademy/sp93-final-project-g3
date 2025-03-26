import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/register.css";
import girls from "../../img/girls.jpg";

export const Register = () => {
    return (
        <main className="form-register d-flex justify-content-center align-items-center">
            <div className="register-box p-4 shadow-lg rounded">
                {/* Title */}
                <h1 className="register-title">Register</h1>
                {/* Subtitle */}
                <p className="register-subtitle">Discover your next adventure</p>
                {/* Registration Form */}
                <form>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="floatingFirstName" placeholder="First Name" />
                        <label htmlFor="floatingFirstName">First Name</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="floatingLastName" placeholder="Last Name" />
                        <label htmlFor="floatingLastName">Last Name</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="email" className="form-control" id="floatingEmail" placeholder="name@example.com" />
                        <label htmlFor="floatingEmail">Email Address</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    {/* Submit Button */}
                    <button className="btn register-btn w-100 py-2" type="submit">Register</button>
                    {/* Login Link */}
                    <div className="text-center mt-3">
                        <span className="login-text">You already have an account? </span>
                        <Link to="/login" className="login-link">Log in</Link>
                    </div>
                </form>
            </div>
        </main>
    );
};