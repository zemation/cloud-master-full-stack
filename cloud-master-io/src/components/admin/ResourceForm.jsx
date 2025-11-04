// src/components/admin/ResourceForm.jsx

import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { createResource, updateResource, reset } from '../../features/resource/resourceSlice.js'; 

const ResourceForm = ({ resourceToEdit }) => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isEditing = !!resourceToEdit;

    // State flag to track if the success logic has already run
    const [hasHandledSuccess, setHasHandledSuccess] = useState(false); 

    const [formData, setFormData] = useState({
        title: resourceToEdit?.title || '',
        url: resourceToEdit?.url || '',
        provider: resourceToEdit?.provider || '',
        category: resourceToEdit?.category || '',
        topic: resourceToEdit?.topic || '',
        certification: resourceToEdit?.certification || '',
        resourceType: resourceToEdit?.resourceType || 'Article',
        description: resourceToEdit?.description || '',
    });

    const { navMap, categories } = useSelector((state) => state.nav);
    const { user } = useSelector((state) => state.auth); 
    const { isSuccess, isError, message } = useSelector((state) => state.resource); 

    const resourceTypes = ['Video', 'Article', 'Book', 'Official Docs', 'Course', 'Other'];

    // CRITICAL FIX: Handle redirection with a delay to clear the alert
    useEffect(() => {
        if (isError) {
            alert(`API Error: ${message}`);
            dispatch(reset());
        }
        
        // Check if successful AND the alert hasn't been shown yet
        if (isSuccess && !hasHandledSuccess) {
            setHasHandledSuccess(true); 

            // SUCCESS PATH: No alert required. Navigate immediately.
            dispatch(reset());
            navigate('/admin');
        }

    }, [isSuccess, isError, message, navigate, dispatch, isEditing, hasHandledSuccess]); 
    // -------------------------------------------------------------

    useEffect(() => {
        // Effect to reset the Topic when the Category changes
        if (formData.category && !isEditing) {
            setFormData(prev => ({ ...prev, topic: '' }));
        }
    }, [formData.category, isEditing]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (!formData.category || !formData.topic) {
            alert('Please select a Category and Topic.');
            return;
        }

        const payload = {
            ...formData,
            certification: formData.certification || null, 
            description: formData.description || null,
        };
        
        // Reset the navigation flag upon submission so a new success can be processed
        setHasHandledSuccess(false); 

        if (isEditing) {
             dispatch(updateResource({ id: resourceToEdit._id, payload, token: user.token }));
        } else {
             dispatch(createResource({ payload, token: user.token }));
        }
    };

    return (
        <Card className="p-4">
            <Card.Title>{isEditing ? 'Edit Resource' : 'Add New Resource'}</Card.Title>
            <hr/>
            <Form onSubmit={onSubmit}>
                <Row className="mb-3">
                    {/* Category Dropdown (Driven by navMap) */}
                    <Form.Group as={Col} controlId="formGridCategory">
                        <Form.Label>Category (Required)</Form.Label>
                        <Form.Select 
                            name="category"
                            value={formData.category} 
                            onChange={onChange}
                            required
                        >
                            <option value="">Select Category...</option>
                            {/* Render Categories from the Redux state (navMap keys) */}
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* Topic Dropdown (Dependent on Category) */}
                    <Form.Group as={Col} controlId="formGridTopic">
                        <Form.Label>Topic (Required)</Form.Label>
                        <Form.Select 
                            name="topic"
                            value={formData.topic} 
                            onChange={onChange}
                            required
                            disabled={!formData.category} 
                        >
                            <option value="">Select Topic...</option>
                            {/* Conditional Rendering: Only show topics for the selected category */}
                            {formData.category && navMap[formData.category] && (
                                navMap[formData.category].map(top => (
                                    <option key={top} value={top}>{top}</option>
                                ))
                            )}
                        </Form.Select>
                    </Form.Group>
                </Row>
                
                {/* Resource Details */}
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="title" value={formData.title} onChange={onChange} required />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridUrl">
                        <Form.Label>URL</Form.Label>
                        <Form.Control type="url" name="url" value={formData.url} onChange={onChange} required />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridProvider">
                        <Form.Label>Provider</Form.Label>
                        <Form.Control type="text" name="provider" value={formData.provider} onChange={onChange} required />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCert">
                        <Form.Label>Certification Name (Optional)</Form.Label>
                        <Form.Control type="text" name="certification" value={formData.certification} onChange={onChange} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridType">
                        <Form.Label>Resource Type</Form.Label>
                        <Form.Select name="resourceType" value={formData.resourceType} onChange={onChange} required>
                            {resourceTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Row>

                <Form.Group className="mb-4" controlId="formGridDescription">
                    {/* ⬅️ FIX APPLIED HERE: Corrected the closing tag ⬅️ */}
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="description" 
                        value={formData.description} 
                        onChange={onChange} 
                    />
                </Form.Group>

                <div className="d-grid gap-2">
                    <Button variant={isEditing ? 'warning' : 'success'} type="submit">
                        {isEditing ? 'Update Resource' : 'Add Resource'}
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default ResourceForm;