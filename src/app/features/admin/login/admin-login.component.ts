import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-custom login-wrapper">
      <div class="login-card glass-panel">
        <div class="login-header">
          <div class="security-badge">🔒 ADMIN AUTHENTICATION</div>
          <h2>Portfolio Portal Access</h2>
          <p>Authenticate with Google OAuth or Admin credentials to manage posts, blogs, achievements, and portfolio assets.</p>
        </div>

        <div class="error-box" *ngIf="errorMessage">
          ⚠️ {{ errorMessage }}
        </div>

        <!-- Google OAuth Button -->
        <button (click)="loginWithGoogle()" [disabled]="loading" class="oauth-btn">
          <svg class="google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.2 0 10.04 0 12s.47 3.8 1.29 5.42l3.99-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>Sign in with Google OAuth</span>
        </button>

        <div class="divider">
          <span>OR LOGIN WITH ADMIN CREDENTIALS</span>
        </div>

        <!-- Password Form -->
        <form (ngSubmit)="loginWithPassword()" class="login-form">
          <div class="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="admin@cinematic-portfolio.com"
              required
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>Master Password</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              required
              class="form-control"
            />
          </div>

          <div class="form-actions">
            <button type="submit" [disabled]="loading" class="btn-cinematic btn-block">
              {{ loading ? 'Authenticating...' : 'Sign In as Admin' }}
            </button>
            <button type="button" (click)="quickDemoLogin()" class="btn-cinematic btn-outline btn-block" style="margin-top: 0.5rem;">
              ⚡ One-Click Demo Admin Login
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      padding-top: 4rem;
      max-width: 500px;
      margin: 0 auto;
    }

    .login-card {
      padding: 2.5rem;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;

      h2 { font-size: 2rem; color: #fff; margin: 0.5rem 0; }
      p { color: var(--text-muted); font-size: 0.9rem; }
    }

    .security-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: var(--accent-cyan);
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.3);
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
    }

    .error-box {
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.4);
      color: var(--accent-rose);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }

    .oauth-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 0.85rem 1.25rem;
      background: #1e293b;
      border: 1px solid var(--border-glass);
      border-radius: 12px;
      color: #fff;
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: var(--transition-smooth);

      &:hover {
        background: #334155;
        border-color: rgba(255, 255, 255, 0.2);
      }
    }

    .google-icon {
      width: 20px;
      height: 20px;
    }

    .divider {
      text-align: center;
      position: relative;
      margin: 1.75rem 0;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: var(--border-glass);
        z-index: 1;
      }

      span {
        position: relative;
        z-index: 2;
        background: #0f131a;
        padding: 0 0.75rem;
        font-size: 0.7rem;
        font-weight: 700;
        color: var(--text-dim);
        letter-spacing: 0.05em;
      }
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;

      label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-muted);
      }
    }

    .form-control {
      width: 100%;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-glass);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      color: #fff;
      font-family: var(--font-body);
      outline: none;
      transition: var(--transition-smooth);

      &:focus {
        border-color: var(--accent-indigo);
        background: rgba(255, 255, 255, 0.07);
      }
    }

    .btn-block {
      width: 100%;
      justify-content: center;
    }
  `]
})
export class AdminLoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = 'admin@cinematic-portfolio.com';
  password = 'admin';
  loading = false;
  errorMessage = '';

  async loginWithGoogle(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    try {
      await this.authService.loginWithGoogle();
      this.redirectAfterLogin();
    } catch (err: any) {
      this.errorMessage = err.message || 'OAuth authentication failed.';
    } finally {
      this.loading = false;
    }
  }

  async loginWithPassword(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    try {
      await this.authService.loginWithEmail(this.email, this.password);
      this.redirectAfterLogin();
    } catch (err: any) {
      this.errorMessage = err.message || 'Invalid admin credentials.';
    } finally {
      this.loading = false;
    }
  }

  quickDemoLogin(): void {
    this.authService.loginAsDemoAdmin();
    this.redirectAfterLogin();
  }

  private redirectAfterLogin(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
    this.router.navigateByUrl(returnUrl);
  }
}
