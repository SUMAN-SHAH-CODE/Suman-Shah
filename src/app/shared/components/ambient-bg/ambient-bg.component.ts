import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ambient-bg',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ambient-wrapper" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="orb orb-4"></div>
      <div class="aurora-beam"></div>
      <div class="grid-overlay"></div>
      
      <!-- Micro-sparkle floating particles -->
      <div class="particles">
        <span class="particle p-1"></span>
        <span class="particle p-2"></span>
        <span class="particle p-3"></span>
        <span class="particle p-4"></span>
        <span class="particle p-5"></span>
      </div>
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
      filter: blur(130px);
      opacity: 0.38;
      animation: float 22s infinite alternate ease-in-out;
    }

    .orb-1 {
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, #6366f1 0%, transparent 70%);
      top: -120px;
      left: -120px;
    }

    .orb-2 {
      width: 650px;
      height: 650px;
      background: radial-gradient(circle, #a855f7 0%, transparent 70%);
      bottom: -180px;
      right: -120px;
      animation-delay: -7s;
    }

    .orb-3 {
      width: 480px;
      height: 480px;
      background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
      top: 35%;
      left: 45%;
      transform: translate(-50%, -50%);
      animation-delay: -14s;
    }

    .orb-4 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, #f43f5e 0%, transparent 70%);
      bottom: 20%;
      left: 10%;
      opacity: 0.2;
      animation-delay: -18s;
    }

    .aurora-beam {
      position: absolute;
      top: 0;
      left: 20%;
      width: 60%;
      height: 400px;
      background: linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.04) 50%, transparent 100%);
      filter: blur(60px);
      transform: rotate(-15deg);
      animation: auroraWave 16s ease-in-out infinite alternate;
    }

    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image: linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 48px 48px;
      opacity: 0.75;
      mask-image: radial-gradient(circle at center, black 40%, transparent 95%);
    }

    .particles {
      position: absolute;
      inset: 0;
    }

    .particle {
      position: absolute;
      width: 3px;
      height: 3px;
      background: #38bdf8;
      border-radius: 50%;
      box-shadow: 0 0 8px #38bdf8;
      animation: particleDrift 14s infinite linear;
    }

    .p-1 { top: 20%; left: 15%; animation-duration: 18s; animation-delay: 0s; }
    .p-2 { top: 60%; left: 80%; animation-duration: 15s; animation-delay: -3s; }
    .p-3 { top: 80%; left: 30%; animation-duration: 20s; animation-delay: -7s; }
    .p-4 { top: 35%; left: 70%; animation-duration: 16s; animation-delay: -10s; }
    .p-5 { top: 15%; left: 85%; animation-duration: 19s; animation-delay: -5s; }

    @keyframes float {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(50px, 70px) scale(1.12); }
      100% { transform: translate(-40px, 40px) scale(0.92); }
    }

    @keyframes auroraWave {
      0% { transform: rotate(-15deg) translateY(0) scaleX(1); opacity: 0.6; }
      50% { transform: rotate(-10deg) translateY(40px) scaleX(1.2); opacity: 0.9; }
      100% { transform: rotate(-20deg) translateY(-20px) scaleX(0.9); opacity: 0.6; }
    }

    @keyframes particleDrift {
      0% { transform: translateY(0px) translateX(0px); opacity: 0; }
      20% { opacity: 0.8; }
      80% { opacity: 0.8; }
      100% { transform: translateY(-100px) translateX(40px); opacity: 0; }
    }
  `]
})
export class AmbientBgComponent {}

