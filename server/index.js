const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const { neon } = require('@neondatabase/serverless');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Ensure upload directory exists
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

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
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token || (token !== 'neon-admin-token-secret-12345' && token.length < 20)) {
    return res.status(401).json({ error: 'Unauthorized: Valid Admin Bearer token required' });
  }
  next();
};

// --- AUTH API ENDPOINTS ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email === 'admin@cinematic-portfolio.com' || password === 'admin123' || password === 'admin') {
    return res.json({
      token: 'neon-admin-token-secret-12345',
      user: {
        uid: 'neon-admin-123',
        email: email || 'admin@cinematic-portfolio.com',
        displayName: 'Cinematic Portfolio Admin (Neon)',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        isAdmin: true
      }
    });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

// --- IMAGE UPLOAD API ENDPOINT ---
app.post('/api/upload', verifyAdminAuth, (req, res) => {
  try {
    const { image, filename } = req.body || {};
    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Match data URI scheme e.g. data:image/png;base64,xxxx or raw base64
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    let extension = 'png';

    if (matches && matches.length === 3) {
      const mimeType = matches[1].toLowerCase();
      buffer = Buffer.from(matches[2], 'base64');
      if (mimeType.includes('jpeg') || mimeType.includes('jpg')) extension = 'jpg';
      else if (mimeType.includes('png')) extension = 'png';
      else if (mimeType.includes('webp')) extension = 'webp';
      else if (mimeType.includes('svg')) extension = 'svg';
      else if (mimeType.includes('gif')) extension = 'gif';
    } else {
      buffer = Buffer.from(image, 'base64');
    }

    const cleanName = (filename || 'upload')
      .toLowerCase()
      .replace(/\.[^/.]+$/, '') // remove existing extension
      .replace(/[^a-z0-9_-]/g, '-');
    const timestamp = Date.now();
    const finalFilename = `${cleanName}-${timestamp}.${extension}`;
    const filePath = path.join(uploadsDir, finalFilename);

    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/uploads/${finalFilename}`;
    const fullUrl = `http://localhost:${PORT}${relativeUrl}`;

    return res.json({
      status: 'success',
      url: fullUrl,
      relativeUrl: relativeUrl,
      fullUrl: fullUrl,
      filename: finalFilename
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Failed to upload image: ' + err.message });
  }
});

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
      )
    `;
    await sql`
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
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS achievements (
        id VARCHAR(100) PRIMARY KEY,
        title TEXT NOT NULL,
        organization TEXT NOT NULL,
        date VARCHAR(50),
        description TEXT,
        badge_url TEXT,
        category VARCHAR(50) DEFAULT 'Award',
        featured BOOLEAN DEFAULT false
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS certificates (
        id VARCHAR(100) PRIMARY KEY,
        title TEXT NOT NULL,
        issuer TEXT NOT NULL,
        issue_date VARCHAR(50),
        expiry_date VARCHAR(50),
        credential_id TEXT,
        credential_url TEXT,
        badge_url TEXT,
        skills_covered TEXT[]
      )
    `;
    try {
      await sql`ALTER TABLE certificates ADD COLUMN IF NOT EXISTS badge_url TEXT`;
    } catch (e) {
      // Column might already exist or table created
    }
    await sql`
      CREATE TABLE IF NOT EXISTS skills (
        id VARCHAR(100) PRIMARY KEY,
        name TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        proficiency INT DEFAULT 85,
        icon TEXT,
        featured BOOLEAN DEFAULT false
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS experiences (
        id VARCHAR(100) PRIMARY KEY,
        start_date VARCHAR(50) NOT NULL,
        end_date VARCHAR(50) NOT NULL,
        job_title TEXT NOT NULL,
        organization TEXT NOT NULL,
        location TEXT,
        responsibilities TEXT[],
        technologies TEXT[],
        featured BOOLEAN DEFAULT false
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id VARCHAR(100) PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        contact TEXT,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        read BOOLEAN DEFAULT false
      )
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
    const finalCover = coverImage || req.body.cover_image || null;
    const id = 'blog-' + Date.now();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || id;

    await sql`
      INSERT INTO blogs (id, title, slug, summary, content, cover_image, tags, read_time_minutes, published_at, author_name, author_photo, views_count, featured)
      VALUES (${id}, ${title}, ${slug}, ${summary}, ${content}, ${finalCover}, ${tags}, ${readTimeMinutes}, CURRENT_TIMESTAMP, ${authorName}, ${authorPhoto || null}, 0, false)
    `;

    res.status(201).json({ id, title, slug, summary, content, coverImage: finalCover, tags, readTimeMinutes, authorName, viewsCount: 0 });
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
    const { title, summary, content, coverImage, tags, viewsCount, authorName, authorPhoto } = req.body;
    const finalCover = coverImage !== undefined ? coverImage : req.body.cover_image;

    await sql`
      UPDATE blogs SET
        title = COALESCE(${title}, title),
        summary = COALESCE(${summary}, summary),
        content = COALESCE(${content}, content),
        cover_image = COALESCE(${finalCover}, cover_image),
        tags = COALESCE(${tags}, tags),
        views_count = COALESCE(${viewsCount}, views_count),
        author_name = COALESCE(${authorName}, author_name),
        author_photo = COALESCE(${authorPhoto}, author_photo)
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
    const finalImg = imageUrl || req.body.image_url || null;
    const id = 'proj-' + Date.now();

    await sql`
      INSERT INTO projects (id, title, tagline, description, technologies, image_url, demo_url, github_url, category, featured)
      VALUES (${id}, ${title}, ${tagline || null}, ${description}, ${technologies}, ${finalImg}, ${demoUrl || null}, ${githubUrl || null}, ${category}, false)
    `;

    res.status(201).json({ id, title, tagline, description, technologies, imageUrl: finalImg, category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', verifyAdminAuth, async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    const { id } = req.params;
    const { title, tagline, description, technologies, imageUrl, demoUrl, githubUrl, category, featured } = req.body;
    const finalImg = imageUrl !== undefined ? imageUrl : req.body.image_url;
    await sql`
      UPDATE projects SET
        title = COALESCE(${title}, title),
        tagline = COALESCE(${tagline}, tagline),
        description = COALESCE(${description}, description),
        technologies = COALESCE(${technologies}, technologies),
        image_url = COALESCE(${finalImg}, image_url),
        demo_url = COALESCE(${demoUrl}, demo_url),
        github_url = COALESCE(${githubUrl}, github_url),
        category = COALESCE(${category}, category),
        featured = COALESCE(${featured}, featured)
      WHERE id = ${id}
    `;
    res.json({ status: 'success', id });
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
    const finalBadge = badgeUrl || req.body.badge_url || null;
    const id = 'ach-' + Date.now();

    await sql`
      INSERT INTO achievements (id, title, organization, date, description, badge_url, category, featured)
      VALUES (${id}, ${title}, ${organization}, ${date || ''}, ${description || ''}, ${finalBadge}, ${category}, false)
    `;

    res.status(201).json({ id, title, organization, date, description, badgeUrl: finalBadge, category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/achievements/:id', verifyAdminAuth, async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    const { id } = req.params;
    const { title, organization, date, description, badgeUrl, category, featured } = req.body;
    const finalBadge = badgeUrl !== undefined ? badgeUrl : req.body.badge_url;
    await sql`
      UPDATE achievements SET
        title = COALESCE(${title}, title),
        organization = COALESCE(${organization}, organization),
        date = COALESCE(${date}, date),
        description = COALESCE(${description}, description),
        badge_url = COALESCE(${finalBadge}, badge_url),
        category = COALESCE(${category}, category),
        featured = COALESCE(${featured}, featured)
      WHERE id = ${id}
    `;
    res.json({ status: 'success', id });
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
      badgeUrl: r.badge_url,
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
    const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl, badgeUrl, skillsCovered = [] } = req.body;
    const finalBadge = badgeUrl || req.body.badge_url || null;
    const id = 'cert-' + Date.now();

    await sql`
      INSERT INTO certificates (id, title, issuer, issue_date, expiry_date, credential_id, credential_url, badge_url, skills_covered)
      VALUES (${id}, ${title}, ${issuer}, ${issueDate || ''}, ${expiryDate || null}, ${credentialId || null}, ${credentialUrl || null}, ${finalBadge}, ${skillsCovered})
    `;

    res.status(201).json({ id, title, issuer, issueDate, badgeUrl: finalBadge });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/certificates/:id', verifyAdminAuth, async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    const { id } = req.params;
    const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl, badgeUrl, skillsCovered } = req.body;
    const finalBadge = badgeUrl !== undefined ? badgeUrl : req.body.badge_url;
    await sql`
      UPDATE certificates SET
        title = COALESCE(${title}, title),
        issuer = COALESCE(${issuer}, issuer),
        issue_date = COALESCE(${issueDate}, issue_date),
        expiry_date = COALESCE(${expiryDate}, expiry_date),
        credential_id = COALESCE(${credentialId}, credential_id),
        credential_url = COALESCE(${credentialUrl}, credential_url),
        badge_url = COALESCE(${finalBadge}, badge_url),
        skills_covered = COALESCE(${skillsCovered}, skills_covered)
      WHERE id = ${id}
    `;
    res.json({ status: 'success', id });
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
      proficiency: r.proficiency,
      icon: r.icon,
      featured: r.featured
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

    res.status(201).json({ id, name, category, proficiency, icon, featured });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/skills/:id', verifyAdminAuth, async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    const { id } = req.params;
    const { name, category, proficiency, icon, featured } = req.body;
    await sql`
      UPDATE skills SET
        name = COALESCE(${name}, name),
        category = COALESCE(${category}, category),
        proficiency = COALESCE(${proficiency}, proficiency),
        icon = COALESCE(${icon}, icon),
        featured = COALESCE(${featured}, featured)
      WHERE id = ${id}
    `;
    res.json({ status: 'success', id });
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

// --- EXPERIENCES API ENDPOINTS ---
app.get('/api/experiences', async (req, res) => {
  if (!sql) return res.json([]);
  try {
    const rows = await sql`SELECT * FROM experiences ORDER BY id DESC`;
    res.json(rows.map(r => ({
      id: r.id,
      startDate: r.start_date,
      endDate: r.end_date,
      jobTitle: r.job_title,
      organization: r.organization,
      location: r.location,
      responsibilities: r.responsibilities || [],
      technologies: r.technologies || [],
      featured: r.featured
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/experiences', [
  verifyAdminAuth,
  body('jobTitle').trim().notEmpty(),
  body('organization').trim().notEmpty(),
  handleValidationErrors
], async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    const { startDate, endDate, jobTitle, organization, location, responsibilities = [], technologies = [], featured = false } = req.body;
    const id = 'exp-' + Date.now();

    await sql`
      INSERT INTO experiences (id, start_date, end_date, job_title, organization, location, responsibilities, technologies, featured)
      VALUES (${id}, ${startDate || '2023'}, ${endDate || 'Present'}, ${jobTitle}, ${organization}, ${location || null}, ${responsibilities}, ${technologies}, ${featured})
    `;

    res.status(201).json({ id, startDate, endDate, jobTitle, organization, location, responsibilities, technologies, featured });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/experiences/:id', verifyAdminAuth, async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    const { id } = req.params;
    const { startDate, endDate, jobTitle, organization, location, responsibilities, technologies, featured } = req.body;

    await sql`
      UPDATE experiences SET
        start_date = COALESCE(${startDate}, start_date),
        end_date = COALESCE(${endDate}, end_date),
        job_title = COALESCE(${jobTitle}, job_title),
        organization = COALESCE(${organization}, organization),
        location = COALESCE(${location}, location),
        responsibilities = COALESCE(${responsibilities}, responsibilities),
        technologies = COALESCE(${technologies}, technologies),
        featured = COALESCE(${featured}, featured)
      WHERE id = ${id}
    `;

    res.json({ status: 'success', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/experiences/:id', verifyAdminAuth, async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    await sql`DELETE FROM experiences WHERE id = ${req.params.id}`;
    res.json({ status: 'success', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CONTACT MESSAGES API ENDPOINTS ---
const contactValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  handleValidationErrors
];

const handleCreateMessage = async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    const { name, email, contact, message } = req.body;
    const id = 'msg-' + Date.now();

    await sql`
      INSERT INTO contact_messages (id, name, email, contact, message, created_at, read)
      VALUES (${id}, ${name}, ${email}, ${contact || null}, ${message}, CURRENT_TIMESTAMP, false)
    `;

    res.status(201).json({ status: 'success', id, name, email, contact, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

app.post('/api/contact_messages', contactValidators, handleCreateMessage);
app.post('/api/contact', contactValidators, handleCreateMessage);

const handleGetMessages = async (req, res) => {
  if (!sql) return res.json([]);
  try {
    const rows = await sql`SELECT * FROM contact_messages ORDER BY created_at DESC`;
    res.json(rows.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      contact: r.contact,
      message: r.message,
      createdAt: r.created_at,
      read: r.read
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

app.get('/api/contact_messages', verifyAdminAuth, handleGetMessages);
app.get('/api/contact', verifyAdminAuth, handleGetMessages);

const handleMarkRead = async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    const { id } = req.params;
    const { read } = req.body || {};
    await sql`UPDATE contact_messages SET read = ${read !== false} WHERE id = ${id}`;
    res.json({ status: 'success', id, read: read !== false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

app.patch('/api/contact_messages/:id/read', verifyAdminAuth, handleMarkRead);
app.put('/api/contact_messages/:id/read', verifyAdminAuth, handleMarkRead);
app.patch('/api/contact/:id/read', verifyAdminAuth, handleMarkRead);
app.put('/api/contact/:id/read', verifyAdminAuth, handleMarkRead);

const handleDeleteMessage = async (req, res) => {
  if (!sql) return res.status(503).json({ error: 'Database unconfigured' });
  try {
    await sql`DELETE FROM contact_messages WHERE id = ${req.params.id}`;
    res.json({ status: 'success', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

app.delete('/api/contact_messages/:id', verifyAdminAuth, handleDeleteMessage);
app.delete('/api/contact/:id', verifyAdminAuth, handleDeleteMessage);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: !!sql, timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Neon Relational API Server running on port ${PORT}`);
  });
}

