import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';
import { AuthService } from '../../../core/services/auth.service';
import { Blog, Project, Achievement, Certificate, Skill } from '../../../core/models/portfolio.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-custom dashboard-wrapper">
      <!-- Admin Header Bar -->
      <div class="dashboard-header glass-panel">
        <div>
          <span class="admin-tag">⚡ PORTFOLIO CONTROL CENTER</span>
          <h1 class="dash-title">Admin Management Dashboard</h1>
          <p class="dash-sub">Logged in as: <strong>{{ (authService.currentUser$ | async)?.email }}</strong></p>
        </div>
        <button (click)="logout()" class="btn-cinematic btn-outline btn-sm">Logout Admin</button>
      </div>

      <!-- Navigation Tabs -->
      <div class="tabs-bar glass-panel">
        <button class="tab-btn" [class.active]="activeTab === 'blogs'" (click)="activeTab = 'blogs'">
          📝 Blogs ({{ blogs.length }})
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'projects'" (click)="activeTab = 'projects'">
          🚀 Projects ({{ projects.length }})
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'achievements'" (click)="activeTab = 'achievements'">
          🏆 Achievements ({{ achievements.length }})
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'certificates'" (click)="activeTab = 'certificates'">
          📜 Certificates ({{ certificates.length }})
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'skills'" (click)="activeTab = 'skills'">
          💡 Skills ({{ skills.length }})
        </button>
      </div>

      <!-- BLOGS TAB -->
      <div class="tab-content glass-panel" *ngIf="activeTab === 'blogs'">
        <div class="content-header">
          <h2>Manage Blog Posts</h2>
          <button (click)="openBlogModal()" class="btn-cinematic btn-sm">+ Create New Blog</button>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Published</th>
              <th>Read Time</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of blogs">
              <td class="bold-cell">{{ item.title }}</td>
              <td>{{ item.publishedAt | date:'shortDate' }}</td>
              <td>{{ item.readTimeMinutes }} mins</td>
              <td>{{ item.viewsCount || 0 }}</td>
              <td class="actions-cell">
                <button (click)="openBlogModal(item)" class="action-btn edit">Edit</button>
                <button (click)="deleteBlog(item.id)" class="action-btn delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PROJECTS TAB -->
      <div class="tab-content glass-panel" *ngIf="activeTab === 'projects'">
        <div class="content-header">
          <h2>Manage Projects</h2>
          <button (click)="openProjectModal()" class="btn-cinematic btn-sm">+ Add Project</button>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Category</th>
              <th>Tagline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of projects">
              <td class="bold-cell">{{ p.title }}</td>
              <td><span class="badge-tag">{{ p.category }}</span></td>
              <td>{{ p.tagline }}</td>
              <td class="actions-cell">
                <button (click)="openProjectModal(p)" class="action-btn edit">Edit</button>
                <button (click)="deleteProject(p.id)" class="action-btn delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ACHIEVEMENTS TAB -->
      <div class="tab-content glass-panel" *ngIf="activeTab === 'achievements'">
        <div class="content-header">
          <h2>Manage Achievements</h2>
          <button (click)="openAchievementModal()" class="btn-cinematic btn-sm">+ Add Achievement</button>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Organization</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of achievements">
              <td class="bold-cell">{{ a.title }}</td>
              <td>{{ a.organization }}</td>
              <td><span class="badge-tag">{{ a.category }}</span></td>
              <td>{{ a.date }}</td>
              <td class="actions-cell">
                <button (click)="openAchievementModal(a)" class="action-btn edit">Edit</button>
                <button (click)="deleteAchievement(a.id)" class="action-btn delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- CERTIFICATES TAB -->
      <div class="tab-content glass-panel" *ngIf="activeTab === 'certificates'">
        <div class="content-header">
          <h2>Manage Certificates</h2>
          <button (click)="openCertModal()" class="btn-cinematic btn-sm">+ Add Certificate</button>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Issuer</th>
              <th>Issue Date</th>
              <th>Credential ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of certificates">
              <td class="bold-cell">{{ c.title }}</td>
              <td>{{ c.issuer }}</td>
              <td>{{ c.issueDate }}</td>
              <td><code>{{ c.credentialId || 'N/A' }}</code></td>
              <td class="actions-cell">
                <button (click)="openCertModal(c)" class="action-btn edit">Edit</button>
                <button (click)="deleteCert(c.id)" class="action-btn delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- SKILLS TAB -->
      <div class="tab-content glass-panel" *ngIf="activeTab === 'skills'">
        <div class="content-header">
          <h2>Manage Technical Skills</h2>
          <button (click)="openSkillModal()" class="btn-cinematic btn-sm">+ Add Skill</button>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Skill Name</th>
              <th>Category</th>
              <th>Proficiency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of skills">
              <td class="bold-cell">{{ s.name }}</td>
              <td><span class="badge-tag">{{ s.category }}</span></td>
              <td>{{ s.proficiency }}%</td>
              <td class="actions-cell">
                <button (click)="openSkillModal(s)" class="action-btn edit">Edit</button>
                <button (click)="deleteSkill(s.id)" class="action-btn delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- MODAL DIALOG FOR EDITING / CREATING -->
      <div class="modal-backdrop" *ngIf="showModal">
        <div class="modal-card glass-panel">
          <div class="modal-header">
            <h3>{{ isEditMode ? 'Edit' : 'Create' }} Item</h3>
            <button class="close-btn" (click)="showModal = false">✕</button>
          </div>

          <!-- BLOG FORM -->
          <div *ngIf="activeTab === 'blogs'" class="form-container">
            <div class="form-group">
              <label>Title</label>
              <input type="text" [(ngModel)]="blogForm.title" class="form-control" />
            </div>
            <div class="form-group">
              <label>Summary</label>
              <textarea [(ngModel)]="blogForm.summary" class="form-control" rows="2"></textarea>
            </div>
            <div class="form-group">
              <label>Content (Markdown / Text)</label>
              <textarea [(ngModel)]="blogForm.content" class="form-control" rows="5"></textarea>
            </div>
            <div class="form-group">
              <label>Cover Image URL</label>
              <input type="text" [(ngModel)]="blogForm.coverImage" class="form-control" />
            </div>
            <div class="form-group">
              <label>Tags (comma separated)</label>
              <input type="text" [(ngModel)]="blogFormTagsRaw" class="form-control" placeholder="Angular, Security, Firebase" />
            </div>
            <div class="modal-actions">
              <button (click)="saveBlog()" class="btn-cinematic btn-sm">Save Blog Post</button>
              <button (click)="showModal = false" class="btn-cinematic btn-outline btn-sm">Cancel</button>
            </div>
          </div>

          <!-- PROJECT FORM -->
          <div *ngIf="activeTab === 'projects'" class="form-container">
            <div class="form-group">
              <label>Title</label>
              <input type="text" [(ngModel)]="projForm.title" class="form-control" />
            </div>
            <div class="form-group">
              <label>Tagline</label>
              <input type="text" [(ngModel)]="projForm.tagline" class="form-control" />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="projForm.description" class="form-control" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Category</label>
              <input type="text" [(ngModel)]="projForm.category" class="form-control" />
            </div>
            <div class="form-group">
              <label>Technologies (comma separated)</label>
              <input type="text" [(ngModel)]="projFormTechRaw" class="form-control" />
            </div>
            <div class="form-group">
              <label>Image URL</label>
              <input type="text" [(ngModel)]="projForm.imageUrl" class="form-control" />
            </div>
            <div class="modal-actions">
              <button (click)="saveProject()" class="btn-cinematic btn-sm">Save Project</button>
              <button (click)="showModal = false" class="btn-cinematic btn-outline btn-sm">Cancel</button>
            </div>
          </div>

          <!-- ACHIEVEMENT FORM -->
          <div *ngIf="activeTab === 'achievements'" class="form-container">
            <div class="form-group">
              <label>Title</label>
              <input type="text" [(ngModel)]="achieveForm.title" class="form-control" />
            </div>
            <div class="form-group">
              <label>Organization</label>
              <input type="text" [(ngModel)]="achieveForm.organization" class="form-control" />
            </div>
            <div class="form-group">
              <label>Category</label>
              <input type="text" [(ngModel)]="achieveForm.category" class="form-control" />
            </div>
            <div class="form-group">
              <label>Date (YYYY-MM-DD)</label>
              <input type="text" [(ngModel)]="achieveForm.date" class="form-control" />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="achieveForm.description" class="form-control" rows="3"></textarea>
            </div>
            <div class="modal-actions">
              <button (click)="saveAchievement()" class="btn-cinematic btn-sm">Save Achievement</button>
              <button (click)="showModal = false" class="btn-cinematic btn-outline btn-sm">Cancel</button>
            </div>
          </div>

          <!-- CERTIFICATE FORM -->
          <div *ngIf="activeTab === 'certificates'" class="form-container">
            <div class="form-group">
              <label>Title</label>
              <input type="text" [(ngModel)]="certForm.title" class="form-control" />
            </div>
            <div class="form-group">
              <label>Issuer</label>
              <input type="text" [(ngModel)]="certForm.issuer" class="form-control" />
            </div>
            <div class="form-group">
              <label>Issue Date</label>
              <input type="text" [(ngModel)]="certForm.issueDate" class="form-control" />
            </div>
            <div class="form-group">
              <label>Credential ID</label>
              <input type="text" [(ngModel)]="certForm.credentialId" class="form-control" />
            </div>
            <div class="modal-actions">
              <button (click)="saveCert()" class="btn-cinematic btn-sm">Save Certificate</button>
              <button (click)="showModal = false" class="btn-cinematic btn-outline btn-sm">Cancel</button>
            </div>
          </div>

          <!-- SKILL FORM -->
          <div *ngIf="activeTab === 'skills'" class="form-container">
            <div class="form-group">
              <label>Skill Name</label>
              <input type="text" [(ngModel)]="skillForm.name" class="form-control" />
            </div>
            <div class="form-group">
              <label>Category</label>
              <input type="text" [(ngModel)]="skillForm.category" class="form-control" />
            </div>
            <div class="form-group">
              <label>Proficiency (%)</label>
              <input type="number" [(ngModel)]="skillForm.proficiency" class="form-control" min="0" max="100" />
            </div>
            <div class="modal-actions">
              <button (click)="saveSkill()" class="btn-cinematic btn-sm">Save Skill</button>
              <button (click)="showModal = false" class="btn-cinematic btn-outline btn-sm">Cancel</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper { padding-top: 2rem; }

    .dashboard-header {
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      @media (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }

    .admin-tag {
      font-size: 0.75rem;
      font-weight: 800;
      color: var(--accent-cyan);
      letter-spacing: 0.08em;
    }

    .dash-title { font-size: 1.8rem; color: #fff; }
    .dash-sub { color: var(--text-muted); font-size: 0.85rem; }

    .tabs-bar {
      display: flex;
      gap: 0.5rem;
      padding: 0.5rem;
      margin-bottom: 1.5rem;
      overflow-x: auto;
    }

    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      white-space: nowrap;
      transition: var(--transition-smooth);

      &:hover { color: #fff; }
      &.active {
        background: var(--accent-indigo);
        color: #fff;
      }
    }

    .tab-content {
      padding: 1.5rem 2rem;
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      h2 { font-size: 1.4rem; color: #fff; }
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;

      th, td {
        padding: 0.9rem 1rem;
        border-bottom: 1px solid var(--border-glass);
        font-size: 0.9rem;
      }

      th {
        color: var(--text-dim);
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.75rem;
      }

      td {
        color: var(--text-muted);

        &.bold-cell {
          color: #fff;
          font-weight: 600;
        }
      }
    }

    .actions-cell {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      font-size: 0.75rem;
      border: none;
      cursor: pointer;
      font-weight: 600;

      &.edit {
        background: rgba(99, 102, 241, 0.2);
        color: #a5b4fc;
        &:hover { background: rgba(99, 102, 241, 0.4); }
      }

      &.delete {
        background: rgba(244, 63, 94, 0.2);
        color: #fca5a5;
        &:hover { background: rgba(244, 63, 94, 0.4); }
      }
    }

    /* MODAL */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .modal-card {
      width: 100%;
      max-width: 600px;
      padding: 2rem;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      h3 { font-size: 1.3rem; color: #fff; }
      .close-btn {
        background: transparent;
        border: none;
        color: var(--text-muted);
        font-size: 1.2rem;
        cursor: pointer;
      }
    }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      label { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }
    }

    .form-control {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-glass);
      padding: 0.6rem 0.8rem;
      border-radius: 6px;
      color: #fff;
      font-family: var(--font-body);
      outline: none;
    }

    .modal-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  authService = inject(AuthService);
  contentService = inject(ContentService);
  private router = inject(Router);

  activeTab: 'blogs' | 'projects' | 'achievements' | 'certificates' | 'skills' = 'blogs';

  blogs: Blog[] = [];
  projects: Project[] = [];
  achievements: Achievement[] = [];
  certificates: Certificate[] = [];
  skills: Skill[] = [];

  showModal = false;
  isEditMode = false;
  selectedId: string | null = null;

  // Forms
  blogForm: Partial<Blog> = {};
  blogFormTagsRaw = '';

  projForm: Partial<Project> = {};
  projFormTechRaw = '';

  achieveForm: Partial<Achievement> = {};

  certForm: Partial<Certificate> = {};

  skillForm: Partial<Skill> = {};

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.blogs = this.contentService.getBlogs();
    this.contentService.projects$.subscribe(p => this.projects = p);
    this.contentService.achievements$.subscribe(a => this.achievements = a);
    this.contentService.certificates$.subscribe(c => this.certificates = c);
    this.contentService.skills$.subscribe(s => this.skills = s);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Blog CRUD
  openBlogModal(blog?: Blog): void {
    if (blog) {
      this.isEditMode = true;
      this.selectedId = blog.id;
      this.blogForm = { ...blog };
      this.blogFormTagsRaw = blog.tags ? blog.tags.join(', ') : '';
    } else {
      this.isEditMode = false;
      this.selectedId = null;
      this.blogForm = { title: '', summary: '', content: '', authorName: 'Admin', readTimeMinutes: 5 };
      this.blogFormTagsRaw = '';
    }
    this.showModal = true;
  }

  saveBlog(): void {
    const tags = this.blogFormTagsRaw.split(',').map(t => t.trim()).filter(Boolean);
    if (this.isEditMode && this.selectedId) {
      this.contentService.updateBlog(this.selectedId, { ...this.blogForm, tags });
    } else {
      this.contentService.addBlog({
        title: this.blogForm.title || 'Untitled Post',
        slug: '',
        summary: this.blogForm.summary || '',
        content: this.blogForm.content || '',
        coverImage: this.blogForm.coverImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
        tags,
        readTimeMinutes: this.blogForm.readTimeMinutes || 5,
        publishedAt: new Date().toISOString(),
        authorName: 'Admin'
      });
    }
    this.refreshData();
    this.showModal = false;
  }

  deleteBlog(id: string): void {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.contentService.deleteBlog(id);
      this.refreshData();
    }
  }

  // Project CRUD
  openProjectModal(p?: Project): void {
    if (p) {
      this.isEditMode = true;
      this.selectedId = p.id;
      this.projForm = { ...p };
      this.projFormTechRaw = p.technologies ? p.technologies.join(', ') : '';
    } else {
      this.isEditMode = false;
      this.selectedId = null;
      this.projForm = { title: '', tagline: '', description: '', category: 'Web App' };
      this.projFormTechRaw = '';
    }
    this.showModal = true;
  }

  saveProject(): void {
    const technologies = this.projFormTechRaw.split(',').map(t => t.trim()).filter(Boolean);
    if (this.isEditMode && this.selectedId) {
      this.contentService.updateProject(this.selectedId, { ...this.projForm, technologies });
    } else {
      this.contentService.addProject({
        title: this.projForm.title || 'New Project',
        tagline: this.projForm.tagline || '',
        description: this.projForm.description || '',
        category: this.projForm.category || 'Web App',
        technologies,
        imageUrl: this.projForm.imageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
      });
    }
    this.refreshData();
    this.showModal = false;
  }

  deleteProject(id: string): void {
    if (confirm('Delete this project?')) {
      this.contentService.deleteProject(id);
      this.refreshData();
    }
  }

  // Achievement CRUD
  openAchievementModal(a?: Achievement): void {
    if (a) {
      this.isEditMode = true;
      this.selectedId = a.id;
      this.achieveForm = { ...a };
    } else {
      this.isEditMode = false;
      this.selectedId = null;
      this.achieveForm = { title: '', organization: '', category: 'Award', date: new Date().toISOString().split('T')[0] };
    }
    this.showModal = true;
  }

  saveAchievement(): void {
    if (this.isEditMode && this.selectedId) {
      this.contentService.updateAchievement(this.selectedId, this.achieveForm);
    } else {
      this.contentService.addAchievement({
        title: this.achieveForm.title || 'New Achievement',
        organization: this.achieveForm.organization || '',
        category: this.achieveForm.category || 'Award',
        date: this.achieveForm.date || new Date().toISOString().split('T')[0],
        description: this.achieveForm.description || ''
      });
    }
    this.refreshData();
    this.showModal = false;
  }

  deleteAchievement(id: string): void {
    if (confirm('Delete this achievement?')) {
      this.contentService.deleteAchievement(id);
      this.refreshData();
    }
  }

  // Cert CRUD
  openCertModal(c?: Certificate): void {
    if (c) {
      this.isEditMode = true;
      this.selectedId = c.id;
      this.certForm = { ...c };
    } else {
      this.isEditMode = false;
      this.selectedId = null;
      this.certForm = { title: '', issuer: '', issueDate: new Date().toISOString().split('T')[0] };
    }
    this.showModal = true;
  }

  saveCert(): void {
    if (this.isEditMode && this.selectedId) {
      this.contentService.updateCertificate(this.selectedId, this.certForm);
    } else {
      this.contentService.addCertificate({
        title: this.certForm.title || 'New Certificate',
        issuer: this.certForm.issuer || 'Issuer',
        issueDate: this.certForm.issueDate || new Date().toISOString().split('T')[0],
        skillsCovered: []
      });
    }
    this.refreshData();
    this.showModal = false;
  }

  deleteCert(id: string): void {
    if (confirm('Delete this certificate?')) {
      this.contentService.deleteCertificate(id);
      this.refreshData();
    }
  }

  // Skill CRUD
  openSkillModal(s?: Skill): void {
    if (s) {
      this.isEditMode = true;
      this.selectedId = s.id;
      this.skillForm = { ...s };
    } else {
      this.isEditMode = false;
      this.selectedId = null;
      this.skillForm = { name: '', category: 'Frontend', proficiency: 85 };
    }
    this.showModal = true;
  }

  saveSkill(): void {
    if (this.isEditMode && this.selectedId) {
      this.contentService.updateSkill(this.selectedId, this.skillForm);
    } else {
      this.contentService.addSkill({
        name: this.skillForm.name || 'New Skill',
        category: this.skillForm.category || 'Frontend',
        proficiency: this.skillForm.proficiency || 80
      });
    }
    this.refreshData();
    this.showModal = false;
  }

  deleteSkill(id: string): void {
    if (confirm('Delete this skill?')) {
      this.contentService.deleteSkill(id);
      this.refreshData();
    }
  }
}
