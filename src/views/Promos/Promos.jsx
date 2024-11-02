import { Badge, Button, Col, ColorPicker, Divider, Dropdown, Flex, Form, Input, List, Menu, Popconfirm, Row, Skeleton, Space, Spin, Table, Tooltip, message } from 'antd'
import React, { useState } from 'react'
import { red, blue, volcano, presetDarkPalettes, gold, lime, grey } from '@ant-design/colors';
import './Promos.css';
import { useQueryClient } from 'react-query';
import { useCreatePromo, useDeletePromo, usePromos } from '../../services/Promotions';
import { BarChartOutlined, BarcodeOutlined, DeleteOutlined, DownOutlined, EditOutlined, EyeFilled, PlusOutlined, QuestionCircleOutlined, RotateLeftOutlined, ShopOutlined, SortAscendingOutlined, SyncOutlined, UpOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { MdCalendarToday, MdColorize, MdDiscount, MdEditCalendar } from 'react-icons/md';
import PromotionModal from '../../components/operator/PromotionModal';

function Promos() {
    const { data: promos, isLoading } = usePromos()
    const deletePromotionMutation = useDeletePromo();
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [selectedPromo, setSelectedPromo] = useState(null);

    const handleCancel = () => {
        setIsModalVisible(false)
        setSelectedPromo(null);
    }

    const handleEditClient = (record) => {
        console.log(record)
        setSelectedPromo(record);
        setIsModalVisible(true);
    };

    const handleDeleteClient = (record) => {
        deletePromotionMutation.mutate(record.key, {
            onSuccess: () => {
                message.success('Promoción eliminada correctamente');
            },
            onError: () => {
                message.error('Error al eliminar la promoción');
            },
        });
    };
    if (isLoading) {
        <Spin></Spin>
    }
    const columns = [
        {
            title: (
                <Space>
                    <ShopOutlined />
                    <span>Nombre</span>
                </Space>
            ),
            key: 'promotion_name',
            dataIndex: 'promotion_name',
            width: 50,
            render: (text) => {
                return (
                    <p>{text}</p>
                )
            }


        },
        {
            title: (
                <Space>
                    <BarcodeOutlined />
                    <span>Codigo</span>
                </Space>
            ),
            key: 'code',
            dataIndex: 'code',
            align: 'center',
            width: 40,
            render: (text) => {
                return (
                    <p>{text}</p>
                )
            }


        },
        {
            title: (
                <Space>
                    <MdDiscount />
                    <span>Descuento</span>
                </Space>
            ),
            key: 'discount',
            align: 'center',
            width: 30,
            render: (record) => {
                return record.promotion_type === 'PORCENTAJE'
                    ? `${record.discount} %`
                    : `${record.discount} Bs.`;
            }
        },
        {
            title: (
                <Space>
                    <MdCalendarToday />
                    <span>Fecha de inicio</span>
                </Space>
            ),
            key: 'discount',
            dataIndex: 'start_date',
            width: 60,
            render: (text) => {
                return (
                    <p>{text}</p>
                )
            }
        },
        {
            title: (
                <Space>
                    <MdEditCalendar />
                    <span>Fecha de finalizacion</span>
                </Space>
            ),
            key: 'discount',
            dataIndex: 'end_date',
            width: 60,
            render: (text) => {
                return (
                    <p>{text}</p>
                )
            }
        },

        {
            title: (
                <Space>
                    <span>Acciones</span>
                </Space>
            ),
            key: 'accion',
            width: 45,
            align: 'center',
            fixed: 'right',
            render: (_, record) => {

                return (

                    <Space>
                        
                        <Tooltip title="Editar" color='#F8BD25' key='Editar'>
                            <Button
                                icon={<EditOutlined />}
                                size='small'
                                style={{
                                    color: '#F8BD25', borderColor: '#F8BD25'
                                }}
                                onClick={() => handleEditClient(record)}
                            />
                        </Tooltip>
                        <Tooltip title="Eliminar" color='#000' key='Eliminar'>
                            <Popconfirm
                                title="Eliminar Promocion"
                                placement='left'
                                description="Esta accion no podra revertirse."
                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                onConfirm={() => handleDeleteClient(record)}
                            >
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    size='small'

                                />
                            </Popconfirm>
                        </Tooltip>
                    </Space>
                )
            },
        },
    ]


    return (
        <Col span={24}>

            <Flex align='center' justify='space-between' style={{ margin: '10px 0px' }}>
                <h3 style={{ margin: 0, marginTop: 15 }}> </h3>
                {isLoading ?
                    <Space>
                        <Skeleton.Button active={true} size='small' />
                        <Skeleton.Button active={true} size='small' />
                        <Skeleton.Button active={true} size='small' />
                    </Space>
                    :
                    <Space>

                        <Button
                            onClick={() => { }}
                            icon={<BarChartOutlined />}
                            type='default'
                            size='small'
                        >
                            Generar Reporte
                        </Button>
                        <Button
                            onClick={() => {
                                setIsModalVisible(true)
                                setSelectedPromo(null)
                            }}
                            icon={<PlusOutlined />}
                            type='default'
                            size='middle'
                        >
                            Crear producto tela
                        </Button>
                    </Space>
                }
            </Flex>

            {/* MODAL PARA LAS SUCURSALES */}

            <Spin spinning={isLoading} tip='Cargando datos de las sucursales'>
                <Table
                    scroll={{
                        x: 900,
                    }}
                    bordered
                    virtual
                    columns={columns}
                    dataSource={isLoading ? [] : promos.data.map(item => ({ ...item.attributes, key: item.id }))}
                    size='small'
                    pagination={{
                        pageSize: 6,
                    }} />
            </Spin>

            <PromotionModal
                visible={isModalVisible}
                onCancel={handleCancel}
                promoData={selectedPromo}
            />

        </Col>
    )

}
export default Promos