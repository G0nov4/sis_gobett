import { Button, Col, Divider, Flex, Form, Radio, Row, Space, Modal } from 'antd';
import React, { useState, useMemo } from 'react';
import Categories from '../../components/operator/Categories';
import FabricList from '../../components/operator/FabricList';
import SearchClient from '../../components/operator/SearchClient';
import DetailOrderList from '../../components/operator/DetailOrderList';
import DetailAddress from '../../components/operator/DetailAddress';
import SummaryOfSales from '../../components/operator/SummaryOfSales';
import { RightCircleFilled } from '@ant-design/icons';
import TransactionType from '../../components/operator/TransactionType';
import { useCreateSale } from '../../services/Sales';


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
    const [selectedCategory, setSelectedCategory] = useState(null);

    const clientAddress = clientSelected?.address || '';

    const handleAddToOrderList = (fabric, item, isRoll = false, isRemoving = false) => {
        setOrderList(updateOrderList(orderList, fabric, item, isRoll, isRemoving));
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

        const newOrder = {
            delivery: deliveryOption || 'EN TIENDA',
            status: transactionType === 'VENTA' ? true : false,
            client_id: clientSelected?.value || null,
            sales_box: 1,
            detail: orderList || [],
            total_sale: total || 0,
            address: address || '',
            promo: descuento || 0,
            sales_type: transactionType || 'VENTA'
        }

        console.log('Order details:', newOrder);
        try {
            await createSaleMutation.mutateAsync(newOrder);
            Modal.success({
                title: 'Éxito',
                content: 'Venta realizada correctamente'
            });
            // Resetear el estado
            setOrderList([]);
            setIsSecondPartSelected(false);
            setClientSelected(null);
            setDescuento(0);
            setTransactionType('VENTA');
            setDeliveryOption('EN TIENDA');
            setAddress('');
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
                                        onClick={onFinish}
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
        </div>
    );
};

export default Sales;
