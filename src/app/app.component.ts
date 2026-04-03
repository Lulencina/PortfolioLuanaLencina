import { Component, signal, computed, effect, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  id: string;
  title: string;
  role: string;
  problem: string;
  action: string;
  tech: string[];
  link: string;
  webLink?: string; // Propiedad opcional para el sitio en vivo
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-fuchsia-500/30 selection:text-fuchsia-200 overflow-x-hidden">
      <div class="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none"></div>
      <div class="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-500/10 blur-[120px] pointer-events-none"></div>

      <canvas #particleCanvas class="fixed inset-0 pointer-events-none z-0"></canvas>

      <nav [class]="'fixed top-0 left-0 w-full z-50 transition-all duration-500 ' + (scrolled() ? 'py-4' : 'py-8')">
        <div class="max-w-6xl mx-auto px-6">
          <div class="bg-[#0B1120]/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <a href="#" class="flex items-center gap-2 group">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-cyan-500/20">LL</div>
              <span class="text-white font-bold tracking-tight hidden sm:block group-hover:text-cyan-400 transition-colors">Luana Lencina</span>
            </a>
            
            <div class="hidden md:flex items-center gap-8">
              <a href="#perfil" class="text-sm font-bold hover:text-fuchsia-400 transition-colors uppercase tracking-widest">Perfil</a>
              <a href="#proyectos" class="text-sm font-bold hover:text-cyan-400 transition-colors uppercase tracking-widest">Proyectos</a>
              <a href="#contacto" class="text-sm font-bold hover:text-fuchsia-400 transition-colors uppercase tracking-widest">Contacto</a>
              <button (click)="toggleParticles()" [class]="'p-2 rounded-full transition-all ' + (bgActive() ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500 bg-white/5')">
                <svg [class]="'w-5 h-5 ' + (bgActive() ? 'animate-spin-slow' : '')" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </button>
            </div>

            <div class="flex md:hidden items-center gap-4">
              <button (click)="toggleParticles()" [class]="'p-2 rounded-full ' + (bgActive() ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500 bg-white/5')">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v2m0 16v2M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </button>
              <button (click)="toggleMenu()" class="p-2 text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              </button>
            </div>
          </div>
        </div>

        <div [class]="'fixed inset-y-0 right-0 w-64 bg-[#0B1120]/95 backdrop-blur-2xl z-[60] border-l border-white/10 transform transition-transform duration-300 ease-in-out md:hidden ' + (isMenuOpen() ? 'translate-x-0' : 'translate-x-full')">
          <div class="p-8 flex flex-col h-full">
            <button (click)="toggleMenu()" class="self-end p-2 text-slate-400 mb-8">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div class="flex flex-col gap-8">
              <a href="#perfil" (click)="toggleMenu()" class="text-lg font-bold text-white hover:text-fuchsia-400 transition-colors uppercase tracking-widest">Perfil</a>
              <a href="#proyectos" (click)="toggleMenu()" class="text-lg font-bold text-white hover:text-cyan-400 transition-colors uppercase tracking-widest">Proyectos</a>
              <a href="#contacto" (click)="toggleMenu()" class="text-lg font-bold text-white hover:text-fuchsia-400 transition-colors uppercase tracking-widest">Contacto</a>
            </div>
            <div class="mt-auto pt-8 border-t border-white/10">
               <p class="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Luana Lencina</p>
            </div>
          </div>
        </div>
        @if (isMenuOpen()) {
          <div (click)="toggleMenu()" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"></div>
        }
      </nav>

      <main class="relative z-10">
        <section id="inicio" class="min-h-[85vh] flex flex-col items-center justify-center px-6 pt-24 pb-8 text-center">
          <div class="mt-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-6 shadow-inner">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Open to work
          </div>
          
          <h1 class="text-4xl sm:text-6xl md:text-7xl font-black text-white text-center tracking-tight leading-[1.05] mb-6">
            Hola, soy <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 via-fuchsia-300 to-white animate-gradient-x">
              Luana Lencina
            </span>
          </h1>

          <div class="text-lg sm:text-3xl font-mono text-slate-400 h-10 mb-8">
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-400 font-bold">
              {{ typewriterText() }}
              <span class="text-fuchsia-500 animate-pulse ml-1">|</span>
            </span>
          </div>

          <p class="max-w-2xl text-center text-slate-400 text-base sm:text-lg mb-10 leading-relaxed">
            Ingeniería de calidad y desarrollo enfocado en la <span class="text-white font-medium">robustez</span>, <span class="text-white font-medium">escalabilidad</span> y <span class="text-white font-medium">experiencia de usuario</span>.
          </p>

          <div class="flex flex-wrap justify-center gap-4 sm:gap-5">
            <a href="#proyectos" class="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-white to-slate-200 text-black font-black hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2">
              Ver Proyectos 
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M9 18l6-6-6-6"/></svg>
            </a>
            <a href="#" class="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 group">
              <svg class="w-4 h-4 group-hover:translate-y-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m4-5l5 5 5-5m-5 5V3"/></svg>
              Descargar CV
            </a>
          </div>
        </section>

        <section id="perfil" class="py-12 px-6">
          <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 class="text-4xl sm:text-5xl font-black text-white mb-6 flex items-center gap-4">
                  <span class="text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600">/</span> Perfil
                </h2>
                <p class="text-xl text-slate-400 leading-relaxed mb-8">
                  Profesional de calidad y desarrolladora enfocada en la excelencia. Mi filosofía es simple: el software debe ser <span class="text-cyan-400">hermoso</span> por fuera y <span class="text-fuchsia-400">a prueba de balas</span> por dentro.
                </p>
                
                <div class="grid grid-cols-1 gap-4">
                  @for (skill of skills; track skill.name) {
                    <div class="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/50 hover:bg-white/[0.06] transition-all group">
                      <div class="flex items-center gap-3 text-white font-bold mb-2">
                        <span [innerHTML]="skill.icon" class="text-cyan-400 group-hover:scale-110 transition-transform"></span>
                        {{ skill.name }}
                      </div>
                      <p class="text-sm text-slate-400 mb-4 leading-relaxed italic">
                        {{ skill.description }}
                      </p>
                      <div class="flex flex-wrap gap-2">
                        @for (tech of skill.techs; track tech) {
                          <span class="text-[10px] font-mono px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/10">{{ tech }}</span>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>

              <div class="grid grid-cols-1 gap-6">
                <div class="relative group rounded-3xl p-[1px] overflow-hidden shadow-2xl">
                  <div class="absolute inset-0 bg-gradient-to-br from-cyan-500 via-fuchsia-500 to-purple-500 opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div class="relative h-full bg-[#0B1120]/90 backdrop-blur-xl rounded-[23px] p-8 flex flex-col border border-white/10">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-fuchsia-500/20">
                      <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-6">Certificaciones</h3>
                    <div class="space-y-4">
                      @for (cert of certifications; track cert) {
                        <div class="flex items-center gap-4 group/item">
                          <div class="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover/item:bg-cyan-500/20 transition-colors">
                            <svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
                          </div>
                          <span class="text-slate-300 font-medium group-hover/item:text-white transition-colors">{{ cert }}</span>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="proyectos" class="py-12 px-6 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
          <div class="max-w-6xl mx-auto">
            <h2 class="text-4xl sm:text-5xl font-black text-white mb-10 flex items-center gap-4">
              <span class="text-transparent bg-clip-text bg-gradient-to-b from-fuchsia-400 to-purple-600">/</span> Proyectos
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              @for (project of projects; track project.id) {
                <div class="group relative">
                  <div class="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-[24px] opacity-20 group-hover:opacity-100 blur-[2px] transition-opacity duration-500"></div>
                  <div class="relative h-full bg-[#0B1120] backdrop-blur-xl rounded-[23px] p-7 flex flex-col border border-white/5 transition-all">
                    <div class="flex justify-between items-start mb-6">
                      <span class="text-[10px] font-black tracking-[0.15em] text-white bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-1.5 rounded-full uppercase shadow-lg shadow-blue-500/20">
                        {{ project.role }}
                      </span>
                      <a [href]="project.link" target="_blank" class="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
                      </a>
                    </div>
                    
                    <h3 class="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                      {{ project.title }}
                    </h3>
                    
                    <p class="text-slate-400 mb-8 leading-relaxed">
                      {{ project.problem }}
                    </p>

                    <div class="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                      <div class="flex -space-x-2">
                        @for (t of project.tech.slice(0, 3); track t) {
                          <div class="w-9 h-9 rounded-full bg-slate-800 border-2 border-[#0B1120] flex items-center justify-center text-[9px] font-black text-cyan-400 uppercase shadow-xl">
                            {{ t.substring(0, 2) }}
                          </div>
                        }
                      </div>
                      <button (click)="openModal(project)" class="text-sm font-bold text-white flex items-center gap-2 hover:text-fuchsia-400 transition-all hover:translate-x-1">
                        Detalles <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </section>

        <section id="contacto" class="py-16 px-6">
          <div class="max-w-4xl mx-auto">
            <div class="relative rounded-[2.5rem] sm:rounded-[3.5rem] bg-gradient-to-br from-cyan-600/20 via-[#0B1120] to-fuchsia-600/20 p-8 sm:p-12 border border-white/10 text-center overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)]">
              <div class="absolute -top-10 -right-10 p-8 text-fuchsia-500/10 pointer-events-none">
                <svg class="w-64 h-64 rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M4 17l6-6-6-6M12 19h8"/></svg>
              </div>
              
              <h2 class="text-4xl sm:text-7xl font-black text-white mb-6 tracking-tighter">¿Hablamos?</h2>
              <p class="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Estoy lista para aportar mi experiencia en <span class="text-cyan-400 font-bold">testing automatizado</span> y <span class="text-fuchsia-400 font-bold">desarrollo fullstack</span> a tu próximo gran proyecto.
              </p>
              
              <div class="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 relative z-10">
                <a href="mailto:lulencina2@hotmail.com" class="group flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-white/10 transition-all">
                  <svg class="w-5 h-5 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
                  Enviar Correo
                </a>
                <a href="https://www.linkedin.com/in/luana-lencina-qa-tester-manual-automatizado-%F0%9F%92%BB-880120216/" target="_blank" class="flex items-center justify-center gap-3 px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all">
                  <svg class="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer class="py-10 border-t border-white/10 text-center bg-[#020617]">
        <p class="text-[10px] font-mono tracking-[0.3em] text-slate-500">
          DESIGNED & BUILT BY <span class="text-white">LUANA LENCINA</span> // 2026
        </p>
      </footer>

      @if (activeModal()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-md">
          <div class="bg-[#0B1120] border border-white/10 rounded-[2rem] sm:rounded-[3rem] w-full max-w-2xl p-8 sm:p-12 relative shadow-[0_0_100px_rgba(0,0,0,1)] overflow-y-auto max-h-[90vh]">
            <button (click)="closeModal()" class="absolute top-6 right-6 sm:top-10 sm:right-10 p-3 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-all">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <div class="flex items-center gap-5 mb-8 sm:mb-10">
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
              </div>
              <div>
                <h3 class="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">{{ activeModal()?.title }}</h3>
                <p class="text-cyan-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mt-2">{{ activeModal()?.role }}</p>
              </div>
            </div>

            <div class="space-y-8">
              <div>
                <h4 class="text-white font-black text-[10px] sm:text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-fuchsia-500"></span>
                  El Desafío
                </h4>
                <p class="text-slate-400 leading-relaxed text-base sm:text-lg">{{ activeModal()?.problem }}</p>
              </div>

              <div>
                <h4 class="text-white font-black text-[10px] sm:text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-cyan-500"></span>
                  Mi Acción
                </h4>
                <p class="text-slate-400 leading-relaxed text-base sm:text-lg">{{ activeModal()?.action }}</p>
              </div>

              <div class="flex flex-wrap gap-2">
                @for (t of activeModal()?.tech; track t) {
                  <span class="px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] sm:text-xs text-cyan-300 font-bold font-mono">{{ t }}</span>
                }
              </div>

              <div class="flex flex-col sm:flex-row gap-4 pt-4">
                <a [href]="activeModal()?.link" target="_blank" class="flex-1 flex items-center justify-center gap-3 py-4 sm:py-5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-black rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all hover:scale-[1.02]">
                  GitHub <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4-3h6v6m-11 11L21 3"/></svg>
                </a>
                
                @if (activeModal()?.id === 'renovared') {
                  <a [href]="activeModal()?.webLink" target="_blank" class="flex-1 flex items-center justify-center gap-3 py-4 sm:py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all hover:scale-[1.02]">
                    Sitio Web <svg class="w-5 h-5 text-fuchsia-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 8s linear infinite;
    }
    .animate-gradient-x {
      background-size: 200% 200%;
      animation: gradient-x 15s ease infinite;
    }
    @keyframes gradient-x {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    :host {
      display: block;
    }
    html {
      scroll-behavior: smooth;
    }
  `]
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  // --- ESTADO ---
  scrolled = signal(false);
  bgActive = signal(true);
  isMenuOpen = signal(false); 
  activeModal = signal<Project | null>(null);
  
  // --- MÁQUINA DE ESCRIBIR ---
  roles = ["QA Automation Engineer", "QA Manual Engineer", "FullStack Developer"];
  typewriterText = signal("");
  private wordIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private typewriterTimeout: any;

  // --- DATOS ---
  skills = [
    { 
      name: "Frontend", 
      icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M3 9h18"/></svg>', 
      description: "Creación de interfaces modernas, responsivas y centradas en el usuario con las últimas tecnologías web.",
      techs: ["Angular", "TypeScript", "HTML", "CSS", "JavaScript"] 
    },
    { 
      name: "Backend", 
      icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>', 
      description: "Diseño de APIs robustas y arquitecturas escalables que garantizan la integridad de los datos.",
      techs: ["Node.js", "Express", "Spring Boot", "SQL"] 
    },
    { 
      name: "QA / Testing", 
      icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>', 
      description: "Automatización de pruebas y aseguramiento de calidad para entregar software libre de errores.",
      techs: ["Cypress", "Selenium", "JUnit", "E2E"] 
    },
  ];

  projects: Project[] = [
    {
      id: "renovared",
      title: "RenovaRed",
      role: "FullStack Developer",
      problem: "Necesidad de una plataforma moderna para la gestión de renovación de recursos reciclables.",
      action: "Desarrollo de interfaz de usuario reactiva y lógica de negocio para optimización de procesos.",
      tech: ["Angular", "Express", "Node.js", "Supabase"],
      link: "https://github.com/fabiancgonzalez/RenovaRed",
      webLink: "https://renovared.vercel.app/"
    },
    {
      id: "ticketazo",
      title: "Ticketazo",
      role: "QA Automation",
      problem: "Sistema de gestión de tickets y eventos con alta demanda de concurrencia.",
      action: "Implementación de flujos de usuario completos, desde la selección de asientos hasta la confirmación.",
      tech: ["Cypress", "JavaScript", "SQL", "Trello/Jira"],
      link: "https://github.com/Giulicapua/GRUPO-2-TICKETAZO"
    },
    {
      id: "santex",
      title: "ProyectoDevSantex",
      role: "FullStack Developer",
      problem: "Desafío técnico final para el programa de formación en Santex.",
      action: "Integración de múltiples servicios y creación de una arquitectura escalable siguiendo buenas prácticas.",
      tech: ["Angular", "Spring Boot", "Docker", "Node.js", "Express"],
      link: "https://github.com/Lulencina/Proyecto-DevSantex"
    },
    {
      id: "cypress",
      title: "Demoblaze Test (Cypress)",
      role: "QA Automation",
      problem: "Asegurar la estabilidad de flujos críticos de e-commerce en Demoblaze.",
      action: "Creación de suite de tests E2E automatizados cubriendo login, carrito y checkout.",
      tech: ["Cypress", "JavaScript", "E2E Testing"],
      link: "https://github.com/Lulencina/DemoblazeTestWithCypress"
    }
  ];

  certifications = [
    "Certificación FullStack en Santex",
    "Certificación en Desarrollo Web con Angular",
    "Certificación en Automatización de Pruebas con Cypress",
    "Certificación en Testing Funcional",
    "Certificación en Testing Automatizado con Selenium",
    "Certificación en Game Testing",
  ];

  // --- MOTOR DE PARTÍCULAS ---
  private particles: any[] = [];
  private animationFrameId?: number;
  private ctx?: CanvasRenderingContext2D;

  constructor() {
    effect(() => {
      if (this.bgActive()) {
        this.startParticles();
      } else {
        this.stopParticles();
      }
    });
  }

  ngAfterViewInit() {
    this.initTypewriter();
    this.initCanvas();
  }

  ngOnDestroy() {
    this.stopParticles();
    clearTimeout(this.typewriterTimeout);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled.set(window.scrollY > 50);
  }

  @HostListener('window:resize', [])
  onResize() {
    this.initCanvas();
    if (window.innerWidth > 768) {
        this.isMenuOpen.set(false);
    }
  }

  // --- LÓGICA ---
  toggleMenu() {
    this.isMenuOpen.update(v => !v);
    if (this.isMenuOpen()) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
  }

  private initTypewriter() {
    const currentWord = this.roles[this.wordIndex];
    
    if (this.isDeleting) {
      this.typewriterText.set(currentWord.substring(0, this.charIndex - 1));
      this.charIndex--;
    } else {
      this.typewriterText.set(currentWord.substring(0, this.charIndex + 1));
      this.charIndex++;
    }

    let speed = this.isDeleting ? 75 : 150;

    if (!this.isDeleting && this.charIndex === currentWord.length) {
      this.isDeleting = true;
      speed = 2000; 
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.roles.length;
      speed = 500;
    }

    this.typewriterTimeout = setTimeout(() => this.initTypewriter(), speed);
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.createParticles();
    if (this.bgActive()) this.animateParticles();
  }

  private createParticles() {
    const count = window.innerWidth < 768 ? 40 : 100;
    this.particles = [];
    const canvas = this.canvasRef.nativeElement;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        size: Math.random() * 2 + 1,
        color: i % 3 === 0 ? '#22d3ee' : i % 3 === 1 ? '#d946ef' : '#6366f1'
      });
    }
  }

  private animateParticles() {
    if (!this.bgActive() || !this.ctx) return;
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    this.particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      this.ctx!.beginPath();
      this.ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx!.fillStyle = p.color + '44'; 
      this.ctx!.fill();

      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          this.ctx!.beginPath();
          this.ctx!.moveTo(p.x, p.y);
          this.ctx!.lineTo(p2.x, p2.y);
          this.ctx!.strokeStyle = `rgba(148, 163, 184, ${0.2 * (1 - dist / 120)})`;
          this.ctx!.lineWidth = 0.6;
          this.ctx!.stroke();
        }
      }
    });
    this.animationFrameId = requestAnimationFrame(() => this.animateParticles());
  }

  toggleParticles() {
    this.bgActive.update(v => !v);
  }

  private startParticles() {
    if (!this.animationFrameId) this.animateParticles();
  }

  private stopParticles() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
    if (this.ctx) {
      const canvas = this.canvasRef.nativeElement;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  openModal(project: Project) {
    this.activeModal.set(project);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.activeModal.set(null);
    document.body.style.overflow = 'auto';
  }
}