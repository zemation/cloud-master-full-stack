// src/components/layout/Footer.jsx

import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white p-3 mt-5">
      <Container className="text-center">
        &copy; {new Date().getFullYear()} Cloud-Master-IO
      </Container>
    </footer>
  );
};

export default Footer;