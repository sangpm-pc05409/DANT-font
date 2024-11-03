import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete } from 'react-icons/ai';
import axios from 'axios';

export default function ProductCards() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const token = localStorage.getItem('token'); // Giả định rằng token được lưu trong localStorage

  // Hàm tải giỏ hàng từ API
  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/user/shopping/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data);
      calculateTotal(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  // Hàm tính tổng tiền của giỏ hàng
  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
    setTotalPrice(total);
  };

  // Tăng số lượng sản phẩm
  const handleIncrease = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/user/shopping/cart/increase?id=${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCart(); // Tải lại giỏ hàng
    } catch (error) {
      alert("Không thể tăng số lượng sản phẩm.");
      console.error("Error increasing quantity:", error);
    }
  };

  // Giảm số lượng sản phẩm
  const handleDecrease = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/user/shopping/cart/decrease?id=${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCart(); // Tải lại giỏ hàng
    } catch (error) {
      alert("Không thể giảm số lượng sản phẩm.");
      console.error("Error decreasing quantity:", error);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemove = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/user/shopping/cart/delete?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        fetchCart(); // Tải lại giỏ hàng
      }
    } catch (error) {
      alert("Không thể xóa sản phẩm khỏi giỏ hàng.");
      console.error("Error removing item:", error);
    }
  };

  return (
    <section className="h-100" style={{ backgroundColor: "#eee" }}>
      <Container className="py-5 h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col md="10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-normal mb-0 text-black">Giỏ hàng của bạn</h3>
            </div>

            {cartItems.length === 0 ? (
              <p>Giỏ hàng của bạn đang trống</p>
            ) : (
              cartItems.map((item) => (
                <Card className="rounded-3 mb-4" key={item.id}>
                  <Card.Body className="p-4">
                    <Row className="justify-content-between align-items-center">
                      <Col md="2">
                        {item.product?.image ? (
                          <Card.Img
                            className="rounded-3"
                            src={`http://localhost:8080/images/${item.product.image}`}
                            alt={item.product.name}
                          />
                        ) : (
                          <Card.Img
                            className="rounded-3"
                            src="https://via.placeholder.com/150"
                            alt="Placeholder image"
                          />
                        )}
                      </Col>
                      <Col md="3">
                        <p className="lead fw-normal mb-2">{item.product?.name || "Unknown Product"}</p>
                      </Col>
                      <Col md="3" className="d-flex align-items-center justify-content-around">
                        <Button variant="link" className="px-2" onClick={() => handleDecrease(item.id)}>
                          <AiOutlineMinus />
                        </Button>

                        <Form.Control min={0} value={item.quantity} type="number" readOnly size="sm" />

                        <Button variant="link" className="px-2" onClick={() => handleIncrease(item.id)}>
                          <AiOutlinePlus />
                        </Button>
                      </Col>
                      <Col md="2" className="d-flex align-items-center justify-content-end">
                        <h5 className="mb-0">${(item.product?.price * item.quantity).toFixed(2)}</h5>
                      </Col>
                      <Col md="1" className="d-flex align-items-center justify-content-end">
                        <Button variant="link" className="text-danger" onClick={() => handleRemove(item.id)}>
                          <AiOutlineDelete size={24} />
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))
            )}

            {/* Tổng giá và nút Thanh toán */}
            {cartItems.length > 0 && (
              <Card className="rounded-3 mb-4">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md="6" className="d-flex justify-content-start">
                      <h5 className="mb-0">Tổng cộng: ${totalPrice.toFixed(2)}</h5>
                    </Col>

                    <Col md="6" className="d-flex justify-content-end">
                      <Button variant="warning" size="lg">
                        Thanh toán
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
}
