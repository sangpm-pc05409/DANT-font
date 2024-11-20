import React, { useState, useEffect } from 'react';
import { getAccountByUsername, postCheckPoint } from "../services/account_service";
import { getOrderFromCart, addCartToBill, payment, setBillAsPaid } from "../services/order_servide";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const Order = () => {
    const navigate = useNavigate();
    const ids = localStorage.getItem("ids");
    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    const [accounts, setAccounts] = useState([]);
    const [cartPay, setCartPay] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [inputValue, setInputValue] = useState(0);
    const [usePoint, setUsePoint] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [payMent, setPayMent] = useState(0);

    useEffect(() => {
        if (!ids) {
            navigate("/");
            return;
        }
    
        const parsedIds = JSON.parse(ids); // Chuyển đổi chuỗi JSON thành mảng
        const fetchUserData = async () => {
            try {
                // Lấy thông tin tài khoản từ API thông qua token
                const userData = await getAccountByUsername(token);
                setAccounts(userData); // Lưu thông tin tài khoản vào state
    
                const cart = await getOrderFromCart(parsedIds);
                setCartPay(cart);
    
                const total = cart.reduce((sum, item) => sum + (item.products[0].price * item.quantity), 0);
                setTotalPrice(total);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };
    
        fetchUserData();
    }, [token, ids, navigate]);

    useEffect(() => {
        const handlePaymentResponse = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('vnp_ResponseCode') && urlParams.get('vnp_ResponseCode') === '00' && localStorage.getItem('IdPayment')) {
                try {
                    await setBillAsPaid(localStorage.getItem('IdPayment'));
                    toast.success("Thanh toán hóa đơn thành công!");
                    localStorage.removeItem('IdPayment');
                    navigate("/bills");
                } catch (error) {
                    toast.error("Xử lý hóa đơn thất bại!");
                }
            }
        };

        handlePaymentResponse();
    }, [cartPay, inputValue, token]);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleInputChange = (event) => setInputValue(event.target.value);

    const handleInput = async (event) => {
        event.preventDefault();

        try {
            const check = await postCheckPoint(inputValue, token); // Dùng token làm parameter
            if (!check) {
                toast.error("Số điểm có giá trị tối đa 10% số điểm bạn có!");
            } else {
                const discountAmount = inputValue * 100;
                setTotalPrice(prevPrice => prevPrice - discountAmount);
                toggleVisibility();
                setUsePoint(true);
            }
        } catch (error) {
            console.error("Error applying points:", error);
        }
    };

    const handlePayment = async (event) => {
        event.preventDefault();

        try {
            if (parseInt(payMent) === 0) {
                await addCartToBill(token, cartPay, inputValue); // Dùng token
                toast.success("Tạo Hóa đơn thành công!");
                navigate('/bills');
            } else if (parseInt(payMent) === 1) {
                const response = await payment(totalPrice);
                if (response && response.url) {
                    await addCartToBill(token, cartPay, inputValue); // Dùng token
                    localStorage.setItem('IdPayment', response);
                    toast.success("Tạo Hóa đơn thành công!");
                    window.location.href = response.url;
                }
            }
        } catch (error) {
            toast.error("Tạo Hóa đơn thất bại!");
        }
    };

    return (
        <div className="App">
            <div className="container-fluid py-5">
                <div className="container py-5">
                    <h1 className="mb-4">Chi tiết thanh toán</h1>
                    <form noValidate>
                        <div className="row g-5">
                            <div className="col-lg-6">
                                <div className="table-responsive">
                                    <table className="table text-center">
                                        <thead>
                                            <tr>
                                                <th>Sản phẩm</th>
                                                <th>Tên sản phẩm</th>
                                                <th>Giá</th>
                                                <th>Số lượng</th>
                                                <th>Tổng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartPay.map(p => (
                                                <tr key={p.id}>
                                                    <td><img className="img-fluid" src={"../image/" + p?.prod[0]?.productImages[0]?.name} alt="" style={{ width: '90px', height: '90px' }} /></td>
                                                    <td>{p.prod[0].name}</td>
                                                    <td>{p.prod[0]?.price?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</td>
                                                    <td>{p.quantity}</td>
                                                    <td>{(p.prod[0].price * p.quantity)?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="2">Phương thức thanh toán:</td>
                                                <td colSpan="3">
                                                    <select name="selectedPayment" className="form-control" onChange={(e) => setPayMent(e.target.value)}>
                                                        <option value="0">Thanh toán khi nhận hàng</option>
                                                        <option value="1">Thanh toán qua VNpay</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2">Tổng:</td>
                                                <td colSpan="3"><strong>{totalPrice?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <button onClick={handlePayment} className="btn btn-primary w-100">Đặt hàng</button>
                                <Toaster />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Order;
