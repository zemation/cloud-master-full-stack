// src/api/resourceApi.js

import axios from 'axios';
import { API_URL } from '../config/config';

const RESOURCE_URL = `${API_URL}/resources`;

// Helper — build auth header
const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// Get all resources (with optional query params)
export const getResources = async (params = {}) => {
  const response = await axios.get(RESOURCE_URL, { params });
  return response.data;
};

// Get single resource by id or slug
export const getResource = async (id) => {
  const response = await axios.get(`${RESOURCE_URL}/${id}`);
  return response.data;
};

// Get resources by category
export const getResourcesByCategory = async (category) => {
  const response = await axios.get(`${RESOURCE_URL}/category/${category}`);
  return response.data;
};

// Get resources by topic
export const getResourcesByTopic = async (topic) => {
  const response = await axios.get(`${RESOURCE_URL}/topic/${topic}`);
  return response.data;
};

// Get all certifications
export const getCertifications = async () => {
  const response = await axios.get(`${RESOURCE_URL}/certifications`);
  return response.data;
};

// Create resource (admin)
export const createResource = async (resourceData, token) => {
  const response = await axios.post(RESOURCE_URL, resourceData, authHeader(token));
  return response.data;
};

// Update resource (admin)
export const updateResource = async (id, resourceData, token) => {
  const response = await axios.put(`${RESOURCE_URL}/${id}`, resourceData, authHeader(token));
  return response.data;
};

// Delete resource (admin)
export const deleteResource = async (id, token) => {
  const response = await axios.delete(`${RESOURCE_URL}/${id}`, authHeader(token));
  return response.data;
};

// Increment view count
export const incrementViews = async (id) => {
  const response = await axios.put(`${RESOURCE_URL}/${id}/views`);
  return response.data;
};