/**
 * Neon DB Seed Script
 * Run once: node server/seed.js
 * Safe to re-run — skips existing records.
 */
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

const SKILLS = [
  { id: 'sk-1', name: 'Angular 18 & RxJS', category: 'Frontend', proficiency: 95, featured: true, icon: 'code' },
  { id: 'sk-2', name: 'TypeScript & JavaScript', category: 'Frontend', proficiency: 92, featured: true, icon: 'terminal' },
  { id: 'sk-3', name: 'SCSS & Modern CSS3', category: 'Frontend', proficiency: 90, featured: true, icon: 'palette' },
  { id: 'sk-4', name: 'Firebase & Neon Postgres', category: 'Backend', proficiency: 88, featured: true, icon: 'flame' },
  { id: 'sk-5', name: 'Node.js & Express', category: 'Backend', proficiency: 85, featured: true, icon: 'server' },
  { id: 'sk-6', name: 'REST & GraphQL APIs', category: 'Backend', proficiency: 86, featured: false, icon: 'api' },
  { id: 'sk-7', name: 'Git & GitHub Actions', category: 'Cloud/DevOps', proficiency: 89, featured: false, icon: 'git-branch' },
  { id: 'sk-8', name: 'Jest, Jasmine & Playwright', category: 'Tools', proficiency: 84, featured: false, icon: 'check-circle' }
];

const PROJECTS = [
  {
    id: 'proj-1',
    title: 'Aetheria - Cinematic Web Studio',
    tagline: 'Immersive 3D/Web Audio Interactive Showcase Engine',
    description: 'An advanced web platform featuring hardware-accelerated shaders, dynamic soundscapes, and real-time interactive 3D particle systems built with Angular and WebGL.',
    technologies: ['Angular', 'TypeScript', 'Three.js', 'SCSS', 'Web Audio API'],
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://example.com/demo/aetheria',
    githubUrl: 'https://github.com/example/aetheria',
    category: 'Web App',
    featured: true
  },
  {
    id: 'proj-2',
    title: 'PulseFlow - Realtime Analytics Dashboard',
    tagline: 'High-frequency telemetry stream visualizer with custom reactive charts',
    description: 'Ultra-fast dashboard capable of rendering 100k data points per second with zero frame drops, leveraging Web Workers and RxJS pipeline optimization.',
    technologies: ['Angular', 'RxJS', 'Neon Postgres', 'Chart.js', 'Tailwind'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://example.com/demo/pulseflow',
    githubUrl: 'https://github.com/example/pulseflow',
    category: 'Dashboard',
    featured: true
  },
  {
    id: 'proj-3',
    title: 'CyberShield - Zero-Trust Auth Framework',
    tagline: 'Granular OAuth2 and WebAuthn security layer for enterprise apps',
    description: 'A security solution implementing biometrics authentication, encrypted local key storage, and automated token revocation hooks for Angular frontends.',
    technologies: ['Angular', 'Firebase Auth', 'WebAuthn', 'TypeScript'],
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://example.com/demo/cybershield',
    githubUrl: 'https://github.com/example/cybershield',
    category: 'Security',
    featured: true
  }
];

const ACHIEVEMENTS = [
  {
    id: 'ach-1',
    title: 'Global Hackathon Winner - 1st Place',
    organization: 'TechCrunch Disrupt Hackathon',
    date: '2024-10-15',
    category: 'Hackathon',
    description: 'Awarded 1st place among 350+ global developer teams for building an AI-assisted accessible web renderer in under 48 hours.',
    badgeUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=200&q=80',
    featured: true
  },
  {
    id: 'ach-2',
    title: 'Angular Community Contributor Recognition',
    organization: 'Angular Open Source Initiative',
    date: '2024-05-20',
    category: 'Recognition',
    description: 'Recognized for contributing performance improvements to core router reactive state bindings and documentation enhancements.',
    badgeUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=200&q=80',
    featured: true
  },
  {
    id: 'ach-3',
    title: 'Cloud Architecture Excellence Award',
    organization: 'Google Developer Group',
    date: '2023-11-08',
    category: 'Award',
    description: 'Honored for building serverless web architectures achieving 99.99% uptime with minimal latency and automatic horizontal scaling.',
    badgeUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=200&q=80',
    featured: true
  }
];

const CERTIFICATES = [
  {
    id: 'cert-1',
    title: 'Google Cloud Certified Professional Cloud Developer',
    issuer: 'Google Cloud Platform',
    issueDate: '2024-02-10',
    expiryDate: '2026-02-10',
    credentialId: 'GCP-DEV-9920184',
    credentialUrl: 'https://example.com/credentials/gcp-dev',
    skillsCovered: ['Cloud Architecture', 'Serverless Functions', 'Neon DB', 'Security']
  },
  {
    id: 'cert-2',
    title: 'Meta Frontend Developer Professional Certificate',
    issuer: 'Meta / Coursera',
    issueDate: '2023-08-15',
    expiryDate: null,
    credentialId: 'META-FE-448102',
    credentialUrl: 'https://example.com/credentials/meta-fe',
    skillsCovered: ['Angular', 'UX Systems', 'Web Security', 'Testing & CI/CD']
  }
];

const BLOGS = [
  {
    id: 'blog-1',
    title: 'Building Cinematic Web Experiences with Angular 18 and Custom Shaders',
    slug: 'building-cinematic-web-experiences-angular-18',
    summary: 'Discover how to combine Angular single-page agility with GPU-accelerated graphics and glassmorphism design for breathtaking web apps.',
    content: `### The Evolution of Web Aesthetics\n\nModern web development has moved past flat layout grids. Users expect immersive, atmospheric experiences that feel alive.\n\n#### Core Architectural Pillars:\n1. **Layered Visual Depth**: Utilizing CSS backdrop filters and hardware-accelerated transforms.\n2. **Reactive State Management**: Binding component animations directly to RxJS streams.\n3. **Optimized Asset Pipeline**: Lazy loading assets with Angular signals and deferrable views.`,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    tags: ['Angular', 'Web Design', 'UI/UX', 'SCSS'],
    readTimeMinutes: 5,
    authorName: 'Suman Shah',
    authorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    viewsCount: 1420,
    featured: true
  },
  {
    id: 'blog-2',
    title: 'Securing Angular Applications with Firebase OAuth & Role-Based Access',
    slug: 'securing-angular-firebase-oauth-rbac',
    summary: 'A complete step-by-step security guide to setting up Firebase Authentication, Google OAuth, and Firestore Security Rules for Admin management.',
    content: `### Why Role-Based Security Matters\n\nIn modern single-page applications, public visitors must enjoy seamless content browsing, while administrative powers must be strictly restricted to authenticated site owners.\n\n#### Key Takeaways:\n- Client-side route guards prevent accidental navigation.\n- Server-side security rules provide non-bypassable backend enforcement.\n- Local state handles immediate user feedback gracefully.`,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Firebase', 'Security', 'Angular', 'OAuth'],
    readTimeMinutes: 7,
    authorName: 'Suman Shah',
    authorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    viewsCount: 980,
    featured: true
  }
];

const EXPERIENCES = [
  {
    id: 'exp-1',
    startDate: 'Jan 2023',
    endDate: 'Present',
    jobTitle: 'Senior Full-Stack Web Engineer',
    organization: 'Aether Technologies Inc.',
    location: 'Remote / San Francisco, CA',
    responsibilities: [
      'Architected micro-frontend systems using Angular 18, Signals, and RxJS reactive state pipelines.',
      'Designed and deployed Neon Serverless PostgreSQL relational database APIs processing 5M+ daily requests.',
      'Optimized WebGL hardware-accelerated render engines reducing time-to-interactive by 45%.'
    ],
    technologies: ['Angular 18', 'TypeScript', 'Neon DB', 'Node.js', 'RxJS', 'Docker'],
    featured: true
  },
  {
    id: 'exp-2',
    startDate: 'Mar 2021',
    endDate: 'Dec 2022',
    jobTitle: 'Frontend Software Engineer',
    organization: 'Pulse Flow Digital Agency',
    location: 'New York, NY',
    responsibilities: [
      'Developed real-time telemetry dashboards rendering 100k data points per second with zero frame drops.',
      'Integrated Firebase OAuth2, multi-factor authentication, and custom role-based access control (RBAC).',
      'Engineered reusable SCSS design systems and automated unit testing suites with Jasmine and Playwright.'
    ],
    technologies: ['Angular', 'RxJS', 'Firebase', 'SCSS', 'Playwright', 'Git'],
    featured: true
  },
  {
    id: 'exp-3',
    startDate: 'Jun 2019',
    endDate: 'Feb 2021',
    jobTitle: 'Associate Software Developer',
    organization: 'CyberShield Systems',
    location: 'Boston, MA',
    responsibilities: [
      'Built secure REST and GraphQL API services in Node.js and Express with JWT authentication.',
      'Collaborated with UX designers to convert Figma prototypes into pixel-perfect responsive web pages.',
      'Maintained CI/CD deployment pipelines using GitHub Actions and cloud app instances.'
    ],
    technologies: ['JavaScript', 'Node.js', 'Express', 'GraphQL', 'HTML5/CSS3', 'Git'],
    featured: true
  }
];

async function seed() {
  console.log('🌱 Starting Neon DB seed...\n');

  // --- Skills ---
  console.log('Seeding skills...');
  for (const s of SKILLS) {
    const existing = await sql`SELECT id FROM skills WHERE id = ${s.id}`;
    if (existing.length === 0) {
      await sql`
        INSERT INTO skills (id, name, category, proficiency, icon, featured)
        VALUES (${s.id}, ${s.name}, ${s.category}, ${s.proficiency}, ${s.icon}, ${s.featured})
      `;
      console.log(`  ✅ Inserted skill: ${s.name}`);
    } else {
      console.log(`  ⏭  Skipped (exists): ${s.name}`);
    }
  }

  // --- Projects ---
  console.log('\nSeeding projects...');
  for (const p of PROJECTS) {
    const existing = await sql`SELECT id FROM projects WHERE id = ${p.id}`;
    if (existing.length === 0) {
      await sql`
        INSERT INTO projects (id, title, tagline, description, technologies, image_url, demo_url, github_url, category, featured)
        VALUES (${p.id}, ${p.title}, ${p.tagline}, ${p.description}, ${p.technologies}, ${p.imageUrl}, ${p.demoUrl}, ${p.githubUrl}, ${p.category}, ${p.featured})
      `;
      console.log(`  ✅ Inserted project: ${p.title}`);
    } else {
      console.log(`  ⏭  Skipped (exists): ${p.title}`);
    }
  }

  // --- Achievements ---
  console.log('\nSeeding achievements...');
  for (const a of ACHIEVEMENTS) {
    const existing = await sql`SELECT id FROM achievements WHERE id = ${a.id}`;
    if (existing.length === 0) {
      await sql`
        INSERT INTO achievements (id, title, organization, date, description, badge_url, category, featured)
        VALUES (${a.id}, ${a.title}, ${a.organization}, ${a.date}, ${a.description}, ${a.badgeUrl}, ${a.category}, ${a.featured})
      `;
      console.log(`  ✅ Inserted achievement: ${a.title}`);
    } else {
      console.log(`  ⏭  Skipped (exists): ${a.title}`);
    }
  }

  // --- Certificates ---
  console.log('\nSeeding certificates...');
  for (const c of CERTIFICATES) {
    const existing = await sql`SELECT id FROM certificates WHERE id = ${c.id}`;
    if (existing.length === 0) {
      await sql`
        INSERT INTO certificates (id, title, issuer, issue_date, expiry_date, credential_id, credential_url, skills_covered)
        VALUES (${c.id}, ${c.title}, ${c.issuer}, ${c.issueDate}, ${c.expiryDate}, ${c.credentialId}, ${c.credentialUrl}, ${c.skillsCovered})
      `;
      console.log(`  ✅ Inserted certificate: ${c.title}`);
    } else {
      console.log(`  ⏭  Skipped (exists): ${c.title}`);
    }
  }

  // --- Blogs ---
  console.log('\nSeeding blogs...');
  for (const b of BLOGS) {
    const existing = await sql`SELECT id FROM blogs WHERE id = ${b.id}`;
    if (existing.length === 0) {
      await sql`
        INSERT INTO blogs (id, title, slug, summary, content, cover_image, tags, read_time_minutes, published_at, author_name, author_photo, views_count, featured)
        VALUES (${b.id}, ${b.title}, ${b.slug}, ${b.summary}, ${b.content}, ${b.coverImage}, ${b.tags}, ${b.readTimeMinutes}, CURRENT_TIMESTAMP, ${b.authorName}, ${b.authorPhoto}, ${b.viewsCount}, ${b.featured})
      `;
      console.log(`  ✅ Inserted blog: ${b.title}`);
    } else {
      console.log(`  ⏭  Skipped (exists): ${b.title}`);
    }
  }

  // --- Messages ---
  console.log('\nSeeding contact messages...');
  const MESSAGES = [
    {
      id: 'msg-seed-1',
      name: 'Sarah Jenkins',
      email: 'sarah.j@techcorp.io',
      contact: '+1 415 555 0198',
      message: 'Hi Suman, we are looking for a Senior Angular Lead for an upcoming cloud dashboard migration project. Would love to discuss!'
    },
    {
      id: 'msg-seed-2',
      name: 'David Vance',
      email: 'dvance@venturecap.com',
      contact: '+44 20 7946 0912',
      message: 'Loved your portfolio design! Are you open for consulting on responsive WebGL / canvas integration for our platform?'
    }
  ];

  for (const m of MESSAGES) {
    const existing = await sql`SELECT id FROM contact_messages WHERE id = ${m.id}`;
    if (existing.length === 0) {
      await sql`
        INSERT INTO contact_messages (id, name, email, contact, message, created_at, read)
        VALUES (${m.id}, ${m.name}, ${m.email}, ${m.contact}, ${m.message}, CURRENT_TIMESTAMP, false)
      `;
      console.log(`  ✅ Inserted message from: ${m.name}`);
    } else {
      console.log(`  ⏭  Skipped (exists): message from ${m.name}`);
    }
  }

  console.log('\n🎉 Seed complete! All data is now in Neon DB.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
