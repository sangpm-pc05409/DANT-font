import React from 'react';
import { Container, Row, Col, Nav, Form, FormControl, Button, Card, ListGroup, Image } from 'react-bootstrap';
import { FaUserFriends, FaClock, FaSave, FaUsers, FaVideo, FaStore, FaNewspaper, FaCalendarAlt, FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';

const Sidebar = () => (
  <Nav defaultActiveKey="/home" className="flex-column mt-3">
    <Nav.Link href="#profile">
      <FaUserFriends /> Bạn bè
    </Nav.Link>
    <Nav.Link href="#memories">
      <FaClock /> Kỷ niệm
    </Nav.Link>
    <Nav.Link href="#saved">
      <FaSave /> Đã lưu
    </Nav.Link>
    <Nav.Link href="#groups">
      <FaUsers /> Nhóm
    </Nav.Link>
    <Nav.Link href="#videos">
      <FaVideo /> Video
    </Nav.Link>
    <Nav.Link href="#marketplace">
      <FaStore /> Marketplace
    </Nav.Link>
    <Nav.Link href="#feed">
      <FaNewspaper /> Bảng feed
    </Nav.Link>
    <Nav.Link href="#events">
      <FaCalendarAlt /> Sự kiện
    </Nav.Link>
  </Nav>
);

const Post = ({ userImage, userName, timeStamp, content }) => (
  <Card className="mb-3 mt-3">
    <Card.Body>
      <Row>
        <Col xs={2}>
          <Image src={userImage} roundedCircle width="50" height="50" />
        </Col>
        <Col>
          <Card.Title>{userName}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{timeStamp}</Card.Subtitle>
        </Col>
      </Row>
      <Card.Text>{content}</Card.Text>
      <Row>
        <Col>
          <Button variant="link"><FaThumbsUp /> Like</Button>
        </Col>
        <Col>
          <Button variant="link"><FaComment /> Comment</Button>
        </Col>
        <Col>
          <Button variant="link"><FaShare /> Share</Button>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

const MainContent = () => (
  <div>
    <Card className="mb-3 mt-3">
      <Card.Body>
        <Form>
          <FormControl type="text" placeholder="Phú ơi, bạn đang nghĩ gì thế?" />
        </Form>
      </Card.Body>
    </Card>
    <Post
      userImage="https://via.placeholder.com/50"
      userName="Nguyễn Phú"
      timeStamp="1 giờ trước"
      content="Đây là bài đăng của tôi trên clover giả lập."
    />

    <Post
      userImage="https://via.placeholder.com/50"
      userName="Phan Sang"
      timeStamp="1 giờ trước"
      content="Đây là bài đăng của tôi trên clover giả lập."
    />
    <Post
      userImage="https://via.placeholder.com/50"
      userName="Phú đẹp trai vcl"
      timeStamp="1 giờ trước"
      content="Đây là bài đăng của tôi trên clover giả lập."
    />
  </div>
);

const Contacts = () => (
  <ListGroup className='mt-3 '>
    <ListGroup.Item>Danh Piy Truong</ListGroup.Item>
    <ListGroup.Item>Trí Tài</ListGroup.Item>
    <ListGroup.Item>Văn Qui</ListGroup.Item>
    <ListGroup.Item>Thu Thuy Nguyen</ListGroup.Item>
    <ListGroup.Item>Nguyen Phuoc</ListGroup.Item>
    <ListGroup.Item>Nhật Thanh</ListGroup.Item>
    <ListGroup.Item>Thang Phan Van</ListGroup.Item>
    <ListGroup.Item>Phúc Bùi</ListGroup.Item>
    <ListGroup.Item>Đặng Khang</ListGroup.Item>
    <ListGroup.Item>Tài Nguyễn</ListGroup.Item>
    <ListGroup.Item>Phuong Tran</ListGroup.Item>
    <ListGroup.Item>Le Phuong Tien</ListGroup.Item>
    <ListGroup.Item>Trường Giang</ListGroup.Item>
  </ListGroup>
);

const HomePage = () => (
  <Container fluid>
    <Row>
      <Col md={3}>
        <Sidebar />
      </Col>
      <Col md={6}>
        <MainContent />
      </Col>
      <Col md={3}>
        <Contacts />
      </Col>
    </Row>
  </Container>
);

export default HomePage;
