import { Component, inject, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { Experience } from '../../core/models/portfolio.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-experiences',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-custom page-wrapper">
      <div class="page-header animate-fade-in-up">
        <span class="badge-tag">CAREER JOURNEY</span>
        <h1 class="page-title">Work & Professional <span class="gradient-text-animated">Experience</span></h1>
        <p class="page-desc">Scroll down to explore engineering roles, core accomplishments, and technical responsibilities across my career.</p>
      </div>

      <!-- ANIMATED VERTICAL TIMELINE CONTAINER -->
      <div class="timeline-container" *ngIf="experiences$ | async as experiences">
        <div class="timeline-axis">
          <div class="axis-glow"></div>
        </div>

        <div
          class="timeline-item"
          *ngFor="let item of experiences; let idx = index; let isOdd = odd"
          [class.left-item]="!isOdd"
          [class.right-item]="isOdd"
          [style.animation-delay]="(idx * 0.15) + 's'"
        >
          <!-- Animated Node Connector -->
          <div class="timeline-node">
            <span class="node-dot"></span>
            <span class="node-ring"></span>
          </div>

          <!-- Timeline Card -->
          <div class="timeline-card glass-panel card-hover-fx">
            <div class="card-header">
              <div class="time-badge">
                <span class="calendar-icon">📅</span>
                <span>{{ item.startDate }} — {{ item.endDate }}</span>
              </div>
              <span class="location-tag" *ngIf="item.location">📍 {{ item.location }}</span>
            </div>

            <h2 class="job-title">{{ item.jobTitle }}</h2>
            <h3 class="org-name">{{ item.organization }}</h3>

            <div class="responsibilities-section" *ngIf="item.responsibilities?.length">
              <h4 class="section-sub">Key Responsibilities & Impact:</h4>
              <ul class="resp-list">
                <li *ngFor="let resp of item.responsibilities">
                  <span class="bullet-spark">⚡</span>
                  <span>{{ resp }}</span>
                </li>
              </ul>
            </div>

            <div class="tech-tags-wrapper" *ngIf="item.technologies?.length">
              <span class="tech-tag" *ngFor="let tech of item.technologies">{{ tech }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-wrapper {
      padding-top: 2rem;
    }
    .page-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .page-title {
      font-size: 2.2rem;
      margin: 0.4rem 0 0.6rem 0;
    }
    .page-desc {
      font-size: 0.95rem;
    }

    /* TIMELINE STRUCTURE */
    .timeline-container {
      position: relative;
      max-width: 820px;
      margin: 0 auto;
      padding: 1rem 0 2rem 0;
    }

    /* Vertical glowing axis line */
    .timeline-axis {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 3px;
      background: linear-gradient(180deg, var(--accent-cyan) 0%, var(--accent-indigo) 50%, var(--accent-purple) 100%);
      transform: translateX(-50%);
      border-radius: 2px;
      box-shadow: 0 0 12px rgba(6, 182, 212, 0.6);

      @media (max-width: 768px) {
        left: 10px;
        width: 2px;
      }
    }

    /* TIMELINE ITEM SCROLL REVEAL ANIMATION */
    .timeline-item {
      position: relative;
      margin-bottom: 1.75rem;
      width: 50%;
      padding-right: 1.5rem;
      opacity: 0;
      transform: translateY(35px) scale(0.97);
      transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;

      &.left-item {
        transform: translateX(-35px) translateY(20px) scale(0.97);
      }

      &.right-item {
        margin-left: 50%;
        padding-right: 0;
        padding-left: 1.5rem;
        transform: translateX(35px) translateY(20px) scale(0.97);
      }

      /* Scroll reveal state */
      &.in-view {
        opacity: 1 !important;
        transform: translateX(0) translateY(0) scale(1) !important;
      }

      @media (max-width: 768px) {
        width: 100%;
        margin-left: 0 !important;
        padding-left: 1.6rem !important;
        padding-right: 0 !important;
        margin-bottom: 1.15rem;
        transform: translateY(25px) !important;
      }
    }

    /* Compact Timeline Node */
    .timeline-node {
      position: absolute;
      top: 1.1rem;
      right: -7px;
      width: 14px;
      height: 14px;
      z-index: 10;

      .right-item & {
        right: auto;
        left: -7px;
      }

      @media (max-width: 768px) {
        left: 5px !important;
        right: auto !important;
        top: 0.85rem;
        width: 10px;
        height: 10px;
      }
    }

    .node-dot {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: var(--accent-cyan);
      box-shadow: 0 0 10px var(--accent-cyan);
    }

    .node-ring {
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      border: 2px solid var(--accent-indigo);
      animation: pulseRing 2s infinite ease-out;
    }

    @keyframes pulseRing {
      0% { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(1.8); opacity: 0; }
    }

    .timeline-card {
      padding: 1.15rem 1.25rem;
      border-radius: 12px;

      @media (max-width: 600px) {
        padding: 0.75rem 0.85rem;
        border-radius: 10px;
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-bottom: 0.45rem;
    }

    .time-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.18rem 0.55rem;
      border-radius: 16px;
      background: rgba(6, 182, 212, 0.12);
      border: 1px solid rgba(6, 182, 212, 0.35);
      color: var(--accent-cyan);
      font-size: 0.74rem;
      font-weight: 700;
    }

    .location-tag {
      font-size: 0.74rem;
      color: var(--text-dim);
    }

    .job-title {
      font-size: 1.2rem;
      color: #fff;
      margin-bottom: 0.15rem;

      @media (max-width: 600px) {
        font-size: 1rem;
      }
    }

    .org-name {
      color: var(--accent-indigo);
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 0.65rem;

      @media (max-width: 600px) {
        font-size: 0.82rem;
        margin-bottom: 0.45rem;
      }
    }

    .responsibilities-section {
      margin-bottom: 0.65rem;
    }

    .section-sub {
      font-size: 0.74rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 0.35rem;
    }

    .resp-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;

      li {
        display: flex;
        align-items: flex-start;
        gap: 0.35rem;
        font-size: 0.85rem;
        color: #d1d5db;
        line-height: 1.45;

      }
    }

    .bullet-spark {
      color: var(--accent-cyan);
      font-size: 0.75rem;
      margin-top: 0.15rem;
    }

    .tech-tags-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-glass);
    }

    .tech-tag {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-glass);
      color: var(--text-muted);
      padding: 0.15rem 0.5rem;
      border-radius: 6px;
      font-size: 0.74rem;
    }
  `]
})
export class ExperiencesComponent implements AfterViewInit, OnDestroy {
  private contentService = inject(ContentService);
  private el = inject(ElementRef);

  experiences$: Observable<Experience[]> = this.contentService.experiences$;
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // Fallback: make all items visible if IntersectionObserver is not supported
      const items = this.el.nativeElement.querySelectorAll('.timeline-item');
      items.forEach((item: Element) => item.classList.add('in-view'));
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            // Only reset if element is below viewport (user scrolled up above it)
            // Prevents bounce on the last timeline item when at bottom of page
            if (entry.boundingClientRect.top > 0) {
              entry.target.classList.remove('in-view');
            }
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px 0px 0px'
      }
    );

    // Observe items with polling check until DOM is populated
    const checkAndObserve = () => {
      const items = this.el.nativeElement.querySelectorAll('.timeline-item');
      if (items.length > 0) {
        items.forEach((item: Element) => this.observer?.observe(item));
      } else {
        setTimeout(checkAndObserve, 150);
      }
    };

    setTimeout(checkAndObserve, 100);
  }
}
