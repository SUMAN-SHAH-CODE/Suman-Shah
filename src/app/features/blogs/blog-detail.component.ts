import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { Blog } from '../../core/models/portfolio.model';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-custom page-wrapper">
      <div class="back-link">
        <a routerLink="/blogs">← Back to All Articles</a>
      </div>

      <ng-container *ngIf="blog; else notFound">
        <article class="blog-article glass-panel">
          <!-- Article Header -->
          <header class="article-header">
            <div class="article-meta">
              <span class="badge-tag" *ngFor="let tag of blog.tags">#{{ tag }}</span>
              <span class="date">{{ blog.publishedAt | date:'fullDate' }}</span>
              <span class="read-time">• {{ blog.readTimeMinutes }} min read</span>
              <span class="seen-pill" *ngIf="isRead">✓ SEEN BY YOU</span>
            </div>

            <h1 class="article-title">{{ blog.title }}</h1>
            <p class="article-summary">{{ blog.summary }}</p>

            <div class="author-bar">
              <img [src]="blog.authorPhoto" [alt]="blog.authorName" class="author-avatar" *ngIf="blog.authorPhoto" />
              <div class="author-info">
                <span class="author-name">{{ blog.authorName }}</span>
                <span class="author-role">Author & Technical Lead</span>
              </div>
              <button class="mark-read-btn" (click)="markAsRead()" [class.active]="isRead">
                {{ isRead ? '✓ Marked as Read' : '👁 Mark as Read' }}
              </button>
            </div>
          </header>

          <!-- Cover Image -->
          <div class="article-cover" *ngIf="blog.coverImage">
            <img [src]="blog.coverImage" [alt]="blog.title" />
          </div>

          <!-- Article Content -->
          <div class="article-content" [innerHTML]="formattedContent"></div>
        </article>
      </ng-container>

      <ng-template #notFound>
        <div class="not-found glass-panel">
          <h2>Article Not Found</h2>
          <p>The requested blog article could not be found or has been removed.</p>
          <a routerLink="/blogs" class="btn-cinematic">Browse Articles</a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .page-wrapper { padding-top: 2rem; max-width: 900px; margin: 0 auto; }

    .back-link {
      margin-bottom: 1.5rem;
      a {
        color: var(--accent-cyan);
        text-decoration: none;
        font-weight: 600;
        font-size: 0.95rem;
        &:hover { text-decoration: underline; }
      }
    }

    .blog-article {
      padding: 3rem;
      @media (max-width: 600px) { padding: 1.5rem; }
    }

    .article-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.75rem;
      font-size: 0.85rem;
      color: var(--text-dim);
      margin-bottom: 1rem;
    }

    .seen-pill {
      background: rgba(16, 185, 129, 0.2);
      color: var(--accent-emerald);
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .article-title {
      font-size: 2.5rem;
      line-height: 1.2;
      margin-bottom: 1rem;
      color: #fff;
      @media (max-width: 600px) { font-size: 1.8rem; }
    }

    .article-summary {
      font-size: 1.2rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .author-bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-glass);
      margin-bottom: 2rem;
    }

    .author-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--accent-indigo);
    }

    .author-info {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .author-name {
      color: #fff;
      font-weight: 700;
      font-size: 1rem;
    }

    .author-role {
      color: var(--text-dim);
      font-size: 0.8rem;
    }

    .mark-read-btn {
      background: transparent;
      border: 1px solid var(--border-glass);
      color: var(--text-muted);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.85rem;
      transition: var(--transition-smooth);

      &:hover {
        border-color: var(--accent-emerald);
        color: var(--accent-emerald);
      }

      &.active {
        background: rgba(16, 185, 129, 0.15);
        border-color: rgba(16, 185, 129, 0.4);
        color: var(--accent-emerald);
      }
    }

    .article-cover {
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 2.5rem;
      img {
        width: 100%;
        max-height: 400px;
        object-fit: cover;
      }
    }

    .article-content {
      color: #d1d5db;
      font-size: 1.1rem;
      line-height: 1.8;

      h2, h3, h4 {
        color: #fff;
        margin: 2rem 0 1rem 0;
      }

      p {
        margin-bottom: 1.5rem;
      }

      pre {
        background: #0f172a;
        padding: 1.25rem;
        border-radius: 8px;
        overflow-x: auto;
        border: 1px solid var(--border-glass);
        margin: 1.5rem 0;
        font-family: monospace;
        color: #38bdf8;
      }

      code {
        background: rgba(255, 255, 255, 0.1);
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-family: monospace;
      }

      ul, ol {
        margin-bottom: 1.5rem;
        padding-left: 1.5rem;
      }

      li {
        margin-bottom: 0.5rem;
      }
    }

    .not-found {
      text-align: center;
      padding: 4rem;
      h2 { font-size: 2rem; margin-bottom: 1rem; }
      p { color: var(--text-muted); margin-bottom: 2rem; }
    }
  `]
})
export class BlogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);

  blog: Blog | undefined;
  isRead: boolean = false;
  formattedContent: string = '';

  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      this.blog = this.contentService.getBlogById(blogId);
      if (this.blog) {
        this.isRead = this.contentService.isBlogRead(this.blog.id);
        this.formattedContent = this.formatContent(this.blog.content);
        // Automatically mark as read when user reads full post
        this.markAsRead();
      }
    }
  }

  markAsRead(): void {
    if (this.blog) {
      this.contentService.markBlogAsRead(this.blog.id);
      this.isRead = true;
    }
  }

  private formatContent(content: string): string {
    if (!content) return '';
    return content
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/#### (.*)/g, '<h4>$1</h4>')
      .replace(/```typescript([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }
}
