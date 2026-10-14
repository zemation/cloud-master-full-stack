// utils/chatBudget.js
//
// Daily token budget enforcement for the study-guide chat.
// Reads CHAT_DAILY_TOKEN_BUDGET (total tokens per UTC day, 0 = unlimited).

const ChatUsage = require('../models/ChatUsageModel');

const todayKey = () => new Date().toISOString().slice(0, 10);

const getBudget = () => {
  const raw = parseInt(process.env.CHAT_DAILY_TOKEN_BUDGET || '100000', 10);
  return Number.isNaN(raw) ? 100000 : raw;
};

/**
 * Check whether today's token usage is still under budget.
 * @returns {Promise<{allowed: boolean, used: number, budget: number}>}
 */
const checkBudget = async () => {
  const budget = getBudget();
  if (!budget || budget <= 0) {
    return { allowed: true, used: 0, budget: 0 };
  }
  const doc = await ChatUsage.findOne({ date: todayKey() }).lean();
  const used = (doc?.promptTokens || 0) + (doc?.completionTokens || 0);
  return { allowed: used < budget, used, budget };
};

/**
 * Record token usage reported by the upstream model API.
 */
const recordUsage = async (promptTokens = 0, completionTokens = 0) => {
  const p = Math.max(0, Math.round(promptTokens) || 0);
  const c = Math.max(0, Math.round(completionTokens) || 0);
  if (p === 0 && c === 0) return;
  await ChatUsage.updateOne(
    { date: todayKey() },
    { $inc: { promptTokens: p, completionTokens: c, requests: 1 } },
    { upsert: true }
  );
};

module.exports = { checkBudget, recordUsage, getBudget };
