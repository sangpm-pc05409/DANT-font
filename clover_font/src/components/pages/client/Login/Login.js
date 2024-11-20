import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Gửi yêu cầu đăng nhập đến API
      const response = await axios.post("http://localhost:8080/api/login", null, {
        params: {
          username,
          password,
        },
      });
      
      // Kiểm tra phản hồi
      if (response.status === 200 && response.data.status === "success") {
        localStorage.setItem("token", response.data.data); // Lưu token vào localStorage
        navigate("/index"); // Chuyển hướng đến trang index
      } else {
        setError(response.data.message || "Sai tên đăng nhập hoặc mật khẩu. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Sai tên đăng nhập hoặc mật khẩu. Vui lòng thử lại."); // Hiển thị thông báo lỗi
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-lg p-3 mb-5 bg-white rounded">
            <Card.Body>
              <h2 className="text-center mb-4">Đăng Nhập</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleLogin}>
                <Form.Group id="username" className="mb-3">
                  <Form.Label>Tên đăng nhập</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    size="lg"
                    placeholder="Nhập tên đăng nhập"
                  />
                </Form.Group>

                <Form.Group id="password" className="mb-3">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    size="lg"
                    placeholder="Nhập mật khẩu"
                  />
                </Form.Group>

                <Button className="w-100" type="submit" size="lg" variant="primary">
                  Đăng Nhập
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}