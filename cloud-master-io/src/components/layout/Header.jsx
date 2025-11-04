// src/components/layout/Header.jsx

import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'; 
import { useSelector, useDispatch } from 'react-redux';
import { FaSignInAlt, FaSignOutAlt, FaUserShield, FaCloud } from 'react-icons/fa'; 

import { logout, reset } from '../../features/auth/authSlice.js'; 

const Header = () => {
    const dispatch = useDispatch();
    
    const navState = useSelector((state) => state.nav) || {};
    const { navMap = {}, categories = [] } = navState;
    
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
            <Container>
                {/* Brand Link: Now includes the Cloud Icon */}
                <LinkContainer to="/">
                    <Navbar.Brand>
                        <FaCloud className='me-2' />Cloud-Master-IO
                    </Navbar.Brand>
                </LinkContainer>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* 1. Dynamic Category Dropdown Links */}
                        {categories.map((category, index) => (
                            <NavDropdown 
                                title={category} 
                                id={`nav-dropdown-${index}`}
                                key={category}
                                
                                // ⬅️ CRITICAL FIX: Use menuVariant="dark" to force dark dropdown styling ⬅️
                                menuVariant="dark" 
                            >
                                {/* Map the Topics within the selected Category */}
                                {navMap[category] && navMap[category].map((topic) => (
                                    <LinkContainer 
                                        to={{
                                            pathname: '/',
                                            search: `?category=${category}&topic=${topic}`
                                        }}
                                        key={topic}
                                    >
                                        <NavDropdown.Item>{topic}</NavDropdown.Item>
                                    </LinkContainer>
                                ))}
                                
                                {/* 2. Divider and Certifications Link (Always last) */}
                                <NavDropdown.Divider />
                                <LinkContainer to={{
                                    pathname: '/',
                                    search: `?category=${category}&certification=true`
                                }}>
                                    <NavDropdown.Item>Certifications</NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
                        ))}
                    </Nav>

                    {/* 3. Admin/Auth Links (Aligned right) */}
                    <Nav>
                        {user ? (
                            <>
                                <LinkContainer to="/admin">
                                    <Nav.Link>
                                        <FaUserShield className='me-1' /> Admin
                                    </Nav.Link>
                                </LinkContainer>
                                
                                <Button variant="danger" onClick={onLogout}>
                                    <FaSignOutAlt className='me-1' /> Logout
                                </Button>
                            </>
                        ) : (
                            <LinkContainer to="/login">
                                <Nav.Link>
                                    <FaSignInAlt className='me-1' /> Login
                                </Nav.Link>
                            </LinkContainer>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;