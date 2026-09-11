import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';
import { AuthService } from '../../../core/services/auth.service';
import { ImageUploaderComponent } from '../../../shared/components/image-uploader/image-uploader.component';
import {
  Blog,
  Project,
  Achievement,
  Certificate,
  Skill,
  Experience,
  ContactMessage,
} from '../../../core/models/portfolio.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploaderComponent],
  template: `
    <div class="container-custom dashboard-wrapper">
      <!-- Admin Header Bar -->
      <div class="dashboard-header glass-panel">
        <div>
          <span class="admin-tag">⚡ PORTFOLIO CONTROL CENTER</span>
          <h1 class="dash-title">Admin Management Dashboard</h1>
          <p class="dash-sub">
            Logged in as:
            <strong>{{ (authService.currentUser$ | async)?.email }}</strong>
          </p>
        </div>
        <button (click)="logout()" class="btn-cinematic btn-outline btn-sm">
          Logout Admin
        </button>
      </div>

      <!-- Navigation Tabs -->
      <div class="tabs-bar glass-panel">
        <button
          class="tab-btn"
          [class.active]="activeTab === 'blogs'"
          (click)="activeTab = 'blogs'"
        >
          📝 Blogs ({{ blogs.length }})
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab === 'experiences'"
          (click)="activeTab = 'experiences'"
        >
          💼 Experiences ({{ experiences.length }})
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab === 'projects'"
          (click)="activeTab = 'projects'"
        >
          🚀 Projects ({{ projects.length }})
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab === 'achievements'"
          (click)="activeTab = 'achievements'"
        >
          🏆 Achievements ({{ achievements.length }})
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab === 'certificates'"
          (click)="activeTab = 'certificates'"
        >
          📜 Certificates ({{ certificates.length }})
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab === 'skills'"
          (click)="activeTab = 'skills'"
        >
          💡 Skills ({{ skills.length }})
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab === 'messages'"
          (click)="activeTab = 'messages'"
        >
          💬 Messages ({{ messages.length }})
        </button>
      </div>

      <!-- BLOGS TAB -->
      <div class="tab-content glass-panel" *ngIf="activeTab === 'blogs'">
        <div class="content-header">
          <h2>Manage Blog Posts</h2>
          <button (click)="openBlogModal()" class="btn-cinematic btn-sm">
            + Create New Blog
          </button>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Blog Article</th>
              <th>Published</th>
              <th>Read Time</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of blogs">
              <td class="bold-cell">
                <div class="table-item-cell">
                  <img
                    *ngIf="item.coverImage"
                    [src]="item.coverImage"
                    alt="Cover"
                    class="table-thumb"
                  />
                  <div *ngIf="!item.coverImage" class="table-icon-fallback">
                    📝
                  </div>
                  <span>{{ item.title }}</span>
                </div>
              </td>
              <td>{{ item.publishedAt | date: 'shortDate' }}</td>
              <td>{{ item.readTimeMinutes }} mins</td>
              <td>{{ item.viewsCount || 0 }}</td>
              <td class="actions-cell">
                <button (click)="openBlogModal(item)" class="action-btn edit">
                  Edit
                </button>
                <button (click)="deleteBlog(item.id)" class="action-btn delete">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- EXPERIENCES TAB -->
      <div class="tab-content glass-panel" *ngIf="activeTab === 'experiences'">
        <div class="content-header">
          <h2>Manage Work Experiences</h2>
          <button (click)="openExpModal()" class="btn-cinematic btn-sm">
            + Add Experience
          </button>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Organization</th>
              <th>Period</th>
              <th>Responsibilities</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let exp of experiences">
              <td class="bold-cell">{{ exp.jobTitle }}</td>
              <td>{{ exp.organization }}</td>
              <td>
                <span class="badge-tag"
                  >{{ exp.startDate }} - {{ exp.endDate }}</span
                >
              </td>
              <td>{{ exp.responsibilities.length || 0 }} bullets</td>
              <td class="actions-cell">
                <button (click)="openExpModal(exp)" class="action-btn edit">
                  Edit
                </button>
                <button (click)="deleteExp(exp.id)" class="action-btn delete">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PROJECTS TAB -->
      <div class="tab-content glass-panel" *ngIf="activeTab === 'projects'">
        <div class="content-header">
          <h2>Manage Projects</h2>
          <button (click)="openProjectModal()" class="btn-cinematic btn-sm">
            + Add Project
          </button>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Category</th>
              <th>Tagline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of projects">
              <td class="bold-cell">
                <div class="table-item-cell">
                  <img
                    *ngIf="p.imageUrl"
                    [src]="p.imageUrl"
                    alt="Project"
                    class="table-thumb"
                  />
                  <div *ngIf="!p.imageUrl" class="table-icon-fallback">🚀</div>
                  <span>{{ p.title }}</span>
                </div>
              </td>
              <td>
                <span class="badge-tag">{{ p.category }}</span>
              </td>
              <td>{{ p.tagline }}</td>
              <td class="actions-cell">
                <button (click)="openProjectModal(p)" class="action-btn edit">
                  Edit
                </button>
                <button (click)="deleteProject(p.id)" class="action-btn delete">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ACHIEVEMENTS TAB -->
      <div class="tab-content glass-panel" *ngIf="activeTab === 'achievements'">
        <div class="content-header">
          <h2>Manage Achievements</h2>
          <button (click)="openAchievementModal()" class="btn-cinematic btn-sm">
            + Add Achievement
          </button>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Achievement</th>
              <th>Organization</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of achievements">
              <td class="bold-cell">
                <div class="table-item-cell">
                  <img
                    *ngIf="a.badgeUrl"
                    [src]="a.badgeUrl"
                    alt="Badge"
                    class="table-thumb"
                  />
                  <div *ngIf="!a.badgeUrl" class="table-icon-fallback">🏆</div>
                  <span>{{ a.title }}</span>
                </div>
              </td>
              <td>{{ a.organization }}</td>
              <td>
                <span class="badge-tag">{{ a.category }}</span>
              </td>
              <td>{{ a.date }}</td>
              <td class="actions-cell">
                <button
                  (click)="openAchievementModal(a)"
                  class="action-btn edit"
                >
                  Edit
                </button>
                <button
                  (click)="deleteAchievement(a.id)"
                  class="action-btn delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- CERTIFICATES TAB -->
      <div class="tab-content glass-panel" *ngIf="activeTab === 'certificates'">
        <div class="content-header">
          <h2>Manage Certificates</h2>
          <button (click)="openCertModal()" class="btn-cinematic btn-sm">
            + Add Certificate
          </button>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Certificate</th>
              <th>Issuer</th>
              <th>Issue Date</th>
              <th>Credential ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of certificates">
              <td class="bold-cell">
                <div class="table-item-cell">
                  <img
                    *ngIf="c.badgeUrl"
                    [src]="c.badgeUrl"
                    alt="Certificate"
                    class="table-thumb"
                  />
                  <div *ngIf="!c.badgeUrl" class="table-icon-fallback">📜</div>
                  <span>{{ c.title }}</span>
                </div>
              </td>
              <td>{{ c.issuer }}</td>
              <td>{{ c.issueDate }}</td>
              <td>
                <code>{{ c.credentialId || 'N/A' }}</code>
              </td>
              <td class="actions-cell">
                <button (click)="openCertModal(c)" class="action-btn edit">
                  Edit
                </button>
                <button (click)="deleteCert(c.id)" class="action-btn delete">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- SKILLS TAB -->
      <div class="tab-content glass-panel" *ngIf="activeTab === 'skills'">
        <div class="content-header">
          <h2>Manage Technical Skills</h2>
          <button (click)="openSkillModal()" class="btn-cinematic btn-sm">
            + Add Skill
          </button>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Category</th>
              <th>Proficiency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of skills">
              <td class="bold-cell">
                <div class="table-item-cell">
                  <img
                    *ngIf="
                      s.icon &&
                      (s.icon.startsWith('http') ||
                        s.icon.startsWith('/') ||
                        s.icon.startsWith('data:'))
                    "
                    [src]="s.icon"
                    alt="Icon"
                    class="table-thumb"
                  />
                  <div
                    *ngIf="
                      !s.icon ||
                      (!s.icon.startsWith('http') &&
                        !s.icon.startsWith('/') &&
                        !s.icon.startsWith('data:'))
                    "
                    class="table-icon-fallback"
                  >
                    {{ s.icon || '💡' }}
                  </div>
                  <span>{{ s.name }}</span>
                </div>
              </td>
              <td>
                <span class="badge-tag">{{ s.category }}</span>
              </td>
              <td>{{ s.proficiency }}%</td>
              <td class="actions-cell">
                <button (click)="openSkillModal(s)" class="action-btn edit">
                  Edit
                </button>
                <button (click)="deleteSkill(s.id)" class="action-btn delete">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- MESSAGES TAB -->
      <div class="tab-content glass-panel" *ngIf="activeTab === 'messages'">
        <div class="content-header">
          <h2>Contact Inquiries & Messages</h2>
          <button (click)="refreshMessages()" class="btn-cinematic btn-sm">
            🔄 Refresh Messages
          </button>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Email / Contact</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let msg of messages">
              <td class="bold-cell">{{ msg.name }}</td>
              <td>
                <div>{{ msg.email }}</div>
                <div
                  style="font-size: 0.75rem; color: var(--text-dim);"
                  *ngIf="msg.contact"
                >
                  📞 {{ msg.contact }}
                </div>
              </td>
              <td
                style="max-width: 320px; line-height: 1.4; font-size: 0.85rem;"
              >
                {{ msg.message }}
              </td>
              <td style="font-size: 0.8rem; color: var(--text-dim);">
                {{ msg.createdAt | date: 'short' }}
              </td>
              <td>
                <span
                  class="badge-tag"
                  [style.background]="
                    msg.read
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'rgba(244, 63, 94, 0.15)'
                  "
                >
                  {{ msg.read ? '✓ Read' : '✉ New' }}
                </span>
              </td>
              <td class="actions-cell">
                <button
                  (click)="toggleMessageRead(msg)"
                  class="action-btn edit"
                >
                  {{ msg.read ? 'Unread' : 'Mark Read' }}
                </button>
                <button
                  (click)="deleteMessage(msg.id)"
                  class="action-btn delete"
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr *ngIf="messages.length === 0">
              <td
                colspan="6"
                style="text-align: center; color: var(--text-dim); padding: 2rem;"
              >
                No contact messages received yet.
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
            <div class="form-mode-switch">
              <button
                type="button"
                class="form-mode-btn"
                [class.active]="!blogPreviewMode"
                (click)="blogPreviewMode = false"
              >
                ✏️ Edit Content
              </button>
              <button
                type="button"
                class="form-mode-btn"
                [class.active]="blogPreviewMode"
                (click)="blogPreviewMode = true"
              >
                👁 Live Preview
              </button>
            </div>

            <div *ngIf="!blogPreviewMode">
              <div class="form-group">
                <label>Title</label>
                <input
                  type="text"
                  [(ngModel)]="blogForm.title"
                  class="form-control"
                  placeholder="e.g. Consistent Error Handling with ProblemDetails"
                />
              </div>
              <div class="form-group">
                <label>Summary</label>
                <textarea
                  [(ngModel)]="blogForm.summary"
                  class="form-control"
                  rows="2"
                  placeholder="Short introductory summary"
                ></textarea>
              </div>
              <div class="form-group">
                <label>Content (Markdown / Code / Headings / Text)</label>
                <textarea
                  [(ngModel)]="blogForm.content"
                  class="form-control content-textarea"
                  rows="9"
                  placeholder="Type or paste your markdown, headers (#, ##, ###), code blocks, JSON, ASCII flows..."
                ></textarea>
              </div>
              <app-image-uploader
                label="Cover Image"
                [value]="blogForm.coverImage || ''"
                (valueChange)="blogForm.coverImage = $event"
                placeholder="https://images.unsplash.com/... or upload a file"
              ></app-image-uploader>
              <div class="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  [(ngModel)]="blogFormTagsRaw"
                  class="form-control"
                  placeholder="Angular, Security, Firebase, ASP.NET"
                />
              </div>
            </div>

            <!-- LIVE PREVIEW CONTAINER -->
            <div *ngIf="blogPreviewMode" class="blog-live-preview-box">
              <div class="preview-cover" *ngIf="blogForm.coverImage">
                <img [src]="blogForm.coverImage" alt="Cover" />
              </div>
              <h2 class="preview-title">
                {{ blogForm.title || 'Untitled Blog Post' }}
              </h2>
              <p class="preview-summary" *ngIf="blogForm.summary">
                {{ blogForm.summary }}
              </p>
              <div
                class="preview-content-rendered"
                [innerHTML]="formatBlogPreview(blogForm.content || '')"
              ></div>
            </div>

            <div class="modal-actions">
              <button (click)="saveBlog()" class="btn-cinematic btn-sm">
                Save Blog Post
              </button>
              <button
                (click)="showModal = false"
                class="btn-cinematic btn-outline btn-sm"
              >
                Cancel
              </button>
            </div>
          </div>

          <!-- EXPERIENCE FORM -->
          <div *ngIf="activeTab === 'experiences'" class="form-container">
            <div class="form-group">
              <label>Job Title</label>
              <input
                type="text"
                [(ngModel)]="expForm.jobTitle"
                class="form-control"
                placeholder="e.g. Senior Full-Stack Engineer"
              />
            </div>
            <div class="form-group">
              <label>Organization / Company</label>
              <input
                type="text"
                [(ngModel)]="expForm.organization"
                class="form-control"
                placeholder="e.g. Aether Tech"
              />
            </div>
            <div class="form-group">
              <label>Start Date (e.g. Jan 2023)</label>
              <input
                type="text"
                [(ngModel)]="expForm.startDate"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>End Date (e.g. Present or Dec 2024)</label>
              <input
                type="text"
                [(ngModel)]="expForm.endDate"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Location (Optional)</label>
              <input
                type="text"
                [(ngModel)]="expForm.location"
                class="form-control"
                placeholder="e.g. Remote / San Francisco"
              />
            </div>
            <div class="form-group">
              <label>Responsibilities (One per line)</label>
              <textarea
                [(ngModel)]="expFormRespRaw"
                class="form-control"
                rows="4"
                placeholder="Built micro-frontends in Angular&#10;Deployed Neon DB APIs"
              ></textarea>
            </div>
            <div class="modal-actions">
              <button (click)="saveExp()" class="btn-cinematic btn-sm">
                Save Experience
              </button>
              <button
                (click)="showModal = false"
                class="btn-cinematic btn-outline btn-sm"
              >
                Cancel
              </button>
            </div>
          </div>

          <!-- PROJECT FORM -->
          <div *ngIf="activeTab === 'projects'" class="form-container">
            <div class="form-group">
              <label>Title</label>
              <input
                type="text"
                [(ngModel)]="projForm.title"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Tagline</label>
              <input
                type="text"
                [(ngModel)]="projForm.tagline"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea
                [(ngModel)]="projForm.description"
                class="form-control"
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label>Category</label>
              <input
                type="text"
                [(ngModel)]="projForm.category"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Technologies (comma separated)</label>
              <input
                type="text"
                [(ngModel)]="projFormTechRaw"
                class="form-control"
              />
            </div>
            <app-image-uploader
              label="Project Showcase Image"
              [value]="projForm.imageUrl || ''"
              (valueChange)="projForm.imageUrl = $event"
              placeholder="https://images.unsplash.com/... or upload a file"
            ></app-image-uploader>
            <div class="modal-actions">
              <button (click)="saveProject()" class="btn-cinematic btn-sm">
                Save Project
              </button>
              <button
                (click)="showModal = false"
                class="btn-cinematic btn-outline btn-sm"
              >
                Cancel
              </button>
            </div>
          </div>

          <!-- ACHIEVEMENT FORM -->
          <div *ngIf="activeTab === 'achievements'" class="form-container">
            <div class="form-group">
              <label>Title</label>
              <input
                type="text"
                [(ngModel)]="achieveForm.title"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Organization</label>
              <input
                type="text"
                [(ngModel)]="achieveForm.organization"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Category</label>
              <input
                type="text"
                [(ngModel)]="achieveForm.category"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Date (YYYY-MM-DD)</label>
              <input
                type="text"
                [(ngModel)]="achieveForm.date"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea
                [(ngModel)]="achieveForm.description"
                class="form-control"
                rows="3"
              ></textarea>
            </div>
            <app-image-uploader
              label="Achievement Badge / Image"
              [value]="achieveForm.badgeUrl || ''"
              (valueChange)="achieveForm.badgeUrl = $event"
              placeholder="Upload award badge / photo or paste URL"
            ></app-image-uploader>
            <div class="modal-actions">
              <button (click)="saveAchievement()" class="btn-cinematic btn-sm">
                Save Achievement
              </button>
              <button
                (click)="showModal = false"
                class="btn-cinematic btn-outline btn-sm"
              >
                Cancel
              </button>
            </div>
          </div>

          <!-- CERTIFICATE FORM -->
          <div *ngIf="activeTab === 'certificates'" class="form-container">
            <div class="form-group">
              <label>Title</label>
              <input
                type="text"
                [(ngModel)]="certForm.title"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Issuer</label>
              <input
                type="text"
                [(ngModel)]="certForm.issuer"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Issue Date</label>
              <input
                type="text"
                [(ngModel)]="certForm.issueDate"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Credential ID</label>
              <input
                type="text"
                [(ngModel)]="certForm.credentialId"
                class="form-control"
              />
            </div>
            <app-image-uploader
              label="Certificate Badge / Image"
              [value]="certForm.badgeUrl || ''"
              (valueChange)="certForm.badgeUrl = $event"
              placeholder="Upload certificate image or paste badge URL"
            ></app-image-uploader>
            <div class="modal-actions">
              <button (click)="saveCert()" class="btn-cinematic btn-sm">
                Save Certificate
              </button>
              <button
                (click)="showModal = false"
                class="btn-cinematic btn-outline btn-sm"
              >
                Cancel
              </button>
            </div>
          </div>

          <!-- SKILL FORM -->
          <div *ngIf="activeTab === 'skills'" class="form-container">
            <div class="form-group">
              <label>Skill Name</label>
              <input
                type="text"
                [(ngModel)]="skillForm.name"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Category</label>
              <input
                type="text"
                [(ngModel)]="skillForm.category"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Proficiency (%)</label>
              <input
                type="number"
                [(ngModel)]="skillForm.proficiency"
                class="form-control"
                min="0"
                max="100"
              />
            </div>
            <app-image-uploader
              label="Skill Icon / Image"
              [value]="skillForm.icon || ''"
              (valueChange)="skillForm.icon = $event"
              placeholder="Upload logo/icon or paste image URL"
            ></app-image-uploader>
            <div class="modal-actions">
              <button (click)="saveSkill()" class="btn-cinematic btn-sm">
                Save Skill
              </button>
              <button
                (click)="showModal = false"
                class="btn-cinematic btn-outline btn-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-wrapper {
        padding-top: 2rem;
      }

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

      .dash-title {
        font-size: 1.8rem;
        color: #fff;
      }
      .dash-sub {
        color: var(--text-muted);
        font-size: 0.85rem;
      }

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

        &:hover {
          color: #fff;
        }
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

        h2 {
          font-size: 1.4rem;
          color: #fff;
        }
      }

      .admin-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;

        th,
        td {
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

      .table-item-cell {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .table-thumb {
        width: 36px;
        height: 36px;
        border-radius: 6px;
        object-fit: cover;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        flex-shrink: 0;
      }

      .table-icon-fallback {
        width: 36px;
        height: 36px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.05);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
        flex-shrink: 0;
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
          &:hover {
            background: rgba(99, 102, 241, 0.4);
          }
        }

        &.delete {
          background: rgba(244, 63, 94, 0.2);
          color: #fca5a5;
          &:hover {
            background: rgba(244, 63, 94, 0.4);
          }
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
        h3 {
          font-size: 1.3rem;
          color: #fff;
        }
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
        label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }
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

      .content-textarea {
        font-family: 'Fira Code', Consolas, Monaco, monospace;
        font-size: 0.88rem;
        line-height: 1.5;
        white-space: pre-wrap;
      }

      .form-mode-switch {
        display: flex;
        gap: 0.4rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-glass);
        padding: 3px;
        border-radius: 8px;
        margin-bottom: 1rem;
      }

      .form-mode-btn {
        flex: 1;
        background: transparent;
        border: none;
        color: var(--text-muted);
        padding: 0.4rem 0.8rem;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          color: #fff;
        }

        &.active {
          background: var(--accent-indigo);
          color: #fff;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        }
      }

      .blog-live-preview-box {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 1.5rem;
        max-height: 450px;
        overflow-y: auto;
        margin-bottom: 1rem;

        .preview-cover img {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .preview-title {
          font-size: 1.4rem;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .preview-summary {
          color: var(--text-muted);
          font-style: italic;
          border-left: 3px solid var(--accent-cyan);
          padding-left: 0.75rem;
          margin-bottom: 1.25rem;
          font-size: 0.95rem;
        }
      }

      ::ng-deep .preview-content-rendered {
        color: #cbd5e1;
        font-size: 0.95rem;
        line-height: 1.7;

        .blog-h1,
        .blog-h2,
        .blog-h3,
        .blog-h4 {
          color: #fff;
          margin: 1.25rem 0 0.5rem 0;
        }
        .blog-h3 {
          color: var(--accent-cyan);
        }
        .blog-p {
          margin-bottom: 1rem;
        }
        .code-card {
          background: #090d16;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0.85rem 1rem;
          margin: 1rem 0;
          font-family: monospace;
          color: #38bdf8;
          overflow-x: auto;
          font-size: 0.85rem;
          white-space: pre;
        }
        .diagram-card {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 8px;
          padding: 0.85rem 1rem;
          margin: 1rem 0;
          font-family: monospace;
          color: #67e8f9;
          overflow-x: auto;
          font-size: 0.85rem;
          white-space: pre;
        }

        .compact-flow-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          max-width: 440px;
          margin: 1.25rem auto;
          padding: 1rem 0.85rem;
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(6, 182, 212, 0.25);
          border-radius: 12px;
          text-align: center;
        }
        .compact-step-pill {
          display: inline-block;
          background: rgba(30, 41, 59, 0.9);
          border: 1px solid rgba(6, 182, 212, 0.35);
          color: #f1f5f9;
          font-size: 0.84rem;
          font-weight: 600;
          padding: 0.35rem 0.9rem;
          border-radius: 20px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        .compact-step-arrow {
          color: var(--accent-cyan);
          font-size: 0.95rem;
          font-weight: 800;
          margin: 0.2rem 0;
          line-height: 1;
        }
        .inline-code {
          background: rgba(99, 102, 241, 0.15);
          color: #a5b4fc;
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          font-family: monospace;
        }
        .list-item-num,
        .list-item-bullet {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.4rem;
          .list-num,
          .bullet-dot {
            color: var(--accent-cyan);
            font-weight: bold;
          }
        }
      }

      .modal-actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 1rem;
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  authService = inject(AuthService);
  contentService = inject(ContentService);
  private router = inject(Router);

  activeTab:
    | 'blogs'
    | 'experiences'
    | 'projects'
    | 'achievements'
    | 'certificates'
    | 'skills'
    | 'messages' = 'blogs';

  blogs: Blog[] = [];
  experiences: Experience[] = [];
  projects: Project[] = [];
  achievements: Achievement[] = [];
  certificates: Certificate[] = [];
  skills: Skill[] = [];
  messages: ContactMessage[] = [];

  showModal = false;
  isEditMode = false;
  selectedId: string | null = null;
  blogPreviewMode = false;

  // Forms
  blogForm: Partial<Blog> = {};
  blogFormTagsRaw = '';

  expForm: Partial<Experience> = {};
  expFormRespRaw = '';

  projForm: Partial<Project> = {};
  projFormTechRaw = '';

  achieveForm: Partial<Achievement> = {};

  certForm: Partial<Certificate> = {};

  skillForm: Partial<Skill> = {};

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.contentService.fetchAllFromApi();
    this.contentService.blogs$.subscribe((b) => (this.blogs = b));
    this.contentService.experiences$.subscribe((e) => (this.experiences = e));
    this.contentService.projects$.subscribe((p) => (this.projects = p));
    this.contentService.achievements$.subscribe((a) => (this.achievements = a));
    this.contentService.certificates$.subscribe((c) => (this.certificates = c));
    this.contentService.skills$.subscribe((skills) => {
      this.skills = [...skills].sort((a, b) => {
        const idA = Number(a.id.replace('sk-', ''));
        const idB = Number(b.id.replace('sk-', ''));

        return idA - idB;
      });
    });
    this.refreshMessages();
  }

  refreshMessages(): void {
    this.contentService.getContactMessages().subscribe({
      next: (msgs) => (this.messages = msgs || []),
      error: (err) => console.error('Failed to load contact messages:', err),
    });
  }

  toggleMessageRead(msg: ContactMessage): void {
    const targetState = !msg.read;
    this.contentService.markMessageRead(msg.id, targetState).subscribe({
      next: () => (msg.read = targetState),
    });
  }

  deleteMessage(id: string): void {
    if (!confirm('Are you sure you want to delete this message?')) return;
    this.contentService.deleteContactMessage(id).subscribe({
      next: () => (this.messages = this.messages.filter((m) => m.id !== id)),
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Blog CRUD
  openBlogModal(blog?: Blog): void {
    this.blogPreviewMode = false;
    if (blog) {
      this.isEditMode = true;
      this.selectedId = blog.id;
      this.blogForm = { ...blog };
      this.blogFormTagsRaw = blog.tags ? blog.tags.join(', ') : '';
    } else {
      this.isEditMode = false;
      this.selectedId = null;
      this.blogForm = {
        title: '',
        summary: '',
        content: '',
        authorName: 'Admin',
        readTimeMinutes: 5,
      };
      this.blogFormTagsRaw = '';
    }
    this.showModal = true;
  }

  saveBlog(): void {
    const tags = this.blogFormTagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (this.isEditMode && this.selectedId) {
      this.contentService
        .updateBlog(this.selectedId, { ...this.blogForm, tags })
        .subscribe({
          next: () => this.contentService.fetchAllFromApi(),
          error: (e) => alert('Error updating blog: ' + e.message),
        });
    } else {
      this.contentService
        .addBlog({
          title: this.blogForm.title || 'Untitled Post',
          slug: '',
          summary: this.blogForm.summary || '',
          content: this.blogForm.content || '',
          coverImage: this.blogForm.coverImage || '',
          tags,
          readTimeMinutes: this.blogForm.readTimeMinutes || 5,
          publishedAt: new Date().toISOString(),
          authorName: this.blogForm.authorName || 'Admin',
        })
        .subscribe({
          next: () => this.contentService.fetchAllFromApi(),
          error: (e) => alert('Error creating blog: ' + e.message),
        });
    }
    this.showModal = false;
  }

  deleteBlog(id: string): void {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.contentService.deleteBlog(id).subscribe({
        error: (e) => alert('Error deleting blog: ' + e.message),
      });
    }
  }

  // Experience CRUD
  openExpModal(exp?: Experience): void {
    if (exp) {
      this.isEditMode = true;
      this.selectedId = exp.id;
      this.expForm = { ...exp };
      this.expFormRespRaw = exp.responsibilities
        ? exp.responsibilities.join('\n')
        : '';
    } else {
      this.isEditMode = false;
      this.selectedId = null;
      this.expForm = {
        jobTitle: '',
        organization: '',
        startDate: 'Jan 2023',
        endDate: 'Present',
        location: '',
      };
      this.expFormRespRaw = '';
    }
    this.showModal = true;
  }

  saveExp(): void {
    const responsibilities = this.expFormRespRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (this.isEditMode && this.selectedId) {
      this.contentService
        .updateExperience(this.selectedId, {
          ...this.expForm,
          responsibilities,
        })
        .subscribe({
          error: (e) => alert('Error updating experience: ' + e.message),
        });
    } else {
      this.contentService
        .addExperience({
          jobTitle: this.expForm.jobTitle || 'Software Engineer',
          organization: this.expForm.organization || 'Company',
          startDate: this.expForm.startDate || 'Jan 2023',
          endDate: this.expForm.endDate || 'Present',
          location: this.expForm.location || '',
          responsibilities,
        })
        .subscribe({
          error: (e) => alert('Error creating experience: ' + e.message),
        });
    }
    this.showModal = false;
  }

  deleteExp(id: string): void {
    if (confirm('Delete this work experience?')) {
      this.contentService.deleteExperience(id).subscribe({
        error: (e) => alert('Error deleting experience: ' + e.message),
      });
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
      this.projForm = {
        title: '',
        tagline: '',
        description: '',
        category: 'Web App',
      };
      this.projFormTechRaw = '';
    }
    this.showModal = true;
  }

  saveProject(): void {
    const technologies = this.projFormTechRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (this.isEditMode && this.selectedId) {
      this.contentService
        .updateProject(this.selectedId, { ...this.projForm, technologies })
        .subscribe({
          next: () => this.contentService.fetchAllFromApi(),
          error: (e) => alert('Error updating project: ' + e.message),
        });
    } else {
      this.contentService
        .addProject({
          title: this.projForm.title || 'New Project',
          tagline: this.projForm.tagline || '',
          description: this.projForm.description || '',
          category: this.projForm.category || 'Web App',
          technologies,
          imageUrl: this.projForm.imageUrl || '',
        })
        .subscribe({
          next: () => this.contentService.fetchAllFromApi(),
          error: (e) => alert('Error creating project: ' + e.message),
        });
    }
    this.showModal = false;
  }

  deleteProject(id: string): void {
    if (confirm('Delete this project?')) {
      this.contentService.deleteProject(id).subscribe({
        error: (e) => alert('Error deleting project: ' + e.message),
      });
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
      this.achieveForm = {
        title: '',
        organization: '',
        category: 'Award',
        date: new Date().toISOString().split('T')[0],
      };
    }
    this.showModal = true;
  }

  saveAchievement(): void {
    if (this.isEditMode && this.selectedId) {
      this.contentService
        .updateAchievement(this.selectedId, this.achieveForm)
        .subscribe({
          next: () => this.contentService.fetchAllFromApi(),
          error: (e) => alert('Error updating achievement: ' + e.message),
        });
    } else {
      this.contentService
        .addAchievement({
          title: this.achieveForm.title || 'New Achievement',
          organization: this.achieveForm.organization || '',
          category: this.achieveForm.category || 'Award',
          date: this.achieveForm.date || new Date().toISOString().split('T')[0],
          description: this.achieveForm.description || '',
          badgeUrl: this.achieveForm.badgeUrl || '',
        })
        .subscribe({
          next: () => this.contentService.fetchAllFromApi(),
          error: (e) => alert('Error creating achievement: ' + e.message),
        });
    }
    this.showModal = false;
  }

  deleteAchievement(id: string): void {
    if (confirm('Delete this achievement?')) {
      this.contentService.deleteAchievement(id).subscribe({
        error: (e) => alert('Error deleting achievement: ' + e.message),
      });
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
      this.certForm = {
        title: '',
        issuer: '',
        issueDate: new Date().toISOString().split('T')[0],
      };
    }
    this.showModal = true;
  }

  saveCert(): void {
    if (this.isEditMode && this.selectedId) {
      this.contentService
        .updateCertificate(this.selectedId, this.certForm)
        .subscribe({
          next: () => this.contentService.fetchAllFromApi(),
          error: (e) => alert('Error updating certificate: ' + e.message),
        });
    } else {
      this.contentService
        .addCertificate({
          title: this.certForm.title || 'New Certificate',
          issuer: this.certForm.issuer || 'Issuer',
          issueDate:
            this.certForm.issueDate || new Date().toISOString().split('T')[0],
          credentialId: this.certForm.credentialId || '',
          credentialUrl: this.certForm.credentialUrl || '',
          badgeUrl: this.certForm.badgeUrl || '',
          skillsCovered: [],
        })
        .subscribe({
          next: () => this.contentService.fetchAllFromApi(),
          error: (e) => alert('Error creating certificate: ' + e.message),
        });
    }
    this.showModal = false;
  }

  deleteCert(id: string): void {
    if (confirm('Delete this certificate?')) {
      this.contentService.deleteCertificate(id).subscribe({
        error: (e) => alert('Error deleting certificate: ' + e.message),
      });
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
      this.contentService
        .updateSkill(this.selectedId, this.skillForm)
        .subscribe({
          next: () => this.contentService.fetchAllFromApi(),
          error: (e) => alert('Error updating skill: ' + e.message),
        });
    } else {
      this.contentService
        .addSkill({
          name: this.skillForm.name || 'New Skill',
          category: this.skillForm.category || 'Frontend',
          proficiency: this.skillForm.proficiency || 80,
          icon: this.skillForm.icon || '',
        })
        .subscribe({
          next: () => this.contentService.fetchAllFromApi(),
          error: (e) => alert('Error creating skill: ' + e.message),
        });
    }
    this.showModal = false;
  }

  deleteSkill(id: string): void {
    if (confirm('Delete this skill?')) {
      this.contentService.deleteSkill(id).subscribe({
        error: (e) => alert('Error deleting skill: ' + e.message),
      });
    }
  }

  formatBlogPreview(content: string): string {
    if (!content)
      return '<p style="color: var(--text-dim);">No content typed yet...</p>';
    let text = content;
    const codeBlocks: string[] = [];

    text = text.replace(
      /```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g,
      (_m, lang, code) => {
        const idx = codeBlocks.length;
        const cleanLang = lang ? lang.trim() : '';
        const langBadge = cleanLang
          ? `<span class="code-badge">${cleanLang}</span>`
          : '';
        codeBlocks.push(
          `<div class="code-card">${langBadge}<pre class="code-pre"><code>${this.escapeHtml(code.trim())}</code></pre></div>`,
        );
        return `%%CODEBLOCK${idx}%%`;
      },
    );

    text = text.replace(
      /(?:^|\n)(\{\s*[\r\n]+[\s\S]*?[\r\n]+\})/gm,
      (_m, jsonStr) => {
        const idx = codeBlocks.length;
        codeBlocks.push(
          `<div class="code-card"><span class="code-badge">json</span><pre class="code-pre"><code>${this.escapeHtml(jsonStr.trim())}</code></pre></div>`,
        );
        return `\n%%CODEBLOCK${idx}%%\n`;
      },
    );

    // 3. Compact Centered Flowcharts & Diagrams
    const flowBlockRegex = /(?:^|\n)(?:(?:The flow looks like this:?|Flowchart:?|Process:?)\s*\n?)?((?:[^\n]+\s*(?:[↓➔→←↑]|-->|->|=>)\s*)+[^\n]+)(?:\n|$)/gi;
    text = text.replace(flowBlockRegex, (_match, flowContent) => {
      const steps = flowContent
        .split(/(?:\s*[↓➔→←↑]\s*|\s*(?:-->|->|=>)\s*)/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0 && !/^(The flow looks like this:?|Flowchart:?|Process:?)$/i.test(s));

      if (steps.length < 2) return _match;

      const idx = codeBlocks.length;
      const stepsHtml = steps.map((step: string, stepIdx: number) => {
        const isLast = stepIdx === steps.length - 1;
        const arrowHtml = isLast ? '' : `<div class="compact-step-arrow">↓</div>`;
        return `<div class="compact-step-pill">${this.escapeHtml(step)}</div>${arrowHtml}`;
      }).join('');

      const flowCard = `<div class="compact-flow-card">${stepsHtml}</div>`;
      codeBlocks.push(flowCard);
      return `\n%%CODEBLOCK${idx}%%\n`;
    });

    text = text.replace(
      /!\[([^\]]*)\]\((https?:\/\/[^\s)]+|\/uploads\/[^\s)]+)\)/g,
      '<img src="$2" alt="$1" style="max-width: 100%; border-radius: 8px; margin: 0.5rem 0;" />',
    );

    text = text.replace(/^######\s*(.*)$/gm, '<h6 class="blog-h6">$1</h6>');
    text = text.replace(/^#####\s*(.*)$/gm, '<h5 class="blog-h5">$1</h5>');
    text = text.replace(/^####\s*(.*)$/gm, '<h4 class="blog-h4">$1</h4>');
    text = text.replace(/^###\s*(.*)$/gm, '<h3 class="blog-h3">$1</h3>');
    text = text.replace(/^##\s*(.*)$/gm, '<h2 class="blog-h2">$1</h2>');
    text = text.replace(/^#\s*(.*)$/gm, '<h1 class="blog-h1">$1</h1>');

    text = text.replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>');
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
    text = text.replace(
      /^>\s*(.*)$/gm,
      '<blockquote class="blog-quote">$1</blockquote>',
    );
    text = text.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" class="blog-link">$1 ↗</a>',
    );
    text = text.replace(
      /(^|[^"'>])(https?:\/\/[^\s<)]+)/g,
      '$1<a href="$2" target="_blank" class="blog-link">$2 ↗</a>',
    );
    text = text.replace(
      /^(\d+)\.\s+(.*)$/gm,
      '<div class="list-item-num"><span class="list-num">$1.</span> <span class="list-body">$2</span></div>',
    );
    text = text.replace(
      /^[-*]\s+(.*)$/gm,
      '<div class="list-item-bullet"><span class="bullet-dot">•</span> <span class="list-body">$1</span></div>',
    );

    const sections = text.split(/\n\n+/);
    let html = sections
      .map((sec) => {
        sec = sec.trim();
        if (!sec) return '';
        if (
          /^<(h[1-6]|div|blockquote|pre|table|img)/.test(sec) ||
          sec.startsWith('%%CODEBLOCK')
        ) {
          return sec;
        }
        const withBrs = sec.replace(/\n/g, '<br/>');
        return `<p class="blog-p">${withBrs}</p>`;
      })
      .join('\n');

    codeBlocks.forEach((block, idx) => {
      html = html.replace(new RegExp(`%%CODEBLOCK${idx}%%`, 'g'), block);
    });

    return html;
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
