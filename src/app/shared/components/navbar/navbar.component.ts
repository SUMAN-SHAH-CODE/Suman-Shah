import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar glass-panel">
      <div class="nav-container container-custom">
        <!-- Brand Logo -->
        <a routerLink="/" class="brand-logo">
          <span class="logo-icon">⚡</span>
          <span class="logo-text">AETHER<span class="highlight">PORTFOLIO</span></span>
        </a>

        <!-- Desktop Navigation Links -->
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">Home</a>
          <a routerLink="/blogs" routerLinkActive="active" class="nav-item">Blogs</a>
          <a routerLink="/projects" routerLinkActive="active" class="nav-item">Projects</a>
          <a routerLink="/achievements" routerLinkActive="active" class="nav-item">Achievements</a>
          <a routerLink="/certificates" routerLinkActive="active" class="nav-item">Certificates</a>
        </div>

        <!-- Auth Actions / Admin Link -->
        <div class="nav-actions">
          <ng-container *ngIf="authService.currentUser$ | async as user; else loginBtn">
            <a routerLink="/admin/dashboard" class="btn-cinematic btn-sm">
              <span class="admin-badge">ADMIN</span>
              Dashboard
            </a>
            <button (click)="logout()" class="btn-cinematic btn-outline btn-sm">Logout</button>
          </ng-container>

          <ng-template #loginBtn>
            <a routerLink="/admin/login" class="btn-cinematic btn-outline btn-sm">Admin Portal</a>
          </ng-template>

          <!-- Mobile Hamburger Trigger -->
          <button class="mobile-toggle" (click)="toggleMobileMenu()" [class.open]="mobileMenuOpen" aria-label="Toggle Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div class="mobile-drawer" [class.show]="mobileMenuOpen">
        <a routerLink="/" (click)="closeMobileMenu()" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
        <a routerLink="/blogs" (click)="closeMobileMenu()" routerLinkActive="active">Blogs</a>
        <a routerLink="/projects" (click)="closeMobileMenu()" routerLinkActive="active">Projects</a>
        <a routerLink="/achievements" (click)="closeMobileMenu()" routerLinkActive="active">Achievements</a>
        <a routerLink="/certificates" (click)="closeMobileMenu()" routerLinkActive="active">Certificates</a>
        <ng-container *ngIf="authService.currentUser$ | async; else mobileLogin">
          <a routerLink="/admin/dashboard" (click)="closeMobileMenu()">Admin Dashboard</a>
          <button (click)="logout(); closeMobileMenu()" class="mobile-logout-btn">Logout</button>
        </ng-container>
        <ng-template #mobileLogin>
          <a routerLink="/admin/login" (click)="closeMobileMenu()">Admin Portal Login</a>
        </ng-template>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 1rem;
      z-index: 1000;
      margin: 1rem auto;
      max-width: 1200px;
      width: calc(100% - 2rem);
      border-radius: 20px;
      padding: 0.6rem 1.2rem;
    }

    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      text-decoration: none;
      font-family: var(--font-heading);
      font-weight: 800;
      font-size: 1.1rem;
      color: #fff;

      .highlight {
        color: var(--accent-cyan);
      }

      @media (max-width: 480px) {
        font-size: 0.95rem;
      }
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.8rem;

      @media (max-width: 868px) {
        display: none;
      }
    }

    .nav-item {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      transition: var(--transition-smooth);

      &:hover, &.active {
        color: #fff;
        text-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
      }
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .admin-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      font-size: 0.65rem;
      font-weight: 800;
    }

    .mobile-toggle {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 28px;
      height: 20px;
      background: transparent;
      border: none;
      cursor: pointer;

      span {
        display: block;
        height: 2px;
        width: 100%;
        background: #fff;
        border-radius: 2px;
        transition: var(--transition-smooth);
      }

      @media (max-width: 868px) {
        display: flex;
      }
    }

    .mobile-drawer {
      display: none;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem 0 0.5rem 0;
      border-top: 1px solid var(--border-glass);
      margin-top: 0.8rem;

      a {
        color: var(--text-muted);
        text-decoration: none;
        font-size: 1.05rem;
        font-weight: 500;

        &.active, &:hover {
          color: var(--accent-cyan);
        }
      }

      .mobile-logout-btn {
        background: transparent;
        border: none;
        color: var(--accent-rose);
        text-align: left;
        font-size: 1.05rem;
        cursor: pointer;
        padding: 0;
      }

      &.show {
        display: flex;
      }
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  mobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
