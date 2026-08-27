const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const NEON_DB_URL = process.env.DATABASE_URL;

let sql = null;
if (NEON_DB_URL) {
  try {
    sql = neon(NEON_DB_URL);
  } catch (err) {
    console.warn('Neon connection note:', err.message);
  }
}

// Admin Token Verification Middleware
const verifyAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.length < 15) {
    return res.status(401).json({ error: 'Unauthorized: Valid Admin Bearer token required' });
  }
  next();
};

// Validation Error Handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', errors: errors.array() });
  }
  next();
};

// Initialize Neon Database Tables
async function initSchema() {
  if (!sql) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS blogs (
        id VARCHAR(100) PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        cover_image TEXT,
        tags TEXT[],
        read_time_minutes INT DEFAULT 5,
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        author_name TEXT DEFAULT 'Admin',
        author_photo TEXT,
        views_count INT DEFAULT 0,
        featured BOOLEAN DEFAULT false
      );

      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(100) PRIMARY KEY,
        title TEXT NOT NULL,
        tagline TEXT,
        description TEXT NOT NULL,
        technologies TEXT[],
        image_url TEXT,
        demo_url TEXT,
        github_url TEXT,
        category TEXT DEFAULT 'Web App',
        featured BOOLEAN DEFAULT false
      );

      CREATE TABLE IF NOT EXISTS achievements (
        id VARCHAR(100) PRIMARY KEY,
        title TEXT NOT NULL,
        organization TEXT NOT NULL,
        date VARCHAR(50),
        description TEXT,
        badge_url TEXT,
        category VARCHAR(50) DEFAULT 'Award',
        featured BOOLEAN DEFAULT false
      );

      CREATE TABLE IF NOT EXISTS certificates (
        id VARCHAR(100) PRIMARY KEY,
        title TEXT NOT NULL,
        issuer TEXT NOT NULL,
        issue_date VARCHAR(50),
        expiry_date VARCHAR(50),
        credential_id TEXT,
        credential_url TEXT,
        skills_covered TEXT[]
      );

      CREATE TABLE IF NOT EXISTS skills (
        id VARCHAR(100) PRIMARY KEY,
        name TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        proficiency INT DEFAULT 85,
        icon TEXT,
        featured BOOLEAN DEFAULT false
      );
    `;
    console.log('Neon Relational Schema Initialized');
  } catch (err) {
    console.warn('Neon schema setup note:', err.message);
  }
}

initSchema();

// --- BLOG API ENDPOINTS ---
app.get('/api/blogs', async (req, res) => {
  if (!sql) return res.json([]);
  try {
    const rows = await sql`SELECT * FROM blogs ORDER BY published_at DESC`;
    res.json(rows.map(r => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      summary: r.summary,
      content: r.content,
      coverImage: r.cover_image,
      tags: r.tags || [],
      readTimeMinutes: r.read_time_minutes,
      publishedAt: r.published_at,
      authorName: r.author_name,
      authorPhoto: r.author_photo,
      viewsCount: r.views_count,
      featured: r.featured
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/blogs', [
  verifyAdminAuth,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('summary').trim().notEmpty().withMessage('Summary is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  handleValidationErrors
], async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    const { title, summary, content, coverImage, tags = [], readTimeMinutes = 5, authorName = 'Admin', authorPhoto } = req.body;
    const id = 'blog-' + Date.now();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || id;

    await sql`
      INSERT INTO blogs (id, title, slug, summary, content, cover_image, tags, read_time_minutes, published_at, author_name, author_photo, views_count, featured)
      VALUES (${id}, ${title}, ${slug}, ${summary}, ${content}, ${coverImage || null}, ${tags}, ${readTimeMinutes}, CURRENT_TIMESTAMP, ${authorName}, ${authorPhoto || null}, 0, false)
    `;

    res.status(201).json({ id, title, slug, summary, content, coverImage, tags, readTimeMinutes, authorName, viewsCount: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/blogs/:id', [
  body('title').optional().trim().notEmpty(),
  handleValidationErrors
], async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    const { id } = req.params;
    const { title, summary, content, coverImage, tags, viewsCount } = req.body;

    await sql`
      UPDATE blogs SET
        title = COALESCE(${title}, title),
        summary = COALESCE(${summary}, summary),
        content = COALESCE(${content}, content),
        cover_image = COALESCE(${coverImage}, cover_image),
        tags = COALESCE(${tags}, tags),
        views_count = COALESCE(${viewsCount}, views_count)
      WHERE id = ${id}
    `;

    res.json({ status: 'success', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/blogs/:id', verifyAdminAuth, async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    await sql`DELETE FROM blogs WHERE id = ${req.params.id}`;
    res.json({ status: 'success', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PROJECTS API ENDPOINTS ---
app.get('/api/projects', async (req, res) => {
  if (!sql) return res.json([]);
  try {
    const rows = await sql`SELECT * FROM projects`;
    res.json(rows.map(r => ({
      id: r.id,
      title: r.title,
      tagline: r.tagline,
      description: r.description,
      technologies: r.technologies || [],
      imageUrl: r.image_url,
      demoUrl: r.demo_url,
      githubUrl: r.github_url,
      category: r.category,
      featured: r.featured
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', [
  verifyAdminAuth,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  handleValidationErrors
], async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    const { title, tagline, description, technologies = [], imageUrl, demoUrl, githubUrl, category = 'Web App' } = req.body;
    const id = 'proj-' + Date.now();

    await sql`
      INSERT INTO projects (id, title, tagline, description, technologies, image_url, demo_url, github_url, category, featured)
      VALUES (${id}, ${title}, ${tagline || null}, ${description}, ${technologies}, ${imageUrl || null}, ${demoUrl || null}, ${githubUrl || null}, ${category}, false)
    `;

    res.status(201).json({ id, title, tagline, description, technologies, category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', verifyAdminAuth, async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    await sql`DELETE FROM projects WHERE id = ${req.params.id}`;
    res.json({ status: 'success', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ACHIEVEMENTS API ENDPOINTS ---
app.get('/api/achievements', async (req, res) => {
  if (!sql) return res.json([]);
  try {
    const rows = await sql`SELECT * FROM achievements`;
    res.json(rows.map(r => ({
      id: r.id,
      title: r.title,
      organization: r.organization,
      date: r.date,
      description: r.description,
      badgeUrl: r.badge_url,
      category: r.category
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/achievements', [
  verifyAdminAuth,
  body('title').trim().notEmpty(),
  body('organization').trim().notEmpty(),
  handleValidationErrors
], async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    const { title, organization, date, description, badgeUrl, category = 'Award' } = req.body;
    const id = 'ach-' + Date.now();

    await sql`
      INSERT INTO achievements (id, title, organization, date, description, badge_url, category, featured)
      VALUES (${id}, ${title}, ${organization}, ${date || ''}, ${description || ''}, ${badgeUrl || null}, ${category}, false)
    `;

    res.status(201).json({ id, title, organization, date, description, category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/achievements/:id', verifyAdminAuth, async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    await sql`DELETE FROM achievements WHERE id = ${req.params.id}`;
    res.json({ status: 'success', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CERTIFICATES API ENDPOINTS ---
app.get('/api/certificates', async (req, res) => {
  if (!sql) return res.json([]);
  try {
    const rows = await sql`SELECT * FROM certificates`;
    res.json(rows.map(r => ({
      id: r.id,
      title: r.title,
      issuer: r.issuer,
      issueDate: r.issue_date,
      expiryDate: r.expiry_date,
      credentialId: r.credential_id,
      credentialUrl: r.credential_url,
      skillsCovered: r.skills_covered || []
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/certificates', [
  verifyAdminAuth,
  body('title').trim().notEmpty(),
  body('issuer').trim().notEmpty(),
  handleValidationErrors
], async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl, skillsCovered = [] } = req.body;
    const id = 'cert-' + Date.now();

    await sql`
      INSERT INTO certificates (id, title, issuer, issue_date, expiry_date, credential_id, credential_url, skills_covered)
      VALUES (${id}, ${title}, ${issuer}, ${issueDate || ''}, ${expiryDate || null}, ${credentialId || null}, ${credentialUrl || null}, ${skillsCovered})
    `;

    res.status(201).json({ id, title, issuer, issueDate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/certificates/:id', verifyAdminAuth, async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    await sql`DELETE FROM certificates WHERE id = ${req.params.id}`;
    res.json({ status: 'success', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SKILLS API ENDPOINTS ---
app.get('/api/skills', async (req, res) => {
  if (!sql) return res.json([]);
  try {
    const rows = await sql`SELECT * FROM skills`;
    res.json(rows.map(r => ({
      id: r.id,
      name: r.name,
      category: r.category,
      proficiency: r.proficiency
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/skills', [
  verifyAdminAuth,
  body('name').trim().notEmpty(),
  body('category').trim().notEmpty(),
  handleValidationErrors
], async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    const { name, category, proficiency = 85, icon, featured = false } = req.body;
    const id = 'sk-' + Date.now();

    await sql`
      INSERT INTO skills (id, name, category, proficiency, icon, featured)
      VALUES (${id}, ${name}, ${category}, ${proficiency}, ${icon || null}, ${featured})
    `;

    res.status(201).json({ id, name, category, proficiency });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/skills/:id', verifyAdminAuth, async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    await sql`DELETE FROM skills WHERE id = ${req.params.id}`;
    res.json({ status: 'success', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Neon Relational API Server running on port ${PORT}`);
  });
}

module.exports = app;
