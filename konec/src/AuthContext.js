import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [role, setRole] = useState(null);

    return (
        <AuthContext.Provider value={{ auth, setAuth, role, setRole }}>
            {children}
        </AuthContext.Provider>
    );
};
