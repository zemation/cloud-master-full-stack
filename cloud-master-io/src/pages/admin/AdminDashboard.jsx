// pages/admin/AdminDashboard.jsx

import React, { useEffect } from 'react';
import { Table, Button, Spinner, Row, Col, Alert } from 'react-bootstrap'; 
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { getResources } from '../../features/resource/resourceSlice.js'; 

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    
    const { user } = useSelector(state => state.auth);
    const { resources, isLoading, isError, message } = useSelector(state => state.resource);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        
        if (isError) {
            console.error(message);
        }

        if (user) { 
            dispatch(getResources(user)); 
        }
        
        return () => {}; 
    }, [user, navigate, isError, message, dispatch]); 

    const onDeleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            console.log(`Resource ${id} deletion dispatched.`);
        }
    };
    
    if (isLoading) {
        return <Spinner animation="border" role="status" className="d-block mx-auto" />;
    }

    if (resources.length === 0) {
        return (
            <div style={{ paddingTop: '10px' }}>
                <Row className="mt-5">
                    <Col className="text-center">
                        <Alert variant="info">
                            No resources found in the database. <br /> 
                            {/* FINAL FIX ATTEMPT 1: Direct Button onClick */}
                            <Button 
                                variant="link" 
                                onClick={() => navigate('/admin/add')} // Direct navigate call
                                style={{ padding: '0', verticalAlign: 'baseline' }}
                            >
                                Click here to add the first resource.
                            </Button>
                        </Alert>
                    </Col>
                </Row>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '10px' }}>
            <Row className="align-items-center mb-4">
                <Col>
                    <h1>Resource Management Dashboard</h1>
                </Col>
                <Col className="text-end">
                    {/* FINAL FIX ATTEMPT 2: Direct Button onClick for main button */}
                    <Button 
                        variant="success" 
                        className="d-flex align-items-center ms-auto" 
                        onClick={() => navigate('/admin/add')} // Direct navigate call
                    >
                        <FaPlus className="me-2" /> Add New Resource
                    </Button>
                </Col>
            </Row>
            
            <Table striped bordered hover responsive className="table-sm">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Topic</th>
                        <th>Provider</th>
                        <th>Date Added</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {resources.map((resource) => (
                        <tr key={resource._id}>
                            <td>{resource.title}</td>
                            <td>{resource.category}</td>
                            <td>{resource.topic}</td>
                            <td>{resource.provider}</td>
                            <td>{new Date(resource.createdAt).toLocaleDateString()}</td>
                            <td>
                                {/* Edit Button */}
                                <LinkContainer to={`/admin/edit/${resource._id}`}>
                                    <Button variant="info" className="btn-sm me-2">
                                        <FaEdit />
                                    </Button>
                                </LinkContainer>
                                
                                {/* Delete Button */}
                                <Button 
                                    variant="danger" 
                                    className="btn-sm" 
                                    onClick={() => onDeleteHandler(resource._id)}
                                >
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default AdminDashboard;