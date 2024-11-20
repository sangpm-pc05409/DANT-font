import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const API_ORDER_URL = '/order';
const API_CART_ORDER_URL = '/order/getOrder';

const API_ADD_CART_TO_ORDER_URL = '/order/create-bills-client';

const API_BILL_URL = '/billclient/showBillCli';

const API_SHOW_DETAILBILL_URL = '/billclient/showDetailBill';

const API_CANCEL_BILL_URL = '/billclient/cancel_bill';

const API_PAYMENT_URL = '/order/payment';
const API_SET_ORDER_PAID_URL = '/order/updateBillAsPaid';
export const getAllOders = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};
// Tạo instance axios
const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Thêm interceptor để tự động thêm JWT vào các yêu cầu
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }else{
            window.location = "/error";
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// LẤY LIST CART TỪ LOCAL STORE ĐỂ THÊM TẠO BILL
export const getOrderFromCart = async (ids) => {
    const response = await axiosInstance.get(`${API_CART_ORDER_URL}?ids=${encodeURIComponent(ids)}`).catch(function (error) {
        window.location = "/error";
      });;
    return response.data;
};
//PAYMENT
export const payment = async (amount) => {
     const response = await axiosInstance.get(`${API_PAYMENT_URL}/${amount}`).catch(function (error) {
        window.location = "/error";
      });;
    return response.data;
}
//SET BILL AS PAID
export const setBillAsPaid = async (id) => {
    const response = await axiosInstance.put(`${API_SET_ORDER_PAID_URL}/${id}`).catch(function (error) {
        window.location = "/error";
      });;
   return response.data;
}
// ADD CART TO BILL
export const addCartToBill = async (acc_id, carts, point) => {
    const response = await axiosInstance.post(`${API_ADD_CART_TO_ORDER_URL}/${acc_id}/${point}`, carts).catch(function (error) {
        window.location = "/error";
      });;
    return response.data;
};
//SHOW BILL
export const showBill = async (username) => {
    const response = await axiosInstance.get(`${API_BILL_URL}/${username}`).catch(function (error) {
        window.location = "/error";
      });;
    return response.data;
};

//SHOW DETAIL BILL
export const showDetailBill = async ( id) => {
    const response = await axiosInstance.get(`${API_SHOW_DETAILBILL_URL}/${id}`).catch(function (error) {
        window.location = "/error";
      });;
    return response.data;
};

//CANCEL BILL
export const cancelBill = async (id) => {
    const response = await axiosInstance.put(`${API_CANCEL_BILL_URL}/${id}`).catch(function (error) {
        window.location = "/error";
      });;
    return response.data;
};
export const getOderById = async (id) => {
    const response = await axiosInstance.get(`${API_ORDER_URL}/${id}`).catch(function (error) {
        window.location = "/error";
      });;
    return response.data;
};

export const createOder = async (student) => {
    const response = await axiosInstance.post(API_ORDER_URL, student).catch(function (error) {
        window.location = "/error";
      });;
    return response.data;
};

export const updateOder = async (id, student) => {
    const response = await axiosInstance.put(`${API_ORDER_URL}/${id}`, student).catch(function (error) {
        window.location = "/error";
      });;
    return response.data;
};

export const deleteOder = async (id) => {
    await axiosInstance.delete(`${API_ORDER_URL}/${id}`).catch(function (error) {
        window.location = "/error";
      });;
};