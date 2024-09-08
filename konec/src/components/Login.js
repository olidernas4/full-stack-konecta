import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './Login.css'; // Importamos el archivo de CSS

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setAuth, setRole } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
            const data = await response.json();
            setAuth(data.token);
            setRole(data.role);
        } catch (error) {
            console.error('Login failed', error);
        }
    };

   

    return (
        <div className="login-body">
            <div className="login-container">
                <div className="login-box">
                    <h2>Login</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                    />
                    <button className="login-button" onClick={handleLogin}>Login</button>
                    {/* <button className="logout-button" onClick={handleLogout}>Logout</button> */}
                </div>
            </div>
        </div>
    );
};

export default Login;

/* 
const handleLogout = () => {
    setAuth(null);
    setRole(null);
};*/