import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container-custom footer-content">
        <div class="footer-brand">
          <h3>⚡ AETHER<span class="highlight">PORTFOLIO</span></h3>
          <p>Cinematic web interface engineered with Angular, TypeScript & Firebase Authentication.</p>
        </div>

        <div class="footer-links">
          <h4>Navigation</h4>
          <a routerLink="/">Home</a>
          <a routerLink="/blogs">Blogs & Insights</a>
          <a routerLink="/projects">Projects Showcase</a>
          <a routerLink="/achievements">Achievements</a>
          <a routerLink="/certificates">Certificates</a>
        </div>

        <div class="footer-security">
          <h4>Security & Role Control</h4>
          <p>Protected by Firebase OAuth & Firestore Security Rules.</p>
          <a routerLink="/admin/login" class="admin-link">⚡ Admin Portal Access</a>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© {{ currentYear }} Cinematic Portfolio Engine. Built with Angular 18 & Firebase.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      margin-top: 5rem;
      border-top: 1px solid var(--border-glass);
      background: rgba(10, 12, 16, 0.85);
      backdrop-filter: blur(12px);
      padding: 4rem 0 2rem 0;
    }

    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1.5fr;
      gap: 3rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    .footer-brand {
      h3 {
        font-size: 1.4rem;
        margin-bottom: 0.75rem;

        .highlight {
          color: var(--accent-cyan);
        }
      }

      p {
        color: var(--text-muted);
        font-size: 0.95rem;
        max-width: 360px;
      }
    }

    .footer-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      h4 {
        margin-bottom: 0.5rem;
        font-size: 1rem;
        color: #fff;
      }

      a {
        color: var(--text-muted);
        text-decoration: none;
        font-size: 0.9rem;
        transition: var(--transition-smooth);

        &:hover {
          color: var(--accent-cyan);
        }
      }
    }

    .footer-security {
      h4 {
        margin-bottom: 0.5rem;
        font-size: 1rem;
        color: #fff;
      }

      p {
        color: var(--text-muted);
        font-size: 0.9rem;
        margin-bottom: 0.75rem;
      }

      .admin-link {
        color: var(--accent-indigo);
        font-weight: 600;
        text-decoration: none;
        font-size: 0.9rem;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .footer-bottom {
      text-align: center;
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      color: var(--text-dim);
      font-size: 0.85rem;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
