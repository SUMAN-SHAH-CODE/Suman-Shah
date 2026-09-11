import {
  Component,
  inject,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import {
  Blog,
  Project,
  Achievement,
  Skill,
  Experience,
  PortfolioStats,
} from '../../core/models/portfolio.model';
import { Observable } from 'rxjs';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="home-wrapper container-custom">
      <!-- HERO SECTION -->
      <section class="hero-section animate-fade-in-up">
        <div class="hero-main-container">
          <div class="hero-text-content">
            <!-- Floating Live Badges -->
            <div class="hero-top-badges">
              <div class="hero-badge">
                <span class="pulse-dot"></span>
                <span>AVAILABLE FOR DEVELOPMENT PROJECT</span>
              </div>
              <div class="neon-status-chip">
                <span class="chip-spark">✦</span>
                <span>Neon DB Connected</span>
              </div>
            </div>

            <h1 class="hero-title">
              Hi, I'm
              <span class="gradient-text-animated">Suman Shah</span>
            </h1>

            <!-- Dynamic Typing Role Headline -->
            <div class="dynamic-roles">
              <span class="role-static">Specializing in </span>
              <span class="role-animated gradient-text">{{
                currentRoleText
              }}</span>
              <span class="typing-cursor">|</span>
            </div>

            <p class="hero-subtitle">
              A Software Engineer and Full-Stack Developer specializing in
              <span class="gradient-text-animated"
                ><strong>Android & Web Development</strong></span
              >
              . I have professional experience at
              <span class="gradient-text-animated"
                ><strong>Danphe HIMS</strong></span
              >
              and was part of the winning team at
              <span class="gradient-text-animated">
                <strong>Sagarmatha Tech-Fest 2023</strong></span
              >. I enjoy building modern applications, solving real-world
              problems, and continuously exploring new technologies to create
              meaningful software solutions.
            </p>

            <div class="hero-actions">
              <a routerLink="/projects" class="btn-cinematic">
                <span>Explore Projects</span>
                <span class="arrow-anim">→</span>
              </a>
              <a routerLink="/blogs" class="btn-cinematic btn-outline">
                <span>Read Tech Articles</span>
              </a>
            </div>
          </div>

          <!-- Profile Avatar with Animated Gradient Frame -->
          <div class="hero-avatar-col">
            <div class="avatar-gradient-wrapper">
              <div class="avatar-glow-effect"></div>
              <div class="avatar-rotating-ring"></div>
              <div class="avatar-inner-circle">
                <img
                  src="assets/suman-shah.png"
                  alt="Suman Shah"
                  class="avatar-face-image"
                  loading="eager"
                  fetchpriority="high"
                />
              </div>
              <div class="avatar-status-pill">
                <span class="pulse-status-dot"></span>
                <span>Available</span>
              </div>
            </div>
          </div>
        </div>

        <!-- STATS BAR WITH ANIMATED COUNTER -->
        <div class="stats-bar glass-panel card-hover-fx">
          <div class="stat-item">
            <span class="stat-number gradient-text"
              >{{ displayStats.projectsCount }}+</span
            >
            <span class="stat-label">Projects Delivered</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number gradient-text"
              >{{ displayStats.experiencesCount }}+</span
            >
            <span class="stat-label">Roles & Positions</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number gradient-text">{{
              displayStats.blogsCount
            }}</span>
            <span class="stat-label">Tech Articles</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number gradient-text">{{
              displayStats.achievementsCount
            }}</span>
            <span class="stat-label">Achievements</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number gradient-text">{{
              displayStats.skillsCount
            }}</span>
            <span class="stat-label">Core Skills</span>
          </div>
        </div>
      </section>

      <!-- INTERACTIVE FEATURED PROJECTS SLIDER / CAROUSEL -->
      <section
        class="section-container scroll-reveal"
        *ngIf="featuredProjects$ | async as projects"
      >
        <div class="section-header">
          <div>
            <span class="section-tag">FEATURED SHOWCASE</span>
            <h2 class="section-title">Spotlight Projects</h2>
          </div>

          <div class="carousel-controls">
            <!-- View Mode Switcher -->
            <button class="view-mode-btn" (click)="toggleViewMode()">
              {{
                isGridView
                  ? '🎞 Switch to Spotlight Slides'
                  : '⊞ Switch to Grid View'
              }}
            </button>
            <div class="arrow-btns" *ngIf="!isGridView && projects.length > 1">
              <button
                class="control-btn"
                (click)="prevSlide(projects.length)"
                aria-label="Previous Slide"
              >
                ‹
              </button>
              <button
                class="control-btn"
                (click)="nextSlide(projects.length)"
                aria-label="Next Slide"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <!-- 1. SLIDER / CAROUSEL VIEW -->
        <div
          class="carousel-wrapper tab-card-anim"
          *ngIf="!isGridView && projects.length > 0"
          (mouseenter)="pauseAutoSlide()"
          (mouseleave)="resumeAutoSlide(projects.length)"
        >
          <div
            class="carousel-card glass-panel"
            *ngIf="projects[currentSlideIndex] as currentProject"
          >
            <div class="carousel-media" *ngIf="currentProject.imageUrl">
              <img
                [src]="currentProject.imageUrl"
                [alt]="currentProject.title"
                class="slide-img"
              />
              <div class="carousel-media-overlay"></div>
              <span class="slide-counter-badge"
                >{{ currentSlideIndex + 1 }} / {{ projects.length }}</span
              >
            </div>

            <div class="carousel-info">
              <div class="card-tags">
                <span class="badge-tag">{{ currentProject.category }}</span>
                <span class="spotlight-tag">★ FEATURED</span>
              </div>
              <h3 class="slide-title">{{ currentProject.title }}</h3>
              <p class="slide-tagline">{{ currentProject.tagline }}</p>
              <p class="slide-desc">{{ currentProject.description }}</p>

              <div class="tech-stack">
                <span
                  class="tech-chip"
                  *ngFor="let tech of currentProject.technologies"
                  >{{ tech }}</span
                >
              </div>

              <div class="slide-actions">
                <a
                  [href]="currentProject.demoUrl"
                  target="_blank"
                  class="btn-cinematic btn-sm"
                  *ngIf="currentProject.demoUrl"
                >
                  <span>Live Interactive Demo</span>
                  <span>↗</span>
                </a>
                <a
                  [href]="currentProject.githubUrl"
                  target="_blank"
                  class="btn-cinematic btn-outline btn-sm"
                  *ngIf="currentProject.githubUrl"
                >
                  <span>Source Code</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Carousel Pagination Dots & Progress Bar -->
          <div class="carousel-pagination" *ngIf="projects.length > 1">
            <button
              *ngFor="let p of projects; let idx = index"
              class="dot-btn"
              [class.active]="idx === currentSlideIndex"
              (click)="goToSlide(idx)"
              [attr.aria-label]="'Go to slide ' + (idx + 1)"
            >
              <span
                class="dot-fill"
                [style.width]="idx === currentSlideIndex ? '100%' : '0%'"
              ></span>
            </button>
          </div>
        </div>

        <!-- 2. GRID VIEW (ALTERNATIVE TOGGLE) -->
        <div class="projects-grid tab-card-anim" *ngIf="isGridView">
          <div
            class="project-card glass-panel card-hover-fx"
            *ngFor="let project of projects"
          >
            <div class="card-img-wrapper" *ngIf="project.imageUrl">
              <img
                [src]="project.imageUrl"
                [alt]="project.title"
                loading="lazy"
              />
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
                <span
                  class="tech-chip"
                  *ngFor="let tech of project.technologies"
                  >{{ tech }}</span
                >
              </div>
              <div class="card-footer-actions">
                <a
                  [href]="project.demoUrl"
                  target="_blank"
                  class="btn-cinematic btn-sm"
                  *ngIf="project.demoUrl"
                  >Live Demo ↗</a
                >
                <a
                  [href]="project.githubUrl"
                  target="_blank"
                  class="btn-cinematic btn-outline btn-sm"
                  *ngIf="project.githubUrl"
                  >Code ↗</a
                >
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- INTERACTIVE FILTERABLE SKILLS SECTION -->
      <section
        class="section-container scroll-reveal"
        *ngIf="skills$ | async as skills"
      >
        <div class="section-header">
          <div>
            <span class="section-tag">CAPABILITIES</span>
            <h2 class="section-title">Technical Expertise</h2>
          </div>

          <!-- Category Filter Tabs -->
          <div class="skill-category-filters">
            <button
              *ngFor="let cat of skillCategories"
              class="filter-pill"
              [class.active]="selectedSkillCategory === cat"
              (click)="onSkillCategoryChange(cat)"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <div class="skills-grid" [class.tab-card-anim]="isTabAnimating">
          <div
            class="skill-card glass-panel card-hover-fx"
            *ngFor="let skill of getFilteredSkills(skills); let sIdx = index"
            [style.animation-delay]="sIdx * 0.05 + 's'"
          >
            <div class="skill-header">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-percent">{{ skill.proficiency }}%</span>
            </div>
            <div class="skill-bar-track">
              <div
                class="skill-bar-fill"
                [style.width.%]="skill.proficiency"
              ></div>
            </div>
            <div class="skill-footer">
              <span class="badge-tag">{{ skill.category }}</span>
              <span class="proficiency-level">{{
                getProficiencyLabel(skill.proficiency)
              }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- RECENT ARTICLES -->
      <section
        class="section-container scroll-reveal"
        *ngIf="featuredBlogs$ | async as blogs"
      >
        <div class="section-header">
          <div>
            <span class="section-tag">INSIGHTS</span>
            <h2 class="section-title">Latest Articles</h2>
          </div>
          <a routerLink="/blogs" class="btn-cinematic btn-outline btn-sm"
            >All Blogs →</a
          >
        </div>

        <div class="blogs-grid">
          <div
            class="blog-card glass-panel card-hover-fx"
            *ngFor="let blog of blogs"
          >
            <div class="blog-img" *ngIf="blog.coverImage">
              <img [src]="blog.coverImage" [alt]="blog.title" loading="lazy" />
            </div>
            <div class="blog-content">
              <div class="blog-meta">
                <span>{{ blog.publishedAt | date: 'mediumDate' }}</span>
                <span>•</span>
                <span>{{ blog.readTimeMinutes }} min read</span>
                <span
                  class="read-badge"
                  *ngIf="contentService.isBlogRead(blog.id)"
                  >✓ SEEN</span
                >
              </div>
              <h3 class="blog-title">
                <a [routerLink]="['/blogs', blog.id]">{{ blog.title }}</a>
              </h3>
              <p class="blog-summary">{{ blog.summary }}</p>
              <a [routerLink]="['/blogs', blog.id]" class="read-more-link"
                >Read Full Post →</a
              >
            </div>
          </div>
        </div>
      </section>

      <!-- CAREER EXPERIENCE TIMELINE PREVIEW -->
      <section
        class="section-container scroll-reveal"
        *ngIf="experiences$ | async as experiences"
      >
        <div class="section-header">
          <div>
            <span class="section-tag">CAREER TIMELINE</span>
            <h2 class="section-title">Work Experience</h2>
          </div>
          <a routerLink="/experiences" class="btn-cinematic btn-outline btn-sm"
            >Interactive Timeline →</a
          >
        </div>

        <div class="experiences-home-grid">
          <div
            class="exp-home-card glass-panel card-hover-fx"
            *ngFor="let exp of experiences"
          >
            <div class="exp-time-badge">
              {{ exp.startDate }} — {{ exp.endDate }}
            </div>
            <h3 class="exp-title">{{ exp.jobTitle }}</h3>
            <h4 class="exp-org">{{ exp.organization }}</h4>
            <ul class="exp-bullets">
              <li *ngFor="let bullet of exp.responsibilities.slice(0, 2)">
                <span class="bullet-spark">⚡</span>
                <span>{{ bullet }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- RECOGNITIONS -->
      <section
        class="section-container scroll-reveal"
        *ngIf="featuredAchievements$ | async as achievements"
      >
        <div class="section-header">
          <div>
            <span class="section-tag">HONORS</span>
            <h2 class="section-title">Achievements & Milestones</h2>
          </div>
          <a routerLink="/achievements" class="btn-cinematic btn-outline btn-sm"
            >View All →</a
          >
        </div>

        <div class="achievements-grid-home">
          <div
            class="achieve-card glass-panel card-hover-fx"
            *ngFor="let item of achievements"
          >
            <div class="achieve-thumb" *ngIf="item.badgeUrl">
              <img [src]="item.badgeUrl" [alt]="item.title" loading="lazy" />
            </div>
            <div class="achieve-icon" *ngIf="!item.badgeUrl">🏆</div>
            <div class="achieve-info">
              <h4>{{ item.title }}</h4>
              <p class="org">
                {{ item.organization }} • {{ item.date | date: 'yyyy' }}
              </p>
              <p class="desc">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .home-wrapper {
        padding-top: 1.5rem;
      }

      .hero-section {
        padding: 1.5rem 0.5rem 1rem 0.5rem;
        max-width: 920px;
        margin: 0 auto;
      }

      .hero-main-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2.5rem;
        text-align: left;
        margin-bottom: 2.2rem;

        @media (max-width: 820px) {
          flex-direction: column-reverse;
          text-align: center;
          gap: 1.75rem;
        }
      }

      .hero-text-content {
        flex: 1;
      }

      .hero-avatar-col {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .avatar-gradient-wrapper {
        position: relative;
        width: 145px;
        height: 145px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;

        @media (max-width: 480px) {
          width: 125px;
          height: 125px;
        }
      }

      .avatar-glow-effect {
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        background: conic-gradient(
          from 0deg,
          #06b6d4,
          #8b5cf6,
          #ec4899,
          #3b82f6,
          #06b6d4
        );
        filter: blur(12px);
        opacity: 0.6;
        animation: spinConic 6s linear infinite;
        pointer-events: none;
      }

      .avatar-rotating-ring {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: conic-gradient(
          from 0deg,
          #06b6d4,
          #8b5cf6,
          #ec4899,
          #3b82f6,
          #06b6d4
        );
        animation: spinConic 6s linear infinite;
        box-shadow:
          0 0 20px rgba(6, 182, 212, 0.4),
          0 0 40px rgba(139, 92, 246, 0.25);
        pointer-events: none;
      }

      .avatar-inner-circle {
        position: absolute;
        inset: 3.5px;
        border-radius: 50%;
        overflow: hidden;
        background: #090d16;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        transform: translateZ(0);
      }

      .avatar-face-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 50% 8%;
        transform: scale(1.48) translateZ(0);
        transform-origin: 28% 30%;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .avatar-gradient-wrapper:hover .avatar-face-image {
        transform: scale(1.58) translateZ(0);
      }

      .avatar-status-pill {
        position: absolute;
        bottom: -6px;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.2rem 0.65rem;
        border-radius: 20px;
        background: rgba(15, 23, 42, 0.95);
        border: 1px solid rgba(16, 185, 129, 0.5);
        backdrop-filter: blur(8px);
        color: #34d399;
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 0.03em;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        z-index: 2;
      }

      .pulse-status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 6px #10b981;
        animation: pulse 1.5s infinite;
      }

      @keyframes spinConic {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .hero-top-badges {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;

        @media (max-width: 820px) {
          justify-content: center;
        }
      }

      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.25rem 0.65rem;
        border-radius: 30px;
        background: rgba(6, 182, 212, 0.1);
        border: 1px solid rgba(6, 182, 212, 0.3);
        color: var(--accent-cyan);
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.04em;
      }

      .neon-status-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.25rem 0.65rem;
        border-radius: 30px;
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #34d399;
        font-size: 0.7rem;
        font-weight: 700;
      }

      .chip-spark {
        color: #34d399;
        animation: spinSlow 6s linear infinite;
      }

      @keyframes spinSlow {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .pulse-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--accent-cyan);
        box-shadow: 0 0 8px var(--accent-cyan);
        animation: pulse 1.5s infinite;
      }

      @keyframes pulse {
        0% {
          transform: scale(0.95);
          opacity: 0.7;
        }
        50% {
          transform: scale(1.3);
          opacity: 1;
        }
        100% {
          transform: scale(0.95);
          opacity: 0.7;
        }
      }

      .hero-title {
        font-size: 2.5rem;
        line-height: 1.18;
        font-weight: 800;
        margin-bottom: 0.75rem;

        @media (max-width: 768px) {
          font-size: 1.75rem;
        }
        @media (max-width: 480px) {
          font-size: 1.5rem;
        }
      }

      .dynamic-roles {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        min-height: 1.6rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 0.35rem;

        @media (max-width: 820px) {
          justify-content: center;
        }

        @media (max-width: 600px) {
          font-size: 0.88rem;
        }
      }

      .role-static {
        color: var(--text-dim);
      }

      .role-animated {
        font-weight: 700;
      }

      .typing-cursor {
        color: var(--accent-cyan);
        animation: blink 1s step-end infinite;
      }

      @keyframes blink {
        from,
        to {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
      }

      .hero-subtitle {
        font-size: 0.92rem;
        color: var(--text-muted);
        margin-bottom: 1.5rem;
        line-height: 1.5;
        max-width: 620px;
        margin-left: 0;
        margin-right: 0;

        @media (max-width: 820px) {
          margin-left: auto;
          margin-right: auto;
        }
      }

      .hero-actions {
        display: flex;
        justify-content: flex-start;
        gap: 0.6rem;
        margin-bottom: 0.5rem;

        @media (max-width: 820px) {
          justify-content: center;
        }

        @media (max-width: 480px) {
          flex-direction: row;
          width: 100%;
          .btn-cinematic {
            flex: 1;
            justify-content: center;
          }
        }
      }

      .arrow-anim {
        transition: transform 0.25s ease;
      }
      .btn-cinematic:hover .arrow-anim {
        transform: translateX(4px);
      }

      .stats-bar {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 0.85rem 1rem;
        border-radius: 14px;

        @media (max-width: 600px) {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.65rem 0.35rem;
          padding: 0.75rem 0.5rem;
        }
      }

      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .stat-number {
        font-size: 1.4rem;
        font-weight: 800;
        font-family: var(--font-heading);
      }

      .stat-label {
        font-size: 0.68rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .stat-divider {
        width: 1px;
        height: 30px;
        background: var(--border-glass);

        @media (max-width: 600px) {
          display: none;
        }
      }

      /* SECTIONS */
      .section-container {
        margin-top: 2.25rem;

        @media (max-width: 768px) {
          margin-top: 1.75rem;
        }
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 1.15rem;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .section-tag {
        font-size: 0.7rem;
        font-weight: 700;
        color: var(--accent-indigo);
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .section-title {
        font-size: 1.6rem;
        font-weight: 700;
        color: #fff;

        @media (max-width: 600px) {
          font-size: 1.3rem;
        }
      }

      /* CAROUSEL / SLIDER STYLES */
      .carousel-controls {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .view-mode-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-glass);
        color: var(--text-muted);
        padding: 0.4rem 0.9rem;
        border-radius: 8px;
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition-smooth);

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border-color: var(--accent-cyan);
        }
      }

      .arrow-btns {
        display: flex;
        gap: 0.4rem;
      }

      .control-btn {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: rgba(99, 102, 241, 0.15);
        border: 1px solid rgba(99, 102, 241, 0.3);
        color: #fff;
        font-size: 1.4rem;
        line-height: 1;
        cursor: pointer;
        transition: var(--transition-smooth);

        &:hover {
          background: var(--accent-indigo);
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
        }
      }

      .carousel-wrapper {
        position: relative;
      }

      .carousel-card {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        border-radius: 16px;
        overflow: hidden;
        min-height: 350px;
        animation: fadeInSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1);

        @media (max-width: 868px) {
          grid-template-columns: 1fr;
          min-height: auto;
          border-radius: 12px;
        }
      }

      @keyframes fadeInSlide {
        from {
          opacity: 0;
          transform: scale(0.98) translateX(15px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateX(0);
        }
      }

      .carousel-media {
        position: relative;
        min-height: 280px;
        overflow: hidden;

        @media (max-width: 600px) {
          min-height: 95px;
        }
      }

      .slide-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;
      }

      .carousel-card:hover .slide-img {
        transform: scale(1.04);
      }

      .carousel-media-overlay {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(
            to right,
            transparent 50%,
            rgba(18, 24, 38, 0.9) 100%
          ),
          linear-gradient(to top, rgba(18, 24, 38, 0.8) 0%, transparent 60%);

        @media (max-width: 868px) {
          background: linear-gradient(
            to top,
            rgba(18, 24, 38, 1) 0%,
            transparent 70%
          );
        }
      }

      .slide-counter-badge {
        position: absolute;
        top: 0.75rem;
        left: 0.75rem;
        background: rgba(0, 0, 0, 0.65);
        backdrop-filter: blur(8px);
        color: #fff;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 0.2rem 0.5rem;
        border-radius: 6px;
        border: 1px solid var(--border-glass);
      }

      .spotlight-tag {
        font-size: 0.68rem;
        font-weight: 800;
        color: #fbbf24;
        background: rgba(251, 191, 36, 0.15);
        border: 1px solid rgba(251, 191, 36, 0.3);
        padding: 0.15rem 0.5rem;
        border-radius: 20px;
      }

      .carousel-info {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;

        @media (max-width: 600px) {
          padding: 0.85rem 1rem;
        }
      }

      .slide-title {
        font-size: 1.6rem;
        color: #fff;
        margin: 0.5rem 0 0.2rem 0;

        @media (max-width: 600px) {
          font-size: 1.15rem;
          margin: 0.3rem 0 0.15rem 0;
        }
      }

      .slide-tagline {
        color: var(--accent-cyan);
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 0.85rem;

        @media (max-width: 600px) {
          font-size: 0.8rem;
          margin-bottom: 0.4rem;
        }
      }

      .slide-desc {
        color: var(--text-muted);
        font-size: 0.9rem;
        line-height: 1.6;
        margin-bottom: 1.25rem;

        @media (max-width: 600px) {
          font-size: 0.78rem;
          line-height: 1.45;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }

      .slide-actions {
        display: flex;
        gap: 0.65rem;
        margin-top: auto;
        flex-wrap: wrap;

        @media (max-width: 600px) {
          gap: 0.4rem;
          .btn-cinematic {
            padding: 0.3rem 0.65rem;
            font-size: 0.75rem;
          }
        }
      }

      .carousel-pagination {
        display: flex;
        justify-content: center;
        gap: 0.6rem;
        margin-top: 1.25rem;
      }

      .dot-btn {
        width: 40px;
        height: 6px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 4px;
        border: none;
        cursor: pointer;
        padding: 0;
        overflow: hidden;
        transition: var(--transition-smooth);

        &.active {
          width: 60px;
          background: var(--accent-indigo);
        }
      }

      .dot-fill {
        display: block;
        height: 100%;
        background: var(--accent-cyan);
        transition: width 0.3s ease;
      }

      /* SKILL FILTER PILLS */
      .skill-category-filters {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .filter-pill {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--border-glass);
        color: var(--text-muted);
        padding: 0.35rem 0.85rem;
        border-radius: 20px;
        font-size: 0.8rem;
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
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
        }
      }

      /* SKILLS */
      .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 1.25rem;

        @media (max-width: 600px) {
          grid-template-columns: repeat(2, 1fr);
          gap: 0.6rem;
        }
      }

      .skill-card {
        padding: 1rem 0.85rem;
        border-radius: 12px;

        @media (max-width: 480px) {
          padding: 0.75rem 0.65rem;
        }
      }

      .skill-header {
        display: flex;
        justify-content: space-between;
        font-weight: 600;
        font-size: 0.88rem;
        margin-bottom: 0.45rem;

        @media (max-width: 480px) {
          font-size: 0.8rem;
        }
      }

      .skill-percent {
        color: var(--accent-cyan);
        font-family: var(--font-heading);
        font-weight: 700;
      }

      .skill-bar-track {
        height: 5px;
        width: 100%;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
      }

      .skill-bar-fill {
        height: 100%;
        background: linear-gradient(
          90deg,
          var(--accent-cyan),
          var(--accent-indigo)
        );
        border-radius: 4px;
        box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .skill-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .proficiency-level {
        font-size: 0.7rem;
        color: var(--text-dim);
        font-weight: 600;
      }

      /* PROJECTS GRID */
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

      .card-img-wrapper {
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

      .card-img-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to top,
          rgba(18, 24, 38, 1),
          transparent 70%
        );
      }

      .card-body {
        padding: 1.15rem;
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        @media (max-width: 600px) {
          padding: 0.75rem 0.65rem;
        }
      }

      .card-title {
        font-size: 1.15rem;
        margin: 0.35rem 0 0.15rem 0;
        color: #fff;

        @media (max-width: 600px) {
          font-size: 0.95rem;
        }
      }

      .card-sub {
        color: var(--accent-cyan);
        font-size: 0.8rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .card-desc {
        color: var(--text-muted);
        font-size: 0.85rem;
        margin-bottom: 0.85rem;
        flex-grow: 1;

        @media (max-width: 600px) {
          font-size: 0.78rem;
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }

      .tech-stack {
        display: flex;
        flex-wrap: wrap;
        gap: 0.3rem;
        margin-bottom: 0.85rem;
      }

      .tech-chip {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-glass);
        padding: 0.15rem 0.4rem;
        border-radius: 6px;
        font-size: 0.7rem;
        color: var(--text-muted);
      }

      .card-footer-actions {
        display: flex;
        gap: 0.5rem;

        @media (max-width: 600px) {
          flex-direction: column;
          gap: 0.35rem;
        }
      }

      /* BLOGS */
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
        padding: 1.15rem;
        display: flex;
        flex-direction: column;
        border-radius: 12px;

        @media (max-width: 600px) {
          padding: 0.75rem 0.65rem;
        }
      }

      .blog-img {
        height: 150px;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 0.85rem;

        @media (max-width: 600px) {
          height: 80px;
          margin-bottom: 0.4rem;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .blog-meta {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.75rem;
        color: var(--text-dim);
        margin-bottom: 0.4rem;
      }

      .read-badge {
        background: rgba(16, 185, 129, 0.2);
        color: var(--accent-emerald);
        padding: 0.1rem 0.35rem;
        border-radius: 4px;
        font-weight: 700;
        font-size: 0.65rem;
      }

      .blog-title {
        font-size: 1.05rem;
        margin-bottom: 0.4rem;

        @media (max-width: 600px) {
          font-size: 0.9rem;
        }

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
        font-size: 0.82rem;
        margin-bottom: 0.75rem;
        flex-grow: 1;

        @media (max-width: 600px) {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }

      .read-more-link {
        color: var(--accent-indigo);
        text-decoration: none;
        font-weight: 600;
        font-size: 0.8rem;

        &:hover {
          text-decoration: underline;
        }
      }

      /* ACHIEVEMENTS */
      .achievements-grid-home {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
        gap: 1.25rem;

        @media (max-width: 600px) {
          grid-template-columns: repeat(2, 1fr);
          gap: 0.65rem;
        }
      }

      .achieve-card {
        padding: 1.15rem;
        display: flex;
        gap: 0.85rem;
        align-items: flex-start;
        border-radius: 12px;

        @media (max-width: 600px) {
          padding: 0.75rem 0.65rem;
          gap: 0.5rem;
        }
      }

      .achieve-icon {
        font-size: 1.5rem;
        background: rgba(255, 255, 255, 0.05);
        padding: 0.4rem;
        border-radius: 8px;

        @media (max-width: 600px) {
          font-size: 1.2rem;
          padding: 0.3rem;
        }
      }

      /* EXPERIENCES PREVIEW IN HOME */
      .experiences-home-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
        gap: 1.25rem;

        @media (max-width: 600px) {
          grid-template-columns: repeat(2, 1fr);
          gap: 0.65rem;
        }
      }

      .exp-home-card {
        padding: 1.15rem;
        border-radius: 12px;
        display: flex;
        flex-direction: column;

        @media (max-width: 600px) {
          padding: 0.75rem 0.65rem;
        }
      }

      .exp-time-badge {
        display: inline-block;
        align-self: flex-start;
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--accent-cyan);
        background: rgba(6, 182, 212, 0.1);
        border: 1px solid rgba(6, 182, 212, 0.3);
        padding: 0.25rem 0.65rem;
        border-radius: 20px;
        margin-bottom: 0.8rem;
      }

      .exp-title {
        font-size: 1.25rem;
        color: #fff;
        margin-bottom: 0.2rem;
      }

      .exp-org {
        color: var(--accent-indigo);
        font-size: 0.92rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }

      .exp-bullets {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        li {
          display: flex;
          align-items: flex-start;
          gap: 0.4rem;
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
      }

      /* SCROLL REVEAL STYLES */
      .scroll-reveal {
        opacity: 0;
        transform: translateY(35px) scale(0.97);
        transition:
          opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: opacity, transform;

        &.in-view {
          opacity: 1 !important;
          transform: translateY(0) scale(1) !important;
        }
      }

      /* CONTACT / GET IN TOUCH SECTION */
      .contact-grid {
        display: grid;
        grid-template-columns: 1fr 1.25fr;
        gap: 1.5rem;

        @media (max-width: 820px) {
          grid-template-columns: 1fr;
        }
      }

      .contact-info-card,
      .contact-form-card {
        padding: 1.6rem;
        border-radius: 16px;
      }

      .info-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.35rem 0.85rem;
        border-radius: 30px;
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #34d399;
        font-size: 0.76rem;
        font-weight: 700;
        margin-bottom: 1.25rem;
      }

      .contact-heading {
        font-size: 1.5rem;
        font-weight: 800;
        line-height: 1.25;
        margin-bottom: 0.75rem;
      }

      .contact-lead {
        color: var(--text-muted);
        font-size: 0.92rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }

      .contact-details {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .detail-item {
        display: flex;
        align-items: center;
        gap: 0.85rem;
      }

      .detail-icon {
        font-size: 1.25rem;
        background: rgba(255, 255, 255, 0.05);
        padding: 0.5rem;
        border-radius: 10px;
        line-height: 1;
      }

      .detail-label {
        font-size: 0.72rem;
        color: var(--text-dim);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 700;
        display: block;
      }

      .detail-val {
        font-size: 0.9rem;
        font-weight: 600;
        color: #fff;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;

        @media (max-width: 520px) {
          grid-template-columns: 1fr;
        }
      }

      .form-group {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;

        label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
        }
      }

      .form-input {
        width: 100%;
        background: rgba(10, 12, 16, 0.7);
        border: 1px solid var(--border-glass);
        border-radius: 10px;
        padding: 0.65rem 0.9rem;
        color: #fff;
        font-family: var(--font-body);
        font-size: 0.88rem;
        outline: none;
        transition: var(--transition-smooth);

        &:focus {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.25);
        }
      }

      .send-msg-btn {
        width: 100%;
        justify-content: center;
        margin-top: 0.5rem;
      }

      .form-status {
        padding: 0.65rem 0.9rem;
        border-radius: 8px;
        font-size: 0.82rem;
        font-weight: 600;
        margin-bottom: 1rem;

        &.success {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        &.error {
          background: rgba(244, 63, 94, 0.15);
          color: #f87171;
          border: 1px solid rgba(244, 63, 94, 0.3);
        }
      }

      .achievements-grid-home {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.25rem;
      }

      .achieve-card {
        padding: 1.25rem;
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        border-radius: 12px;
      }

      .achieve-thumb {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        overflow: hidden;
        flex-shrink: 0;
        border: 1px solid var(--border-glass);
        background: rgba(0, 0, 0, 0.2);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .achieve-icon {
        font-size: 1.8rem;
        flex-shrink: 0;
      }

      .achieve-info {
        flex: 1;
        h4 {
          color: #fff;
          font-size: 1.05rem;
          margin: 0 0 0.25rem 0;
        }
        .org {
          color: var(--accent-cyan);
          font-size: 0.8rem;
          margin: 0 0 0.4rem 0;
        }
        .desc {
          color: var(--text-muted);
          font-size: 0.85rem;
          line-height: 1.5;
          margin: 0;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  contentService = inject(ContentService);
  private el = inject(ElementRef);

  skills$: Observable<Skill[]> = this.contentService.skills$;
  featuredProjects$: Observable<Project[]> = this.contentService.projects$;
  featuredBlogs$: Observable<Blog[]> = this.contentService.blogs$;
  featuredAchievements$: Observable<Achievement[]> =
    this.contentService.achievements$;
  experiences$: Observable<Experience[]> = this.contentService.experiences$;
  stats$: Observable<PortfolioStats> = this.contentService.stats$;

  // Get In Touch Contact Form State
  contactModel = {
    name: '',
    email: '',
    contact: '',
    message: '',
  };
  contactSending = false;
  contactSubmitSuccess = false;
  contactSubmitError: string | null = null;

  sendContactMessage(): void {
    if (
      !this.contactModel.name ||
      !this.contactModel.email ||
      !this.contactModel.message
    )
      return;

    this.contactSending = true;
    this.contactSubmitSuccess = false;
    this.contactSubmitError = null;

    this.contentService.sendContactMessage(this.contactModel).subscribe({
      next: () => {
        this.contactSending = false;
        this.contactSubmitSuccess = true;
        this.contactModel = { name: '', email: '', contact: '', message: '' };
        setTimeout(() => (this.contactSubmitSuccess = false), 6000);
      },
      error: (err) => {
        this.contactSending = false;
        this.contactSubmitError =
          err?.error?.error || 'Failed to send message. Please try again.';
      },
    });
  }

  // Scroll Reveal State
  private scrollObserver: IntersectionObserver | null = null;
  isTabAnimating = true;

  // Animated Counter State
  displayStats = {
    projectsCount: 0,
    blogsCount: 0,
    achievementsCount: 0,
    skillsCount: 0,
    experiencesCount: 0,
  };
  private counterInterval: any;

  // Interactive Carousel State
  currentSlideIndex = 0;
  isGridView = false;
  private autoSlideInterval: any;

  // Filterable Skills State
  skillCategories = ['All', 'Frontend', 'Backend', 'Cloud/DevOps', 'Tools'];
  selectedSkillCategory = 'All';

  // Dynamic Typewriter Headline State
  roles: string[] = ['Android Development', 'Dotnet EF Core', 'Angular'];
  currentRoleIndex = 0;
  currentRoleText = '';
  private isDeleting = false;
  private typewriterTimer: any;

  ngOnInit(): void {
    this.startTypewriter();
    this.startAutoSlide();
    this.initStatsCounter();
  }

  ngAfterViewInit(): void {
    this.setupScrollObserver();
  }

  ngOnDestroy(): void {
    this.pauseAutoSlide();
    clearTimeout(this.typewriterTimer);
    if (this.counterInterval) clearInterval(this.counterInterval);
    if (this.scrollObserver) this.scrollObserver.disconnect();
  }

  private setupScrollObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      const items = (this.el.nativeElement as HTMLElement).querySelectorAll(
        '.scroll-reveal',
      );
      items.forEach((item: Element) => item.classList.add('in-view'));
      return;
    }

    this.scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            // Only reset when element scrolls BELOW viewport (user scrolled up above it)
            // boundingClientRect.top > 0 means element is below the visible area
            // This prevents the bounce on the last item at the bottom of the page
            if (entry.boundingClientRect.top > 0) {
              entry.target.classList.remove('in-view');
            }
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px 0px 0px',
      },
    );

    const checkAndObserve = () => {
      const items = (this.el.nativeElement as HTMLElement).querySelectorAll(
        '.scroll-reveal',
      );
      if (items.length > 0) {
        items.forEach((item: Element) => this.scrollObserver?.observe(item));
      } else {
        setTimeout(checkAndObserve, 150);
      }
    };

    setTimeout(checkAndObserve, 100);
  }

  onSkillCategoryChange(cat: string): void {
    this.selectedSkillCategory = cat;
    this.isTabAnimating = false;
    setTimeout(() => (this.isTabAnimating = true), 20);
  }

  // Animated Counter Logic
  private initStatsCounter(): void {
    this.stats$.subscribe((target) => {
      if (!target) return;
      this.animateCounter(target);
    });
  }

  private animateCounter(target: PortfolioStats): void {
    if (this.counterInterval) clearInterval(this.counterInterval);

    const duration = 1200; // 1.2s total animation
    const steps = 30;
    const stepTime = duration / steps;
    let step = 0;

    this.counterInterval = setInterval(() => {
      step++;
      const progress = step / steps;
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);

      this.displayStats = {
        projectsCount: Math.round(target.projectsCount * ease),
        blogsCount: Math.round(target.blogsCount * ease),
        achievementsCount: Math.round(target.achievementsCount * ease),
        skillsCount: Math.round(target.skillsCount * ease),
        experiencesCount: Math.round((target.experiencesCount || 3) * ease),
      };

      if (step >= steps) {
        clearInterval(this.counterInterval);
        this.displayStats = {
          projectsCount: target.projectsCount,
          blogsCount: target.blogsCount,
          achievementsCount: target.achievementsCount,
          skillsCount: target.skillsCount,
          experiencesCount: target.experiencesCount || 3,
        };
      }
    }, stepTime);
  }

  // Typewriter effect
  private startTypewriter(): void {
    const fullText = this.roles[this.currentRoleIndex];
    if (this.isDeleting) {
      this.currentRoleText = fullText.substring(
        0,
        this.currentRoleText.length - 1,
      );
    } else {
      this.currentRoleText = fullText.substring(
        0,
        this.currentRoleText.length + 1,
      );
    }

    let speed = this.isDeleting ? 40 : 80;

    if (!this.isDeleting && this.currentRoleText === fullText) {
      speed = 2200; // Pause at full word
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentRoleText === '') {
      this.isDeleting = false;
      this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
      speed = 400;
    }

    this.typewriterTimer = setTimeout(() => this.startTypewriter(), speed);
  }

  // Carousel methods
  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide(3); // defaults to cycling
    }, 5500);
  }

  pauseAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  resumeAutoSlide(total: number): void {
    this.pauseAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide(total);
    }, 5500);
  }

  nextSlide(total: number): void {
    if (total > 0) {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % total;
    }
  }

  prevSlide(total: number): void {
    if (total > 0) {
      this.currentSlideIndex = (this.currentSlideIndex - 1 + total) % total;
    }
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }

  toggleViewMode(): void {
    this.isGridView = !this.isGridView;
  }

  // Skills helpers
  getFilteredSkills(skills: Skill[]): Skill[] {
    if (this.selectedSkillCategory === 'All') return skills;
    return skills.filter(
      (s) =>
        s.category.toLowerCase() === this.selectedSkillCategory.toLowerCase(),
    );
  }

  getProficiencyLabel(percent: number): string {
    if (percent >= 90) return 'Expert';
    if (percent >= 80) return 'Advanced';
    return 'Proficient';
  }
}
