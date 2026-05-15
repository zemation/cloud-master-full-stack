// pages/NotFoundPage.jsx

import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <Container className="mt-5 text-center">
      <Alert variant="danger">
        <FaExclamationTriangle size={50} className="mb-3" />
        <h1 className="display-4">404 - Page Not Found</h1>
        <p className="lead">
          The resource you were looking for doesn't exist.
        </p>
        <hr />
        <p className="mb-0">
          It looks like you might have followed a bad link or typed a wrong URL.
        </p>
      </Alert>
      <Link to="/">
        <Button variant="primary" className="mt-3">
          Go to Home Page
        </Button>
      </Link>
    </Container>
  );
};

export default NotFoundPage;