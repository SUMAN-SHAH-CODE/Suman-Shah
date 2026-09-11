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
    <div class="container-custom page-wrapper animate-fade-in-up">
      <div class="page-header">
        <span class="badge-tag">THOUGHTS & ARTICLES</span>
        <h1 class="page-title">Blog & <span class="gradient-text-animated">Insights</span></h1>
        <p class="page-desc">In-depth technical articles on Angular architecture, web performance, security, and cloud scalability.</p>
      </div>

      <!-- Search Bar -->
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
        <div class="blog-card glass-panel card-hover-fx" *ngFor="let blog of getFilteredBlogs(blogs$ | async)">
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
    .page-wrapper { padding-top: 1.5rem; }
    .page-header { text-align: center; margin-bottom: 1.5rem; }
    .page-title { font-size: 2.2rem; margin: 0.3rem 0; }
    .page-desc { color: var(--text-muted); max-width: 550px; margin: 0 auto; font-size: 0.95rem; }

    .filter-bar {
      padding: 0.65rem 1.1rem;
      margin-bottom: 1.5rem;
      border-radius: 10px;
    }

    .search-input-wrapper {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .search-input {
      width: 100%;
      background: transparent;
      border: none;
      color: #fff;
      font-family: var(--font-body);
      font-size: 0.9rem;
      outline: none;

      &::placeholder {
        color: var(--text-dim);
      }
    }

    .search-icon {
      font-size: 0.95rem;
    }

    .blogs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 1.25rem;

      @media (max-width: 600px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.65rem;
      }
    }

    .blog-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-radius: 12px;

      @media (max-width: 600px) {
        padding: 0;
      }
    }

    .blog-cover {
      height: 150px;
      overflow: hidden;

      @media (max-width: 600px) {
        height: 80px;
      }

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
      padding: 1.15rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .blog-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.4rem;
      font-size: 0.78rem;
      color: var(--text-dim);
      margin-bottom: 0.5rem;
    }

    .seen-badge {
      background: rgba(16, 185, 129, 0.2);
      color: var(--accent-emerald);
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.68rem;
    }

    .blog-title {
      font-size: 1.15rem;
      margin-bottom: 0.5rem;
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
      font-size: 0.88rem;
      margin-bottom: 1rem;
      line-height: 1.5;
      flex-grow: 1;
    }

    .blog-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-bottom: 1rem;
    }

    .tag-chip {
      font-size: 0.72rem;
      color: var(--accent-purple);
      background: rgba(168, 85, 247, 0.1);
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
    }

    .blog-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-glass);
    }

    .read-btn {
      color: var(--accent-cyan);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.82rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;

      &:hover {
        text-decoration: underline;
      }
    }

    .mark-seen-btn {
      background: transparent;
      border: 1px solid var(--border-glass);
      color: var(--text-muted);
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
      font-size: 0.72rem;
      cursor: pointer;
      transition: var(--transition-smooth);

      &:hover {
        border-color: var(--accent-cyan);
        color: #fff;
      }

      &.is-read {
        background: rgba(16, 185, 129, 0.15);
        color: var(--accent-emerald);
        border-color: rgba(16, 185, 129, 0.3);
      }
    }
  `]
})
export class BlogListComponent {
  contentService = inject(ContentService);
  blogs$: Observable<Blog[]> = this.contentService.blogs$;
  searchQuery: string = '';

  getFilteredBlogs(blogs: Blog[] | null): Blog[] {
    if (!blogs) return [];
    if (!this.searchQuery.trim()) return blogs;

    const query = this.searchQuery.toLowerCase();
    return blogs.filter(blog =>
      blog.title.toLowerCase().includes(query) ||
      blog.summary.toLowerCase().includes(query) ||
      blog.tags.some(t => t.toLowerCase().includes(query))
    );
  }

  toggleReadStatus(blogId: string, event: Event): void {
    event.stopPropagation();
    this.contentService.markBlogAsRead(blogId);
  }
}
