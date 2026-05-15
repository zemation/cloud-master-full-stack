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

    // Final navigation handler for the static Add button
    const navigateToAddResource = () => {
        navigate('/admin/add');
    };
    
    // Final navigation handler for the dynamic Edit button
    const navigateToEditResource = (resourceId) => {
        navigate(`/admin/edit/${resourceId}`);
    };
    
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
                            <Button 
                                variant="link" 
                                onClick={navigateToAddResource} 
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
                    {/* CRITICAL FIX: The main Add Button uses the final onClick handler */}
                    <Button 
                        variant="success" 
                        className="d-flex align-items-center ms-auto" 
                        onClick={navigateToAddResource}
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
                                {/* CRITICAL FIX: Edit Button uses direct onClick handler */}
                                <Button 
                                    variant="info" 
                                    className="btn-sm me-2"
                                    onClick={() => navigateToEditResource(resource._id)}
                                >
                                    <FaEdit />
                                </Button>
                                
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