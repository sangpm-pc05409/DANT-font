import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ProductGallery.css';

// Component ProductCard to display each product
const ProductCard = ({ id, title, price, location, imageUrl }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/user/product/${id}`);  // Updated path for correct navigation
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user/shopping/product', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || 'Cannot load data from server');
        }

        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  if (loading) {
    return <h2 className="loading-message">Loading data...</h2>;
  }

  const sortedProducts = [...products].sort((a, b) => b.price - a.price);
  const topProducts = sortedProducts.slice(0, 4);

  return (
    <Container className="mt-4 product-gallery">
      <h4 className="text-dark mb-4">Gợi ý hôm nay</h4>
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

      <h4 className="text-dark mt-5 mb-4">Những sản phẩm có giá trị giảm dần</h4>
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
