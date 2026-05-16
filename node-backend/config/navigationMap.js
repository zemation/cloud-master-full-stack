// config/navigationMap.js

/**
 * Single source of truth for site navigation structure.
 * Used by:
 * - Backend: validate category/topic combinations on resource create/update
 * - Frontend: build navigation menus and admin form dropdowns
 */
const navigationMap = {
    "Foundations": [
        "Hardware Essentials",
        "Introduction to Operating Systems",
        "Networking",
        "Security",
        "Certifications"
    ],
    "Operating Systems": [
        "Linux",
        "Windows",
        "Mac",
        "Certifications"
    ],
    "DevOps": [
        "Containers",
        "Kubernetes",
        "CI/CD",
        "Automation & Scripting",
        "Observability",
        "Certifications"
    ],
    "Cloud": [
        "Cloud Foundations",
        "AWS",
        "GCP",
        "Azure",
        "OpenStack",
        "Certifications"
    ],
    "Web Development": [
        "Frontend",
        "Backend",
        "Full Stack/Architecture",
        "Certifications"
    ],
    "Programming": [
        "Python",
        "C Family",
        "Go",
        "Java"
    ],
    "Databases": [
        "Relational",
        "Non-Relational"
    ]
};

// All valid categories
const getCategories = () => Object.keys(navigationMap);

// All valid topics (flat)
const getTopics = () => Object.values(navigationMap).flat();

// Check if a topic belongs to a category
const isValidCombination = (category, topic) => {
    return navigationMap[category]?.includes(topic) ?? false;
};

module.exports = { navigationMap, getCategories, getTopics, isValidCombination };