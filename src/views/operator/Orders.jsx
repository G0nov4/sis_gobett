import React, { useState, useMemo } from 'react';
import { Row, Col, Button, Space, Input, Radio, Badge, Spin, Divider } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import OrderList from '../../components/operator/OrderList';
import './Orders.css';
import { useSales, useUpdateSale } from '../../services/Sales';
import { message } from 'antd';

const Orders = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchText, setSearchText] = useState('');
  const { data: sales, isLoading } = useSales('createdAt', 'desc', {
    filters: {
      sales_type: {
        $eq: 'PEDIDO'
      }
    }
  });
  const updateSaleMutation = useUpdateSale();

  const getFilteredSales = useMemo(() => {
    if (!sales?.data) return [];
    
    return sales.data.filter(sale => {
      const matchesSearch = searchText.toLowerCase() === '' || 
        sale.attributes.client?.data?.attributes?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        sale.attributes.client?.data?.attributes?.phone_1?.includes(searchText);

      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'process' && !sale.attributes.status) ||
        (filterStatus === 'completed' && sale.attributes.status);

      return matchesSearch && matchesStatus;
    });
  }, [sales, searchText, filterStatus]);

  const handleStatusChange = async (saleId, newStatus) => {
    try {
      await updateSaleMutation.mutateAsync({
        id: saleId,
        data: { status: newStatus }
      });
    } catch (error) {
      message.error('Error al actualizar el estado de la venta');
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <div className="pos-sales-container">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space align="baseline" style={{ width: '100%', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>Pedidos</h2>
            <span style={{ color: '#666' }}>{getCurrentDate()}</span>
          </Space>
          <Divider />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space size="middle" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Radio.Group 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value="all">
                Todas las órdenes
                <Badge count={sales?.data?.length || 0} style={{ marginLeft: 5 }} />
              </Radio.Button>
              <Radio.Button value="process">
                En proceso
                <Badge count={sales?.data?.filter(sale => !sale.attributes.status).length || 0} style={{ marginLeft: 5 }} />
              </Radio.Button>
              <Radio.Button value="completed">
                Completados
                <Badge count={sales?.data?.filter(sale => sale.attributes.status).length || 0} style={{ marginLeft: 5 }} />
              </Radio.Button>
            </Radio.Group>

            <Space>
              <Input
                placeholder="Buscar pedido..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
                allowClear
              />
            </Space>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={24}>
          <OrderList 
            salesList={getFilteredSales}
            handleStatusChange={handleStatusChange}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Orders;