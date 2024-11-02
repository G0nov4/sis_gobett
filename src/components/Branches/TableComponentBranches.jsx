import { Badge, Typography, Button, Popconfirm, Progress, Space, Table, Form, Tooltip, Drawer, Row, Col, Card, Switch, Descriptions, Tabs, Flex, Dropdown, Menu, Spin, message, Skeleton, Modal, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { bracnhService } from '../../services/Branch';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BarChartOutlined, DownOutlined, PlusOutlined, SortAscendingOutlined, UpOutlined, DeleteOutlined, DollarOutlined, EditOutlined, EyeFilled, GlobalOutlined, PercentageOutlined, PhoneOutlined, QuestionCircleOutlined, ShopOutlined, SyncOutlined, TeamOutlined } from '@ant-design/icons';
const { Link } = Typography;

const TableComponentBranches = () => {
    const queryClient = useQueryClient()
    const getAllBranches = async (orderBy = 'id', orderType = 'asc', filters = {}) => {
        const response = bracnhService.get(orderBy = 'id', orderType = 'asc', filters = {});
        return response;
    };

    // Obteniendo todos los sucursales
    const { data, error, isLoading, isFetching } = useQuery({
        queryKey: ['Branches'],
        queryFn: getAllBranches,
        cacheTime: 10000,
        staleTime: 30000,
        refetchOnWindowFocus: true
    })
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditBranch, setIsEditBranch] = useState();
    const [informationbranch, setInformationBranch] = useState({})
    const [branches, setBranches] = useState(data || [])

    // Mutations de Edit, Mutate, Delete
    const addBranchMutation = useMutation({
        mutationFn: bracnhService.post,
        onSuccess: () => {
            message.success(isEditBranch ? 'Sucursal editada exitosamente!!!' : 'Sucursal añadida exitosamente!!!');
            queryClient.invalidateQueries('Branches')
        },
        onError: () => {
            message.error('Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.');
        }
    })

    const editBranchMutation = useMutation({
        mutationFn: bracnhService.put,
        onSuccess: () => {
            queryClient.invalidateQueries('Branches')
        },
        onError: () => {
            message.error('Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.');
        }
    })

    const deleteBracnhMutation = useMutation({
        mutationFn: bracnhService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries('Branches')
        },
        onError: () => { },

    })
    // Efecto para actualizar el estado 'branches' cuando 'data' cambie
    useEffect(() => {
        if (data) {
            setBranches(data);
            console.log('actualizando data de susucursales')
        }
    }, [data]);


    const onCancel = () => {
        setModalOpen(false)
        setIsEditBranch(false)
        setInformationBranch({})
    }
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
            width: 40,
            render: (text, record) => (
                <Link href="https://ant.design" target="_blank">
                    {record.attributes.name}
                </Link>
            ),
        },
        {
            title: (
                <Space>
                    <PhoneOutlined />
                    <span>Telefono</span>

                </Space>
            ),
            key: 'phone',
            align: 'left',
            width: 20,
            render: (text, record) => (
                <span>
                    {record.attributes.phone}
                </span>
            ),
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
                record.attributes.available == true ?
                    <Badge key='estado' color='green' text='Activo' /> :
                    <Badge key='estado' color='red' text='Inactivo' />
            )
        },
        {
            title: (
                <Space>
                    <GlobalOutlined />
                    <span>Ciudad</span>
                </Space>
            ),
            key: 'departament',
            align: 'left',
            width: 30,
            render: (text, record) => (
                <span>
                    {record.attributes.departament}
                </span>
            ),
        },
        {
            title: (
                <Space>
                    <DollarOutlined />
                    <span>Direccion</span>

                </Space>
            ),
            key: 'sales',
            align: 'center',
            width:80,
            render: (text, record) => (
                <span>
                    {record.attributes.address}
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
            width: 20,
            align: 'center',
            fixed: 'right',
            render: (_, record) => {
                const handleEditClient = () => {
                    setIsEditBranch(true)
                    setModalOpen(true)
                    setInformationBranch(record)
                }
                const handleDeleteClent = () => {
                    deleteBracnhMutation.mutate(record.id)
                }
                return (

                    <Space>
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
                                title="Eliminar Cliente"
                                placement='left'
                                description="Esta accion no podra revertirse."
                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}

                                onConfirm={handleDeleteClent}
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


    // Manjador de el orden
    const handleMenuClick = (e) => {
        const orderBy = 'name';

        if (e.key === 'ascendente') {
            const ascOrder = data.sort((a, b) => a[orderBy] < b[orderBy] ? -1 : 1)
            setBranches(ascOrder)
            message.success(`Orden Ascendente`);
        } else {
            const descOrder = data.sort((a, b) => a[orderBy] > b[orderBy] ? -1 : 1)
            setBranches(descOrder)
        }

    };

    const ModalEditCreateBranch = () => {
        const { form } = Form.useForm();
        const [switchValue, setSwitchValue] = useState(informationbranch.attributes?.available || false);
        const [loadingButton, setLoadingButton] = useState(false);
        const [formEditData, setFormEditData] = useState(informationbranch);



        // Manejador de los cambios del input
        const handleInputChange = (field, value) => {
            setFormEditData((prevData) => ({
                ...prevData,
                attributes: {
                    ...prevData.attributes,
                    [field]: value,
                },
            }));

        };

        // Manejador del estado del Switch
        const handleSwitchChange = (checked) => {
            setSwitchValue(checked);
            handleInputChange("available", checked)
        };
        // Funcion que se usa cuando se termina el formulario
        const onFinish = async () => {
            setLoadingButton(true);

            if (isEditBranch) {
                await editBranchMutation.mutateAsync(formEditData);
            } else {
                await addBranchMutation.mutateAsync(formEditData.attributes);
            }
            onCancel();
            setLoadingButton(false);
        };

        return (
            <>
                <Modal
                    open={modalOpen}
                    title={isEditBranch ? 'Editar Sucursal' : 'Crear Nueva Sucursal'}
                    destroyOnClose={true}
                    centered
                    onCancel={onCancel}
                    width={700}
                    closable={true}
                    footer={false}
                >

                    <Form
                        form={form}
                        onFinish={onFinish}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        layout="horizontal"
                        initialValues={isEditBranch ? informationbranch.attributes : {}} // Valor predeterminado para el switch
                    >

                        <Row align={'middle'} justify={'start'} style={{
                            padding: 20,
                            margin: '10px 0px 20px 0px',
                            border: '1px solid #d9d9d9', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}>
                            <Col span={2} style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <ShopOutlined style={{ background: '#f0f0f0', border: '1px solid #d9d9d9', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', fontSize: '30px', padding: 5 }} />
                            </Col>
                            <Col span={17} style={{ margin: '0 5px' }}>
                                <Row>
                                    <h4 style={{ margin: 0 }}>Habilitar Sucursal</h4>
                                    <p style={{ color: 'gray', fontSize: 12, margin: '0' }}>Al habilitar la sucursal, estas asumiendo que la sucursal ya esta en funcionamiento y que esta habilitada a tener un inventario y registrar ventas.</p>
                                </Row>
                            </Col>
                            <Col span={4} style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'stretch'
                            }}>
                                <Form.Item

                                    name="available"
                                    style={{
                                        marginBottom: 0
                                    }}
                                >
                                    <Switch
                                        checked={switchValue}
                                        onChange={handleSwitchChange}
                                        checkedChildren="Habilitado"
                                        unCheckedChildren="Inhabilitado"
                                        style={{
                                            backgroundColor: switchValue ? '#52c41a' : '#f5222d',
                                            borderColor: switchValue ? '#1890ff' : '#f5222d',
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Nombre" name="name" rules={[{ required: true, message: 'Por favor, ingresa el nombre' }]}>
                                    <Input placeholder="Nombre de la Sucursal" onChange={(e) => handleInputChange('name', e.target.value)} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Teléfono"
                                    name="phone"
                                    required
                                    rules={[
                                        { required: true, message: 'Por favor, ingresa el número de teléfono' },
                                        { pattern: /^[0-9]*$/, message: 'Ingresa solo números' },
                                    ]}
                                >
                                    <Input placeholder="Número de Teléfono" onChange={(e) => handleInputChange('phone', e.target.value)} />
                                </Form.Item>
                            </Col>

                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Ciudad"
                                    name="departament"
                                    rules={[{ required: true, message: 'Por favor, selecciona la ciudad' }]}
                                >
                                    <Select
                                        onSelect={((e) => handleInputChange('departament', e))}
                                        placeholder='Departamento'
                                        options={[
                                            {
                                                value: 'LA PAZ',
                                                label: 'La paz',
                                            },
                                            {
                                                value: 'COCHABAMBA',
                                                label: 'Cochabamba',
                                            },
                                            {
                                                value: 'ORURO',
                                                label: 'Oruro',
                                            },
                                            {
                                                value: 'SANTA CRUZ',
                                                label: 'Santa cruz',
                                            },
                                            {
                                                value: 'SUCRE',
                                                label: 'Sucre',
                                            },
                                            {
                                                value: 'BENI',
                                                label: 'Beni',
                                            },
                                            {
                                                value: 'TARIJA',
                                                label: 'Tarija',
                                            },
                                            {
                                                value: 'PANDO',
                                                label: 'Pando',
                                            },
                                            {
                                                value: 'POTOSI',
                                                label: 'Potosi',
                                            },
                                        ]} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Dirección" name="address">
                                    <Input placeholder="Dirección de la Sucursal" onChange={(e) => handleInputChange('address', e.target.value)} />
                                </Form.Item>
                            </Col>

                        </Row>

                        <Row gutter={16}>
                            <Button danger type="primary" htmlType="submit" icon={isEditBranch ? <EditOutlined /> : <PlusOutlined />} loading={loadingButton} >
                                {isEditBranch ? 'Editar Sucursal' : 'Crear Sucursal'}
                            </Button>
                        </Row>
                    </Form>
                </Modal>
            </>
        )
    }

    return (

        <Col span={24}>

            <Flex align='center' justify='space-between' style={{ margin: '10px 0px' }}>
                <h3 style={{ margin: 0, marginTop: 15 }}>Sucursales </h3>
                {isLoading ?
                    <Space>
                        <Skeleton.Button active={true} size='small' />
                        <Skeleton.Button active={true} size='small' />
                        <Skeleton.Button active={true} size='small' />
                    </Space>
                    :
                    <Space>
                        <Dropdown overlay={
                            <Menu onClick={handleMenuClick}>
                                <Menu.Item key="ascendente" icon={<UpOutlined />}>
                                    Ascendente
                                </Menu.Item>
                                <Menu.Item key="descendente" icon={<DownOutlined />}>
                                    Descendente
                                </Menu.Item>
                            </Menu>
                        } trigger={['click']}>
                            <Button
                                icon={<SortAscendingOutlined />}
                                type='text'
                                size='small' >
                                Sort
                            </Button>
                        </Dropdown>
                        <Button
                            onClick={() => { }}
                            icon={<BarChartOutlined />}
                            type='default'
                            size='small'
                        >
                            reporte
                        </Button>
                        <Button
                            onClick={() => { setModalOpen(true) }}
                            icon={<PlusOutlined />}
                            type='default'
                            size='middle'
                        >
                            Crear sucursal
                        </Button>
                    </Space>
                }
            </Flex>

            {/* MODAL PARA LAS SUCURSALES */}
            <ModalEditCreateBranch />
            <Spin spinning={isLoading} tip='Cargando datos de las sucursales'>
                <Table
                    scroll={{
                        x: 900,
                    }}
                    bordered
                    virtual
                    columns={columns}
                    dataSource={isLoading ? [] : branches.map(item => ({ ...item, key: item.id }))}
                    size="small"
                    pagination={{
                        pageSize: 6,
                    }} />
            </Spin>



        </Col>
    )
}

export default TableComponentBranches