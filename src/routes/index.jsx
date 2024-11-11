import React, { useContext } from 'react';

import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import Login from '../views/Auth/Login';
import Register from '../views/Auth/Register';
import CustomHeader from '../container/Sidebar/Header';
import Page404 from '../views/Results/404';
import Page403 from '../views/Results/403';
import LoadingPage from '../views/Results/Loading';
import Branches_Points from '../views/Branches/Branches_Points';
import Clients from '../views/Clients/Clients';
import CreateComponentFabric from '../views/Fabrics/CreateFabric';
import Fabrics from '../views/Fabrics/Fabrics';
import Supplier from '../views/Supppliers/Supplier';
import PosSales from '../views/operator/Orders';
import HeaderSales from '../container/Sidebar/HeaderSales';
import ConfigurationProfiles from '../components/operator/ConfigurationProfiles';
import Categories from '../views/Categories/Categories';
import Promos from '../views/Promos/Promos';
import ViewFabric from '../components/Fabrics/ViewFabric';
import EditFabric from '../views/Fabrics/EditFabric';
import Sales from '../views/operator/Sales';
import Movements from '../views/operator/Movements';
import Orders from '../views/operator/Orders';
import TransactionSales from '../views/Sales/TransactionSales';
import TransactionOrders from '../views/Orders/TransactionOrders';

const RoutesApp = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />

                {/* Rutas protegidas */}
                <Route element={<ProtectedRoutes />}>
                    {/* Rutas de administrador */}
                    <Route path='/admin/*' element={<AdminRoutes />} />
                    {/* Rutas de operador */}
                    <Route path='/operator/*' element={<OperatorRoutes />} />
                    {/* Rutas de almacén */}
                    <Route path='/warehouse/*' element={<WarehouseRoutes />} />
                </Route>

                {/* Ruta 404 */}
                <Route path="/404" element={<Page404 />} />
                <Route path="*" element={<Navigate to="/404" />} />
                <Route path="/403" element={<Page403 />} />
            </Routes>
        </AuthProvider>
    );
};

// Componente para rutas protegidas
const ProtectedRoutes = () => {
    const { isAuthenticated, isLoading } = useContext(AuthContext);
    if (isLoading) return <LoadingPage />
    if (isAuthenticated) return <Outlet />;
    return <Navigate to='/403' replace />;
};

// Componente para rutas de administrador
const AdminRoutes = () => {
    const role = localStorage.getItem('sis_role')
    if (role === 'gerente') {
        return (
            <>
                <CustomHeader title={"ADMINISTRADOR"}>
                    <Routes>
                        <Route index element={<h1>HOME</h1>} />
                        <Route path='/branches' element={<Branches_Points />} />
                        <Route path='/clients' element={<Clients />} />
                        <Route path='/fabrics' element={<Fabrics />} />
                        <Route path='/fabrics/:id' element={<ViewFabric/>} />
                        <Route path='/fabric/create' element={<CreateComponentFabric />} />
                        <Route path='/suppliers' element={<Supplier />} />
                        <Route path='/categories' element={<Categories />} />
                        <Route path='/promos' element={<Promos />} />
                        <Route path='fabric/edit/:id' element={<EditFabric />} />
                        <Route path='/sales' element={<TransactionSales />} />
                        <Route path='/orders' element={<TransactionOrders />} />
                    </Routes>
                </CustomHeader>
            </>
        );
    }
    return <Navigate to='/403' replace />;
};

// Componente para rutas de operador
const OperatorRoutes = () => {
    const role = localStorage.getItem('sis_role')
    if (role === 'operador de venta') {
        return (
            <>
                <HeaderSales>
                    <Routes>
                        <Route index path='/sales' element={<Sales />} />
                        <Route index path='/movements' element={<Movements />} />
                        <Route index path='/orders' element={<Orders />} />
                        <Route index path='/profile' element={<ConfigurationProfiles />} />
                    </Routes>

                </HeaderSales>

            </>
        );
    }
    return <Navigate to='/login' replace />;
};

// Componente para rutas de almacén
const WarehouseRoutes = () => {
    const role = localStorage.getItem('sis_role')
    if (role === 'operador de almacen') {
        return (
            <>
                <CustomHeader title={"Warehouse Dashboard"} />
                <Outlet />
            </>
        );
    }
    return <Navigate to='/403' replace />;
};

export default RoutesApp;
