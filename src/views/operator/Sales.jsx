import { Button, Col, Divider, Flex, Form, Radio, Row, Space, Modal, Table, InputNumber, message } from 'antd';
import React, { useState, useMemo } from 'react';
import Categories from '../../components/operator/Categories';
import FabricList from '../../components/operator/FabricList';
import SearchClient from '../../components/operator/SearchClient';
import DetailOrderList from '../../components/operator/DetailOrderList';
import DetailAddress from '../../components/operator/DetailAddress';
import SummaryOfSales from '../../components/operator/SummaryOfSales';
import { CalendarOutlined, CloseCircleOutlined, HistoryOutlined, RightCircleFilled, UserOutlined } from '@ant-design/icons';
import TransactionType from '../../components/operator/TransactionType';
import { useCreateSale } from '../../services/Sales';
import './Sales.css';
import dayjs from 'dayjs';
import { FaSalesforce } from 'react-icons/fa6';
import { TbReportAnalytics } from 'react-icons/tb';

// Función responsable de actualizar la lista de órdenes
const updateOrderList = (orderList, fabric, item, isRoll = false, isRemoving = false) => {
    if (isRoll) {
        // Manejo de rollos
        if (isRemoving) {
            return orderList.filter(order => order.key !== `roll-${item.id}`);
        }

        // Verificar si el rollo ya existe
        const existingRoll = orderList.find(order => order.key === `roll-${item.id}`);
        if (existingRoll) {
            return orderList;
        }

        // Añadir nuevo rollo
        return [
            ...orderList,
            {
                key: `roll-${item.id}`,
                quantity: item.attributes.roll_footage,
                description: fabric.name,
                fabricId: fabric.id,
                color: item.attributes.color.data.attributes.color,
                colorId: item.attributes.color.data.id,
                unitPrice: fabric.wholesale_price,
                totalPrice: fabric.wholesale_price * item.attributes.roll_footage,
                isRoll: true,
                rollCode: item.attributes.code,
                saleType: 'POR ROLLO',
                cuts: 1,
                rollId: item.id
            }
        ];
    } else {
        // Manejo de metros
        const existingMeterItem = orderList.find(
            (orderItem) =>
                orderItem.description === fabric.name &&
                orderItem.colorId === item.id &&
                !orderItem.isRoll
        );

        if (existingMeterItem) {
            return orderList.map((orderItem) =>
                orderItem.key === existingMeterItem.key
                    ? {
                        ...orderItem,
                        quantity: orderItem.quantity + 1,
                        totalPrice: (orderItem.quantity + 1) * orderItem.unitPrice,
                    }
                    : orderItem
            );
        }

        return [
            ...orderList,
            {
                key: `meter-${fabric.name}-${item.id}`,
                quantity: 1,
                description: fabric.name,
                fabricId: fabric.id,
                color: item.color,
                colorId: item.id,
                unitPrice: fabric.wholesale_price,
                totalPrice: fabric.wholesale_price,
                isRoll: false,
                saleType: 'POR METRO',
                cuts: 1
            }
        ];
    }
};


const Sales = () => {
    const [orderList, setOrderList] = useState([]);
    const [isSecondPartSelect, setIsSecondPartSelected] = useState(false);
    const [clientSelected, setClientSelected] = useState(null)
    const [descuento, setDescuento] = useState(0);
    const [transactionType, setTransactionType] = useState('VENTA');
    const [deliveryOption, setDeliveryOption] = useState('EN TIENDA');
    const [address, setAddress] = useState('');
    const createSaleMutation = useCreateSale();
    const [deliveryDate, setDeliveryDate] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);

    const clientAddress = clientSelected?.address || '';

    const handleAddToOrderList = (fabric, item, isRoll = false, isRemoving = false) => {
        setOrderList(updateOrderList(orderList, fabric, item, isRoll, isRemoving));
    };

    const resetValues = () => {
        setOrderList([]);
        setIsSecondPartSelected(false);
        setClientSelected(null);
        setDescuento(0);
        setTransactionType('VENTA');
        setDeliveryOption('EN TIENDA');
        setAddress('');
        setDeliveryDate(null);
        setPaymentAmount(0);
        setShowSummaryModal(false);
    };

    const onFinish = async () => {
        // Validar que haya al menos un item en el pedido
        if (!orderList || orderList.length === 0) {
            Modal.error({
                title: 'Error',
                content: 'Debe agregar al menos un item al pedido'
            });
            return;
        }

        // Crear objeto de pago
        const payment = {
            amount: paymentAmount,
            change: Math.max(0, calculateChange()),
            payment_date: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };

        const newOrder = {
            delivery: deliveryOption || 'EN TIENDA',
            status: transactionType === 'VENTA' ? true : false,
            client_id: clientSelected?.value || null,
            sales_box: 1,
            detail: orderList || [],
            total_sale: total || 0,
            address: address || '',
            promo: descuento || 0,
            sales_type: transactionType || 'VENTA',
            delivery_date: deliveryDate || null,
            payment: payment 
        }

        console.log('Order details:', newOrder);
        try {
            await createSaleMutation.mutateAsync(newOrder);
            Modal.success({
                title: 'Éxito',
                content: 'Venta realizada correctamente'
            });
            resetValues();
        } catch (error) {
            Modal.error({
                title: 'Error',
                content: 'Hubo un error al procesar la venta'
            });
        }
    }

    const subtotal = useMemo(() => {
        return orderList.reduce((acc, item) => acc + item.totalPrice, 0);
    }, [orderList]);


    const total = useMemo(() => {
        return subtotal - descuento;
    }, [subtotal, descuento]);

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const handleShowSummary = () => {
        setShowSummaryModal(true);
    };

    const handleConfirmSale = () => {
        setShowSummaryModal(false);
        onFinish();
    };

    const calculateChange = () => {
        return paymentAmount - total;
    };

    return (
        <div style={{ margin: 5, padding: 5, borderRadius: 10, height: 'calc(100vh - 60px)' }}>
            <Row gutter={[8]} style={{ height: '100%' }}>
                <Col lg={17} xs={24}>
                    <Categories onCategorySelect={handleCategorySelect} />
                    <Divider style={{ marginBottom: 10, marginTop: 5 }} />
                    <FabricList
                        addToOrderList={handleAddToOrderList}
                        selectedCategory={selectedCategory}
                    />
                </Col>

                <Col lg={7} xs={24}>

                    {!isSecondPartSelect ? (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                            <div style={{ flexGrow: 1 }}>
                                <TransactionType
                                    transactionType={transactionType}
                                    setTransactionType={setTransactionType}
                                />

                                <Divider style={{ margin: '5px 0px' }} />
                                <DetailOrderList
                                    orderList={orderList}
                                    setOrderList={setOrderList}
                                />
                            </div>

                            {/* Esta parte actúa como un "footer" fijo */}
                            <div style={{ marginTop: 'auto' }}>

                                <Button danger type="primary" style={{ width: '100%' }} icon={<RightCircleFilled />} iconPosition='right' onClick={() => setIsSecondPartSelected(true)}>
                                    PROCESAR VENTA
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <SearchClient
                                clientData={clientSelected}
                                setClientSelected={setClientSelected}
                                setIsSecondPartSelected={setIsSecondPartSelected}
                            />
                            <DetailAddress
                                deliveryOption={deliveryOption}
                                setDeliveryOption={setDeliveryOption}
                                address={address}
                                setAddress={setAddress}
                                clientAddress={clientAddress}
                                    deliveryDate={deliveryDate}
                                    setDeliveryDate={setDeliveryDate}
                            />

                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ flexGrow: 1 }}>

                                </div>

                                <div style={{ marginTop: 'auto' }}>
                                    <SummaryOfSales
                                        subtotal={subtotal}
                                        setDiscount={setDescuento}
                                    />
                                    <Button
                                        danger
                                        type="primary"
                                        style={{ width: '100%' }}
                                        onClick={handleShowSummary}
                                        loading={createSaleMutation.isLoading}
                                    >
                                        TERMINAR VENTA
                                    </Button>
                                    
                                </div>
                            </div>

                        </div>

                    )}
                </Col>
            </Row>

            <Modal
                title={`${transactionType} - Resumen de transacción`}
                open={showSummaryModal}
                footer={null}
                onCancel={() => setShowSummaryModal(false)}
                width={800}
                style={{ maxHeight: '80vh', overflowY: 'scroll' }}
             
            >
                <Row gutter={[16, 16]}>
                    {/* Lista de productos - Lado izquierdo */}
                    <Col span={14} xs={0} sm={0} md={14}>
                        <div className="order-list-container">
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ border: '1px solid #d9d9d9', padding: '12px', borderRadius: '4px', backgroundColor: '#fafafa' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <UserOutlined />
                                            {clientSelected?.label || 'Cliente General'}
                                        </h3>
                                        <div style={{ fontSize: '13px', color: '#666' }}>
                                            <div style={{ marginBottom: '4px' }}>
                                                <strong>Dirección:</strong> {address || clientAddress || deliveryOption}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <CalendarOutlined />
                                                <strong>Fecha de entrega:</strong> {deliveryDate ? new Date(deliveryDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DetailOrderList
                                orderList={orderList}
                                setOrderList={setOrderList}
                            />
                        </div>
                    </Col>

                    {/* Detalles de la venta - Lado derecho */}
                    <Col span={10} xs={24} sm={24} md={10}>
                     
                      

                        <Divider style={{ margin: '12px 0' }}><strong>Ingrese monto de pago</strong></Divider>
                        <InputNumber
                            style={{ 
                                width: '100%', 
                                height: '40px', 
                                marginBottom: '12px',
                                textAlign: 'center',
                                border: 'none',
                            }}
                            size="large"
                            value={paymentAmount}
                            onChange={(value) => setPaymentAmount(value || 0)}
                            precision={2}
                            min={0}
                            placeholder="0.00"
                            prefix={<span >Bs.</span>}
                            autoFocus
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '16px', width: '100%' }}>
                            {[10, 20, 50, 100, 200].map(amount => (
                                <Button
                                    key={amount}
                                    size="small"
                                    onClick={() => setPaymentAmount(amount)}
                                    style={{ width: '100%' }}
                                >
                                    ${amount}
                                </Button>
                            ))}
                        </div>



                       
                         
                            <div className="total-row total-final">
                                <span>Total:</span>
                                <span>Bs. {total.toFixed(2)}</span>
                            </div>
                     

                        <div className="payment-section">
                            <div className="total-row">
                                <span>Monto Recibido:</span>
                                <span>${paymentAmount?.toFixed(2) || '0.00'}</span>
                            </div>
                            {paymentAmount > 0 && (
                                <div className="total-row">
                                    <span>Cambio:</span>
                                    <span className={calculateChange() >= 0 ? 'change-amount' : 'insufficient-amount'}>
                                        ${Math.abs(calculateChange()).toFixed(2)}
                                        {calculateChange() < 0 ? ' (Falta)' : ''}
                                    </span>
                                </div>
                            )}
                        </div>
                        {calculateChange() < 0 ? (
                            <Button 
                                type="primary"
                                icon={<TbReportAnalytics />}
                                onClick={() => {
                                    Modal.confirm({
                                        title: 'Crear historial de pagos',
                                        content: '¿Desea crear un historial de pagos para esta venta? El cliente podrá pagar el monto restante en cuotas posteriores.',
                                        okText: 'Sí, crear',
                                        cancelText: 'No',
                                        centered: true,
                                        onOk() {
                                            onFinish()
                                                .then(() => {
                                                    message.success('Historial de pagos creado exitosamente');
                                                })
                                                .catch(() => {
                                                    message.error('Error al crear el historial de pagos');
                                                });
                                        }
                                    });
                                }}
                                style={{ width: '100%', marginTop: '16px' }}
                            >
                                Crear historial de pagos
                            </Button>
                        ) : (
                            <Button 
                                type="primary"
                                danger
                                    icon={<CloseCircleOutlined />}
                                style={{ width: '100%', marginTop: '16px' }}
                                onClick={() => {
                                    onFinish()
                                        .then(() => {
                                            message.success('Historial de pagos creado exitosamente');
                                        })
                                        .catch(() => {
                                            message.error('Error al crear el historial de pagos');
                                        });
                                }}
                            >
                                Cerrar Venta
                            </Button>
                        )}
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};

export default Sales;
