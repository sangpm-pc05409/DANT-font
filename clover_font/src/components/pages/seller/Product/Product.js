import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import productService from "../api/productApi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState(""); // "add" hoặc "edit"
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProductsBySeller();
        setProducts(data);
      } catch (error) {
        setError("Không thể tải danh sách sản phẩm.");
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const deleteProductHandler = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xoá sản phẩm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter((product) => product.id !== id));
        Swal.fire("Đã xóa!", "Sản phẩm đã được xóa.", "success");
      } catch (error) {
        setError("Không thể xóa sản phẩm.");
        console.error("Error deleting product:", error);
        Swal.fire("Lỗi", "Không thể xóa sản phẩm.", "error");
      }
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setFormType("add");
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormType("edit");
    setShowForm(true);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex">
      <div style={{ marginLeft: "140px", width: "calc(100% - 250px)" }} className="p-4">
        <h2 className="mb-4 text-center">Danh sách sản phẩm</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row mb-3">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên sản phẩm để tìm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-4 text-end">
            <button className="btn btn-primary" onClick={handleAddProduct}>
              <i className="bi bi-plus-circle me-2"></i>Thêm sản phẩm
            </button>
          </div>
        </div>

        {showForm ? (
          <ProductForm
            formType={formType}
            product={selectedProduct}
            onClose={() => setShowForm(false)}
            onRefresh={setProducts}
          />
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Tên sản phẩm</th>
                  <th scope="col">Giá</th>
                  <th scope="col">Số lượng</th>
                  <th scope="col">Mô tả</th>
                  <th scope="col" className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>{product.quantity}</td>
                      <td>{product.description}</td>
                      <td className="text-center">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="btn btn-sm btn-warning me-2"
                        >
                          <i className="bi bi-pencil"></i> Sửa
                        </button>
                        <button
                          onClick={() => deleteProductHandler(product.id)}
                          className="btn btn-sm btn-danger"
                        >
                          <i className="bi bi-trash"></i> Xoá
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Không tìm thấy sản phẩm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
 function ProductForm({ formType, product, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    images: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
        images: [],
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const formToSubmit = new FormData();
    formToSubmit.append("name", formData.name);
    formToSubmit.append("price", formData.price);
    formToSubmit.append("quantity", formData.quantity);
    formToSubmit.append("description", formData.description);

    formData.images.forEach((image) => formToSubmit.append("file", image));

    try {
      let response;
      if (formType === "add") {
        response = await productService.createProduct(formToSubmit);
      } else {
        response = await productService.updateProduct(product.id, formToSubmit);
      }

      onRefresh((prev) =>
        formType === "add"
          ? [response, ...prev]
          : prev.map((item) => (item.id === response.id ? response : item))
      );

      onClose();
    } catch (error) {
      setError("Lỗi trong quá trình gửi dữ liệu. Vui lòng thử lại!");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {formType === "add" ? "Thêm Sản Phẩm" : "Cập Nhật Sản Phẩm"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="form-group">
                <label>Tên sản phẩm</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Giá</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Số lượng</label>
                <input
                  type="number"
                  className="form-control"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Hình ảnh</label>
                <input
                  type="file"
                  className="form-control"
                  name="file"
                  onChange={handleImageChange}
                  multiple
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}