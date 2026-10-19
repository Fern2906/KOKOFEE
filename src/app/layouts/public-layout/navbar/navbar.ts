import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NbButton } from '@ng-brutalism/ui';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, NbButton],
  template: `
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-koko-espresso">
      <!-- Announcement Micro-bar -->
      <div class="bg-koko-espresso text-koko-cream text-xs py-1.5 px-4 text-center font-mono font-medium flex items-center justify-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-koko-gold animate-pulse"></span>
        <span>TUESTE ARTESANAL SEMANAL — ENVÍOS GRATIS A TODO EL PAÍS EN COMPRAS SUPERIORES A $45</span>
      </div>

      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <!-- Logo and Brand Tag -->
        <a routerLink="/" class="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-koko-caramel rounded">
          <div class="w-10 h-10 bg-koko-espresso rounded-lg flex items-center justify-center text-koko-cream font-display font-black text-xl border-2 border-koko-espresso shadow-[2px_2px_0px_#C25E00] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
            K
          </div>
          <div class="flex flex-col">
            <span class="font-display font-black text-2xl tracking-tight text-koko-espresso leading-none">
              KOKOFEE
            </span>
            <span class="text-[9px] font-mono tracking-widest text-koko-muted uppercase font-bold">
              Specialty Coffee Lab
            </span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center gap-8 text-sm font-semibold text-koko-roast">
          <a
            routerLink="/"
            fragment="productos"
            class="hover:text-koko-caramel transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-koko-caramel after:transition-all"
          >
            Granos & Tienda
          </a>
          <a
            routerLink="/"
            fragment="recetas"
            class="hover:text-koko-caramel transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-koko-caramel after:transition-all"
          >
            Guías de Barismo
          </a>
          <a
            routerLink="/"
            fragment="manifiesto"
            class="hover:text-koko-caramel transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-koko-caramel after:transition-all"
          >
            Nuestra Historia
          </a>
          <a
            routerLink="/"
            fragment="resenas"
            class="hover:text-koko-caramel transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-koko-caramel after:transition-all"
          >
            Comunidad
          </a>
        </div>

        <!-- Action Controls -->
        <div class="flex items-center gap-3">
          <!-- Cart Button with Counter -->
          <button
            nbButton
            tone="cream"
            size="sm"
            class="relative flex items-center gap-2 font-bold font-mono px-3 py-1.5"
            aria-label="Ver carrito de compras"
          >
            <span class="text-base">🛒</span>
            <span class="hidden sm:inline">Carrito</span>
            @if (cartService.itemCount() > 0) {
              <span
                class="bg-koko-caramel text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-koko-espresso -mr-1"
              >
                {{ cartService.itemCount() }}
              </span>
            }
          </button>

          <!-- Login Link -->
          <a
            routerLink="/login"
            class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-koko-espresso hover:text-koko-caramel px-2.5 py-1.5 rounded-lg border-2 border-koko-espresso bg-white shadow-[2px_2px_0px_#1A120B] active:shadow-none transition-all"
            title="Iniciar sesión en KOKOFEE"
          >
            <span>👤</span>
            <span class="hidden sm:inline">Ingresar</span>
          </a>

          <!-- Admin Portal Link -->
          <a
            routerLink="/admin"
            class="hidden lg:inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-koko-muted hover:text-koko-espresso px-2 py-1.5 rounded border border-koko-border-subtle hover:border-koko-espresso transition-colors"
            title="Acceso al Panel Administrativo"
          >
            <span>⚙ Admin</span>
          </a>

          <!-- Mobile Hamburger Toggle -->
          <button
            type="button"
            (click)="toggleMobileMenu()"
            class="md:hidden p-2 rounded-lg border-2 border-koko-espresso bg-koko-cream text-koko-espresso hover:bg-white active:translate-y-0.5 transition-all"
            [attr.aria-expanded]="mobileMenuOpen()"
            aria-label="Abrir menú de navegación"
          >
            <span class="text-lg font-bold block leading-none">
              {{ mobileMenuOpen() ? '✕' : '☰' }}
            </span>
          </button>
        </div>
      </nav>

      <!-- Mobile Navigation Drawer / Menu -->
      @if (mobileMenuOpen()) {
        <div class="md:hidden border-t-2 border-koko-espresso bg-koko-cream p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <a
            routerLink="/"
            fragment="productos"
            (click)="closeMobileMenu()"
            class="block p-2 font-bold text-koko-espresso hover:bg-white rounded border border-transparent hover:border-koko-espresso transition-colors"
          >
            ☕ Granos & Tienda
          </a>
          <a
            routerLink="/"
            fragment="recetas"
            (click)="closeMobileMenu()"
            class="block p-2 font-bold text-koko-espresso hover:bg-white rounded border border-transparent hover:border-koko-espresso transition-colors"
          >
            📖 Guías de Barismo
          </a>
          <a
            routerLink="/"
            fragment="manifiesto"
            (click)="closeMobileMenu()"
            class="block p-2 font-bold text-koko-espresso hover:bg-white rounded border border-transparent hover:border-koko-espresso transition-colors"
          >
            🌱 Nuestra Historia y Tostaduría
          </a>
          <a
            routerLink="/"
            fragment="resenas"
            (click)="closeMobileMenu()"
            class="block p-2 font-bold text-koko-espresso hover:bg-white rounded border border-transparent hover:border-koko-espresso transition-colors"
          >
            ⭐ Reseñas de Baristas
          </a>
          <div class="pt-3 border-t border-koko-border-subtle flex items-center justify-between">
            <a
              routerLink="/login"
              (click)="closeMobileMenu()"
              class="text-xs font-mono font-bold text-koko-espresso underline flex items-center gap-1"
            >
              <span>👤</span>
              <span>Iniciar Sesión</span>
            </a>
            <a
              routerLink="/admin"
              (click)="closeMobileMenu()"
              class="text-xs font-mono font-bold text-koko-muted hover:text-koko-espresso underline"
            >
              ⚙ Panel Admin
            </a>
          </div>
        </div>
      }
    </header>
  `,
})
export class NavbarComponent {
  readonly cartService = inject(CartService);
  protected readonly mobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
