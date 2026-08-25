import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { Project } from '../../core/models/portfolio.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-custom page-wrapper">
      <div class="page-header">
        <span class="badge-tag">PORTFOLIO SHOWCASE</span>
        <h1 class="page-title">Featured Projects</h1>
        <p class="page-desc">High-impact web applications, real-time analytics platforms, and modern frontend architecture builds.</p>
      </div>

      <div class="projects-grid">
        <div class="project-card glass-panel" *ngFor="let project of projects$ | async">
          <div class="card-img" *ngIf="project.imageUrl">
            <img [src]="project.imageUrl" [alt]="project.title" />
          </div>
          <div class="card-content">
            <div class="card-badge">{{ project.category }}</div>
            <h2>{{ project.title }}</h2>
            <h4 class="tagline">{{ project.tagline }}</h4>
            <p class="desc">{{ project.description }}</p>
            <div class="tech-list">
              <span class="tech-tag" *ngFor="let tech of project.technologies">{{ tech }}</span>
            </div>
            <div class="card-actions">
              <a [href]="project.demoUrl" target="_blank" class="btn-cinematic btn-sm" *ngIf="project.demoUrl">Live Demo ↗</a>
              <a [href]="project.githubUrl" target="_blank" class="btn-cinematic btn-outline btn-sm" *ngIf="project.githubUrl">Source Code ↗</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-wrapper {
      padding-top: 3rem;
    }
    .page-header {
      margin-bottom: 3rem;
      text-align: center;
    }
    .page-title {
      font-size: 2.8rem;
      margin: 0.5rem 0;
    }
    .page-desc {
      color: var(--text-muted);
      max-width: 600px;
      margin: 0 auto;
    }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;

      @media (max-width: 420px) {
        grid-template-columns: 1fr;
      }
    }
    .project-card {
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .card-img {
      height: 220px;
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
    .card-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .card-badge {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent-cyan);
      text-transform: uppercase;
      margin-bottom: 0.4rem;
    }
    .tagline {
      color: var(--accent-indigo);
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
    }
    .desc {
      color: var(--text-muted);
      font-size: 0.92rem;
      margin-bottom: 1.25rem;
      flex-grow: 1;
    }
    .tech-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
    }
    .tech-tag {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-glass);
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .card-actions {
      display: flex;
      gap: 0.75rem;
    }
  `]
})
export class ProjectsComponent {
  private contentService = inject(ContentService);
  projects$: Observable<Project[]> = this.contentService.projects$;
}
