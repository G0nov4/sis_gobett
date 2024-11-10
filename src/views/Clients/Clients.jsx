import React, { useState } from 'react';
import { Layout, Row, Col, Button, Space } from 'antd';
import { FunnelPlotOutlined, PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import { useClients } from '../../services/Client';
import ClientsTable from '../../components/clients/ClientsTable';
import CreateClientModal from '../../components/clients/ModalCreateClient';
import { generateClientReport } from '../../utils/admin/ReportClients';

const Clients = () => {
  const { data: clients, isLoading } = useClients();

  console.log(clients)
  

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleGenerateReport = () => {
    generateClientReport(clients);
  };

  return (
    <div style={{ height: '100%' }}>
      {!showReport ? (
        <Row style={{ height: 'calc(100vh - 50px)', padding: 0 }}>
          <Col lg={24} style={{ borderRadius: 10, backgroundColor: '#fff' }}>
            <Row style={{ padding: '20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ margin: 0 }}>Gestión de Clientes</h1>
              <Space>
                <Button 
                  icon={<FileTextOutlined />} 
                  onClick={() => setShowReport(true)} 
                  type='default' 
                  size='middle'
                >
                  Generar Reporte
                </Button>
                <Button icon={<FunnelPlotOutlined />} type='text' size='small'>Filter</Button>
                <Button onClick={() => setAddModalOpen(true)} icon={<PlusOutlined />} type='default' size='middle'>
                  Añadir cliente
                </Button>
              </Space>
            </Row>
            <ClientsTable clients={clients} isLoading={isLoading}/>
          </Col>
        </Row>
      ) : (
        <div style={{ height: '100vh' }}>
          <Row style={{ padding: '10px', backgroundColor: '#fff' }}>
            <Space>
              <Button onClick={() => setShowReport(false)} type='primary'>
                Volver
              </Button>
            </Space>
          </Row>
          <div style={{ height: 'calc(100vh - 60px)' }}>
            {generateClientReport(clients)}
          </div>
        </div>
      )}
      <CreateClientModal visible={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </div>
  );
};

export default Clients;
