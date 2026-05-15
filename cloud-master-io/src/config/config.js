// src/config/config.js

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500/api';

export const navigationMap = {
  "Foundations": [
    "Hardware Essentials",
    "Introduction to Operating Systems",
    "Networking",
    "Security"
  ],
  "Operating Systems": [
    "Linux",
    "Windows",
    "Mac"
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