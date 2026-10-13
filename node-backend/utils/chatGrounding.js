// utils/chatGrounding.js
//
// RAG-lite for the study-guide chat: pull the site's own curated resources
// that are relevant to the visitor's message so the model answers from
// real data instead of inventing titles and URLs.

const Resource = require('../models/ResourceModel');

// Common words that add noise to keyword matching
const STOPWORDS = new Set([
  'what', 'which', 'where', 'when', 'should', 'could', 'would', 'there',
  'their', 'about', 'with', 'from', 'have', 'has', 'had', 'this', 'that',
  'these', 'those', 'then', 'than', 'them', 'they', 'will', 'just', 'like',
  'best', 'good', 'some', 'very', 'more', 'most', 'much', 'many', 'also',
  'into', 'over', 'under', 'between', 'does', 'help', 'need', 'want', 'know',
  'learn', 'study', 'exam', 'certification', 'course', 'tell',
]);

/**
 * Extract significant keywords from a message for resource matching.
 */
const extractKeywords = (text) => {
  const words = (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
  return [...new Set(words)].slice(0, 12);
};

/**
 * Find published resources relevant to the visitor's message.
 * Matches keywords against title, description, certification, provider,
 * category, and topic. Returns a lean projection for prompt injection.
 */
const findRelevantResources = async (message, limit = 8) => {
  const keywords = extractKeywords(message);
  if (keywords.length === 0) return [];

  const pattern = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(pattern, 'i');

  const resources = await Resource.find(
    {
      status: 'published',
      $or: [
        { title: regex },
        { description: regex },
        { certification: regex },
        { provider: regex },
        { category: regex },
        { topic: regex },
      ],
    },
    {
      title: 1,
      url: 1,
      provider: 1,
      description: 1,
      certification: 1,
      resourceType: 1,
      difficulty: 1,
    }
  )
    .limit(limit)
    .lean();

  return resources;
};

/**
 * List every certification name currently published on the site.
 */
const listCertifications = async () => {
  const certifications = await Resource.distinct('certification', {
    certification: { $ne: null, $ne: '' },
    status: 'published',
  });
  return certifications.sort();
};

module.exports = { findRelevantResources, listCertifications };
