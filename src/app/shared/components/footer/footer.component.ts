import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <footer class="footer" id="contact">
      <div class="container-custom">
        <div class="footer-top-grid">
          <!-- Col 1: Brand & Contact Info -->
          <div class="footer-brand">
            <h3>⚡ Er. <span class="highlight"> SUMAN SHAH</span></h3>
            <p class="brand-desc">
              Engineered with Angular 18, RxJS, Modern SCSS & Neon Relational
              DB.
            </p>

            <div class="quick-contact">
              <div class="contact-item">
                <span class="c-icon">📧</span>
                <span class="c-text">sumanshahst&#64;gmail.com</span>
              </div>
              <div class="contact-item">
                <span class="c-icon">📍</span>
                <span class="c-text">Kathmandu, Nepal (Open for Remote)</span>
              </div>
              <div class="contact-item">
                <span class="c-icon">⚡</span>
                <span class="c-text">Response SLA: Within 24 hours</span>
              </div>
            </div>
          </div>

          <!-- Col 2: Navigation Links -->
          <div class="footer-links">
            <h4>Quick Links</h4>
            <a routerLink="/">Home</a>
            <a routerLink="/experiences">Experiences</a>
            <a routerLink="/projects">Projects</a>
            <a routerLink="/blogs">Blogs</a>
            <a routerLink="/achievements">Achievements</a>
            <a routerLink="/certificates">Certificates</a>
            <a routerLink="/admin/login" class="admin-link">⚡ Admin Portal</a>
          </div>

          <!-- Col 3: Compact Validated Contact Form -->
          <div class="footer-contact-card glass-panel">
            <div class="form-header">
              <span class="badge-tag">GET IN TOUCH</span>
              <h4 class="form-title">Send a Direct Message</h4>
            </div>

            <form
              (ngSubmit)="sendContactMessage(contactForm)"
              #contactForm="ngForm"
              novalidate
            >
              <div class="form-row">
                <div class="form-group">
                  <input
                    type="text"
                    [(ngModel)]="contactModel.name"
                    name="name"
                    #nameRef="ngModel"
                    required
                    minlength="2"
                    placeholder="Full Name *"
                    class="compact-input"
                    [class.invalid-field]="nameRef.invalid && nameRef.touched"
                  />
                  <span
                    class="error-hint"
                    *ngIf="nameRef.invalid && nameRef.touched"
                  >
                    Name is required (min 2 chars)
                  </span>
                </div>

                <div class="form-group">
                  <input
                    type="email"
                    [(ngModel)]="contactModel.email"
                    name="email"
                    #emailRef="ngModel"
                    required
                    email
                    placeholder="Email Address *"
                    class="compact-input"
                    [class.invalid-field]="emailRef.invalid && emailRef.touched"
                  />
                  <span
                    class="error-hint"
                    *ngIf="emailRef.invalid && emailRef.touched"
                  >
                    Valid email required
                  </span>
                </div>
              </div>

              <div class="form-group">
                <input
                  type="text"
                  [(ngModel)]="contactModel.contact"
                  name="contact"
                  placeholder="Contact / Phone Number (Optional)"
                  class="compact-input"
                />
              </div>

              <div class="form-group">
                <textarea
                  rows="2"
                  [(ngModel)]="contactModel.message"
                  name="message"
                  #msgRef="ngModel"
                  required
                  minlength="5"
                  placeholder="Your Message *"
                  class="compact-input compact-textarea"
                  [class.invalid-field]="msgRef.invalid && msgRef.touched"
                ></textarea>
                <span
                  class="error-hint"
                  *ngIf="msgRef.invalid && msgRef.touched"
                >
                  Message is required (min 5 chars)
                </span>
              </div>

              <div class="form-status success" *ngIf="submitSuccess">
                ✓ Message sent successfully! I'll reply soon.
              </div>

              <div class="form-status error" *ngIf="submitError">
                ⚠️ {{ submitError }}
              </div>

              <button
                type="submit"
                [disabled]="contactForm.invalid || isSending"
                class="btn-cinematic btn-sm submit-btn"
              >
                <span>{{ isSending ? 'Sending...' : 'Send Message' }}</span>
                <span>→</span>
              </button>
            </form>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© {{ currentYear }} Er. Suman Shah. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        margin-top: 3.5rem;
        border-top: 1px solid var(--border-glass);
        background: rgba(10, 12, 16, 0.95);
        backdrop-filter: blur(16px);
        padding: 3rem 0 1.5rem 0;

        @media (max-width: 768px) {
          margin-top: 2rem;
          padding: 1.5rem 0 1rem 0;
        }
      }

      .footer-top-grid {
        display: grid;
        grid-template-columns: 1.25fr 0.8fr 1.6fr;
        gap: 2rem;
        align-items: start;

        @media (max-width: 900px) {
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
      }

      .footer-brand {
        h3 {
          font-size: 1.25rem;
          margin-bottom: 0.35rem;

          .highlight {
            color: var(--accent-cyan);
          }
        }

        .brand-desc {
          color: var(--text-muted);
          font-size: 0.85rem;
          line-height: 1.45;
          margin-bottom: 0.75rem;

          @media (max-width: 768px) {
            margin-bottom: 0.5rem;
            font-size: 0.8rem;
          }
        }
      }

      .quick-contact {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.8rem;
      }

      .c-icon {
        font-size: 0.9rem;
      }

      .c-text {
        color: var(--text-muted);
        font-weight: 500;
      }

      .footer-links {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;

        @media (max-width: 768px) {
          flex-direction: row;
          flex-wrap: wrap;
          gap: 0.35rem 0.85rem;
          align-items: center;
        }

        h4 {
          margin-bottom: 0.35rem;
          font-size: 0.88rem;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.04em;

          @media (max-width: 768px) {
            width: 100%;
            margin-bottom: 0.2rem;
          }
        }

        a {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.82rem;
          transition: var(--transition-smooth);

          &:hover {
            color: var(--accent-cyan);
          }
        }

        .admin-link {
          color: var(--accent-indigo);
          font-weight: 600;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .footer-contact-card {
        padding: 1.25rem;
        border-radius: 12px;

        @media (max-width: 768px) {
          padding: 0.85rem 1rem;
        }
      }

      .form-header {
        margin-bottom: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
      }

      .form-title {
        font-size: 1rem;
        color: #fff;
        font-weight: 700;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.55rem;
      }

      .form-group {
        margin-bottom: 0.5rem;
        display: flex;
        flex-direction: column;
      }

      .compact-input {
        width: 100%;
        background: rgba(10, 12, 16, 0.7);
        border: 1px solid var(--border-glass);
        border-radius: 8px;
        padding: 0.4rem 0.65rem;
        color: #fff;
        font-family: var(--font-body);
        font-size: 0.8rem;
        outline: none;
        transition: var(--transition-smooth);

        &::placeholder {
          color: var(--text-dim);
        }

        &:focus {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.25);
        }

        &.invalid-field {
          border-color: rgba(244, 63, 94, 0.6);
          background: rgba(244, 63, 94, 0.05);
        }
      }

      .compact-textarea {
        resize: vertical;
        min-height: 44px;
      }

      .error-hint {
        color: #f87171;
        font-size: 0.68rem;
        margin-top: 0.15rem;
        font-weight: 600;
      }

      .submit-btn {
        width: 100%;
        justify-content: center;
        margin-top: 0.15rem;

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }
      }

      .form-status {
        padding: 0.35rem 0.6rem;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        margin-bottom: 0.5rem;

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

      .footer-bottom {
        text-align: center;
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        color: var(--text-dim);
        font-size: 0.75rem;
      }
    `,
  ],
})
export class FooterComponent {
  private contentService = inject(ContentService);

  currentYear = new Date().getFullYear();

  contactModel = {
    name: '',
    email: '',
    contact: '',
    message: '',
  };

  isSending = false;
  submitSuccess = false;
  submitError: string | null = null;

  sendContactMessage(form: NgForm): void {
    // if (!this.contactModel.name || !this.contactModel.email || !this.contactModel.message) return;
    if (form.invalid || this.isSending) {
      return;
    }

    this.isSending = true;
    this.submitSuccess = false;
    this.submitError = null;

    this.contentService.sendContactMessage(this.contactModel).subscribe({
      next: () => {
        this.isSending = false;
        this.submitSuccess = true;
        this.contactModel = { name: '', email: '', contact: '', message: '' };
        form.resetForm(this.contactModel);
        setTimeout(() => (this.submitSuccess = false), 5000);
      },
      error: (err) => {
        this.isSending = false;
        this.submitError =
          err?.error?.error || 'Failed to send message. Please try again.';
      },
    });
  }
}
