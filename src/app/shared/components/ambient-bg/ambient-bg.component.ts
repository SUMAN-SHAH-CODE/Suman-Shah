import { Component } from '@angular/core';

@Component({
  selector: 'app-ambient-bg',
  standalone: true,
  template: `
    <div class="ambient-wrapper">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="grid-overlay"></div>
    </div>
  `,
  styles: [`
    .ambient-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: -1;
      overflow: hidden;
      background: #080a0f;
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.35;
      animation: float 20s infinite alternate ease-in-out;
    }

    .orb-1 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, #6366f1 0%, transparent 70%);
      top: -100px;
      left: -100px;
    }

    .orb-2 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, #a855f7 0%, transparent 70%);
      bottom: -150px;
      right: -100px;
      animation-delay: -7s;
    }

    .orb-3 {
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: -12s;
    }

    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image: linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 40px 40px;
      opacity: 0.8;
    }

    @keyframes float {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(40px, 60px) scale(1.1); }
      100% { transform: translate(-30px, 30px) scale(0.95); }
    }
  `]
})
export class AmbientBgComponent {}
