// pages/admin/AddResourcePage.jsx

import React, { useEffect } from 'react';
// ⬅️ FIX: Removed 'useNavigate' import and initialization ⬅️
import { useSelector, useDispatch } from 'react-redux';
import { Alert } from 'react-bootstrap'; 
import ResourceForm from '../../components/admin/ResourceForm.jsx'; 

import { reset } from '../../features/resource/resourceSlice.js';

const AddResourcePage = () => {
    // ⬅️ FIX: Removed initialization of 'navigate' ⬅️
    const dispatch = useDispatch();

    const { isError, message } = useSelector(state => state.resource);

    useEffect(() => {
        if (isError) {
            // Keep error handling on the page level
            alert(`Error adding resource: ${message}`);
            dispatch(reset());
        }
        
        // Cleanup function for when the component unmounts
        return () => {
            // This ensures state is clean if the user leaves the page
            dispatch(reset()); 
        };
    }, [isError, message, dispatch]); // Dependency array is now clean

    return (
        <>
            <h1 className="mb-4">Add New Resource</h1>
            {isError && <Alert variant="danger" className="mb-3">{message}</Alert>}
            
            {/* The form component handles all submission, success alerts, and navigation */}
            <ResourceForm /> 
        </>
    );
};

export default AddResourcePage;