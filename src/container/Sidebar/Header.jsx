import React, { useState } from 'react';
import { Layout, Menu, Dropdown,  Row, Col, Avatar, Button, Drawer } from 'antd';
import { UserOutlined, ProfileOutlined, SettingOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar'
import './Header.css'

const { Header, Content } = Layout;

const CustomHeader = ({ title, children }) => {
    console.log('entrando a header')
    const [visible, setVisible] = useState(false);
    const [visibleSidebar, setVisibleSidebar] = useState(false);
    const handleMenuClick = (e) => {
        if (e.key === 'logout') {
            // Aquí maneja la acción de logout
            console.log('Cerrar sesión');
        }
        setVisible(false);
    };
    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="profile" icon={<ProfileOutlined />}>
                Ver Perfil
            </Menu.Item>

            <Menu.Item key="settings" icon={<SettingOutlined />}>
                Configuración de Perfil
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" style={{
                color: 'red',
                backgroundColor: '#ffe6e6'
            }} icon={<LogoutOutlined style={{ color: 'red' }} />}>
                Logout
            </Menu.Item>
        </Menu>
    );
    return (
        <Layout>
            <Sidebar breakpoint='lg' />
            <Layout>
                <Header
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        width: '100%',
                        padding: '10px 15px',
                        height: 50,
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#fff'
                    }}
                >
                    <Row align='middle' justify='space-between' style={{
                        width: '100%',
                    }} >
                        <Col className="menu">
                            <Button
                                
                                type="text"
                                icon={<MenuOutlined />}
                                onClick={() => setVisibleSidebar(true)}
                            />

                        </Col>
                        <Col>
                            <h2>{title}</h2>
                        </Col>

                        <Dropdown overlay={menu} trigger={['click']} visible={visible} onVisibleChange={setVisible}>
                            <Avatar icon={<UserOutlined />} />
                        </Dropdown>

                    </Row>


                </Header>
                <Content style={{
                    backgroundColor: '#fff',
                    margin: '5px',
                    width: 'calc(100%-10px)',
                    height: 'calc(100vh - 60px)',
                    borderRadius: 10,
                    padding: '20px',
                    overflow: 'auto'
                }}>
                    {children || <Outlet />}
                </Content>
            </Layout>
            <Drawer
                style={{
                    width: 300
                }}
                styles={{
                    body: {
                        padding: 0,
                        margin: 0,
                        
                    }
                }}
                placement="left"
                onClose={() => setVisibleSidebar(false)}
                visible={visibleSidebar}
            >
                <Sidebar/>
            </Drawer>
        </Layout>

    );
};

export default CustomHeader;
