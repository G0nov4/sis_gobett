import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ViewFabric.css';
import { Badge, Button, Card, Carousel, Col, Collapse, Descriptions, Divider, Image, Row, Space, Table, Tag, Tooltip, Typography, Popover, message, Spin } from 'antd';
import { ColumnHeightOutlined, PrinterFilled, ShopOutlined, DownOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { MdOutlineScale } from 'react-icons/md';
import { useUpdateRollStatus } from '../../services/Rolls';
import { useGetFabricById } from '../../services/Fabrics';
import { FaRulerHorizontal, FaRuler, FaTape, FaToiletPaper } from 'react-icons/fa';
import { useQueryClient } from 'react-query';

const { Text, Title } = Typography;

function ViewFabric() {
    const { id } = useParams();
    const { data, isLoading, error } = useGetFabricById(id);
    const updateRollStatus = useUpdateRollStatus();
    const [loadingRollId, setLoadingRollId] = useState(null);
    const queryClient = useQueryClient();

    
    // Muestra loading mientras se cargan los datos
    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    // Manejo de errores
    if (error) {
        message.error('Error al cargar los datos de la tela');
        return <h2>Error: No se pudo cargar la información de la tela.</h2>;
    }

    // Validación de los datos
    if (!data || !data.data || !data.data.attributes) {
        return <h2>Error: No se encontraron datos para esta tela.</h2>;
    }

    const datos = data.data;
    const {
        name,
        description,
        arrive_date,
        supplier,
        height,
        weight,
        code,
        fabric_images,
        colors,
        categories,
        retail_price,
        wholesale_price,
        wholesale_price_assorted,
        price_per_roll,
        price_per_roll_assorted,
        rolls
    } = datos.attributes;

    const statusOptions = ['DISPONIBLE', 'NO DISPONIBLE', 'EN TIENDA', 'RESERVADO'];

    const getStatusColor = (status) => {
        const statusColors = {
            'DISPONIBLE': 'success',
            'NO DISPONIBLE': 'error',
            'EN TIENDA': 'warning',
            'RESERVADO': 'processing',
        };
        return statusColors[status];
    };

    const getStatusIcon = (status) => {
        const statusIcons = {
            'DISPONIBLE': <CheckCircleOutlined />,
            'NO DISPONIBLE': <CloseCircleOutlined />,
            'EN TIENDA': <ExclamationCircleOutlined />,
            'RESERVADO': <SyncOutlined spin />,
        };
        return statusIcons[status];
    };

    const handleStatusChange = async (rollId, newStatus) => {
        setLoadingRollId(rollId);
        try {
            await updateRollStatus.mutateAsync({ id: rollId, newStatus });
            message.success('Estado actualizado correctamente');
            queryClient.invalidateQueries({ queryKey: ['fabric', id] });
        } catch (error) {
            message.error('Error al actualizar el estado');
        } finally {
            setLoadingRollId(null);
        }
    };

    const organizedRolls = rolls.data.reduce((acc, roll) => {
        const colorData = roll.attributes.color.data.attributes;
        const colorName = colorData.name;

        if (!acc[colorName]) {
            acc[colorName] = {
                color: colorData.color,
                rolls: [],
                totalRolls: 0,
                totalFootage: 0
            };
        }

        if (roll.attributes.status === 'DISPONIBLE') {
            acc[colorName].totalFootage += roll.attributes.roll_footage;
            acc[colorName].totalRolls++;
        }

        acc[colorName].rolls.push(roll);
        return acc;
    }, {});

    const rollData = Object.entries(organizedRolls).map(([colorName, colorData], index) => ({
        key: index,
        color: colorName,
        colorCode: colorData.color,
        totalRolls: colorData.totalRolls,
        totalFootage: `${colorData.totalFootage} mts`,
        rolls: colorData.rolls,
    }));

    const rollColumns = [
        {
            title: 'Color',
            dataIndex: 'color',
            key: 'color',
            render: (text, record) => (
                <Space>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: record.colorCode }} />
                    <span>{text}</span>
                </Space>
            ),
        },
        { title: 'Rollos Disponibles', dataIndex: 'totalRolls', key: 'totalRolls' },
        { title: 'Metraje Total Disponible', dataIndex: 'totalFootage', key: 'totalFootage' },
    ];

    const rollColumExpandable = [
        {
            title: 'CODIGO',
            key: 'code',
            render: (record) => (
                <span>{record.attributes.code}</span>
            )
        },
        {
            title: 'Metraje',
            key: 'roll_footage',
            render: (record) => (
                <span>{record.attributes.roll_footage} {record.attributes.unit}</span>
            )
        },
        {
            title: 'Estado',
            key: 'status',
            render: (record) => {
                const content = (
                    <Space direction="vertical">
                        {statusOptions.map((status) => (
                            <Tag
                                key={status}
                                color={getStatusColor(status)}
                                onClick={() => handleStatusChange(record.id, status)}
                                style={{ cursor: 'pointer' }}
                            >
                                {getStatusIcon(status)} {status}
                            </Tag>
                        ))}
                    </Space>
                );

                return (
                    <Popover content={content} trigger="click">
                        <Tag
                            color={getStatusColor(record.attributes.status)}
                            style={{ cursor: 'pointer' }}
                        >
                            {loadingRollId === record.id ? <Spin size="small" /> : getStatusIcon(record.attributes.status)} {record.attributes.status}
                        </Tag>
                    </Popover>
                );
            }
        }
    ];

    const expandedRowRender = (record) => {
        return (
            <Table
                columns={rollColumExpandable}
                dataSource={record.rolls}
                pagination={false}
                rowKey={(roll) => roll.id}
            />
        );
    };

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col lg={12} sm={24}>
                    <Badge.Ribbon text={code} color="blue">
                        <div className='section-information-fabric'>
                            <Carousel autoplay>
                                {fabric_images.data.map((image, index) => (
                                    <Image key={index} src={'http://localhost:1337'+image.attributes.url} alt={`Fabric ${index}`} />
                                ))}
                            </Carousel>
                            <div className='fabric-header'>
                                <Title level={3}>{name}</Title>
                                <Text type="secondary">{description}</Text>
                            </div>
                            <div className='fabric-details'>
                                <Space direction="vertical" size="middle">
                                    <Space>
                                        <Text strong>Fecha de Llegada:</Text>
                                        <Text>{new Date(arrive_date).toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</Text>
                                    </Space>
                                    <Row gutter={[16, 16]}>
                                        <Col lg={12} md={24}>
                                            <Space>
                                                <ShopOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                                                <div>
                                                    <Text strong>Proveedor</Text>
                                                    <br />
                                                    <Text>{supplier?.data?.attributes?.name || '-'}</Text>
                                                </div>
                                            </Space>
                                        </Col>
                                        <Col lg={12} md={24}>
                                            <Space>
                                                <ColumnHeightOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                                                <div>
                                                    <Text strong>Altura</Text>
                                                    <br />
                                                    <Text>{height} cm.</Text>
                                                </div>
                                            </Space>
                                        </Col>
                                        <Col lg={12} md={24}>
                                            <Space>
                                                <MdOutlineScale style={{ fontSize: '24px', color: '#faad14' }} />
                                                <div>
                                                    <Text strong>Peso</Text>
                                                    <br />
                                                    <Text>{weight} g/m²</Text>
                                                </div>
                                            </Space>
                                        </Col>
                                    </Row>

                                </Space>
                            </div>
                        </div>
                    </Badge.Ribbon>
                </Col>
                <Col lg={12} sm={24} style={{ padding: 10 }}>
                    <Row>
                        {/* Sección de Colores */}
                        {colors && colors.length > 0 && (
                            <div className='section-information-fabric'>
                                <h3 className='title-section-fabric'>COLORES</h3>

                                <Row gutter={[8, 8]}>
                                    {colors.map((color, index) => (
                                        <Col span={8} key={index}>
                                            <Space>
                                                <div
                                                    className="color-dot"
                                                    style={{ backgroundColor: color.color }}
                                                />
                                                <span>{color.name}</span>
                                            </Space>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}

                        {/* Sección de Categorías */}
                        {categories && categories.data && categories.data.length > 0 && (
                            <div className='section-information-fabric'>
                                <h3 className='title-section-fabric'> CATEGORIAS</h3>

                                <Space size={'small'}>
                                    {categories.data.map((category, index) => (
                                        <Badge key={index} color="blue" text={category.attributes.name} style={{ marginRight: 8 }} />
                                    ))}
                                </Space>

                            </div>
                        )}

                        <div className='section-information-fabric'>
                            <h3 className='title-section-fabric'>PRECIOS Y COSTOS</h3>
                            <table className="table-container">
                                <thead>
                                    <tr>
                                        <th className="table-header">Tipo de Venta</th>
                                        <th className="table-header">Cantidad</th>
                                        <th className="table-header">Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td rowSpan="3" className="group-title">Metrado</td>
                                        <td className="table-cell">
                                            <FaRulerHorizontal className="icon" /> 1 metro
                                        </td>
                                        <td className="table-cell price-column">Bs. {retail_price}</td>
                                    </tr>
                                    <tr>
                                        <td className="table-cell">
                                            <FaRulerHorizontal className="icon" /> &gt; 5 metros
                                        </td>
                                        <td className="table-cell price-column">Bs. {wholesale_price}</td>
                                    </tr>
                                    <tr>
                                        <td className="table-cell">
                                            <FaRuler className="icon" /> &gt; 50 metros
                                        </td>
                                        <td className="table-cell price-column">Bs. {wholesale_price_assorted}</td>
                                    </tr>
                                    <tr>
                                        <td rowSpan="3" className="group-title">Por Rollo</td>
                                    </tr>
                                    <tr>
                                        <td className="table-cell">
                                            <FaTape className="icon" /> 1 rollo
                                        </td>
                                        <td className="table-cell price-column">Bs. {price_per_roll}</td>
                                    </tr>
                                    <tr>
                                        <td className="table-cell">
                                            <FaToiletPaper className="icon" /> &gt; 5 rollos
                                        </td>
                                        <td className="table-cell price-column">Bs. {price_per_roll_assorted}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Row>
                </Col>
            </Row>
            <Row>
                <div className='section-information-fabric'>
                    <h3>CANTIDAD DE ROLLOS Y COLORES</h3>
                    <Table scroll={{
                        x: 400,
                    }} columns={rollColumns} dataSource={rollData} pagination={false} expandable={{ expandedRowRender }} />
                </div>
            </Row>
        </>
    );
}

export default ViewFabric;
