import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NbBadge, NbButton } from '@ng-brutalism/ui';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  exact?: boolean;
  badge?: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NbButton,
    NbBadge,
  ],
  template: `
    <div class="min-h-screen bg-koko-cream flex flex-col lg:flex-row text-koko-espresso font-sans">

      <!-- ============================================================== -->
      <!-- MOBILE TOP HEADER (Visible on < lg)                           -->
      <!-- ============================================================== -->
      <div class="lg:hidden bg-white border-b-2 border-koko-espresso px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <a routerLink="/admin" class="flex items-center gap-2.5">
          <div class="w-8 h-8 bg-koko-espresso rounded-md flex items-center justify-center text-koko-cream font-display font-black text-base border-2 border-koko-espresso shadow-[2px_2px_0px_#C25E00]">
            K
          </div>
          <span class="font-display font-black text-lg text-koko-espresso">KOKOFEE Admin</span>
        </a>

        <div class="flex items-center gap-2">
          <a
            routerLink="/"
            class="text-xs font-mono font-bold text-koko-muted hover:text-koko-espresso px-2 py-1 border border-koko-border-subtle rounded"
          >
            Tienda ↗
          </a>
          <button
            type="button"
            (click)="toggleMobileSidebar()"
            class="p-2 rounded-lg border-2 border-koko-espresso bg-koko-cream text-koko-espresso font-bold text-base active:translate-y-0.5 transition-all"
            [attr.aria-expanded]="mobileSidebarOpen()"
            aria-label="Abrir menú de navegación de administración"
          >
            {{ mobileSidebarOpen() ? '✕' : '☰' }}
          </button>
        </div>
      </div>

      <!-- Backdrop overlay on mobile -->
      @if (mobileSidebarOpen()) {
        <div
          (click)="closeMobileSidebar()"
          class="fixed inset-0 bg-koko-espresso/50 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
        ></div>
      }

      <!-- ============================================================== -->
      <!-- ADMIN SIDEBAR (Responsive Desktop + Drawer on Mobile)          -->
      <!-- ============================================================== -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-72 bg-koko-espresso text-koko-cream flex flex-col justify-between border-r-3 border-koko-roast transition-transform duration-300 lg:static lg:translate-x-0"
        [class.translate-x-0]="mobileSidebarOpen()"
        [class.-translate-x-full]="!mobileSidebarOpen()"
      >
        <!-- Top Section: Logo & Brand -->
        <div>
          <div class="p-6 border-b border-white/10 flex items-center justify-between">
            <a routerLink="/" class="flex items-center gap-3 group">
              <div class="w-10 h-10 bg-koko-caramel text-white rounded-lg flex items-center justify-center font-display font-black text-xl border-2 border-white/20 shadow-[2px_2px_0px_#FAF7F2]">
                K
              </div>
              <div class="flex flex-col">
                <span class="font-display font-black text-xl text-white tracking-tight">KOKOFEE</span>
                <span class="text-[9px] font-mono tracking-widest text-koko-gold uppercase font-bold">
                  Panel de Control
                </span>
              </div>
            </a>

            <!-- Close button on mobile -->
            <button
              (click)="closeMobileSidebar()"
              class="lg:hidden text-koko-cream/60 hover:text-white text-lg p-1"
              aria-label="Cerrar navegación"
            >
              ✕
            </button>
          </div>

          <!-- Navigation Links -->
          <nav class="p-4 space-y-1.5" aria-label="Navegación administrativa">
            @for (item of navItems; track item.route) {
              <a
                [routerLink]="item.route"
                [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
                routerLinkActive="bg-koko-roast text-koko-cream border-2 border-koko-gold font-bold shadow-[2px_2px_0px_#C25E00]"
                [class.text-koko-cream/70]="true"
                (click)="closeMobileSidebar()"
                class="flex items-center justify-between px-3.5 py-2.5 rounded-lg border-2 border-transparent hover:border-white/15 hover:bg-white/5 transition-all text-sm font-medium"
              >
                <div class="flex items-center gap-3">
                  <span class="text-base">{{ item.icon }}</span>
                  <span>{{ item.label }}</span>
                </div>
                @if (item.badge) {
                  <span
                    nbBadge
                    tone="accent"
                    class="text-[10px] py-0 px-1.5 font-bold font-mono"
                  >
                    {{ item.badge }}
                  </span>
                }
              </a>
            }
          </nav>
        </div>

        <!-- Bottom Section: Admin Profile Card & Logout -->
        <div class="p-4 border-t border-white/10 space-y-3">
          <div class="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-koko-caramel text-white flex items-center justify-center font-bold font-mono border-2 border-white/20 shrink-0">
              FA
            </div>
            <div class="min-w-0 flex-1">
              <div class="font-display font-bold text-xs text-white truncate">
                Fernando Alarcón
              </div>
              <div class="text-[10px] font-mono text-koko-gold truncate">
                Maestro Tostador (Admin)
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <a
              routerLink="/"
              class="flex-1 py-2 px-3 text-center rounded-lg border border-white/15 text-xs font-mono font-bold text-koko-cream/80 hover:bg-white/10 transition-colors"
            >
              Tienda ↗
            </a>
            <button
              type="button"
              (click)="handleLogout()"
              class="py-2 px-3 rounded-lg border border-koko-danger/40 bg-koko-danger/20 text-xs font-mono font-bold text-red-200 hover:bg-koko-danger hover:text-white transition-colors"
              title="Cerrar sesión"
            >
              Salir ⎋
            </button>
          </div>
        </div>
      </aside>

      <!-- ============================================================== -->
      <!-- MAIN VIEWPORT CONTAINER                                        -->
      <!-- ============================================================== -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Top Desktop Header Bar -->
        <header class="hidden lg:flex bg-white border-b-2 border-koko-espresso px-8 py-4 items-center justify-between sticky top-0 z-30">
          <!-- Breadcrumb Context -->
          <div class="flex items-center gap-2 text-xs font-mono text-koko-muted">
            <span class="text-koko-espresso font-bold">KOKOFEE</span>
            <span>/</span>
            <span class="text-koko-roast font-semibold">Administración</span>
            <span>/</span>
            <span class="text-koko-caramel font-bold">Dashboard de Operaciones</span>
          </div>

          <!-- Top Status Actions -->
          <div class="flex items-center gap-4">
            <!-- Active Roaster Status Pill -->
            <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-koko-sage text-koko-sage text-xs font-mono font-bold">
              <span class="w-2 h-2 rounded-full bg-koko-sage animate-pulse"></span>
              <span>Tostaduría en Operación</span>
            </div>

            <!-- Public Store Link Button -->
            <a
              routerLink="/"
              nbButton
              tone="cream"
              size="sm"
              class="font-mono text-xs font-bold"
            >
              Ver Tienda Pública ↗
            </a>
          </div>
        </header>

        <!-- Routed View Content -->
        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <router-outlet />
        </main>
      </div>

    </div>
  `,
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly mobileSidebarOpen = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/admin', icon: '📊', exact: true },
    { label: 'Inventario & Granos', route: '/admin/inventario', icon: '📦', badge: '2 bajo' },
    { label: 'Pedidos de Café', route: '/admin/pedidos', icon: '🛒', badge: '3 nuevos' },
    { label: 'Recetas de Barismo', route: '/admin/recetas', icon: '📖' },
    { label: 'Reseñas de Clientes', route: '/admin/resenas', icon: '⭐' },
  ];

  toggleMobileSidebar(): void {
    this.mobileSidebarOpen.update((v) => !v);
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen.set(false);
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
