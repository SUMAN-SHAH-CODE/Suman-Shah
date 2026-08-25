import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Blog, Achievement, Project, Certificate, Skill, PortfolioStats } from '../models/portfolio.model';

const READ_BLOGS_KEY = 'cinematic_portfolio_read_blogs';

const INITIAL_SKILLS: Skill[] = [
  { id: 'sk-1', name: 'Angular 18 & RxJS', category: 'Frontend', proficiency: 95, featured: true, icon: 'code' },
  { id: 'sk-2', name: 'TypeScript & JavaScript', category: 'Frontend', proficiency: 92, featured: true, icon: 'terminal' },
  { id: 'sk-3', name: 'SCSS & Modern CSS3', category: 'Frontend', proficiency: 90, featured: true, icon: 'palette' },
  { id: 'sk-4', name: 'Firebase & Firestore', category: 'Backend', proficiency: 88, featured: true, icon: 'flame' },
  { id: 'sk-5', name: 'Node.js & Express', category: 'Backend', proficiency: 85, featured: true, icon: 'server' },
  { id: 'sk-6', name: 'REST & GraphQL APIs', category: 'Backend', proficiency: 86, featured: false, icon: 'api' },
  { id: 'sk-7', name: 'Git & GitHub Actions', category: 'Cloud/DevOps', proficiency: 89, featured: false, icon: 'git-branch' },
  { id: 'sk-8', name: 'Jest, Jasmine & Playwright', category: 'Tools', proficiency: 84, featured: false, icon: 'check-circle' }
];

const INITIAL_PROJECTS: Project[] = [
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
    technologies: ['Angular', 'RxJS', 'Firebase Firestore', 'Chart.js', 'Tailwind'],
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

const INITIAL_ACHIEVEMENTS: Achievement[] = [
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

const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    title: 'Google Cloud Certified Professional Cloud Developer',
    issuer: 'Google Cloud Platform',
    issueDate: '2024-02-10',
    expiryDate: '2026-02-10',
    credentialId: 'GCP-DEV-9920184',
    credentialUrl: 'https://example.com/credentials/gcp-dev',
    skillsCovered: ['Cloud Architecture', 'Serverless Functions', 'Firestore DB', 'Security']
  },
  {
    id: 'cert-2',
    title: 'Meta Frontend Developer Professional Certificate',
    issuer: 'Meta / Coursera',
    issueDate: '2023-08-15',
    credentialId: 'META-FE-448102',
    credentialUrl: 'https://example.com/credentials/meta-fe',
    skillsCovered: ['Angular', 'UX Systems', 'Web Security', 'Testing & CI/CD']
  }
];

const INITIAL_BLOGS: Blog[] = [
  {
    id: 'blog-1',
    title: 'Building Cinematic Web Experiences with Angular 18 and Custom Shaders',
    slug: 'building-cinematic-web-experiences-angular-18',
    summary: 'Discover how to combine Angular single-page agility with GPU-accelerated graphics and glassmorphism design for breathtaking web apps.',
    content: `
### The Evolution of Web Aesthetics

Modern web development has moved past flat layout grids. Users expect immersive, atmospheric experiences that feel alive—resembling high-end digital cinema interfaces.

#### Core Architectural Pillars:
1. **Layered Visual Depth**: Utilizing CSS backdrop filters and hardware-accelerated transforms.
2. **Reactive State Management**: Binding component animations directly to RxJS streams.
3. **Optimized Asset Pipeline**: Lazy loading assets with Angular signals and deferrable views.

\`\`\`typescript
@Component({
  selector: 'app-hero',
  template: \`<div class="glass-container" [style.transform]="parallaxStyle()">...</div>\`
})
export class HeroComponent {
  // Cinematic reactive binding
}
\`\`\`

#### Security & Performance Considerations
When building dynamic visual portals, always ensure content sanitization and secure OAuth handling to prevent unauthorized modification of content.
    `,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    tags: ['Angular', 'Web Design', 'UI/UX', 'SCSS'],
    readTimeMinutes: 5,
    publishedAt: '2024-11-01T10:00:00Z',
    authorName: 'Portfolio Author',
    authorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    viewsCount: 1420,
    featured: true
  },
  {
    id: 'blog-2',
    title: 'Securing Angular Applications with Firebase OAuth & Role-Based Access',
    slug: 'securing-angular-firebase-oauth-rbac',
    summary: 'A complete step-by-step security guide to setting up Firebase Authentication, Google OAuth, and Firestore Security Rules for Admin management.',
    content: `
### Why Role-Based Security Matters

In modern single-page applications, public visitors must enjoy seamless content browsing, while administrative powers (creating projects, deleting posts, editing achievements) must be strictly restricted to authenticated site owners.

#### Firestore Security Rules Blueprint:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /blogs/{blogId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
\`\`\`

#### Key Takeaways:
- Client-side route guards prevent accidental navigation.
- Server-side security rules provide non-bypassable backend enforcement.
- Local state handles immediate user feedback gracefully.
    `,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Firebase', 'Security', 'Angular', 'OAuth'],
    readTimeMinutes: 7,
    publishedAt: '2024-10-20T14:30:00Z',
    authorName: 'Portfolio Author',
    authorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    viewsCount: 980,
    featured: true
  }
];

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private blogsSubject = new BehaviorSubject<Blog[]>(INITIAL_BLOGS);
  public blogs$: Observable<Blog[]> = this.blogsSubject.asObservable();

  private projectsSubject = new BehaviorSubject<Project[]>(INITIAL_PROJECTS);
  public projects$: Observable<Project[]> = this.projectsSubject.asObservable();

  private achievementsSubject = new BehaviorSubject<Achievement[]>(INITIAL_ACHIEVEMENTS);
  public achievements$: Observable<Achievement[]> = this.achievementsSubject.asObservable();

  private certificatesSubject = new BehaviorSubject<Certificate[]>(INITIAL_CERTIFICATES);
  public certificates$: Observable<Certificate[]> = this.certificatesSubject.asObservable();

  private skillsSubject = new BehaviorSubject<Skill[]>(INITIAL_SKILLS);
  public skills$: Observable<Skill[]> = this.skillsSubject.asObservable();

  private readBlogIdsSubject = new BehaviorSubject<Set<string>>(new Set<string>());
  public readBlogIds$: Observable<Set<string>> = this.readBlogIdsSubject.asObservable();

  constructor() {
    this.loadReadBlogIds();
    this.loadFromLocalStorage();
  }

  private loadReadBlogIds(): void {
    try {
      const stored = localStorage.getItem(READ_BLOGS_KEY);
      if (stored) {
        const parsed: string[] = JSON.parse(stored);
        this.readBlogIdsSubject.next(new Set(parsed));
      }
    } catch (e) {
      console.error('Failed to load read blogs state:', e);
    }
  }

  private saveReadBlogIds(readSet: Set<string>): void {
    try {
      localStorage.setItem(READ_BLOGS_KEY, JSON.stringify(Array.from(readSet)));
    } catch (e) {
      console.error('Failed to save read blogs state:', e);
    }
  }

  private loadFromLocalStorage(): void {
    const customBlogs = localStorage.getItem('cp_blogs');
    if (customBlogs) this.blogsSubject.next(JSON.parse(customBlogs));

    const customProjects = localStorage.getItem('cp_projects');
    if (customProjects) this.projectsSubject.next(JSON.parse(customProjects));

    const customAchieve = localStorage.getItem('cp_achievements');
    if (customAchieve) this.achievementsSubject.next(JSON.parse(customAchieve));

    const customCerts = localStorage.getItem('cp_certs');
    if (customCerts) this.certificatesSubject.next(JSON.parse(customCerts));

    const customSkills = localStorage.getItem('cp_skills');
    if (customSkills) this.skillsSubject.next(JSON.parse(customSkills));
  }

  private saveStateToLocalStorage(): void {
    localStorage.setItem('cp_blogs', JSON.stringify(this.blogsSubject.value));
    localStorage.setItem('cp_projects', JSON.stringify(this.projectsSubject.value));
    localStorage.setItem('cp_achievements', JSON.stringify(this.achievementsSubject.value));
    localStorage.setItem('cp_certs', JSON.stringify(this.certificatesSubject.value));
    localStorage.setItem('cp_skills', JSON.stringify(this.skillsSubject.value));
  }

  // --- BLOG METHODS ---
  getBlogs(): Blog[] {
    return this.blogsSubject.value;
  }

  getBlogById(id: string): Blog | undefined {
    return this.blogsSubject.value.find(b => b.id === id || b.slug === id);
  }

  markBlogAsRead(id: string): void {
    const currentSet = new Set(this.readBlogIdsSubject.value);
    if (!currentSet.has(id)) {
      currentSet.add(id);
      this.readBlogIdsSubject.next(currentSet);
      this.saveReadBlogIds(currentSet);

      // increment view count
      const updated = this.blogsSubject.value.map(blog => {
        if (blog.id === id) {
          return { ...blog, viewsCount: (blog.viewsCount || 0) + 1 };
        }
        return blog;
      });
      this.blogsSubject.next(updated);
      this.saveStateToLocalStorage();
    }
  }

  isBlogRead(id: string): boolean {
    return this.readBlogIdsSubject.value.has(id);
  }

  addBlog(blog: Omit<Blog, 'id'>): Blog {
    const newBlog: Blog = {
      ...blog,
      id: 'blog-' + Date.now(),
      viewsCount: 0,
      slug: blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'blog-' + Date.now()
    };
    const updated = [newBlog, ...this.blogsSubject.value];
    this.blogsSubject.next(updated);
    this.saveStateToLocalStorage();
    return newBlog;
  }

  updateBlog(id: string, updatedData: Partial<Blog>): void {
    const updated = this.blogsSubject.value.map(blog =>
      blog.id === id ? { ...blog, ...updatedData } : blog
    );
    this.blogsSubject.next(updated);
    this.saveStateToLocalStorage();
  }

  deleteBlog(id: string): void {
    const updated = this.blogsSubject.value.filter(b => b.id !== id);
    this.blogsSubject.next(updated);
    this.saveStateToLocalStorage();
  }

  // --- PROJECT METHODS ---
  addProject(project: Omit<Project, 'id'>): Project {
    const newProject: Project = { ...project, id: 'proj-' + Date.now() };
    this.projectsSubject.next([newProject, ...this.projectsSubject.value]);
    this.saveStateToLocalStorage();
    return newProject;
  }

  updateProject(id: string, data: Partial<Project>): void {
    const updated = this.projectsSubject.value.map(p => p.id === id ? { ...p, ...data } : p);
    this.projectsSubject.next(updated);
    this.saveStateToLocalStorage();
  }

  deleteProject(id: string): void {
    this.projectsSubject.next(this.projectsSubject.value.filter(p => p.id !== id));
    this.saveStateToLocalStorage();
  }

  // --- ACHIEVEMENT METHODS ---
  addAchievement(ach: Omit<Achievement, 'id'>): Achievement {
    const newAch: Achievement = { ...ach, id: 'ach-' + Date.now() };
    this.achievementsSubject.next([newAch, ...this.achievementsSubject.value]);
    this.saveStateToLocalStorage();
    return newAch;
  }

  updateAchievement(id: string, data: Partial<Achievement>): void {
    const updated = this.achievementsSubject.value.map(a => a.id === id ? { ...a, ...data } : a);
    this.achievementsSubject.next(updated);
    this.saveStateToLocalStorage();
  }

  deleteAchievement(id: string): void {
    this.achievementsSubject.next(this.achievementsSubject.value.filter(a => a.id !== id));
    this.saveStateToLocalStorage();
  }

  // --- CERTIFICATE METHODS ---
  addCertificate(cert: Omit<Certificate, 'id'>): Certificate {
    const newCert: Certificate = { ...cert, id: 'cert-' + Date.now() };
    this.certificatesSubject.next([newCert, ...this.certificatesSubject.value]);
    this.saveStateToLocalStorage();
    return newCert;
  }

  updateCertificate(id: string, data: Partial<Certificate>): void {
    const updated = this.certificatesSubject.value.map(c => c.id === id ? { ...c, ...data } : c);
    this.certificatesSubject.next(updated);
    this.saveStateToLocalStorage();
  }

  deleteCertificate(id: string): void {
    this.certificatesSubject.next(this.certificatesSubject.value.filter(c => c.id !== id));
    this.saveStateToLocalStorage();
  }

  // --- SKILL METHODS ---
  addSkill(skill: Omit<Skill, 'id'>): Skill {
    const newSkill: Skill = { ...skill, id: 'sk-' + Date.now() };
    this.skillsSubject.next([...this.skillsSubject.value, newSkill]);
    this.saveStateToLocalStorage();
    return newSkill;
  }

  updateSkill(id: string, data: Partial<Skill>): void {
    const updated = this.skillsSubject.value.map(s => s.id === id ? { ...s, ...data } : s);
    this.skillsSubject.next(updated);
    this.saveStateToLocalStorage();
  }

  deleteSkill(id: string): void {
    this.skillsSubject.next(this.skillsSubject.value.filter(s => s.id !== id));
    this.saveStateToLocalStorage();
  }

  // --- STATS ---
  getStats(): PortfolioStats {
    return {
      projectsCount: this.projectsSubject.value.length,
      blogsCount: this.blogsSubject.value.length,
      achievementsCount: this.achievementsSubject.value.length,
      certificatesCount: this.certificatesSubject.value.length,
      skillsCount: this.skillsSubject.value.length
    };
  }
}
