import { Col, Row } from 'antd'
import React from 'react'
import Statistics from '../../components/Branches/Statistics';
import TableComponentFabrics from '../../components/Fabrics/TableFabrics';

const Fabrics = () => {
  return (

    <Row >
     
      {/* Columna de estadisticas */}
      <Col span={24}>
        <Statistics />
      </Col>

      <TableComponentFabrics />


    </Row>

  )
}

export default Fabrics