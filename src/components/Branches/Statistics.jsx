import { DollarCircleOutlined, MoneyCollectOutlined, ShopOutlined, TeamOutlined } from '@ant-design/icons'
import { Card, Col, Row, Space, Statistic } from 'antd'
import React from 'react'
import { calculateTotalBranches } from '../../utils/StatisticsUtils'

const Statistics = () => {
    const totalBranches = calculateTotalBranches([])
    return (
        <Row gutter={[6, 6]} style={{ marginTop: 15 }} >
            <Col xs={24} sm={12} md={6} key='total_money'  >
                <Card size='small'>

                    <Space direction="horizontal" align="center" size={20}>
                        <DollarCircleOutlined style={{
                            fontSize: '30px',
                            marginLeft: 10
                        }} />
                        <Statistic
                            title={<strong>Total Ganancias</strong>}
                            value='12080 Bs.'
                        />
                    </Space>
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6} key='total_ventas'  >
                <Card size='small'>
                    <Space direction="horizontal" align="center">
                        <MoneyCollectOutlined style={{
                            fontSize: '30px',
                            marginLeft: 10
                        }} />
                        <Statistic
                            title='Total ventas'
                            value='256'
                        />
                    </Space>
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6} key='total_sucursales'  >
                <Card size='small'>
                    <Space direction="horizontal" align="center" size={20}>

                        <ShopOutlined style={{
                            fontSize: '30px',
                            marginLeft: 10
                        }} />
                        <Statistic
                            title='Total Sucursales'
                            value='2'
                        />
                    </Space>
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6} key='total_clientes'  >
                <Card size='small'>
                    <Space direction="horizontal" align="center">
                        <TeamOutlined style={{
                            fontSize: '30px',
                            marginLeft: 10
                        }} />
                        <Statistic
                            title='Total clientes'
                            value='67'
                        />
                    </Space>
                </Card>
            </Col>
        </Row>
    )
}

export default Statistics