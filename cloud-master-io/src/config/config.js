// src/config/config.js

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5500').replace(/\/+$/, '');

export const navigationMap = {
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

export const RESOURCE_TYPES = [
  'course',
  'documentation',
  'practice-exam',
  'study-guide',
  'video',
  'book',
  'tool'
];

export const DIFFICULTY_LEVELS = [
  'beginner',
  'intermediate',
  'advanced'
];