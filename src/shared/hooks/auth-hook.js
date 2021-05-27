import { useState, useEffect, useCallback } from "react";


let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState();
    const [tokenExpDate, setTokenExpDate] = useState();
    const [userId, setUserId] = useState();
    const [role, setRole] = useState();

    const login = useCallback((uid, role, token, expDate) => {
        setToken(token);
        setUserId(uid);
        setRole(role);

        const tokenExpDate =
            expDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpDate(tokenExpDate);
        localStorage.setItem(
            "userData",
            JSON.stringify({
                userId: uid,
                token: token,
                role: role,
                exp: tokenExpDate.toISOString(),
            })
        );
        localStorage.setItem("Allowed", JSON.stringify(0))
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpDate(null);
        setUserId(null);
        localStorage.removeItem("userData");
    }, []);

    useEffect(() => {
        if (token && tokenExpDate) {
            const remainingTime = tokenExpDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.exp) > new Date()
        ) {
            login(
                storedData.userId,
                storedData.role,
                storedData.token,
                new Date(storedData.exp)
            );
        }
    }, [login]);

    return { token, login, logout, userId, role };
};