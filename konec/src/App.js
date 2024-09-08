
import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
    const { auth } = useContext(AuthContext);

    return (
        <div className="App">
            {!auth ? <Login /> : <Dashboard />}
        </div>
    );
};

const AppWrapper = () => (
    <AuthProvider>
        <App />
    </AuthProvider>
);

export default AppWrapper;