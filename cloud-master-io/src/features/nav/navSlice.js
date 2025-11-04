// src/features/nav/navSlice.js

import { createSlice } from '@reduxjs/toolkit';

const navigationMap = {
    "Foundations": ["Hardware Essentials", "Introduction to Operating Systems", "Networking", "Security"],
    "Operating Systems": ["Linux", "Windows", "MAC"],
    "DevOps": ["Containers", "Kubernetes", "CI/CD", "Automation & Scripting", "Observability"],
    "Cloud": ["Cloud Foundations", "AWS", "GCP", "Azure", "OpenStack"],
    "Web Development": ["Frontend", "Backend", "Full Stack/Architecture"],
    "Programming": ["Python", "C Family", "Go", "Java"],
    "Databases": ["Relational", "Non-Relational"]
};

const initialState = {
    navMap: navigationMap,
    categories: Object.keys(navigationMap),
};

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {},
});

export default navSlice.reducer;