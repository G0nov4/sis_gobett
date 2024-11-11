import { Col, Row } from 'antd'
import React from 'react'
import Statistics from '../../components/Branches/Statistics';
import TableComponentFabrics from '../../components/Fabrics/TableFabrics';

const Fabrics = () => {
  return (

    <Row >
     
      <Col span={24}>
        <Row justify="start">
          <h1 style={{ margin: '20px 0' }}>Gestion de telas</h1>
        </Row>
      </Col>

      <TableComponentFabrics />


    </Row>

  )
}

export default Fabrics