import axios from "axios";

const API_URL = "http://localhost:8080/api/sell/product";

// Tạo axios instance để sử dụng baseURL và cấu hình chung
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Thêm JWT vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("Token in request:", token); // Log để kiểm tra token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API Services
const productService = {
  // Lấy tất cả sản phẩm
  getAllProducts: async () => {
    const response = await axiosInstance.get("");
    return response.data;
  },

  // Lấy sản phẩm theo người bán
  getProductsBySeller: async () => {
    const response = await axiosInstance.get("/getProductBySeller");
    return response.data;
  },

  // Thêm sản phẩm mới
  createProduct: async (productData) => {
    const formData = new FormData();

    // Thêm các thông tin sản phẩm vào FormData
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    // Kiểm tra và thêm ảnh vào FormData nếu có
    if (productData.images && Array.isArray(productData.images)) {
      productData.images.forEach((image) => {
        formData.append("file", image);  // Đảm bảo rằng bạn đang truyền đúng tên key 'file' như API yêu cầu
      });
    }

    try {
      const response = await axiosInstance.post("/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },  // Đặt header Content-Type đúng
      });
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error; // Hoặc xử lý lỗi theo cách bạn muốn
    }
  },

  // Cập nhật sản phẩm
  updateProduct: async (productData, files) => {
    const formData = new FormData();

    // Thêm dữ liệu sản phẩm vào FormData
    Object.keys(productData).forEach((key) => formData.append(key, productData[key]));

    // Thêm hình ảnh vào FormData nếu có
    if (files && files.length) {
      files.forEach((file) => formData.append("file", file));
    }

    const response = await axiosInstance.put("/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Xóa sản phẩm
  deleteProduct: async (id) => {
    const response = await axiosInstance.delete("/delete", { params: { id } });
    return response.data;
  },
};

export default productService;
