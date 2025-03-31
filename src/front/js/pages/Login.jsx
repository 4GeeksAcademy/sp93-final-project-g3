import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/login.css"; // Importamos el CSS de Login
import { useNavigate } from "react-router-dom";
import girls from "../../img/girls.jpg"

export const Login = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [viewPassword, setViewPassword] = useState(false);
    const navigate = useNavigate()

    const handleEmail = (event) => { setEmail(event.target.value) }
    const handlePassword = (event) => { setPassword(event.target.value) }
    const handleViewPassword = () => { setViewPassword(!viewPassword) }

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataToSend = { email, password }
        console.log(dataToSend)
        //asignar el valor de user para darle la bienvenida
        actions.login(dataToSend);

        navigate('/')
        // cambien el valor del btn login a logout del navbar
    }

    useEffect(() => {
        actions.login();

    }, [navigate]);
    return (
        <main style={{ position: 'relative', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${girls})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.6, zIndex: -1, }}></div>

            <form className="form-box" onSubmit={handleSubmit}>
                <h1 className="h3 mb-3 fw-bold text-center text-primary-custom">Login</h1>
                <p className="subtitle text-center" style={{ color: "#FF5942" }}>
                    Discover your next adventure
                </p>
                {/* Username / Email */}
                <div className="mb-3">
                    <label htmlFor="emailInput" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="emailInput" placeholder="Enter your email" value={email} onChange={handleEmail} />
                </div>
                {/* Password */}
                <div className="mb-3">
                    <label htmlFor="passwordInput" className="form-label">Password</label>
                    <div className="input-group">
                        <input type={viewPassword ? 'text' : 'password'} className="form-control" id="passwordInput" placeholder="Enter your password" value={password} onChange={handlePassword} />
                        <span className="input-group-text" onClick={handleViewPassword} style={{ cursor: "pointer" }}>
                            {viewPassword ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}
                        </span>
                    </div>
                </div>
                <button className="btn btn-submit w-100 py-2 p-4" type="submit">Log in</button>
                <div className="text-center mt-3">
                    <span className="text-primary-custom">You don't have an account? </span>
                    <a onClick={() => navigate("/register")} href="#" className="text-link">Register</a>
                </div>
            </form>
        </main>
    );
};