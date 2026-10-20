import { Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { LucideAngularModule, ShoppingCart, User, Menu, X, Coffee, BookOpen, Sprout, Star, Settings, } from 'lucide-angular';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);
  readonly mobileMenuOpen = signal(false);

  /** Permite forzar el modo autenticación manualmente si se desea */
  readonly isAuth = input<boolean | undefined>(undefined);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects || e.url)
    ),
    { initialValue: this.router.url }
  );

  readonly isAuthRoute = computed(() => {
    if (this.isAuth() !== undefined) {
      return this.isAuth()!;
    }
    const cleanUrl = (this.currentUrl() || '').split('?')[0].split('#')[0];
    return cleanUrl === '/login' || cleanUrl === '/registro' || cleanUrl === '/register';
  });

  readonly icons = { ShoppingCart, User, Menu, X, Coffee, BookOpen, Sprout, Star, Settings };

  toggleMobileMenu() { this.mobileMenuOpen.update(v => !v); }
  closeMobileMenu() { this.mobileMenuOpen.set(false); }
}