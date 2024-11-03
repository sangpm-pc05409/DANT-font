import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ProductGallery.css'; // Import CSS for additional styles

// Component ProductCard to display each product
const ProductCard = ({ id, title, price, location, imageUrl }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${id}`);  // Navigate to the route with the ID
  };

  return (
    <Col>
      <Card
        className="h-100 product-card shadow-sm"
        style={{ cursor: 'pointer' }}
        onClick={handleCardClick}
      >
        <div className="card-img-container">
          <Card.Img
            variant="top"
            src={imageUrl || "https://via.placeholder.com/150"}
            className="card-img"
          />
        </div>
        <Card.Body className="text-dark border-5">
          <Card.Text className="fw-bold">{title}</Card.Text>
          <Card.Title>
            <Badge className="me-2 fw-bold bg-danger">
              {price} đ
            </Badge>
          </Card.Title>
        </Card.Body>
      </Card>
    </Col>
  );
};

// Component ProductGallery to display the list of products
const ProductGallery = () => {
  const [products, setProducts] = useState([]); // State for products
  const [loading, setLoading] = useState(true); // State for loading status
  const token = localStorage.getItem('token');
  useEffect(() => {
    // Fetch data from the API
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user/shopping/product', {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers if required
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // If the response is not OK, throw an error
          const errorMessage = await response.text(); // Get error message from response
          throw new Error(errorMessage || 'Không thể tải dữ liệu từ máy chủ'); // Error handling
        }

        const data = await response.json();
        setProducts(data); // Set products from API
        setLoading(false); // End loading
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts(); // Call fetch on component mount
  }, [token]); // Include token as dependency to re-fetch if it changes

  // Loading state
  if (loading) {
    return <h2 className="loading-message">Đang tải dữ liệu...</h2>;
  }

  // Error handling


  // Sort products by price from high to low
  const sortedProducts = [...products].sort((a, b) => b.price - a.price);
  const topProducts = sortedProducts.slice(0, 4); // Get top 4 highest priced products

  return (
    <Container className="mt-4 product-gallery">
      {/* Display section for selected products */}
      <h4 className="text-dark mb-4">Lựa chọn hôm nay</h4>
      <Row xs={1} sm={2} md={4} className="g-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.name}
            price={product.price}
            location={`${product.shop.city}, ${product.shop.province}`}
            imageUrl={`http://localhost:8080/images/${product.prodImages[0]?.name}`}
          />
        ))}
      </Row>

      {/* Display section for highest priced products */}
      <h4 className="text-dark mt-5 mb-4">Sản phẩm giá cao nhất</h4>
      <Row xs={1} sm={2} md={4} className="g-4">
        {topProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.name}
            price={product.price}
            location={`${product.shop.city}, ${product.shop.province}`}
            imageUrl={`http://localhost:8080/images/${product.prodImages[0]?.name}`}
          />
        ))}
      </Row>
    </Container>
  );
};

export default ProductGallery;
