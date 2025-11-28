const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, initDB } = require('./database');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// Initialize database on startup
initDB();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Your AI pipeline function
async function callYourAIPipeline(input) {
  // TODO: Replace with your actual AI service
  console.log('🤖 AI Processing:', input);
  return `AI analyzed: "${input}" - This would be your AI model output`;
}

// ===== AUTHENTICATION ROUTES =====
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
      [email, passwordHash, name]
    );
    
    res.json({ 
      success: true,
      user: result.rows[0] 
    });
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== CLIENT ROUTES =====
app.post('/api/clients', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;
    const result = await pool.query(
      `INSERT INTO clients (name, email, phone, company, created_by) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, phone, company, req.user.id]
    );
    res.json({ success: true, client: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/clients', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM clients WHERE created_by = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, clients: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== DOCUMENT ROUTES WITH AI =====
app.post('/api/documents', authenticateToken, async (req, res) => {
  try {
    const { client_id, template_id, name, content } = req.body;
    
    // Use AI to enhance document content
    const ai_generated_content = await callYourAIPipeline(content);
    
    const result = await pool.query(
      `INSERT INTO documents (client_id, template_id, name, content, ai_generated_content, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [client_id, template_id, name, content, ai_generated_content, req.user.id]
    );
    
    res.json({ success: true, document: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/documents', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, c.name as client_name 
       FROM documents d 
       JOIN clients c ON d.client_id = c.id 
       WHERE d.created_by = $1 
       ORDER BY d.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, documents: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== COMPLIANCE DEADLINES =====
app.post('/api/deadlines', authenticateToken, async (req, res) => {
  try {
    const { client_id, title, description, deadline_date, priority } = req.body;
    const result = await pool.query(
      `INSERT INTO compliance_deadlines (client_id, title, description, deadline_date, priority, assigned_to) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [client_id, title, description, deadline_date, priority, req.user.id]
    );
    res.json({ success: true, deadline: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/deadlines/upcoming', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cd.*, c.name as client_name 
       FROM compliance_deadlines cd
       JOIN clients c ON cd.client_id = c.id
       WHERE cd.assigned_to = $1 AND cd.deadline_date >= CURRENT_DATE
       ORDER BY cd.deadline_date ASC
       LIMIT 10`,
      [req.user.id]
    );
    res.json({ success: true, deadlines: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== HEALTH CHECK =====
app.get('/', (req, res) => {
  res.json({ 
    status: 'Compliance AI Backend Running', 
    database: 'Neon PostgreSQL',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'OK', 
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Error', 
      database: 'Disconnected',
      error: error.message 
    });
  }
});

// Chat endpoints
app.post('/api/chat/sessions', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;
    const result = await pool.query(
      'INSERT INTO chat_sessions (user_id, title) VALUES ($1, $2) RETURNING *',
      [req.user.userId, title || 'New Chat']
    );
    res.json({ success: true, session: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/chat/sessions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM chat_sessions WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.user.userId]
    );
    res.json({ success: true, sessions: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chat/messages', authenticateToken, async (req, res) => {
  try {
    const { session_id, message } = req.body;
    
    // Verify session belongs to user
    const sessionCheck = await pool.query(
      'SELECT id FROM chat_sessions WHERE id = $1 AND user_id = $2',
      [session_id, req.user.userId]
    );
    
    if (sessionCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied to chat session' });
    }
    
    // Add user message
    const userMsg = await pool.query(
      'INSERT INTO chat_messages (session_id, sender_type, message) VALUES ($1, $2, $3) RETURNING *',
      [session_id, 'user', message]
    );
    
    // Simple AI response (replace with actual AI logic)
    const aiResponse = generateAIResponse(message);
    const aiMsg = await pool.query(
      'INSERT INTO chat_messages (session_id, sender_type, message) VALUES ($1, $2, $3) RETURNING *',
      [session_id, 'ai', aiResponse]
    );
    
    // Update session timestamp
    await pool.query(
      'UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [session_id]
    );
    
    res.json({ 
      success: true, 
      messages: [userMsg.rows[0], aiMsg.rows[0]]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/chat/messages/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Verify session belongs to user
    const sessionCheck = await pool.query(
      'SELECT id FROM chat_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, req.user.userId]
    );
    
    if (sessionCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied to chat session' });
    }
    
    const result = await pool.query(
      'SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
      [sessionId]
    );
    
    res.json({ success: true, messages: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a chat session
app.delete('/api/chat/sessions/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    // Verify session belongs to user
    const sessionCheck = await pool.query(
      'SELECT id FROM chat_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, userId]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Delete messages first (due to foreign key constraint)
    await pool.query('DELETE FROM chat_messages WHERE session_id = $1', [sessionId]);
    
    // Delete session
    await pool.query('DELETE FROM chat_sessions WHERE id = $1', [sessionId]);

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Simple AI response generator (replace with actual AI service)
function generateAIResponse(userMessage) {
  const responses = [
    "I understand you're working on compliance documentation. How can I help you draft or review your legal documents?",
    "Based on your query, I can assist with contract analysis, regulatory compliance checks, and document automation.",
    "Let me help you with your legal and compliance needs. What specific document or regulation are you working with?",
    "I'm here to streamline your legal workflow. Would you like me to help with document generation, deadline tracking, or compliance analysis?",
    "That's a great question about compliance. I can help you navigate regulatory requirements and automate your documentation process."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

app.listen(port, () => {
  console.log(`🚀 Compliance AI Backend running on port ${port}`);
  console.log(`📊 Database: Neon PostgreSQL`);
  console.log(`🔗 Health check: http://localhost:${port}/api/health`);
});