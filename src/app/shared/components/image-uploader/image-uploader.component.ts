import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../core/services/content.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="image-uploader">
      <label class="uploader-label" *ngIf="label">{{ label }}</label>

      <!-- MODE TOGGLE -->
      <div class="mode-tabs">
        <button type="button" class="mode-tab" [class.active]="mode === 'upload'" (click)="setMode('upload')">
          📁 Upload File
        </button>
        <button type="button" class="mode-tab" [class.active]="mode === 'url'" (click)="setMode('url')">
          🌐 Paste URL
        </button>
      </div>

      <!-- FILE UPLOAD / DRAG & DROP -->
      <div
        *ngIf="mode === 'upload'"
        class="drop-zone"
        [class.dragging]="isDragging"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onFileDrop($event)"
        (click)="fileInput.click()"
      >
        <input
          #fileInput
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
          class="file-input-hidden"
          (change)="onFileSelected($event)"
        />
        <div *ngIf="!isUploading" class="drop-zone-inner">
          <span class="drop-icon">🖼️</span>
          <span class="drop-text">Drag & drop or <u>click to browse</u></span>
          <span class="drop-hint">JPG, PNG, WebP, SVG, GIF — max 25MB</span>
        </div>

        <div *ngIf="isUploading" class="uploading-state">
          <div class="spinner"></div>
          <span>Uploading image to server...</span>
        </div>
      </div>

      <!-- DIRECT URL INPUT -->
      <div *ngIf="mode === 'url'" class="url-input-wrapper">
        <div class="input-with-icon">
          <span class="url-icon">🌐</span>
          <input
            type="text"
            [ngModel]="value"
            (ngModelChange)="onUrlChange($event)"
            [placeholder]="placeholder || 'https://images.unsplash.com/... or /uploads/...'"
            class="form-control url-input"
          />
        </div>
        <div class="url-hint">Paste any direct image link or web URL</div>
      </div>

      <!-- UPLOAD ERROR MESSAGE -->
      <div *ngIf="errorMessage" class="error-banner">
        ⚠️ {{ errorMessage }}
      </div>

      <!-- PREVIEW CARD -->
      <div *ngIf="value" class="preview-card glass-panel">
        <div class="preview-img-container">
          <img
            [src]="displayUrl"
            [alt]="label"
            (error)="onImgError()"
            (load)="imgLoadSuccess = true"
            class="preview-img"
          />
          <div *ngIf="!imgLoadSuccess" class="img-error-badge">
            ⚠️ Image failed to load
          </div>
        </div>

        <div class="preview-info">
          <div class="preview-path" [title]="value">{{ value }}</div>
          <div class="preview-actions">
            <button
              type="button"
              class="btn-action btn-copy"
              (click)="copyUrl()"
              title="Copy URL"
            >
              {{ copied ? '✓ Copied!' : '📋 Copy URL' }}
            </button>
            <button
              type="button"
              class="btn-action btn-remove"
              (click)="removeImage()"
              title="Remove Image"
            >
              🗑 Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .image-uploader {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      margin-bottom: 1.25rem;
    }

    .uploader-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .mode-tabs {
      display: flex;
      gap: 0.35rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-glass, rgba(255, 255, 255, 0.08));
      padding: 3px;
      border-radius: 8px;
    }

    .mode-tab {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--text-dim, #64748b);
      padding: 0.35rem 0.7rem;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover { color: #fff; }

      &.active {
        background: var(--accent-indigo, #6366f1);
        color: #fff;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
      }
    }

    .drop-zone {
      border: 2px dashed var(--border-glass, rgba(255, 255, 255, 0.15));
      border-radius: 10px;
      padding: 1.5rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.02);

      &:hover, &.dragging {
        border-color: var(--accent-indigo, #6366f1);
        background: rgba(99, 102, 241, 0.06);
      }
    }

    .file-input-hidden {
      display: none;
    }

    .drop-zone-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
    }

    .drop-icon { font-size: 2rem; }

    .drop-text {
      color: #fff;
      font-size: 0.88rem;
      font-weight: 600;
    }

    .drop-hint {
      font-size: 0.75rem;
      color: var(--text-dim, #64748b);
    }

    .uploading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      color: var(--accent-cyan, #06b6d4);
      font-size: 0.88rem;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(6, 182, 212, 0.25);
      border-top-color: var(--accent-cyan, #06b6d4);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .url-input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .input-with-icon {
      position: relative;
      display: flex;
      align-items: center;
    }

    .url-icon {
      position: absolute;
      left: 0.65rem;
      font-size: 1rem;
      pointer-events: none;
    }

    .url-input {
      padding-left: 2.2rem !important;
      width: 100%;
    }

    .url-hint {
      font-size: 0.72rem;
      color: var(--text-dim, #64748b);
    }

    .error-banner {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.82rem;
    }

    .preview-card {
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .preview-img-container {
      position: relative;
      background: #0a0f1e;
    }

    .preview-img {
      width: 100%;
      max-height: 180px;
      object-fit: cover;
      display: block;
    }

    .img-error-badge {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(239, 68, 68, 0.15);
      color: #fca5a5;
      font-size: 0.82rem;
    }

    .preview-info {
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .preview-path {
      font-family: monospace;
      font-size: 0.75rem;
      color: var(--text-dim, #64748b);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 200px;
    }

    .preview-actions {
      display: flex;
      gap: 0.4rem;
    }

    .btn-action {
      background: transparent;
      border: 1px solid var(--border-glass, rgba(255, 255, 255, 0.12));
      color: var(--text-muted, #94a3b8);
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover { color: #fff; border-color: rgba(255, 255, 255, 0.3); }
    }

    .btn-remove:hover {
      border-color: rgba(239, 68, 68, 0.5);
      color: #fca5a5;
    }

    .btn-copy.copied {
      border-color: var(--accent-emerald, #10b981);
      color: var(--accent-emerald, #10b981);
    }
  `]
})
export class ImageUploaderComponent implements OnChanges {
  @Input() value: string = '';
  @Input() label: string = 'Image';
  @Input() placeholder: string = '';
  @Output() valueChange = new EventEmitter<string>();

  private contentService = inject(ContentService);

  mode: 'upload' | 'url' = 'upload';
  isDragging = false;
  isUploading = false;
  errorMessage = '';
  imgLoadSuccess = true;
  copied = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.value) {
      this.imgLoadSuccess = true;
      // Auto-switch to URL mode if a URL is already set
      if (this.value.startsWith('http') || this.value.startsWith('/uploads/')) {
        this.mode = 'url';
      }
    }
  }

  get displayUrl(): string {
    if (!this.value) return '';
    if (this.value.startsWith('/uploads/')) {
      return environment.serverUrl + this.value;
    }
    return this.value;
  }

  setMode(newMode: 'upload' | 'url'): void {
    this.mode = newMode;
    this.errorMessage = '';
  }

  onUrlChange(url: string): void {
    this.value = url;
    this.imgLoadSuccess = true;
    this.errorMessage = '';
    this.valueChange.emit(this.value);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please select a valid image file (.jpg, .png, .webp, .svg, .gif).';
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      this.errorMessage = 'Image size exceeds 25MB. Please choose a smaller file.';
      return;
    }

    this.errorMessage = '';
    this.isUploading = true;

    this.contentService.uploadImage(file).subscribe({
      next: (res) => {
        this.isUploading = false;
        this.value = res.url;
        this.imgLoadSuccess = true;
        this.valueChange.emit(this.value);
      },
      error: (err) => {
        this.isUploading = false;
        console.warn('Upload API error, falling back to base64 Data URL:', err);
        // Fallback to client-side base64 data URL
        const reader = new FileReader();
        reader.onload = () => {
          this.value = reader.result as string;
          this.imgLoadSuccess = true;
          this.valueChange.emit(this.value);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  onImgError(): void {
    this.imgLoadSuccess = false;
  }

  removeImage(): void {
    this.value = '';
    this.imgLoadSuccess = true;
    this.errorMessage = '';
    this.valueChange.emit('');
  }

  copyUrl(): void {
    if (this.value) {
      navigator.clipboard.writeText(this.value).then(() => {
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
      });
    }
  }
}
