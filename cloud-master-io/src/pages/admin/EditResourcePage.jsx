// src/pages/admin/EditResourcePage.jsx

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import ResourceForm from '../../components/admin/ResourceForm.jsx'; 

// CRITICAL IMPORTS
import { getResourceById, reset } from '../../features/resource/resourceSlice.js';

const EditResourcePage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Access the Redux state for the selected resource and status
    const { selectedResource, isLoading, isError, message } = useSelector(state => state.resource);
    const { user } = useSelector((state) => state.auth); 
    
    // Check if the user is logged in before allowing fetch
    const token = user?.token;

    useEffect(() => {
        // 1. Authentication Check
        if (!user) {
            navigate('/login');
            return;
        }

        // 2. Error/Redirect Check
        if (isError) {
            alert(`Error: ${message}`);
            navigate('/admin'); 
            return;
        }
        
        // 3. Data Fetch Logic: Only run fetch if ID exists AND data hasn't been loaded
        // We compare the ID from the URL with the ID of the resource currently in state.
        if (id && token && (!selectedResource || selectedResource._id !== id)) { 
            // Pass the ID AND the token to the thunk 
            dispatch(getResourceById({ id, token })); 
        }
        
        // Cleanup: Clear resource state when leaving the page 
        return () => {
            dispatch(reset()); 
        };
    }, [id, token, isError, message, navigate, dispatch, selectedResource, user]); 
    
    // 4. Render Loading/Error States
    if (isLoading) {
        return <Spinner animation="border" role="status" className="d-block mx-auto" />;
    }

    // 5. Render Error if fetch failed or selectedResource is not yet populated
    if (isError || !selectedResource) {
        return <Alert variant="danger" className="mt-5">Could not load resource with ID: {id}. Error: {message || 'Resource not found.'}</Alert>;
    }
    
    // 6. Render Form
    return (
        <>
            <h1 className="mb-4">Edit Resource: {selectedResource.title}</h1>
            <ResourceForm resourceToEdit={selectedResource} /> 
        </>
    );
};

export default EditResourcePage;