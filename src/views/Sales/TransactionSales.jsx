import React, { useState, useMemo } from 'react';
import { Table, Button, Space, Row, Col, Card, DatePicker, Input, Statistic, Typography, Divider, Tag } from 'antd';
import { SearchOutlined, DollarOutlined, ShoppingOutlined, UserOutlined, BarChartOutlined, FileExcelOutlined, PrinterOutlined, ShoppingCartOutlined, CalendarOutlined, HomeOutlined, CheckCircleOutlined, ClockCircleOutlined, TagOutlined } from '@ant-design/icons';
import { Chart as ChartJS } from 'chart.js/auto';
import { Line, Doughnut } from 'react-chartjs-2';
import { useSales } from '../../services/Sales';
import { useClients } from '../../services/Client';
import { useFabrics } from '../../services/Fabrics';
import SalesAnalytics from './SalesAnalytics';
import SaleDetailModal from '../../components/sales/SaleDetailModal';
import { updateSaleStatus, cancelSale } from '../../services/Sales';
import { message } from 'antd';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const TransactionSales = () => {
    const [searchText, setSearchText] = useState('');
    const [dateRange, setDateRange] = useState(null);
    const [selectedSale, setSelectedSale] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { data: salesData, isLoading: isLoadingSales, refetch } = useSales();

console.log(salesData)
    const topProductsData = useMemo(() => {
        if (!salesData?.data) return null;

        const productCount = {};
        salesData.data.forEach(sale => {
            sale.attributes.detail.forEach(item => {
                const fabricName = item.fabric.data.attributes.name;
                productCount[fabricName] = (productCount[fabricName] || 0) + item.quantity_meterage;
            });
        });

        const sortedProducts = Object.entries(productCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        return {
            labels: sortedProducts.map(([name]) => name),
            datasets: [{
                data: sortedProducts.map(([,count]) => count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                ],
            }]
        };
    }, [salesData]);

    const columns = [
        {
            title: (
                <Space>
                    <ShoppingCartOutlined />
                    ID
                </Space>
            ),
            dataIndex: 'id',
            key: 'id',
            width: '80px'
        },
        {
            title: (
                <Space>
                    <UserOutlined />
                    Cliente
                </Space>
            ),
            dataIndex: ['attributes', 'client', 'data', 'attributes', 'name'],
            key: 'client',
            render: (text, record) => (
                `${text} ${record.attributes.client.data.attributes.last_name || ''}`
            )
        },
        {
            title: (
                <Space>
                    <CalendarOutlined />
                    Fecha
                </Space>
            ),
            dataIndex: ['attributes', 'createdAt'],
            key: 'date',
            render: (text) => new Date(text).toLocaleDateString()
        },
        {
            title: (
                <Space>
                    <DollarOutlined />
                    Total
                </Space>
            ),
            key: 'total',
            render: (_, record) => {
                const total = record.attributes.detail.reduce((sum, item) => 
                    sum + (item.quantity_meterage * item.unit_price), 0
                );
                return `Bs. ${total.toFixed(2)}`;
            }
        },
        {
            title: (
                <Space>
                    <HomeOutlined />
                    Entrega
                </Space>
            ),
            dataIndex: ['attributes', 'delivery'],
            key: 'delivery',
            render: (text) => (
                <Tag color={text === 'EN TIENDA' ? 'green' : 'blue'}>
                    {text}
                </Tag>
            )
        },
        {
            title: (
                <Space>
                    <TagOutlined />
                    Estado
                </Space>
            ),
            dataIndex: ['attributes', 'status'],
            key: 'status',
            render: (status) => (
                <Tag color={status ? 'success' : 'processing'} icon={status ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
                    {status ? 'Completado' : 'Pendiente'}
                </Tag>
            )
        }
    ];

    const handleCompleteSale = async (saleId) => {
        try {
            // Llamada a tu API para actualizar el estado
            await updateSaleStatus(saleId, true);
            // Recargar los datos
            refetch();
            setModalVisible(false);
        } catch (error) {
            console.error('Error al completar la venta:', error);
            message.error('Error al completar la venta');
        }
    };

    const handleCancelSale = async (saleId) => {
        try {
            // Aquí puedes implementar la lógica para cancelar
            // Por ejemplo, cambiar el estado a cancelado o eliminar
            await cancelSale(saleId);
            // Recargar los datos
            refetch();
            setModalVisible(false);
        } catch (error) {
            console.error('Error al cancelar la venta:', error);
            message.error('Error al cancelar la venta');
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '24px' }}>
                <Col xs={24} md={12}>
                    <Title level={2} style={{ margin: 0 }}>
                       Ventas
                        <DollarOutlined style={{ marginRight: '8px' }} />
                    </Title>
                </Col>
            </Row>

            {/* Barra de búsqueda y acciones */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} md={8}>
                    <Input
                        size="large"
                        placeholder="Buscar por cliente, producto..."
                        prefix={<SearchOutlined style={{ color: '#1890ff' }} />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col xs={24} md={16} style={{ textAlign: 'right' }}>
                    <Space size="middle">
                        <Button 
                            type="primary" 
                            icon={<BarChartOutlined />}
                            size="large"
                        >
                            Reporte de Ventas
                        </Button>

                    </Space>
                </Col>
            </Row>

            {/* Contenido principal */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={18}>
                  
                        <Table
                            columns={columns}
                            dataSource={salesData?.data}
                            loading={isLoadingSales}
                            size="small"
                            pagination={{ 
                                pageSize: 10,
                                showTotal: (total) => `Total ${total} ventas`
                            }}
                            rowKey={record => record.id}
                            scroll={{ y: 400 }}
                            onRow={(record) => ({
                                onClick: () => {
                                    setSelectedSale(record);
                                    setModalVisible(true);
                                },
                                style: { cursor: 'pointer' }
                            })}
                        />
            
                </Col>

                <Col xs={24} lg={6}>
                    <Card 
                        title="Productos más Vendidos" 
                        bordered={false}
                        headStyle={{ 
                            backgroundColor: '#fafafa',
                            borderBottom: '1px solid #f0f0f0'
                        }}
                    >
                        {topProductsData && (
                            <div style={{ height: '200px' }}>
                                <Doughnut 
                                    data={topProductsData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: {
                                                    boxWidth: 12,
                                                    padding: 15
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            <SaleDetailModal
                visible={modalVisible}
                sale={selectedSale}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedSale(null);
                }}
                onCompleteSale={handleCompleteSale}
                onCancelSale={handleCancelSale}
            />
        </div>
    );
};

export default TransactionSales;