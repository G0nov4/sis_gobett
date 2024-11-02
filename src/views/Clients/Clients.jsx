import React, { useState } from 'react';
import { Layout, Row, Col, Button, Space } from 'antd';
import { FunnelPlotOutlined,  PlusOutlined } from '@ant-design/icons';
import { useClients } from '../../services/Client';
import ClientsTable from '../../components/clients/ClientsTable';
import CreateClientModal from '../../components/clients/ModalCreateClient';



const Clients = () => {
  const { data: clients, isLoading } = useClients();

  const [addModalOpen, setAddModalOpen] = useState(false);

  // Funciones para manejar la apertura y cierre de modales y cajones laterales
  // ...

  return (
    <>
      <Row style={{ height: 'calc(100vh - 50px)', padding: 0 }}>
        <Col lg={24} style={{ borderRadius: 10, backgroundColor: '#fff' }}>
          <Row style={{ padding: 10, display: 'flex', justifyContent: 'end' }}>
            <Space>
              <Button icon={<FunnelPlotOutlined />} type='text' size='small'>Filter</Button>
              {/* Renderiza el menú de ordenamiento aquí */}
              <Button onClick={() => setAddModalOpen(true)} icon={<PlusOutlined />} type='default' size='middle'>Añadir cliente</Button>
            </Space>
          </Row>
          {/* Renderiza la tabla de clientes aquí */}
          <ClientsTable clients={clients} isLoading={isLoading}/>
        </Col>
      </Row>
      {/* Renderiza los modales y el cajón lateral aquí */}
      <CreateClientModal visible={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </>
  );
};

export default Clients;
