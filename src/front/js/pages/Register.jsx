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
    
    const handleFirstName = (event) => {setFirstName(event.target.value)}
    const handleLastName = (event) => {setLastName(event.target.value)}
    const handleEmail = (event) => {setEmail(event.target.value)}
    const handlePassword = (event) => {setPassword(event.target.value)}
    const handleViewPassword = () => {setViewPassword(!viewPassword)}

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataToSend = {
            first_name: firstName, 
            last_name: lastName, 
            email: email,
            password: password
        }
        console.log(dataToSend)
        //asignar el valor de user para darle la bienvenida
        actions.register(dataToSend);
       
        navigate('/')
        // cambien el valor del btn login a logout del navbar 
    }
    return (
        <main style={{position: 'relative', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${girls})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.6, zIndex: -1,}}></div>

            <div className="register-box p-4 shadow-lg rounded">
                {/* Title */}
                <h1 className="register-title">Register</h1>
                {/* Subtitle */}
                <p className="register-subtitle">Discover your next adventure</p>
                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="floatingFirstName" placeholder="First Name" value={firstName} onChange={handleFirstName}/>
                        <label htmlFor="floatingFirstName">First Name</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="floatingLastName" placeholder="Last Name" value={lastName} onChange={handleLastName}/>
                        <label htmlFor="floatingLastName">Last Name</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="email" className="form-control" id="floatingEmail" placeholder="name@example.com" value={email} onChange={handleEmail}/>
                        <label htmlFor="floatingEmail">Email Address</label>
                    </div>
                    <div className="input-group mb-4 form-floating">
                    <input type={viewPassword ? 'text' : 'password'} className="form-control" id="floatingPassword" placeholder="Password" value={password} onChange={handlePassword}/>
                    <label htmlFor="floatingPassword">Password</label>
                    <span className="input-group-text" onClick={handleViewPassword}>
                        { viewPassword ? 
                        <i className="fa fa-eye-slash"></i>
                        :
                        <i className="fa fa-eye"></i>
                        }
                    </span>
                    </div>
                    {/* Submit Button */}
                    <button className="btn register-btn w-100 py-2" type="submit">Register</button>
                    {/* Login Link */}
                    <div className="text-center mt-3">
                        <span className="login-text">You already have an account? </span>
                        <a onClick={() => navigate("/login")} to="/login" className="login-link">Log in</a>                     
                    </div>
                </form>
            </div>
        </main>
    );
};