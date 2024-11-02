import React from 'react';
import { useLocation } from 'react-router-dom';
import CreateComponentFabric from './CreateFabric';
import { Spin } from 'antd';

const EditFabric = () => {
  const location = useLocation();
  const fabricData = location.state;

  if (!fabricData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin tip="Cargando datos de la tela..." />
      </div>
    );
  }

  return <CreateComponentFabric isEdit={true} editData={fabricData} />;
};

export default EditFabric;
