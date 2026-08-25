import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../core/services/content.service';
import { Blog } from '../../core/models/portfolio.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container-custom page-wrapper">
      <div class="page-header">
        <span class="badge-tag">THOUGHTS & ARTICLES</span>
        <h1 class="page-title">Blog & Insights</h1>
        <p class="page-desc">In-depth technical articles on Angular architecture, web performance, security, and cloud scalability.</p>
      </div>

      <!-- Search & Tag Filter Bar -->
      <div class="filter-bar glass-panel">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Search blogs by title, summary, or keyword..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Blogs Grid -->
      <div class="blogs-grid">
        <div class="blog-card glass-panel" *ngFor="let blog of filteredBlogs">
          <div class="blog-cover" *ngIf="blog.coverImage">
            <img [src]="blog.coverImage" [alt]="blog.title" loading="lazy" />
          </div>

          <div class="blog-content">
            <div class="blog-meta">
              <span>{{ blog.publishedAt | date:'mediumDate' }}</span>
              <span>•</span>
              <span>{{ blog.readTimeMinutes }} min read</span>
              <span>•</span>
              <span>👁 {{ blog.viewsCount || 0 }} views</span>
              <span class="seen-badge" *ngIf="contentService.isBlogRead(blog.id)">✓ SEEN</span>
            </div>

            <h2 class="blog-title">
              <a [routerLink]="['/blogs', blog.id]">{{ blog.title }}</a>
            </h2>

            <p class="blog-summary">{{ blog.summary }}</p>

            <div class="blog-tags">
              <span class="tag-chip" *ngFor="let tag of blog.tags">#{{ tag }}</span>
            </div>

            <div class="blog-card-footer">
              <a [routerLink]="['/blogs', blog.id]" class="read-btn">
                <span>Read Article</span>
                <span>→</span>
              </a>

              <button
                (click)="toggleReadStatus(blog.id, $event)"
                class="mark-seen-btn"
                [class.is-read]="contentService.isBlogRead(blog.id)"
              >
                {{ contentService.isBlogRead(blog.id) ? '✓ Marked as Read' : '👁 Mark as Read' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-wrapper { padding-top: 3rem; }
    .page-header { text-align: center; margin-bottom: 2.5rem; }
    .page-title { font-size: 2.8rem; margin: 0.5rem 0; }
    .page-desc { color: var(--text-muted); max-width: 600px; margin: 0 auto; }

    .filter-bar {
      padding: 1rem 1.5rem;
      margin-bottom: 2.5rem;
    }

    .search-input-wrapper {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .search-input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      color: #fff;
      font-size: 1rem;
      font-family: var(--font-body);

      &::placeholder {
        color: var(--text-dim);
      }
    }

    .blogs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 2rem;

      @media (max-width: 400px) {
        grid-template-columns: 1fr;
      }
    }

    .blog-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .blog-cover {
      height: 200px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
      }
      &:hover img {
        transform: scale(1.05);
      }
    }

    .blog-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .blog-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--text-dim);
      margin-bottom: 0.6rem;
    }

    .seen-badge {
      background: rgba(16, 185, 129, 0.2);
      color: var(--accent-emerald);
      padding: 0.1rem 0.5rem;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.7rem;
    }

    .blog-title {
      font-size: 1.3rem;
      margin-bottom: 0.6rem;
      line-height: 1.3;

      a {
        color: #fff;
        text-decoration: none;
        transition: var(--transition-smooth);

        &:hover {
          color: var(--accent-cyan);
        }
      }
    }

    .blog-summary {
      color: var(--text-muted);
      font-size: 0.92rem;
      margin-bottom: 1.25rem;
      line-height: 1.6;
      flex-grow: 1;
    }

    .blog-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
    }

    .tag-chip {
      font-size: 0.75rem;
      color: var(--accent-purple);
      background: rgba(168, 85, 247, 0.1);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }

    .blog-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-glass);
    }

    .read-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--accent-cyan);
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .mark-seen-btn {
      background: transparent;
      border: 1px solid var(--border-glass);
      color: var(--text-muted);
      padding: 0.3rem 0.75rem;
      border-radius: 6px;
      font-size: 0.78rem;
      cursor: pointer;
      transition: var(--transition-smooth);

      &:hover {
        border-color: var(--accent-emerald);
        color: var(--accent-emerald);
      }

      &.is-read {
        background: rgba(16, 185, 129, 0.15);
        border-color: rgba(16, 185, 129, 0.4);
        color: var(--accent-emerald);
      }
    }
  `]
})
export class BlogListComponent {
  contentService = inject(ContentService);
  searchQuery: string = '';

  get filteredBlogs(): Blog[] {
    const blogs = this.contentService.getBlogs();
    if (!this.searchQuery.trim()) {
      return blogs;
    }
    const q = this.searchQuery.toLowerCase();
    return blogs.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.summary.toLowerCase().includes(q) ||
      b.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  toggleReadStatus(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.contentService.markBlogAsRead(id);
  }
}
