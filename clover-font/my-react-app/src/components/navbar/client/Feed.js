// src/components/Feed.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './Feed.css';

function Feed() {
  return (
    <div className="feed">
      <Card className="feed__story">
        <Card.Body>
          <Button variant="primary">Tạo tin</Button>
        </Card.Body>
      </Card>
      <Card className="feed__post">
        <Card.Body>
          <Card.Text>Phú ơi, bạn đang nghĩ gì thế?</Card.Text>
          <Button variant="outline-primary"><i className="fas fa-video"></i> Video trực tiếp</Button>
          <Button variant="outline-success"><i className="fas fa-image"></i> Ảnh/video</Button>
          <Button variant="outline-warning"><i className="fas fa-smile"></i> Cảm xúc/hoạt động</Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Feed;
