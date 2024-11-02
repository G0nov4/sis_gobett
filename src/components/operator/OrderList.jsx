import React from 'react';
import { Card } from 'antd';
import './styles.css'; // Import your custom styles

const MyCard = ({ title, orderNumber, items, table, status }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Canceled':
        return 'status-canceled';
      case 'Ready to Serve':
        return 'status-ready';
      case 'Waiting':
        return 'status-waiting';
      default:
        return '';
    }
  };

  return (
    <Card className="custom-card" size='small'>
      <div className="custom-card-body">
        <div className="custom-card-header">
          <h3 className="custom-card-title">{title}</h3>
          <span>#{orderNumber}</span>
        </div>
        <p>{items} Items &bull; Table {table}</p>
        <span className={`custom-card-status ${getStatusClass(status)}`}>
          {status}
        </span>
      </div>
    </Card>
  );
};

const OrderList = () => {
  const orders = [
    { title: 'Vinicius Bayu', orderNumber: 12532, items: 3, table: 3, status: 'Canceled' },
    { title: 'Cheryl Arema', orderNumber: 12532, items: 3, table: 3, status: 'Ready to Serve' },
    { title: 'Kylian Rex', orderNumber: 12531, items: 12, table: 4, status: 'Waiting' },
    // Add more orders as needed
  ];

  return (
    <div style={{ display: 'flex', overflowX: 'auto' }}>
      {orders.map((order, index) => (
        <MyCard key={index} {...order} />
      ))}
    </div>
  );
};

export default OrderList;