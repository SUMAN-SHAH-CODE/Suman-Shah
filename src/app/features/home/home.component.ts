import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { Blog, Project, Achievement, Skill, PortfolioStats } from '../../core/models/portfolio.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-wrapper container-custom">
      <!-- HERO SECTION -->
      <section class="hero-section">
        <div class="hero-badge">
          <span class="pulse-dot"></span>
          <span>AVAILABLE FOR CINEMATIC WEB PROJECTS</span>
        </div>

        <h1 class="hero-title">
          Architecting <span class="gradient-text">Next-Gen</span> Digital Experiences & Software
        </h1>

        <p class="hero-subtitle">
          Full-Stack Web Engineer specializing in high-performance Angular applications, reactive state design, secure cloud solutions, and interactive user interfaces.
        </p>

        <div class="hero-actions">
          <a routerLink="/projects" class="btn-cinematic">
            <span>Explore Projects</span>
            <span>→</span>
          </a>
          <a routerLink="/blogs" class="btn-cinematic btn-outline">
            <span>Read Insights</span>
          </a>
        </div>

        <!-- STATS BAR -->
        <div class="stats-bar glass-panel" *ngIf="stats">
          <div class="stat-item">
            <span class="stat-number gradient-text">{{ stats.projectsCount }}+</span>
            <span class="stat-label">Projects Delivered</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number gradient-text">{{ stats.blogsCount }}</span>
            <span class="stat-label">Tech Articles</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number gradient-text">{{ stats.achievementsCount }}</span>
            <span class="stat-label">Achievements</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number gradient-text">{{ stats.skillsCount }}</span>
            <span class="stat-label">Core Skills</span>
          </div>
        </div>
      </section>

      <!-- SKILLS GRID -->
      <section class="section-container">
        <div class="section-header">
          <div>
            <span class="section-tag">CAPABILITIES</span>
            <h2 class="section-title">Technical Expertise</h2>
          </div>
        </div>

        <div class="skills-grid">
          <div class="skill-card glass-panel" *ngFor="let skill of skills$ | async">
            <div class="skill-header">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-percent">{{ skill.proficiency }}%</span>
            </div>
            <div class="skill-bar-track">
              <div class="skill-bar-fill" [style.width.%]="skill.proficiency"></div>
            </div>
            <span class="badge-tag" style="margin-top: 0.75rem;">{{ skill.category }}</span>
          </div>
        </div>
      </section>

      <!-- FEATURED PROJECTS -->
      <section class="section-container">
        <div class="section-header">
          <div>
            <span class="section-tag">PORTFOLIO</span>
            <h2 class="section-title">Featured Projects</h2>
          </div>
          <a routerLink="/projects" class="btn-cinematic btn-outline btn-sm">View All Projects</a>
        </div>

        <div class="projects-grid">
          <div class="project-card glass-panel" *ngFor="let project of featuredProjects$ | async">
            <div class="card-img-wrapper" *ngIf="project.imageUrl">
              <img [src]="project.imageUrl" [alt]="project.title" loading="lazy" />
              <div class="card-img-overlay"></div>
            </div>
            <div class="card-body">
              <div class="card-tags">
                <span class="badge-tag">{{ project.category }}</span>
              </div>
              <h3 class="card-title">{{ project.title }}</h3>
              <p class="card-sub">{{ project.tagline }}</p>
              <p class="card-desc">{{ project.description }}</p>
              <div class="tech-stack">
                <span class="tech-chip" *ngFor="let tech of project.technologies">{{ tech }}</span>
              </div>
              <div class="card-footer-actions">
                <a [href]="project.demoUrl" target="_blank" class="btn-cinematic btn-sm" *ngIf="project.demoUrl">Live Demo ↗</a>
                <a [href]="project.githubUrl" target="_blank" class="btn-cinematic btn-outline btn-sm" *ngIf="project.githubUrl">Code ↗</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- RECENT BLOGS -->
      <section class="section-container">
        <div class="section-header">
          <div>
            <span class="section-tag">INSIGHTS</span>
            <h2 class="section-title">Latest Articles</h2>
          </div>
          <a routerLink="/blogs" class="btn-cinematic btn-outline btn-sm">All Blogs</a>
        </div>

        <div class="blogs-grid">
          <div class="blog-card glass-panel" *ngFor="let blog of featuredBlogs$ | async">
            <div class="blog-img" *ngIf="blog.coverImage">
              <img [src]="blog.coverImage" [alt]="blog.title" />
            </div>
            <div class="blog-content">
              <div class="blog-meta">
                <span>{{ blog.publishedAt | date:'mediumDate' }}</span>
                <span>•</span>
                <span>{{ blog.readTimeMinutes }} min read</span>
                <span class="read-badge" *ngIf="contentService.isBlogRead(blog.id)">✓ SEEN</span>
              </div>
              <h3 class="blog-title">
                <a [routerLink]="['/blogs', blog.id]">{{ blog.title }}</a>
              </h3>
              <p class="blog-summary">{{ blog.summary }}</p>
              <a [routerLink]="['/blogs', blog.id]" class="read-more-link">Read Full Post →</a>
            </div>
          </div>
        </div>
      </section>

      <!-- RECENT ACHIEVEMENTS & CERTIFICATES SUMMARY -->
      <section class="section-container split-section">
        <div class="split-column">
          <div class="section-header">
            <div>
              <span class="section-tag">RECOGNITION</span>
              <h2 class="section-title">Achievements</h2>
            </div>
            <a routerLink="/achievements" class="btn-cinematic btn-outline btn-sm">View All</a>
          </div>
          <div class="achievements-list">
            <div class="achieve-card glass-panel" *ngFor="let item of featuredAchievements$ | async">
              <div class="achieve-icon">🏆</div>
              <div class="achieve-info">
                <h4>{{ item.title }}</h4>
                <p class="org">{{ item.organization }} • {{ item.date | date:'yyyy' }}</p>
                <p class="desc">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-wrapper {
      padding-top: 2rem;
    }

    .hero-section {
      text-align: center;
      padding: 4rem 1rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 1rem;
      border-radius: 30px;
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.3);
      color: var(--accent-cyan);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      margin-bottom: 1.5rem;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-cyan);
      box-shadow: 0 0 10px var(--accent-cyan);
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.7; }
      50% { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.7; }
    }

    .hero-title {
      font-size: 3.5rem;
      line-height: 1.15;
      font-weight: 800;
      margin-bottom: 1.5rem;

      @media (max-width: 768px) {
        font-size: 2.2rem;
      }
    }

    .hero-subtitle {
      font-size: 1.15rem;
      color: var(--text-muted);
      margin-bottom: 2.5rem;
      line-height: 1.7;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 4rem;

      @media (max-width: 480px) {
        flex-direction: column;
      }
    }

    .stats-bar {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 1.5rem;

      @media (max-width: 600px) {
        flex-direction: column;
        gap: 1.5rem;
      }
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-number {
      font-size: 2.2rem;
      font-weight: 800;
      font-family: var(--font-heading);
    }

    .stat-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: var(--border-glass);

      @media (max-width: 600px) {
        display: none;
      }
    }

    /* SECTIONS */
    .section-container {
      margin-top: 5rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2rem;

      @media (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }

    .section-tag {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent-indigo);
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 700;
      color: #fff;
    }

    /* SKILLS */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.25rem;
    }

    .skill-card {
      padding: 1.25rem;
    }

    .skill-header {
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      font-size: 0.95rem;
      margin-bottom: 0.6rem;
    }

    .skill-percent {
      color: var(--accent-cyan);
    }

    .skill-bar-track {
      height: 6px;
      width: 100%;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
    }

    .skill-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-cyan), var(--accent-indigo));
      border-radius: 4px;
      transition: width 1s ease-in-out;
    }

    /* PROJECTS */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 2rem;

      @media (max-width: 400px) {
        grid-template-columns: 1fr;
      }
    }

    .project-card {
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .card-img-wrapper {
      position: relative;
      height: 200px;
      overflow: hidden;

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

    .card-img-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(18, 24, 38, 1), transparent 70%);
    }

    .card-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .card-title {
      font-size: 1.3rem;
      margin: 0.5rem 0 0.2rem 0;
      color: #fff;
    }

    .card-sub {
      color: var(--accent-cyan);
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    .card-desc {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 1.25rem;
      flex-grow: 1;
    }

    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
    }

    .tech-chip {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-glass);
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .card-footer-actions {
      display: flex;
      gap: 0.75rem;
    }

    /* BLOGS */
    .blogs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 2rem;
    }

    .blog-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
    }

    .blog-img {
      height: 180px;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 1.25rem;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .blog-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--text-dim);
      margin-bottom: 0.5rem;
    }

    .read-badge {
      background: rgba(16, 185, 129, 0.2);
      color: var(--accent-emerald);
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.7rem;
    }

    .blog-title {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;

      a {
        color: #fff;
        text-decoration: none;

        &:hover {
          color: var(--accent-cyan);
        }
      }
    }

    .blog-summary {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 1rem;
      flex-grow: 1;
    }

    .read-more-link {
      color: var(--accent-indigo);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;

      &:hover {
        text-decoration: underline;
      }
    }

    /* ACHIEVEMENTS */
    .achievements-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .achieve-card {
      padding: 1.25rem;
      display: flex;
      gap: 1.25rem;
      align-items: flex-start;
    }

    .achieve-icon {
      font-size: 2rem;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.6rem;
      border-radius: 12px;
    }

    .achieve-info {
      h4 {
        color: #fff;
        font-size: 1.1rem;
      }

      .org {
        color: var(--accent-cyan);
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 0.4rem;
      }

      .desc {
        color: var(--text-muted);
        font-size: 0.88rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  contentService = inject(ContentService);

  skills$: Observable<Skill[]> = this.contentService.skills$;
  featuredProjects$: Observable<Project[]> = this.contentService.projects$;
  featuredBlogs$: Observable<Blog[]> = this.contentService.blogs$;
  featuredAchievements$: Observable<Achievement[]> = this.contentService.achievements$;

  stats!: PortfolioStats;

  ngOnInit(): void {
    this.stats = this.contentService.getStats();
  }
}
