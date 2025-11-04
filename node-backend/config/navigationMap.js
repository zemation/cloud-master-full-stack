// config/navigationMap.js

/**
 * This map defines the entire, fixed navigation structure of the site.
 * It is used by the Express backend for strict validation (Category must contain Topic)
 * and by the React frontend to build the navigation menus and admin forms.
 */
const navigationMap = {
    // CATEGORY: [TOPIC, TOPIC, ...]
    "Foundations": [
        "Hardware Essentials",
        "Introduction to Operating Systems",
        "Networking", // Foundational Networking concepts
        "Security"    // Foundational Security concepts
    ],
    "Operating Systems": [
        "Linux",
        "Windows",
        "MAC"
    ],
    "DevOps": [
        "Containers",
        "Kubernetes",
        "CI/CD",
        "Automation & Scripting",
        "Observability"
    ],
    "Cloud": [
        "Cloud Foundations",
        "AWS",
        "GCP",
        "Azure",
        "OpenStack"
    ],
    "Web Development": [
        "Frontend",
        "Backend",
        "Full Stack/Architecture"
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

module.exports = navigationMap;