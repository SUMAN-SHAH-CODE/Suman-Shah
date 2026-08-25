import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { Certificate } from '../../core/models/portfolio.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-custom page-wrapper">
      <div class="page-header">
        <span class="badge-tag">VERIFIED CREDENTIALS</span>
        <h1 class="page-title">Certificates & Licenses</h1>
        <p class="page-desc">Professional certifications, specialized technical training, and official credentials.</p>
      </div>

      <div class="certs-grid">
        <div class="cert-card glass-panel" *ngFor="let cert of certs$ | async">
          <div class="cert-header">
            <div class="cert-icon">📜</div>
            <div>
              <span class="issuer">{{ cert.issuer }}</span>
              <h2 class="title">{{ cert.title }}</h2>
            </div>
          </div>

          <div class="cert-dates">
            <span>Issued: {{ cert.issueDate | date:'mediumDate' }}</span>
            <span *ngIf="cert.expiryDate">• Expires: {{ cert.expiryDate | date:'mediumDate' }}</span>
          </div>

          <div class="cred-id" *ngIf="cert.credentialId">
            Credential ID: <code>{{ cert.credentialId }}</code>
          </div>

          <div class="skills-covered" *ngIf="cert.skillsCovered?.length">
            <span class="skill-pill" *ngFor="let s of cert.skillsCovered">{{ s }}</span>
          </div>

          <div class="cert-actions" *ngIf="cert.credentialUrl">
            <a [href]="cert.credentialUrl" target="_blank" class="btn-cinematic btn-outline btn-sm">Verify Credential ↗</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-wrapper { padding-top: 3rem; }
    .page-header { text-align: center; margin-bottom: 3rem; }
    .page-title { font-size: 2.8rem; margin: 0.5rem 0; }
    .page-desc { color: var(--text-muted); max-width: 600px; margin: 0 auto; }
    .certs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 1.5rem;
    }
    .cert-card {
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
    }
    .cert-header {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    .cert-icon {
      font-size: 2rem;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.5rem;
      border-radius: 10px;
    }
    .issuer {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--accent-cyan);
      text-transform: uppercase;
    }
    .title {
      font-size: 1.25rem;
      color: #fff;
    }
    .cert-dates {
      font-size: 0.85rem;
      color: var(--text-dim);
      margin-bottom: 0.75rem;
    }
    .cred-id {
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
      code {
        background: rgba(255, 255, 255, 0.08);
        padding: 0.1rem 0.4rem;
        border-radius: 4px;
        color: var(--accent-indigo);
      }
    }
    .skills-covered {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
      flex-grow: 1;
    }
    .skill-pill {
      background: rgba(168, 85, 247, 0.15);
      border: 1px solid rgba(168, 85, 247, 0.3);
      color: #d8b4fe;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
    }
  `]
})
export class CertificatesComponent {
  private contentService = inject(ContentService);
  certs$: Observable<Certificate[]> = this.contentService.certificates$;
}
