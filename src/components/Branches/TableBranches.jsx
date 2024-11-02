import { DeleteOutlined, DollarOutlined, EditOutlined, EyeFilled, GlobalOutlined, PercentageOutlined, PhoneOutlined, QuestionCircleOutlined, ShopOutlined, SyncOutlined, TeamOutlined } from '@ant-design/icons'
import { Badge, Typography, Button, Popconfirm, Progress, Space, Table, Tooltip, Drawer, Row, Col, Card, Switch, Descriptions, Tabs } from 'antd'
import React, { useState } from 'react'
import { bracnhService } from '../../services/Branch';
import { BsArrowUpSquare } from 'react-icons/bs';

const { Link } = Typography;


const TableBranches = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [formEditData, setFormEditData] = useState(null);

  // EDIT CLIENT
  const handleInputChange = (field, value) => {
    setFormEditData((prevData) => ({
      ...prevData,
      attributes: {
        ...prevData.attributes,
        [field]: value,
      },
    }));
  };
  const onClose = () => {
    setOpen(false);
  };

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
      width: 40,
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
        record.attributes.available === true ?
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
      width: 50,
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
          <span>Ventas</span>

        </Space>
      ),
      key: 'sales',
      align: 'left',
      width: 50,
      render: (text, record) => (
        <span>
          Bs. 7888
        </span>
      ),
    },
    {
      title: (
        <Space>
          <TeamOutlined />
          <span>Clientes</span>

        </Space>
      ),
      key: 'clients',
      align: 'left',
      width: 40,
      render: (text, record) => (
        <span>
          15
        </span>
      ),
    },
    {
      title: (
        <Space>
          <PercentageOutlined />
          <span>Procentaje de venta</span>

        </Space>
      ),
      key: 'percent_of_sales',
      align: 'left',
      width: 50,
      render: (text, record) => (
        <span>
          <Progress percent={60} status="active" strokeColor={{
            '0%': '#FB120E',
            '100%': '#F9C94D',
          }} />
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


        const handleViewClient = async (e) => {
          setOpen(true)
          setFormEditData(record)
          console.log(formEditData)
        }
        const handleEditClient = () => {

        }
        const handleDeleteClent = () => { }
        return (
          <Space>
            <Tooltip title="Ver" color='#4F646F' key='Ver'>
              <Button
                icon={<EyeFilled />}
                size='small' style={{
                  color: '#4F646F', borderColor: '#4F646F'
                }}
                onClick={handleViewClient}
              />
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
  return (
    <div>
      <Col span={24}>
        <Flex align='center' justify='space-between' style={{ margin: '10px 0px' }}>
          <h3 style={{ margin: 0, marginTop: 15 }}>Sucursales </h3>
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
              onClick={() => { setModalAddBranchOpen(true) }}
              icon={<PlusOutlined />}
              type='default'
              size='middle'
            >
              Crear sucursal
            </Button>
          </Space>
        </Flex>
        <Table
          scroll={{
            x: 900,
          }}
          bordered
          virtual
          columns={columns}
          dataSource={data.map(item => ({ ...item, key: item.id }))}

          size="small"
          pagination={{
            pageSize: 6,
          }}
        />
      </Col>

      <Drawer title="Basic Drawer" onClose={onClose} open={open} width={700} bodyStyle={{ padding: 10 }} headerStyle={{ padding: 10 }}>
        {formEditData && (
          <Row>
            <Col span={24}>
              <Descriptions layout='horizontal' size='small' column={{ xs: 1, sm: 2, md: 3, }}>
                <Descriptions.Item label="Nombre" span={{ xs: 1, sm: 1, md: 2 }}>
                  {formEditData.attributes.name || ''}
                </Descriptions.Item>
                <Descriptions.Item label="Codigo" span={{ xs: 1, sm: 1, md: 1 }}>
                  {formEditData.attributes.code}
                </Descriptions.Item>
                <Descriptions.Item label="Fecha de creacion" span={{ xs: 1, sm: 1, md: 1, lg: 2 }}>
                  {new Date('2024-03-07T14:27:51.605Z').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ' a las ' + new Date(formEditData.attributes.createdAt).toLocaleTimeString('es-ES')}
                </Descriptions.Item>
                <Descriptions.Item label="Estado de la sucursal" span={{ xs: 1, sm: 1, md: 1, lg: 1 }}>
                  {formEditData.attributes.available === true ?
                    <Badge key='estado' color='green' text='Activo' /> :
                    <Badge key='estado' color='red' text='Inactivo' />}
                </Descriptions.Item>
                <Descriptions.Item label="Departamento">
                  {formEditData.attributes.departament}
                </Descriptions.Item>
                <Descriptions.Item label="Telefono">
                  {formEditData.attributes.phone}
                </Descriptions.Item>

              </Descriptions>
            </Col>
            <Col span={24}>
              <Tabs>
                <Tabs.TabPane key='ventas_x_sucursal' tab='Ventas' icon={<BsArrowUpSquare />} >

                </Tabs.TabPane>
                <Tabs.TabPane key='clients_x_sucursal' tab='Clientes' icon={<BsArrowUpSquare />} >

                </Tabs.TabPane>
                <Tabs.TabPane key='fabrics_x_sucursal' tab='Ventas' icon={<BsArrowUpSquare />} >

                </Tabs.TabPane>
              </Tabs>
            </Col>
          </Row>
        )}
      </Drawer>
    </div>
  )
}

export default TableBranches