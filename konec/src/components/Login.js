
import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setAuth, setRole } = useContext(AuthContext);
    const handleLogin = async () => {
        try {
            console.log('Logging in with email:', email);
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
            console.log('Login response data:', data); // Log the response data
            setAuth(data.token);
            setRole(data.role); // Asegúrate de que el nombre de la propiedad coincida con la respuesta del backend
            console.log('Login successful, token:', data.token, 'role:', data.role);
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;