import { Badge, Button, Popconfirm, Progress, Space, Table, Tooltip, Row, Col, Flex, Dropdown, Menu, Spin, Skeleton, Divider, Form } from 'antd'
import React, { useState } from 'react'
import { useQueryClient } from 'react-query';
import { BarChartOutlined, DownOutlined, PlusOutlined, SortAscendingOutlined, UpOutlined, DeleteOutlined, EditOutlined, EyeFilled, PercentageOutlined, QuestionCircleOutlined, ShopOutlined, SyncOutlined, TeamOutlined, RotateLeftOutlined, PrinterOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useFabrics, useDeleteFabric } from '../../services/Fabrics';
import { MdColorize } from 'react-icons/md';
import { message } from 'antd';
import { generateFabricReport } from '../../utils/admin/ReportFabric';

const TableComponentFabrics = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const deleteFabricMutation = useDeleteFabric();
    const [showReport, setShowReport] = useState(false);

    // Obteniendo todos los sucursales
    const { data: fabrics, error: errorFabrics, isLoading: isLoadingFabrics } = useFabrics()
    
    const columns = [
        {
            title: (
                <Space>
                    <ShopOutlined />
                    <span>Nombre</span>
                </Space>
            ),
            key: 'name',
            align: 'left',
            fixed: 'left',
            width: 60,
            render: (text, record) => {
                return (
                    <Space>
                        {record.attributes.fabric_images?.data ? (
                            <img src={'http://localhost:1337'+record.attributes.fabric_images.data[0].attributes.url} alt="Imagen" style={{ width: '50px', height: '50px', borderRadius: '3px' }} />
                        ) : (
                            <img src="https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg" alt="Imagen Predeterminada" style={{ width: '50px', height: '50px', borderRadius: '10px' }} />
                        )}
                        <Link to={`${record.id}`} state={record} >
                            {record.attributes.name}
                        </Link>
                    </Space>
                )
            }


        },
        {
            title: (
                <Space>
                    <SyncOutlined />
                    <span>Estado</span>

                </Space>
            ),
            key: 'status',
            align: 'left',
            width: 30,
            render: (text, record) => (
                record.attributes.availability_status == true ?
                    <Badge key='estado' color='green' text='Activo' /> :
                    <Badge key='estado' color='red' text='Inactivo' />
            )
        },
    {
            title: (
                <Space>
                    <RotateLeftOutlined />
                    <span>Rollos</span>
                </Space>
            ),
            key: 'departament',
            align: 'center',
            width: 25,
            render: (text, record) => (

                record.attributes.rolls.data.length < 10 ?
                    <span style={{ color: 'red', alignContent: 'center' }}>
                        {record.attributes.rolls.data.length}
                    </span> :
                    <span>
                        {record.attributes.rolls.data.length}
                    </span>

            ),
        }, 
       {
            title: (
                <Space>
                    <MdColorize />
                    <span>Colores</span>

                </Space>
            ),
            key: 'sales',
            align: 'left',
            width: 60,
            render: (text, record) => (
                <Space size={'small'}>
                    {record.attributes.colors?.data?.map(color => (
                        <div key={color.attributes.color} style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: color.attributes.color }} />
                    ))}
                </Space>
            ),
        },
        {
            title: (
                <Space size={1}>
                    <TeamOutlined />
                    <span>Coste</span>

                </Space>
            ),
            key: 'clients',
            align: 'left',
            width: 20,
            render: (text, record) => (
                <span>
                    {record.attributes.cost} $
                </span>
            ),
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
                const handleEditClient = () => {
                    
                    navigate(`/admin/fabric/edit/${record.id}`, { 
                        state: record 
                    });
                }

                const handleDeleteClient = async () => {
                    try {
                        await deleteFabricMutation.mutateAsync(record.id);
                        message.success('Tela eliminada exitosamente');
                        queryClient.invalidateQueries({ queryKey: ['fabrics'] })
                    } catch (error) {
                        console.error('Error al eliminar la tela:', error);
                        message.error('Error al eliminar la tela');
                    }
                }

                return (
                    <Space>
                        <Tooltip title="Ver" color='#4F646F' key='Ver'>

                            <Link to={`${record.id}`} state={record} >
                                <Button
                                    icon={<EyeFilled />}
                                    size='small' style={{
                                        color: '#4F646F', borderColor: '#4F646F'
                                    }}
                                />
                            </Link>
                        </Tooltip>
                        <Tooltip title="Editar" color='#F8BD25' key='Editar'>
                            <Button
                                icon={<EditOutlined />}
                                size='small'
                                style={{
                                    color: '#F8BD25', borderColor: '#F8BD25'
                                }}
                                onClick={handleEditClient}
                            />
                        </Tooltip>
                        <Tooltip title="Eliminar" color='#000' key='Eliminar'>
                            <Popconfirm
                                title="¿Estás seguro de eliminar esta tela?"
                                placement='left'
                                description={
                                    <div>
                                        <p>Esta acción no podrá revertirse.</p>
                                        <p>Se eliminarán también todos los rollos y colores asociados.</p>
                                    </div>
                                }
                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                okText="Sí, eliminar"
                                cancelText="No, cancelar"
                                okButtonProps={{ danger: true }}
                                onConfirm={handleDeleteClient}
                            >
                                <Button
                                    loading={deleteFabricMutation.isLoading}
                                    danger
                                    icon={<DeleteOutlined />}
                                    size='small'
                                />
                            </Popconfirm>
                        </Tooltip>
                        <Tooltip title="Imprimir Reporte de tela" color='#000' key='Editar'>
                            <Button
                                icon={<PrinterOutlined />}
                                size='small'
                                style={{
                                    color: '#000', borderColor: '#000'
                                }}
                                onClick={handleEditClient}
                            />
                        </Tooltip>
                    </Space>
                )
            },
        },
    ]

    return (
        <>
            {!showReport ? (
                <Col span={24}>
                    <Flex align='center' justify='space-between' style={{ margin: '10px 0px' }}>
                        <h3 style={{ margin: 0, marginTop: 15 }}> </h3>
                        {isLoadingFabrics ?
                            <Space>
                                <Skeleton.Button active={true} size='small' />
                                <Skeleton.Button active={true} size='small' />
                                <Skeleton.Button active={true} size='small' />
                            </Space>
                            :
                            <Space>
                                <Button
                                    onClick={() => setShowReport(true)}
                                    icon={<BarChartOutlined />}
                                    type='default'
                                    size='small'
                                >
                                    Generar Reporte
                                </Button>
                                <Button
                                    onClick={() => navigate("/admin/fabric/create")}
                                    icon={<PlusOutlined />}
                                    type='default'
                                    size='middle'
                                >
                                    Crear producto tela
                                </Button>
                            </Space>
                        }
                    </Flex>

                    <Spin spinning={isLoadingFabrics} tip='Cargando datos de las sucursales'>
                        <Table
                            scroll={{
                                x: 900,
                            }}
                            bordered
                            virtual
                            columns={columns}
                            dataSource={isLoadingFabrics && !errorFabrics ? [] : fabrics.data.map(item => ({ ...item, key: item.id }))}
                            size='small'
                            pagination={{
                                pageSize: 6,
                            }} 
                        />
                    </Spin>
                </Col>
            ) : (
                <div style={{ height: '100vh' }}>
                    <Row style={{ padding: '10px', backgroundColor: '#fff' }}>
                        <Space>
                            <Button onClick={() => setShowReport(false)} type='primary' danger>
                                Volver
                            </Button>
                        </Space>
                    </Row>
                    <div style={{ height: 'calc(100vh - 60px)' }}>
                        {fabrics && generateFabricReport(fabrics)}
                    </div>
                </div>
            )}
        </>
    )
}

export default TableComponentFabrics
