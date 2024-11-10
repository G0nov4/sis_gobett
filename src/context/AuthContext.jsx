import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/AuthService";
import { message } from "antd";
import jwt from 'jwt-decode';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [loggedUser, setLoggedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {


        checkAuthentication();
    }, []);

    const checkAuthentication = async () => {
        const cachedUser = localStorage.getItem("sisgbt-jwtoken");
        if (cachedUser) {
            try {
                setLoggedUser({
                    type: localStorage.getItem("sis_role"),
                    token: cachedUser
                });
            } catch (error) {
                console.error('Error al verificar la autenticación:', error);
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        } else {
            // No hay usuario en caché
            setIsLoading(false);
        }

    };

    const redirectToDashboard = (userType) => {
        checkAuthentication()
        switch (userType) {
            case 'gerente':
                message.success('¡Bienvenido Admin!');
                navigate('/admin', { replace: true });
                break;
            case 'operador de venta':
                message.success('¡Bienvenido Departamento de Ventas!');
                navigate('/operator/sales', { replace: true });
                break;
            case 'operador de almacen':
                message.success('¡Bienvenido Departamento de Almacén!');
                navigate('/warehouse', { replace: true });
                break;
            default:
                message.warning('Usuario no reconocido');
                navigate('/login', { replace: true });
        }
    };

    const login = async (email, password) => {
        try {
            // Realizar el inicio de sesión
            const userInfo = await authService.login(email, password);

            // Obtener el rol del usuario
            const role = await authService.getRole(userInfo);

            localStorage.setItem('sisgbt-jwtoken', role.jwt)
            localStorage.setItem('sis_role', role.role.name)

            // Redireccionar al usuario según su rol
            redirectToDashboard(role.role.name);
        } catch (error) {
            // Manejar errores de inicio de sesión
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setLoggedUser(null);
        navigate('/login', { replace: true });
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!loggedUser, loggedUser, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
