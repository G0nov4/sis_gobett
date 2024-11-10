import { Button, Card, Col, Divider, List, Row, Space, Tag, Typography, Tooltip, Table, Modal, InputNumber, Form, DatePicker, Input, message } from 'antd';
import './styles.css';
import React, { useState } from 'react';
import { CheckCircleFilled, ClockCircleOutlined, ShopOutlined, HomeOutlined, PrinterOutlined, EyeOutlined, DollarOutlined, UserOutlined, PhoneOutlined, MoneyCollectOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useCreatePayment } from '../../services/Payments';
import dayjs from 'dayjs';
import PaymentModal from './PaymentModal';
import { useQueryClient } from 'react-query';


const { Text } = Typography;

const OrderList = ({ salesList }) => {

  const queryClient = useQueryClient();
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({ totalToPay: 0, totalPaid: 0 });

  const showPaymentModal = (sale) => {
    const subtotal = sale.attributes.detail.reduce((sum, item) => 
      sum + (item.quantity_meterage * item.unit_price), 0);
    const discount = sale.attributes.discount || 0;
    const totalToPay = subtotal - discount;
    const totalPaid = sale.attributes.payments?.data?.reduce((sum, payment) => 
      sum + payment.attributes.amount, 0) || 0;

    setSelectedSale(sale);
    setPaymentDetails({ totalToPay, totalPaid });
    setIsPaymentModalVisible(true);
  };


  // Función para formatear la fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Función para determinar el estado y color del Tag
  const getStatusTag = (status, salesType) => {
    if (status) {
      return {
        color: 'success',
        icon: <CheckCircleFilled />,
        text: 'Completado'
      };
    }
    return {
      color: 'processing',
      icon: <ClockCircleOutlined />,
      text: salesType === 'PEDIDO' ? 'Pendiente' : 'En Proceso'
    };
  };


  // Función para calcular el total de una orden
  const calculateTotal = (orderDetails) => {
    return (orderDetails || []).reduce((total, item) => {
      return total + (item.quantity_meterage * item.product.data.attributes.price);
    }, 0).toFixed(2);
  };

  const handlePaymentSuccess = async () => {
    // Forzar la actualización de los datos
    await queryClient.invalidateQueries(['sales']);
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        {salesList?.map((sale) => (
          <Col key={sale.id} xs={24} sm={12} md={8} lg={6}>
            <Card 
              className="sale-card"
              bordered={true}
              style={{ 
                margin:0,
                padding: 0,
                transition: 'all 0.1s ease',
                cursor: 'pointer',
              }}
              hoverable
            >
              {/* Encabezado de la tarjeta */}
              <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text strong style={{ fontSize: '16px', display: 'block' }}>
                    {sale.attributes.sales_type}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {formatDate(sale.attributes.createdAt)}
                  </Text>
                </div>
                <Tag 
                  {...getStatusTag(sale.attributes.status, sale.attributes.sales_type)}
                >
                  {getStatusTag(sale.attributes.status, sale.attributes.sales_type).text}
                </Tag>
              </div>

              <Divider style={{ margin: '8px 0' }} />
              {/* Información del cliente */}
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ display: 'block' }}>Cliente:</Text>
                <Text>{sale.attributes.client?.data?.attributes?.name || 'Cliente no registrado'}</Text>
              </div>

              {/* Lista de productos */}
              <Table
                size="small"
                dataSource={sale.attributes.detail}
                pagination={false}
                columns={[
                  {
                    title: 'Cantidad',
                    dataIndex: 'quantity_meterage',
                    key: 'quantity',
                    width: '5%',
                    render: (quantity) => <Text style={{fontSize: '10px'}}>{quantity} mts</Text>
                  },
                  {
                    title: 'Tela',
                    dataIndex: ['fabric', 'data', 'attributes', 'name'],
                    key: 'fabric',
                    width: '40%',
                    render: (text) => <Text style={{fontSize: '10px'}}>{text}</Text>
                  },
                  {
                    title: 'Precio',
                    dataIndex: 'unit_price',
                    key: 'price',
                    width: '20%',
                    render: (price) => <Text style={{fontSize: '10px'}}>Bs. {price}</Text>
                  },
                  {
                    title: 'Total',
                    key: 'total',
                    width: '30%',
                    render: (_, record) => <Text style={{fontSize: '10px'}}>Bs. {(record.quantity_meterage * record.unit_price).toFixed(2)}</Text>
                  }
                ]}
                style={{ marginBottom: 16 }}
              />
              <div style={{ textAlign: 'right', marginBottom: 16 }}>
                <Text strong style={{ display: 'block' }}>
                  Subtotal: Bs.{sale.attributes.detail.reduce((sum, item) => 
                    sum + (item.quantity_meterage * item.unit_price), 0).toFixed(2)}
                </Text>
                {(() => {
                  const subtotal = sale.attributes.detail.reduce((sum, item) => 
                    sum + (item.quantity_meterage * item.unit_price), 0);
                  const totalPaid = sale.attributes.payments?.data?.reduce((sum, payment) =>
                    sum + payment.attributes.amount, 0) || 0;
                  
                  return (
                    <Text strong style={{ color: totalPaid >= subtotal ? '#52c41a' : '#ff4d4f' }}>
                      {totalPaid >= subtotal ? 
                        `Pagado: Bs.${totalPaid.toFixed(2)} (Completado)` :
                        <>
                          Pagado: Bs.${totalPaid.toFixed(2)} <br /> (Faltante: Bs.${(subtotal - totalPaid).toFixed(2)})
                        </>
                      }
                    </Text>
                  );
                })()}
              </div>


              {/* Botones de acción principales */}
              <Space style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}>
                <Tooltip title="Imprimir">
                  <Button 
                    icon={<PrinterOutlined />} 
                    size="middle" 
                    style={{ backgroundColor: '#d9d9d9', width: '100%'}}
                    block
                  >
                    Imprimir
                  </Button>
                </Tooltip>
                <Tooltip title="Ver Detalles">
                  <Button 
                    icon={<EyeOutlined />} 
                    size="middle" 
                    type="primary" 
                    danger
                    block
                   
                  >
                    Ver Detalles
                  </Button>
                </Tooltip>
              </Space>

              {/* Botón de pago para pedidos pendientes */}
              {sale.attributes.sales_type === 'PEDIDO' && (
                <>
                  {(() => {
                    const subtotal = sale.attributes.detail.reduce((sum, item) => 
                      sum + (item.quantity_meterage * item.unit_price), 0);
                    const discount = sale.attributes.discount || 0;
                    const totalToPay = subtotal - discount;
                    const totalPaid = sale.attributes.payments?.data?.reduce((sum, payment) => 
                      sum + payment.attributes.amount, 0) || 0;
                    
                    return totalPaid < totalToPay && (
                      <>
                        <Divider style={{ margin: '12px 0' }} />
                        <Button 
                          type="primary" 
                          icon={<DollarOutlined />}
                          size="middle"
                          block
                          style={{ backgroundColor: '#52c41a' }}
                          onClick={() => showPaymentModal(sale)}
                        >
                          Añadir Pago (Bs. {(totalToPay - totalPaid).toFixed(2)})
                        </Button>
                      </>
                    );
                  })()}
                </>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <PaymentModal
        visible={isPaymentModalVisible}
        onCancel={() => setIsPaymentModalVisible(false)}
        sale={selectedSale}
        totalToPay={paymentDetails.totalToPay}
        totalPaid={paymentDetails.totalPaid}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default OrderList;