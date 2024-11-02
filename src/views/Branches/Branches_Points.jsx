import { Col, Grid, Row } from 'antd'
import React from 'react'
import Statistics from '../../components/Branches/Statistics'
import TableComponentBranches from '../../components/Branches/TableComponentBranches'
const { useBreakpoint } = Grid
const Branches_Points = () => {
  console.log(useBreakpoint())
  return (

    < Row >
      <Col span={24}>
        <h3 style={{ margin: 0 }}>Resumen</h3>
        <Statistics />
      </Col>
      <TableComponentBranches />

    </Row >

  )
}

export default Branches_Points