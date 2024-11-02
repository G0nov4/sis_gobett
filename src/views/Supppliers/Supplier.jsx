import { BarChartOutlined, DeleteFilled, DeleteOutlined, DownOutlined, EditOutlined, EllipsisOutlined, EyeFilled, HolderOutlined, PlusOutlined, SettingOutlined, SortAscendingOutlined, UpOutlined, UploadOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Descriptions, Dropdown, Form, Input, Menu, Modal, Row, Select, Skeleton, Space, Spin, Upload, message } from 'antd';
import React, { useEffect, useState } from 'react'
import logo from '../../assets/Logo Gobett.png'
import { useCreateSupplier, useDeleteSupplier, useSuppliers } from '../../services/Suppliers';
import { useQueryClient } from 'react-query';
import { MdAddChart } from 'react-icons/md';
const { Meta } = Card;

const Supplier = () => {
    const [form] = Form.useForm();
    const createSupplierMutation = useCreateSupplier()
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);

    const { data: suppliers, isLoading, isError, isFetching } = useSuppliers()
    const [addSupplierModalOpen, setAddSupplierModalOpen] = useState(false);



    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
                const data = await response.json();
                // Map the API data to extract country names and flags
                const countryList = data.map(country => ({
                    name: country.name.common,
                    flag: country.flags.svg,
                    code: country.cca2, // Country code
                }));
                setCountries(countryList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching countries:', error);
                setLoading(false);
            }
        };
        fetchCountries();
    }, []);

    const handleCrateSupplier = (values) => {
        console.log(values)
        const newSupplier = createSupplierMutation.mutateAsync(values);
        newSupplier
            .then(data => {
                message.success('Proovedore Aregado correctamente')
            })
            .catch(err => {
                message.error('Error al crear el proovedor, vuelve a intentarlo mas tarde.')
            })
            .finally(setAddSupplierModalOpen(false))
    }

    const handleDelete = (id) => {
        Modal.confirm({
            title: '¿Deseas eliminar este proveedor?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'Sí',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => { }
        });
    };

    const menu = (
        <Menu>
            <Menu.Item key="report" icon={<MdAddChart />}>
                Generar reporte
            </Menu.Item>
            <Menu.Item key="edit" icon={<EditOutlined />}>
                Editar
            </Menu.Item>
            <Menu.Item key="delete" danger icon={<DeleteOutlined />} onClick={() => handleDelete()}>
                Eliminar
            </Menu.Item>
        </Menu>
    );



    if (isLoading) (
        <Spin></Spin>
    )
    if (isError) (
        <h1>
            Error
        </h1>
    )

    if (isFetching) (
        <Spin></Spin>
    )

    return (
        <>
            <Row gutter={[16, 16]} >
                <Col span={24} style={{ display: 'flex', justifyContent: 'end' }}>
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
                                onClick={() => { setAddSupplierModalOpen(true) }}
                                icon={<PlusOutlined />}
                                type='default'
                                size='middle'
                            >
                                Crear nuevo proovedor
                            </Button>
                        </Space>
                    }
                </Col>
                {suppliers ? suppliers.data.map(supplier => {
                    return (
                        <Col lg={8} md={12} sm={20}>
                            <Card
                                style={{
                                    width: '100%'
                                }}
                                extra={
                                    <Dropdown overlay={menu} trigger={['click']}>
                                        <Button type='text' icon={<HolderOutlined />} />
                                    </Dropdown>
                                }
                                title={supplier.attributes.name}
                            >
                                <Descriptions
                                    size='small' 
                                    layout='vertical'          
                                >
                                    <Descriptions.Item span={1} label="Pais">{supplier.attributes.country}</Descriptions.Item>
                                    <Descriptions.Item span={2} label="Ciudad">{supplier.attributes.city}</Descriptions.Item>
                                    <Descriptions.Item span={3} label="Direccion">{supplier.attributes.address}</Descriptions.Item>
                                    <Descriptions.Item span={3} label="Pagina web"><a href={supplier.attributes.link_web}>{supplier.attributes.link_web}</a></Descriptions.Item>

                                </Descriptions>
                            </Card>
                        </Col>
                    )
                }) : <Spin></Spin>
                }

            </Row>
            <Modal
                centered
                title={<strong>CREAR PROOVEDOR</strong>}
                footer={null}
                visible={addSupplierModalOpen}
                onCancel={() => { setAddSupplierModalOpen(false) }}
            >
                <Form
                    layout='vertical'
                    onFinish={handleCrateSupplier}
                    preserve={false}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label={<strong>Nombre</strong>}
                                style={{ marginBottom: "10px" }}
                                name="name"
                                rules={[{ required: true, message: 'Por favor ingrese el nombre del proovedor' }]}
                            >
                                <Input placeholder='Ingrese el nombre de la empresa' />
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={<strong>Pais</strong>}
                                style={{ marginBottom: "10px" }}
                                name="country"
                                rules={[{ required: true, message: 'Por favor ingrese el Pais' }]}
                            >
                                <Select
                                    showSearch

                                    placeholder="Selecciona un país"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => {
                                        console.log(input, option)
                                        return option.children.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    }
                                >
                                    {countries.map((country) => (
                                        <Select.Option key={country.code} value={country.name}>
                                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                                <img
                                                    src={country.flag}
                                                    alt={`Flag of ${country.name}`}
                                                    style={{ marginRight: 10, width: 20, height: 15 }}
                                                />
                                                {country.name}
                                            </span>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<strong>Ciudad</strong>}
                                style={{ marginBottom: "10px" }}
                                name="city"
                            >
                                <Input placeholder='Nombre de la ciudad' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label={<strong>Numero de contacto</strong>}
                                style={{ marginBottom: "10px" }}
                                name="phone"
                            >
                                <Input type='number' placeholder='Ingrese el numoer de celular de la empresa' />
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label={<strong>Direccion</strong>}
                                style={{ marginBottom: "10px" }}
                                name="address"
                            >
                                <Input placeholder='Ingrese la direccion de la empresa' />
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label={<strong>Link de pagina web</strong>}
                                style={{ marginBottom: "10px" }}
                                name="link_web"
                            >
                                <Input type='text' placeholder='Ingrese el link de la pagina de la empresa' />
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row>
                        <Col s>
                            <Form.Item
                                name="logo"
                                label={<strong>Logotipo de la empresa</strong>}
                                style={{ marginBottom: "10px" }}
                                valuePropName="fileList"
                            >
                                <Upload name="logo" action="" listType="picture-card">
                                    <button style={{ border: 0, background: 'none' }} type="button">
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Subir Logo</div>
                                    </button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item >
                                <Space>
                                    <Button danger type="primary" htmlType="submit" icon={<PlusOutlined />} >
                                        CREAR PROOVEDOR
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}

export default Supplier