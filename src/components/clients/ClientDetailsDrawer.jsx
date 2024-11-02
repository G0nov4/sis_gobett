// ClientDetailsDrawer.js
import React from 'react';
import { Drawer, Descriptions, Divider, Tabs, Tag, Table, Space, Row, Col } from 'antd';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { TabPane } = Tabs

const ClientDetailsDrawer = ({ client, onClose, visible }) => {
    const telaColumns = []; // Define tus columnas para la pestaña 'Tela' aquí
    const pedidosColumns = []; // Define tus columnas para la pestaña 'Pedidos' aquí
    const tabData = {
        tela: [
            { id: 1, name: 'Producto 1', quantity: 10, price: 20 },
            { id: 2, name: 'Producto 2', quantity: 15, price: 30 },
            { id: 2, name: 'Producto 2', quantity: 15, price: 30 },
            { id: 2, name: 'Producto 2', quantity: 15, price: 30 },

            // ... más datos para la pestaña 'Tela'
        ],
        pedidos: [
            { id: 1, customer: 'Cliente 1', product: 'Producto A', quantity: 5 },
            { id: 2, customer: 'Cliente 2', product: 'Producto B', quantity: 8 },
            // ... más datos para la pestaña 'Pedidos'
        ],
    };
    return (
        <Drawer
            title="DETALLES DE CLIENTE"
            placement='right'
            closable={false}
            onClose={onClose}
            visible={visible}
            height={'100px'}
            width={600}
        >
            <Row >
                <Col lg={24} style={{
                    borderRadius: 10,
                    boxShadow: '1px black'
                }}>
                    {client && (
                        <div style={{
                            width: '100%',
                            height: '200px',
                        }}>
                            <Descriptions
                                title={`${client.attributes.name} ${client.attributes.last_name ? client.attributes.last_name : ''}`}
                                size='midlde'
                                extra={
                                    <>
                                        {client.attributes.kind_of_client === 'MAYORISTA' && (
                                            <Tag color="#108ee9">{client.attributes.kind_of_client}</Tag>
                                        )}
                                        {client.attributes.kind_of_client === 'MINORISTA' && (
                                            <Tag color="green">{client.attributes.kind_of_client}</Tag>
                                        )}
                                        {client.attributes.kind_of_client === 'NORMAL' && (
                                            <Tag color="volcano">{client.attributes.kind_of_client}</Tag>
                                        )}
                                    </>
                                }
                                column={2}
                            >
                                <Descriptions.Item label="Numeros de telefono">(+591) {client.attributes.phone_1} <br /> (+591) {client.attributes.phone_2} </Descriptions.Item>
                                <Descriptions.Item label="Ciudad">{client.attributes.city}                                                                                                                                                                                                                                                          </Descriptions.Item>
                                <Descriptions.Item label="Direccion de entrega:">{client.attributes.direction}                                                                                                                                                                                                                                                          </Descriptions.Item>


                            </Descriptions>
                            <Divider style={{ margin: 0 }} />
                            <Tabs defaultActiveKey="1" tabBarStyle={{ margin: 0 }} size='small'>
                               
                                <TabPane
                                    tab={
                                        <Space>
                                            <ShoppingCartOutlined />
                                            Pedidos
                                        </Space>
                                    }
                                    key="2"
                                >
                                    <Table size='small' bordered dataSource={tabData.pedidos} columns={pedidosColumns} />
                                </TabPane>
                            </Tabs>
                        </div>
                    )}
                </Col>
            </Row>
        </Drawer>
    );
};

export default ClientDetailsDrawer;
