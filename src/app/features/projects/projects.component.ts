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
    <div class="container-custom page-wrapper animate-fade-in-up">
      <div class="page-header">
        <span class="badge-tag">PORTFOLIO SHOWCASE</span>
        <h1 class="page-title">Featured <span class="gradient-text-animated">Projects</span></h1>
        <p class="page-desc">High-impact web applications, real-time telemetry systems, and modern frontend architecture builds.</p>
        
        <!-- Category Filter Pills -->
        <div class="project-filters" *ngIf="projects$ | async as projects">
          <button
            *ngFor="let cat of categories"
            class="filter-pill"
            [class.active]="selectedCategory === cat"
            (click)="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div class="projects-grid" *ngIf="projects$ | async as projects">
        <div class="project-card glass-panel card-hover-fx" *ngFor="let project of getFilteredProjects(projects)">
          <div class="card-img" *ngIf="project.imageUrl">
            <img [src]="project.imageUrl" [alt]="project.title" loading="lazy" />
            <div class="card-overlay"></div>
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
      padding-top: 1.5rem;
    }
    .page-header {
      margin-bottom: 2rem;
      text-align: center;
    }
    .page-title {
      font-size: 2.2rem;
      margin: 0.3rem 0 0.5rem 0;
    }
    .page-desc {
      color: var(--text-muted);
      max-width: 550px;
      margin: 0 auto 1.25rem auto;
      font-size: 0.95rem;
    }
    .project-filters {
      display: flex;
      justify-content: center;
      gap: 0.4rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }
    .filter-pill {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-glass);
      color: var(--text-muted);
      padding: 0.25rem 0.75rem;
      border-radius: 16px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-smooth);

      &:hover {
        color: #fff;
        border-color: rgba(255, 255, 255, 0.2);
      }

      &.active {
        background: var(--accent-indigo);
        color: #fff;
        border-color: var(--accent-indigo);
        box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
      }
    }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 1.25rem;

      @media (max-width: 600px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.65rem;
      }
    }
    .project-card {
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border-radius: 12px;
    }
    .card-img {
      position: relative;
      height: 160px;
      overflow: hidden;

      @media (max-width: 600px) {
        height: 85px;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
      &:hover img {
        transform: scale(1.05);
      }
    }
    .card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(18, 24, 38, 0.9) 0%, transparent 60%);
    }
    .card-content {
      padding: 1.15rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      @media (max-width: 600px) {
        padding: 0.75rem 0.65rem;
      }
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
      line-height: 1.6;
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
      flex-wrap: wrap;
    }
  `]
})
export class ProjectsComponent {
  private contentService = inject(ContentService);
  projects$: Observable<Project[]> = this.contentService.projects$;

  categories = ['All', 'Web App', 'Dashboard', 'Security'];
  selectedCategory = 'All';

  getFilteredProjects(projects: Project[]): Project[] {
    if (this.selectedCategory === 'All') return projects;
    return projects.filter(p => p.category.toLowerCase() === this.selectedCategory.toLowerCase());
  }
}
