import React, {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const UserContext = createContext();
export const UserProvider = ({children}) => {
    const [user, setUser] = useState('');
    useEffect(() => {
        const token = localStorage.getItem("FBIdToken");
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 3000 < Date.now()) {
                localStorage.removeItem("FBIdToken");
                setUser('');
                window.location.href = '/signIn';
            } else {
                if (JSON.stringify(decodedToken) !== JSON.stringify(user)) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    setUser(token);
                }
            }
        }
    }, [user]);
    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserValue = () => useContext(UserContext);