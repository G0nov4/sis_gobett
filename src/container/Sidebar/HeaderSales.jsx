import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Space } from 'antd';
import { SettingOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'; // Necesitamos usarLocation para saber la ruta activa
import './HeaderSales.css'; // Importar el archivo CSS
import { BsClipboard2CheckFill, BsClipboard2PulseFill, BsFillCalculatorFill } from 'react-icons/bs';
import { Content } from 'antd/es/layout/layout';

const { Header } = Layout;

const HeaderSales = ({children}) => {
    const location = useLocation(); // Saber qué ruta está activa

    const menu = (
        <Menu>
            <Menu.Item key="1" icon={<SettingOutlined />} to>
                <NavLink to={'profile'}>Perfil</NavLink>
            </Menu.Item>
            <Menu.Item key="2" icon={<LogoutOutlined />}>
                Cerrar sesión
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout>
            <Header className="header">
                {/* Logo a la izquierda */}
                <div className="logo">
                    <div className="logoCircle"></div>
                </div>

                {/* Menú central */}
                <div className="menu">
                    <Link to="sales" className={`link ${location.pathname === '/operator/sales' ? 'link-selected' : ''}`}>CAJA</Link>
                    <Link to="movements" className={`link ${location.pathname === '/operator/movements' ? 'link-selected' : ''}`}>MOVIMIENTOS</Link>
                    <Link to="orders" className={`link ${location.pathname === '/operator/orders' ? 'link-selected' : ''}`}>PEDIDOS</Link>
                </div>

                {/* Imagen de perfil con Dropdown a la derecha */}
                <div className="profile">
                    <Dropdown overlay={menu} trigger={['click']}>
                            <Avatar size="large" icon={<UserOutlined />} />
                    </Dropdown>
                </div>
            </Header>
            <Content style={{
                    backgroundColor: '#fff',
                    margin: '5px',
                    width: 'calc(100%-10px)',
                    height: 'calc(100vh - 50px)',
                    borderRadius: 10,
                    padding: '0px',
                    overflow: 'auto'
                }}>
                    {children || <Outlet />}
                </Content>
        </Layout>
    );
};

export default HeaderSales;
