// src/components/Sidebar.js
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import './Sidebar.css';

function Sidebar() {
  return (
    <ListGroup className="sidebar">
      <ListGroup.Item><i className="fas fa-user"></i> Nguyễn Phú</ListGroup.Item>
      <ListGroup.Item><i className="fas fa-user-friends"></i> Bạn bè</ListGroup.Item>
      <ListGroup.Item><i className="fas fa-clock"></i> Kỷ niệm</ListGroup.Item>
      <ListGroup.Item><i className="fas fa-bookmark"></i> Đã lưu</ListGroup.Item>
      <ListGroup.Item><i className="fas fa-users"></i> Nhóm</ListGroup.Item>
      <ListGroup.Item><i className="fas fa-video"></i> Video</ListGroup.Item>
      <ListGroup.Item><i className="fas fa-store"></i> Marketplace</ListGroup.Item>
      <ListGroup.Item><i className="fas fa-newspaper"></i> Bảng feed</ListGroup.Item>
      <ListGroup.Item><i className="fas fa-calendar"></i> Sự kiện</ListGroup.Item>
    </ListGroup>
  );
}

export default Sidebar;
