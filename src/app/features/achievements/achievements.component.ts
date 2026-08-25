import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { Achievement } from '../../core/models/portfolio.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-custom page-wrapper">
      <div class="page-header">
        <span class="badge-tag">RECOGNITION & HONORS</span>
        <h1 class="page-title">Achievements & Awards</h1>
        <p class="page-desc">Milestones, competition victories, open-source recognitions, and industry honors.</p>
      </div>

      <div class="achievements-grid">
        <div class="achieve-card glass-panel" *ngFor="let item of achievements$ | async">
          <div class="badge-header">
            <span class="badge-tag">{{ item.category }}</span>
            <span class="date">{{ item.date | date:'mediumDate' }}</span>
          </div>
          <h2 class="title">{{ item.title }}</h2>
          <h4 class="org">{{ item.organization }}</h4>
          <p class="desc">{{ item.description }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-wrapper { padding-top: 3rem; }
    .page-header { text-align: center; margin-bottom: 3rem; }
    .page-title { font-size: 2.8rem; margin: 0.5rem 0; }
    .page-desc { color: var(--text-muted); max-width: 600px; margin: 0 auto; }
    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.5rem;
    }
    .achieve-card {
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
    }
    .badge-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .date {
      font-size: 0.8rem;
      color: var(--text-dim);
    }
    .title {
      font-size: 1.3rem;
      color: #fff;
      margin-bottom: 0.3rem;
    }
    .org {
      color: var(--accent-cyan);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    .desc {
      color: var(--text-muted);
      font-size: 0.92rem;
      line-height: 1.6;
    }
  `]
})
export class AchievementsComponent {
  private contentService = inject(ContentService);
  achievements$: Observable<Achievement[]> = this.contentService.achievements$;
}
