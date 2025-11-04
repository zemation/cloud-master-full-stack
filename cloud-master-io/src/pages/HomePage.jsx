// src/pages/HomePage.jsx

import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Spinner, Alert, Card, ListGroup, Row, Col, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
// ⬅️ CRITICAL FIX: FaUserShield icon added to the import list ⬅️
import { FaExternalLinkAlt, FaBook, FaVideo, FaFileAlt, FaCertificate, FaToolbox, FaGlobe, FaUserShield } from 'react-icons/fa'; 

// Import resource actions (These need to be created/completed in the resourceSlice)
import { getResources, reset } from '../features/resource/resourceSlice.js';

const HomePage = () => {
    // 1. Get query parameters from the URL (?category=X&topic=Y)
    const [searchParams] = useSearchParams();
    const currentCategory = searchParams.get('category');
    const currentTopic = searchParams.get('topic');
    const isCertificationView = searchParams.get('certification') === 'true';

    const dispatch = useDispatch();
    
    // Access the actual resource state
    const { resources, isLoading, isError, message } = useSelector(state => state.resource); 

    // Helper function to render the correct icon based on resource type
    const getTypeIcon = (type) => {
        switch (type) {
            case 'Video': return <FaVideo className="me-2 text-danger" />;
            case 'Article': return <FaFileAlt className="me-2 text-primary" />;
            case 'Book': return <FaBook className="me-2 text-success" />;
            case 'Official Docs': return <FaGlobe className="me-2 text-info" />;
            case 'Course': return <FaCertificate className="me-2 text-warning" />;
            default: return <FaToolbox className="me-2 text-secondary" />; // Default icon
        }
    };

    // 2. useEffect to fetch filtered data
    useEffect(() => {
        // Fetch logic runs immediately on load (when currentCategory is null) OR when a filter changes.
        
        // Build query object based on current URL parameters
        const query = { 
            ...(currentCategory && { category: currentCategory }),
            ...(currentTopic && { topic: currentTopic }),
            ...(isCertificationView && { certification: 'true' }),
        };
            
        dispatch(getResources(query)); 

        if (isError) {
            console.error(message);
        }

        return () => {
            dispatch(reset());
        };
    }, [currentCategory, currentTopic, isCertificationView, isError, message, dispatch]);
    
    // --- Content Filtering and Rendering ---

    if (isLoading) {
        return <Spinner animation="border" role="status" className="d-block mx-auto" />;
    }

    // Determine which resources to display (applies client-side filtering logic to the fetched data)
    const filteredResources = (resources || []).filter(res => 
        // If currentCategory is null, the filter returns all resources, otherwise it filters by param
        (!currentCategory || res.category === currentCategory) && 
        (!currentTopic || res.topic === currentTopic) &&
        (!isCertificationView || !!res.certification)
    );

    // Filter resources into general learning and certification categories
    const regularResources = filteredResources.filter(res => !res.certification);
    const certificationResources = filteredResources.filter(res => !!res.certification);
    
    const showRegular = regularResources.length > 0;
    const showCerts = certificationResources.length > 0;

    return (
        <>
            <h1>{currentCategory || 'All'} Resources</h1>
            <h2>{currentTopic || (isCertificationView ? 'All Certifications' : 'Featured')}</h2>
            <hr />

            {/* Alert if no category is selected and no data is available */}
            {!currentCategory && filteredResources.length === 0 && (
                <Alert variant="info" className="text-center">Please select a Category and Topic from the navigation bar to begin exploring resources.</Alert>
            )}

            {/* 1. Regular Resources */}
            {showRegular && (
                <section className="mb-5">
                    <h3>General Learning Resources</h3>
                    <Row xs={1} md={2} className="g-4">
                        {regularResources.map((resource) => (
                            <Col key={resource._id}>
                                <Card className="h-100">
                                    <Card.Body>
                                        {/* UX Enhancement: Title and Type */}
                                        <Card.Title className="fs-5">{getTypeIcon(resource.resourceType)}{resource.title}</Card.Title>
                                        
                                        {/* ⬅️ UX Enhancement: Provider and Type Display (Uses FaUserShield) ⬅️ */}
                                        <Card.Subtitle className="mb-2 text-muted small">
                                            {resource.resourceType} from <FaUserShield className='me-1' /> **{resource.provider}**
                                        </Card.Subtitle>
                                        
                                        {/* UX Enhancement: Description Display */}
                                        <Card.Text className="mt-3">
                                            {resource.description}
                                        </Card.Text>
                                        
                                        <Button variant="primary" href={resource.url} target="_blank" rel="noopener noreferrer">
                                            View Resource <FaExternalLinkAlt />
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>
            )}

            {/* 2. Certification Resources (Conditional Section) */}
            {showCerts && (
                <section>
                    <h3 className="mt-5">
                        <FaCertificate className="me-2 text-warning" /> 
                        {isCertificationView ? 'Filtered Certifications' : 'Certifications & Prep Materials'}
                    </h3>
                    <ListGroup>
                        {certificationResources.map((resource) => (
                            <ListGroup.Item key={resource._id} action href={resource.url} target="_blank">
                                <Row className="align-items-center">
                                    <Col xs={12} md={4}>
                                        <Badge bg="warning" text="dark" className="me-2">
                                            {resource.certification}
                                        </Badge>
                                    </Col>
                                    <Col xs={12} md={8}>
                                        {/* UX Enhancement: Display provider in the list item */}
                                        {resource.title} — Provided by **{resource.provider}**
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </section>
            )}

            {/* Alert if filtering returned no results */}
            {filteredResources.length === 0 && (
                <Alert variant="warning" className="mt-4">No resources found for the selected filter criteria.</Alert>
            )}
        </>
    );
};

export default HomePage;