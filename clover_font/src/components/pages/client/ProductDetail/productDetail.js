import React, { useState, useEffect } from "react";
import { Container, Row, Col, Badge, Card, Button } from "react-bootstrap";
import { FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS

const ProductDetail = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]); // State to hold related products
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // Fetch product details
        const response = await fetch(`http://localhost:8080/api/user/shopping/product/getProductById?id=${id}`);
        const data = await response.json();
        setProduct(data);

        // Fetch list of all products
        const relatedResponse = await fetch(`http://localhost:8080/api/user/shopping/product`);
        const relatedData = await relatedResponse.json();

        // Filter out the current product and shuffle the remaining products
        const filteredRelatedProducts = relatedData
          .filter((relatedProduct) => relatedProduct.id !== data.id) // Exclude the clicked product
          .sort(() => 0.5 - Math.random()) // Shuffle the products
          .slice(0, 4); // Get the first 4 products

        setRelatedProducts(filteredRelatedProducts); // Save related products in state

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <p>Đang tải chi tiết sản phẩm...</p>;
  }

  if (!product) {
    return <p>Không tìm thấy sản phẩm</p>;
  }

  // Destructure product and shop information
  const { name, price = 0, description, ratings = 0, reviews = 0, prodImages, shop } = product;
  const imageUrl = prodImages && prodImages[0] ? `http://localhost:8080/images/${prodImages[0].name}` : "https://via.placeholder.com/150";

  // Get shop information
  const shopInfo = shop
    ? {
      name: shop.name,
      address: `${shop.streetnameNumber}, ${shop.wards}, ${shop.district}`,
      city: `${shop.city}`,
      province: `${shop.province}`,
      nation: `${shop.nation}`
    }
    : null;

  // Handle add to cart
  // Handle add to cart
  // Handle add to cart
  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage

      if (!token) {
        toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
        return;
      }

      // Create a FormData object
      const formData = new FormData();
      formData.append("productId", id);
      formData.append("quantity", 1); // Assuming a default quantity of 1
      formData.append("cartProID", `cart-${id}`); // Example cartProID format

      const response = await fetch(`http://localhost:8080/api/user/shopping/product/addToCart`, {
        method: 'POST',
        body: formData, // Pass the FormData object as the request body
      });

      if (response.ok) {
        toast.success("Sản phẩm đã được thêm vào giỏ hàng!"); // Show success notification
      } else {
        toast.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
    }
  };



  return (
    <Container className="mt-5">
      {/* Toast notification container */}
      <ToastContainer />

      <Row>
        {/* Product image section */}
        <Col md={5}>
          <img
            src={imageUrl}
            alt={name}
            className="img-fluid rounded"
          />
        </Col>

        {/* Product details section */}
        <Col md={7}>
          <h2 className="mb-3">{name}</h2>

          {/* Product ratings */}
          <div className="mb-3">
            {Array(ratings).fill().map((_, i) => (
              <FaStar key={i} color="#FFD700" />
            ))}
            <Badge bg="secondary" className="ms-2">{reviews} Đánh giá</Badge>
          </div>

          {/* Product price */}
          <h3 className="text-danger mb-3">{price.toLocaleString()} VNĐ</h3>

          {/* Product description */}
          <p className="mb-4">
            <h5>Mô tả sản phẩm: </h5>
            {description}
          </p>

          {/* User actions */}
          <div className="d-flex">
            <Button variant="danger" className="me-3">
              Mua Ngay
            </Button>
            <Button variant="warning" className="me-3" onClick={handleAddToCart}>
              <FaShoppingCart /> Thêm vào giỏ hàng
            </Button>
            <Button variant="outline-secondary">
              <FaHeart /> Thêm vào yêu thích
            </Button>
          </div>
        </Col>
      </Row>

      {/* Shop information */}
      {shopInfo && (
        <Row className="mt-4 bg-light p-3 rounded">
          <Col md={12}>
            <h5 className="mb-3">Thông tin cửa hàng</h5>
            <p><strong>Tên cửa hàng:</strong> {shopInfo.name}</p>
            <p><strong>Địa chỉ:</strong> {shopInfo.address}</p>
            <p><strong>Thành phố:</strong> {shopInfo.city}</p>
            <p><strong>Tỉnh/Thành phố:</strong> {shopInfo.province}</p>
            <p><strong>Quốc gia:</strong> {shopInfo.nation}</p>
          </Col>
        </Row>
      )}

      {/* Display related products */}
      <Row className="mt-5 ">
        <Col md={12}>
          <h4 className="mb-3">Sản phẩm khác</h4>
        </Col>
        {relatedProducts.length > 0 ? (
          relatedProducts.map((relatedProduct) => (
            <Col md={3} key={relatedProduct.id} className="mb-4">
              <Card onClick={() => navigate(`/product/${relatedProduct.id}`)} style={{ cursor: 'pointer' }}>
                <Card.Img
                  variant="top"
                  src={relatedProduct.prodImages && relatedProduct.prodImages[0]
                    ? `http://localhost:8080/images/${relatedProduct.prodImages[0].name}`
                    : "https://via.placeholder.com/150"}
                />
                <Card.Body>
                  <Card.Title>{relatedProduct.name}</Card.Title>
                  <Card.Text>₫{relatedProduct.price.toLocaleString()}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>Không có sản phẩm nào để hiển thị</p>
        )}
      </Row>
    </Container>
  );
};

export default ProductDetail;
