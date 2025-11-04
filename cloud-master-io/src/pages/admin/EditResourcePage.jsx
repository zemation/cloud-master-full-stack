// pages/admin/EditResourcePage.jsx

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
// import { useSelector, useDispatch } from 'react-redux'; ⬅️ FIX: Removed or commented out useSelector to fix unused-vars warning
import { useDispatch } from 'react-redux'; // Only dispatch is needed
import ResourceForm from '../../components/admin/ResourceForm.jsx'; 

// Import resource actions (These need to be created/completed in the resourceSlice)
// import { getResourceById, reset } from '../../features/resource/resourceSlice.js';

const EditResourcePage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Mock State for development
    const isLoading = false;
    const isError = false;
    const errorMessage = "Error fetching resource for editing."; 
    const selectedResource = { 
        _id: id, 
        title: 'Mock Resource Title', 
        url: 'http://mockurl.com', 
        provider: 'Mock Provider', 
        category: 'DevOps', 
        topic: 'Kubernetes', 
        certification: 'CKA', 
        resourceType: 'Article',
        description: 'Mock description for editing.'
    };


    useEffect(() => {
        // dispatch(getResourceById(id)); 

        if (isError) {
            alert(errorMessage); 
            navigate('/admin'); 
        }

        return () => {
            // dispatch(reset());
        };
    }, [id, dispatch, isError, navigate, errorMessage]); 
    
    // 2. Render Loading/Error States
    if (isLoading) {
        return <Spinner animation="border" role="status" className="d-block mx-auto" />;
    }

    if (isError || !selectedResource) {
        return <Alert variant="danger">Could not load resource with ID: {id}. Error: {errorMessage}</Alert>;
    }
    
    // 3. Pass fetched data to the ResourceForm
    return (
        <>
            <h1 className="mb-4">Edit Resource</h1>
            <ResourceForm resourceToEdit={selectedResource} />
        </>
    );
};

export default EditResourcePage;