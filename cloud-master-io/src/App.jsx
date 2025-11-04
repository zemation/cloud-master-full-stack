// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap'; 

// Core Layout Components
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';

// Public Pages
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Authentication Pages
import LoginPage from './pages/LoginPage.jsx';

// Admin Pages (Protected)
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AddResourcePage from './pages/admin/AddResourcePage.jsx';
import EditResourcePage from './pages/admin/EditResourcePage.jsx';

// Routing Protection Component
import PrivateRoute from './components/routing/PrivateRoute.jsx'; 

function App() {
  return (
    <Router>
      {/* This wrapper implements the Sticky Footer pattern */}
      <div className="d-flex flex-column min-vh-100">
        <Header />
        
        {/* Main content uses flex-grow-1 to expand and push the footer down */}
        <Container className="my-5 flex-grow-1"> 
          <Routes>
            {/* === PUBLIC ROUTES === */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* === PROTECTED ADMIN ROUTES === */}
            <Route path="/admin" element={<PrivateRoute />}>
              <Route index element={<AdminDashboard />} /> 
              <Route path="add" element={<AddResourcePage />} /> 
              <Route path="edit/:id" element={<EditResourcePage />} />
            </Route>

            {/* === FALLBACK ROUTE === */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Container>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;