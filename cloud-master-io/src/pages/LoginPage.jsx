// src/pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// CRITICAL FIX: Explicitly include the .js extension
import { login, reset } from '../features/auth/authSlice.js'; 

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // WARNING FIX: Removed 'isSuccess' from the destructuring since it was unused.
    const { user, isLoading, isError, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        // Redirect if logged in (user exists)
        if (user) {
            navigate('/admin');
        }

        // Display error message and reset state flags after displaying
        if (isError) {
            alert(`Error: ${message}`);
        }

        dispatch(reset());
    }, [user, isError, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const userData = {
            email,
            password,
        };

        // Dispatch the async login thunk
        dispatch(login(userData));
    };

    // Optional: Render a spinner while logging in
    if (isLoading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className='d-flex justify-content-center'>
            <Card style={{ width: '25rem' }}>
                <Card.Body>
                    <Card.Title className='text-center mb-4'>
                        <FaSignInAlt className='me-2' /> Admin Login
                    </Card.Title>
                    
                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3" controlId='email'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control 
                                type='email'
                                name='email'
                                value={email}
                                placeholder='Enter admin email'
                                onChange={onChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type='password'
                                name='password'
                                value={password}
                                placeholder='Enter password'
                                onChange={onChange}
                                required
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button variant='primary' type='submit'>
                                Login
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default LoginPage;