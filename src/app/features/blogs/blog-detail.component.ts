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
    <div class="container-custom page-wrapper animate-fade-in-up">
      <div class="back-link">
        <a routerLink="/blogs">← Back to All Articles</a>
      </div>
      <ng-container *ngIf="blog; else notFound">
        <article class="blog-article glass-panel">
          <!-- Article Header -->
          <header class="article-header">
            <div class="article-meta">
              <span class="badge-tag" *ngFor="let tag of blog.tags"
                >#{{ tag }}</span
              >
              <span class="date">{{
                blog.publishedAt | date: 'fullDate'
              }}</span>
              <span class="read-time"
                >• {{ blog.readTimeMinutes }} min read</span
              >
              <span class="seen-pill" *ngIf="isRead">✓ SEEN BY YOU</span>
            </div>
            <h1 class="article-title">{{ blog.title }}</h1>
            <p class="article-summary" *ngIf="blog.summary">
              {{ blog.summary }}
            </p>
            <div class="author-bar">
              <img
                [src]="
                  blog.authorPhoto ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                "
                [alt]="blog.authorName"
                class="author-avatar"
              />
              <div class="author-info">
                <span class="author-name">{{
                  blog.authorName || 'Suman Shah'
                }}</span>
                <span class="author-role">Software Engineer & Author</span>
              </div>
              <button
                class="mark-read-btn"
                (click)="markAsRead()"
                [class.active]="isRead"
              >
                {{ isRead ? '✓ Marked as Read' : '👁 Mark as Read' }}
              </button>
            </div>
          </header>
          <!-- Cover Image -->
          <div class="article-cover" *ngIf="blog.coverImage">
            <img
              [src]="blog.coverImage"
              [alt]="blog.title"
              (error)="onCoverError($event)"
              loading="eager"
            />
          </div>
          <!-- Article Content -->
          <div class="article-content" [innerHTML]="formattedContent"></div>
        </article>
      </ng-container>
      <ng-template #notFound>
        <div class="not-found glass-panel">
          <h2>Article Not Found</h2>
          <p>
            The requested blog article could not be found or has been removed.
          </p>
          <a routerLink="/blogs" class="btn-cinematic">Browse Articles</a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .page-wrapper {
        padding-top: 2rem;
        padding-bottom: 4rem;
        max-width: 920px;
        margin: 0 auto;
      }
      .back-link {
        margin-bottom: 1.5rem;
        a {
          color: var(--accent-cyan, #06b6d4);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.2s ease;
          &:hover {
            color: #fff;
            transform: translateX(-4px);
          }
        }
      }
      .blog-article {
        padding: 3rem;
        border-radius: 16px;
        background: rgba(15, 23, 42, 0.75);
        border: 1px solid var(--border-glass, rgba(255, 255, 255, 0.08));
        @media (max-width: 640px) {
          padding: 1.5rem 1.25rem;
        }
      }
      .article-meta {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.75rem;
        font-size: 0.85rem;
        color: var(--text-dim, #94a3b8);
        margin-bottom: 1.25rem;
      }
      .seen-pill {
        background: rgba(16, 185, 129, 0.2);
        color: var(--accent-emerald, #10b981);
        border: 1px solid rgba(16, 185, 129, 0.3);
        padding: 0.2rem 0.6rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 700;
      }
      .article-title {
        font-size: 2.4rem;
        line-height: 1.25;
        font-weight: 800;
        margin-bottom: 1rem;
        color: #fff;
        font-family: var(--font-heading, inherit);
        @media (max-width: 640px) {
          font-size: 1.75rem;
        }
      }
      .article-summary {
        font-size: 1.15rem;
        color: var(--text-muted, #94a3b8);
        line-height: 1.6;
        margin-bottom: 2rem;
        font-weight: 400;
        border-left: 3px solid var(--accent-cyan, #06b6d4);
        padding-left: 1rem;
        font-style: italic;
      }
      .author-bar {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-glass, rgba(255, 255, 255, 0.08));
        margin-bottom: 2rem;
        flex-wrap: wrap;
      }
      .author-avatar {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--accent-cyan, #06b6d4);
        box-shadow: 0 0 12px rgba(6, 182, 212, 0.3);
      }
      .author-info {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }
      .author-name {
        color: #fff;
        font-weight: 700;
        font-size: 0.95rem;
      }
      .author-role {
        color: var(--text-dim, #64748b);
        font-size: 0.8rem;
      }
      .mark-read-btn {
        background: transparent;
        border: 1px solid var(--border-glass, rgba(255, 255, 255, 0.15));
        color: var(--text-muted, #94a3b8);
        padding: 0.45rem 0.9rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.82rem;
        transition: all 0.2s ease;
        &:hover {
          border-color: var(--accent-emerald, #10b981);
          color: var(--accent-emerald, #10b981);
        }
        &.active {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.4);
          color: var(--accent-emerald, #10b981);
        }
      }
      .article-cover {
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 2.5rem;
        border: 1px solid var(--border-glass, rgba(255, 255, 255, 0.1));
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        img {
          width: 100%;
          max-height: 450px;
          object-fit: cover;
          display: block;
        }
      }
      ::ng-deep .article-content {
        color: #cbd5e1;
        font-size: 1.05rem;
        line-height: 1.85;
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          color: #fff;
          font-family: var(--font-heading, inherit);
          font-weight: 700;
          scroll-margin-top: 5rem;
        }
        .blog-h1 {
          font-size: 1.8rem;
          margin: 2.5rem 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .blog-h2 {
          font-size: 1.55rem;
          margin: 2.2rem 0 0.9rem 0;
          color: #f1f5f9;
        }
        .blog-h3 {
          font-size: 1.35rem;
          margin: 2rem 0 0.8rem 0;
          color: var(--accent-cyan, #06b6d4);
        }
        .blog-h4 {
          font-size: 1.15rem;
          margin: 1.6rem 0 0.6rem 0;
          color: #e2e8f0;
        }
        .blog-p {
          margin-bottom: 1.4rem;
          word-break: break-word;
        }
        .code-card {
          position: relative;
          background: #090d16;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          margin: 1.5rem 0;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }
        .code-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.75rem;
          background: rgba(99, 102, 241, 0.25);
          color: #a5b4fc;
          border: 1px solid rgba(99, 102, 241, 0.4);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-family: monospace;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .code-pre {
          margin: 0;
          padding: 1.25rem 1.25rem;
          overflow-x: auto;
          font-family:
            'Fira Code', Consolas, Monaco, 'Courier New', Courier, monospace;
          font-size: 0.92rem;
          line-height: 1.6;
          color: #38bdf8;
          white-space: pre;
          code {
            background: transparent;
            padding: 0;
            color: inherit;
            font-family: inherit;
          }
        }
        .diagram-card {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 10px;
          margin: 1.5rem 0;
          overflow: hidden;
        }
        .diagram-pre {
          margin: 0;
          padding: 1.25rem;
          overflow-x: auto;
          font-family: monospace;
          font-size: 0.9rem;
          line-height: 1.5;
          color: #67e8f9;
          white-space: pre;
        }
        .compact-flow-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          max-width: 440px;
          margin: 1.75rem auto;
          padding: 1.25rem 1rem;
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
          font-size: 0.86rem;
          font-weight: 600;
          padding: 0.4rem 1.1rem;
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;

          &:hover {
            border-color: var(--accent-cyan, #06b6d4);
            background: rgba(6, 182, 212, 0.15);
            transform: translateY(-1px);
          }
        }

        .compact-step-arrow {
          color: var(--accent-cyan, #06b6d4);
          font-size: 1.05rem;
          font-weight: 800;
          margin: 0.25rem 0;
          line-height: 1;
          opacity: 0.9;
        }

        .inline-code {
          background: rgba(99, 102, 241, 0.15);
          color: #a5b4fc;
          border: 1px solid rgba(99, 102, 241, 0.3);
          padding: 0.15rem 0.45rem;
          border-radius: 5px;
          font-family: 'Fira Code', Consolas, Monaco, monospace;
          font-size: 0.88em;
        }
        .list-item-num {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          margin-bottom: 0.75rem;
          font-size: 1.05rem;
          .list-num {
            color: var(--accent-cyan, #06b6d4);
            font-weight: 700;
            font-family: monospace;
            min-width: 1.5rem;
          }
          .list-body {
            flex: 1;
          }
        }
        .list-item-bullet {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          margin-bottom: 0.6rem;
          font-size: 1.05rem;
          .bullet-dot {
            color: var(--accent-cyan, #06b6d4);
            font-weight: bold;
          }
          .list-body {
            flex: 1;
          }
        }
        .blog-quote {
          border-left: 4px solid var(--accent-indigo, #6366f1);
          background: rgba(99, 102, 241, 0.08);
          padding: 1rem 1.25rem;
          border-radius: 0 8px 8px 0;
          margin: 1.5rem 0;
          color: #e2e8f0;
          font-style: italic;
        }
        .blog-link {
          color: var(--accent-cyan, #06b6d4);
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: all 0.2s ease;
          &:hover {
            color: #fff;
          }
        }
        .content-img {
          max-width: 100%;
          border-radius: 10px;
          margin: 1.5rem 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      }
      .not-found {
        text-align: center;
        padding: 4rem 2rem;
        border-radius: 16px;
        h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #fff;
        }
        p {
          color: var(--text-muted, #94a3b8);
          margin-bottom: 2rem;
        }
      }
    `,
  ],
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
      this.contentService.blogs$.subscribe((blogs) => {
        if (blogs && blogs.length > 0) {
          this.blog = blogs.find((b) => b.id === blogId || b.slug === blogId);
          if (this.blog) {
            this.isRead = this.contentService.isBlogRead(this.blog.id);
            this.formattedContent = this.formatContent(this.blog.content);
            this.markAsRead();
          }
        }
      });
    }
  }
  markAsRead(): void {
    if (this.blog) {
      this.contentService.markBlogAsRead(this.blog.id);
      this.isRead = true;
    }
  }
  onCoverError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
  }

  formatContent(content: string): string {
    if (!content) return '';
    let text = content;
    const codeBlocks: string[] = [];
    // 1. Triple backticks code blocks
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
    // 2. Standalone JSON / Object blocks
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
    // 4. Embedded images: ![alt](url)
    text = text.replace(
      /!\[([^\]]*)\]\((https?:\/\/[^\s)]+|\/uploads\/[^\s)]+)\)/g,
      '<img src="$2" alt="$1" class="content-img" />',
    );
    // 5. Headings (# to ######)
    text = text.replace(/^######\s*(.*)$/gm, '<h6 class="blog-h6">$1</h6>');
    text = text.replace(/^#####\s*(.*)$/gm, '<h5 class="blog-h5">$1</h5>');
    text = text.replace(/^####\s*(.*)$/gm, '<h4 class="blog-h4">$1</h4>');
    text = text.replace(/^###\s*(.*)$/gm, '<h3 class="blog-h3">$1</h3>');
    text = text.replace(/^##\s*(.*)$/gm, '<h2 class="blog-h2">$1</h2>');
    text = text.replace(/^#\s*(.*)$/gm, '<h1 class="blog-h1">$1</h1>');
    // 6. Inline Code
    text = text.replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>');
    // 7. Bold & Italic
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
    // 8. Blockquotes
    text = text.replace(
      /^>\s*(.*)$/gm,
      '<blockquote class="blog-quote">$1</blockquote>',
    );
    // 9. Markdown Links
    text = text.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="blog-link">$1 ↗</a>',
    );
    // 10. Plain URLs (not in quotes or href)
    text = text.replace(
      /(^|[^"'>])(https?:\/\/[^\s<)]+)/g,
      '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="blog-link">$2 ↗</a>',
    );
    // 11. Numbered List items
    text = text.replace(
      /^(\d+)\.\s+(.*)$/gm,
      '<div class="list-item-num"><span class="list-num">$1.</span> <span class="list-body">$2</span></div>',
    );
    // 12. Bullet List items
    text = text.replace(
      /^[-*]\s+(.*)$/gm,
      '<div class="list-item-bullet"><span class="bullet-dot">•</span> <span class="list-body">$1</span></div>',
    );
    // 13. Paragraphs & Line Breaks
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
    // 14. Restore code blocks
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
