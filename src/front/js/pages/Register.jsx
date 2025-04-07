import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../styles/register.css";
import girls from "../../img/girls.jpg";

export const Register = () => {
    const { store, actions } = useContext(Context);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [viewPassword, setViewPassword] = useState(false);
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataToSend = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password
        }
        console.log(dataToSend)
        actions.register(dataToSend);
        navigate('/')
        
    }
    return (
        <main style={{ position: 'relative', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${girls})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.6, zIndex: -1, }}></div>

            <div className="register-box p-4 shadow-lg rounded">
                <h1 className="register-title">Register</h1>
                <p className="register-subtitle">Discover your next adventure</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input type="text" className="form-control" id="firstName" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input type="text" className="form-control" id="lastName" placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input type="email" className="form-control" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-group">
                            <input type={viewPassword ? 'text' : 'password'} className="form-control" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <span className="input-group-text" onClick={() => setViewPassword(!viewPassword)} style={{ cursor: "pointer" }}>
                                {viewPassword ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}
                            </span>
                        </div>
                    </div>
                    <button className="btn register-btn w-100 py-2" type="submit">Register</button>
                    <div className="text-center mt-3">
                        <span className="login-text">You already have an account? </span>
                        <a onClick={() => navigate("/login")} href="#" className="login-link">Log in</a>
                    </div>
                </form>
            </div>
        </main>
    );
};