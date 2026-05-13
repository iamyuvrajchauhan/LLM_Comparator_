// backend/controllers/queryController.js
const { getLlmResponses, getAvailableModels } = require('../services/llmService');
const { generateSummary } = require('../services/summaryService');
const QueryHistory = require('../models/QueryHistory');
let puter = null;

const getPuter = async () => {
  if (!puter) {
    const puterModule = await import('@heyputer/puter.js');
    puter = puterModule.puter || puterModule.default;
    const token = process.env.PUTER_API_KEY || process.env.PUTER_AUTH_TOKEN;
    if (token) {
      puter.setAuthToken(token.replace(/['"]+/g, ''));
    }
  }
  return puter;
};

// Generate a short, smart title from the user's query using an LLM
const generateTitle = async (query) => {
  try {
    const puterInstance = await getPuter();
    const response = await puterInstance.ai.chat(
      `Summarize this user question into a short chat title (3-6 words max, no quotes, no punctuation at the end). Just return the title, nothing else.\n\nQuestion: ${query}`,
      { model: 'gpt-4o-mini', temperature: 0.3 }
    );

    let title = null;
    if (typeof response === 'string') title = response;
    else if (response?.message?.content) title = typeof response.message.content === 'string' ? response.message.content : null;
    else if (response?.text) title = response.text;
    else if (response?.choices?.[0]?.message?.content) title = response.choices[0].message.content;

    if (title) {
      // Clean up: remove quotes, trim, limit length
      title = title.replace(/^["']+|["']+$/g, '').replace(/[.!?]+$/, '').trim();
      if (title.length > 0 && title.length <= 60) return title;
    }
  } catch (err) {
    console.warn('Title generation failed, using fallback:', err?.message || err);
  }
  // Fallback: truncate the query
  return query.length > 40 ? query.substring(0, 40) + '...' : query;
};

// @description   Process a user query, get LLM responses, summarize, and save
// @route         POST /api/query
const createQuery = async (req, res) => {
  try {
    const { query, sessionId, selectedModels } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Use selectedModels from request, or default to all models
    const modelsToUse = selectedModels && selectedModels.length > 0 
      ? selectedModels 
      : ['claude-3.5-sonnet', 'gpt-4o-mini', 'mixtral-8x7b-instruct'];

    let chatSession = null;
    let previousTurns = [];

    // If a sessionId is provided, fetch the existing chat session
    if (sessionId) {
      chatSession = await QueryHistory.findOne({ _id: sessionId, userId: req.user._id });
      if (!chatSession) {
         return res.status(404).json({ error: 'Chat session not found' });
      }
      previousTurns = chatSession.turns;
    }

    // Send the user's question to selected LLM providers in parallel
    // Pass previous turns for conversational context
    const responses = await getLlmResponses(query, previousTurns, modelsToUse);

    // This service collects all model outputs
    // and formats them before sending them to the summarizer
    const finalSummary = await generateSummary(query, responses);

    const newTurn = {
      query,
      responses,
      finalSummary,
    };

    if (chatSession) {
      // Append to existing session
      chatSession.turns.push(newTurn);
      const savedHistory = await chatSession.save();
      return res.status(200).json(savedHistory);
    } else {
      // Create new session
      const newQueryHistory = new QueryHistory({
        userId: req.user._id,
        title: await generateTitle(query),
        turns: [newTurn],
      });

      const savedHistory = await newQueryHistory.save();
      return res.status(201).json(savedHistory);
    }
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Failed to fetch model responses' });
  }
};

// @description   Get past queries and their responses
// @route         GET /api/history
const getHistory = async (req, res) => {
  try {
    const history = await QueryHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch query history' });
  }
};

// @description   Delete a specific query from history
// @route         DELETE /api/history/:id
const deleteQuery = async (req, res) => {
  try {
    const queryId = req.params.id;
    const deletedQuery = await QueryHistory.findOneAndDelete({ _id: queryId, userId: req.user._id });

    if (!deletedQuery) {
      return res.status(404).json({ error: 'Query not found or not authorized to delete' });
    }

    res.status(200).json({ message: 'Query deleted successfully', id: queryId });
  } catch (error) {
    console.error('Error deleting query:', error);
    res.status(500).json({ error: 'Failed to delete query' });
  }
};
// @description   Rename a specific chat session
// @route         PATCH /api/history/:id/rename
const renameQuery = async (req, res) => {
  try {
    const queryId = req.params.id;
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const query = await QueryHistory.findOneAndUpdate(
      { _id: queryId, userId: req.user._id },
      { title: title.trim().substring(0, 60) },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({ error: 'Chat not found or not authorized' });
    }

    res.status(200).json(query);
  } catch (error) {
    console.error('Error renaming query:', error);
    res.status(500).json({ error: 'Failed to rename chat' });
  }
};

// @description   Get all dynamic live models from Puter.js
// @route         GET /api/query/models
const getModelsList = async (req, res) => {
  try {
    const models = await getAvailableModels();
    res.status(200).json(models);
  } catch (error) {
    console.error('Error fetching models list:', error);
    res.status(500).json({ error: 'Failed to fetch dynamic models list' });
  }
};

module.exports = {
  createQuery,
  getHistory,
  deleteQuery,
  renameQuery,
  getModelsList,
};
