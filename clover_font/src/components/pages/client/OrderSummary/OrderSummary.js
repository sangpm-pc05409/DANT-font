// src/components/OrderSummary.js
import React from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import './OrderSummary.css';

const OrderSummary = () => {
    return (
        <Container className="order-summary mt-5">
            {/* Shop 1 - Card */}
            <Card className="shop-card mb-4 shadow-sm border-0">
                <Card.Body>
                    <div className="my-4">
                        <h4 className="mb-4 shop-title">GUNDAM89</h4>
                        <div className="border product-card p-3">
                            <div className="product-info d-flex">
                                <img src="product_image_url" alt="product" width="100" className="mr-3 product-image" />
                                <div className="d-flex flex-column justify-content-center">
                                    <span className="font-weight-bold">Mô Hình Lắp Ráp Gundam RG 00 Raiser</span>
                                    <span className="badge badge-secondary mt-2">Đổi ý miễn phí 15 ngày</span>
                                </div>
                            </div>

                            {/* Unit Price, Quantity, and Total (Horizontal Layout) */}
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <div className="font-weight-bold">Đơn giá: ₫780.000</div>
                                <div className="text-muted">Số lượng: 1</div>
                                <div className="font-weight-bold">Thành tiền: ₫780.000</div>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-md-6">
                                <div className="border p-3 voucher-section">
                                    <h5 className="font-weight-bold">Voucher của Shop</h5>
                                    <a href="/" className="text-primary">Chọn Voucher</a>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="border p-3 shipping-section">
                                    <h5 className="font-weight-bold">Đơn vị vận chuyển: Nhanh</h5>
                                    <p>Đảm bảo nhận hàng từ 16 Tháng 10 - 17 Tháng 10</p>
                                    <span className="text-muted">₫32.200</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Shop 2 - Card */}
            <Card className="shop-card mb-4 shadow-sm border-0">
                <Card.Body>
                    <div className="my-4">
                        <h4 className="mb-4 shop-title">Shop B</h4>
                        <div className="border product-card p-3">
                            <div className="product-info d-flex">
                                <img src="product_image_url" alt="product" width="100" className="mr-3 product-image" />
                                <div className="d-flex flex-column justify-content-center">
                                    <span className="font-weight-bold">Sản phẩm từ Shop B</span>
                                    <span className="badge badge-secondary mt-2">Đổi ý miễn phí 15 ngày</span>
                                </div>
                            </div>

                            {/* Unit Price, Quantity, and Total (Horizontal Layout) */}
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <div className="font-weight-bold">Đơn giá: ₫550.000</div>
                                <div className="text-muted">Số lượng: 1</div>
                                <div className="font-weight-bold">Thành tiền: ₫550.000</div>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-md-6">
                                <div className="border p-3 voucher-section">
                                    <h5 className="font-weight-bold">Voucher của Shop</h5>
                                    <a href="/" className="text-primary">Chọn Voucher</a>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="border p-3 shipping-section">
                                    <h5 className="font-weight-bold">Đơn vị vận chuyển: Bình Thường</h5>
                                    <p>Đảm bảo nhận hàng từ 18 Tháng 10 - 19 Tháng 10</p>
                                    <span className="text-muted">₫25.000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Payment Method Section */}
            <Card className="mb-4 shadow-sm border-0 payment-method">
                <Card.Body>
                    <h5 className="font-weight-bold">Phương thức thanh toán</h5>
                    <Form.Group controlId="paymentMethod">
                        <Form.Check
                            type="radio"
                            label="Thanh toán khi nhận hàng"
                            name="paymentMethod"
                            className="my-2"
                        />
                        <Form.Check
                            type="radio"
                            label="MB (x065)"
                            name="paymentMethod"
                            className="my-2"
                        />
                    </Form.Group>
                </Card.Body>
            </Card>

            {/* Total Amount */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Body>
                    {/* Order Summary Breakdown */}
                    <Row>
                        <Col md={8}>
                            <h6 className="text-muted">Tổng tiền hàng:</h6>
                        </Col>
                        <Col md={4} className="text-right">
                            <h6>₫1.330.000</h6> {/* Example total price of products */}
                        </Col>
                    </Row>

                    <Row>
                        <Col md={8}>
                            <h6 className="text-muted">Phí vận chuyển:</h6>
                        </Col>
                        <Col md={4} className="text-right">
                            <h6>₫57.200</h6> {/* Example shipping fee */}
                        </Col>
                    </Row>

                    <hr /> {/* Divider to separate the breakdown and total */}

                    {/* Total Payment */}
                    <Row>
                        <Col md={8}>
                            <h5 className="font-weight-bold">Tổng thanh toán:</h5>
                        </Col>
                        <Col md={4} className="text-right">
                            <h5 className="font-weight-bold text-primary">₫1.387.200</h5>
                        </Col>
                    </Row>

                    {/* Place Order Button on the right */}
                    <Row className="justify-content-end">
                        <Col md="auto">
                            <Button
                                variant="primary"
                                className="font-weight-bold mt-3 shadow-sm rounded-pill"
                                style={{ backgroundColor: '#ff5722', border: 'none', padding: '10px 30px' }}
                            >
                                Đặt hàng
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>


        </Container>
    );
};

export default OrderSummary;
