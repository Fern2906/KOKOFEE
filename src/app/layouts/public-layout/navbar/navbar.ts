import { Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import {
  LucideAngularModule,
  ShoppingCart,
  User,
  Menu,
  X,
  Coffee,
  BookOpen,
  Sprout,
  Star,
  Settings,
  LayoutDashboard,
  Package,
  ClipboardList,
  LogOut,
  Store,
  ShieldCheck,
} from 'lucide-angular';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

export type NavbarVariant = 'public' | 'admin';

interface AdminNavItem {
  label: string;
  route: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);
  readonly mobileMenuOpen = signal(false);

  /** Permite forzar el modo autenticación manualmente si se desea */
  readonly isAuth = input<boolean | undefined>(undefined);

  /** `admin` muestra la navegación del panel en lugar de la tienda pública */
  readonly variant = input<NavbarVariant>('public');

  readonly isAdminMode = computed(() => this.variant() === 'admin');

  readonly adminName = computed(() => this.authService.currentUser()?.name ?? 'Administrador');

  readonly adminInitials = computed(() => {
    const name = this.adminName().trim();
    if (!name) {
      return 'AK';
    }
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  });

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

  readonly adminNavItems: AdminNavItem[] = [
    { label: 'Dashboard', route: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Inventario', route: '/admin/inventario', icon: Package },
    { label: 'Pedidos', route: '/admin/pedidos', icon: ClipboardList },
    { label: 'Recetas', route: '/admin/recetas', icon: BookOpen },
  ];

  readonly icons = {
    ShoppingCart,
    User,
    Menu,
    X,
    Coffee,
    BookOpen,
    Sprout,
    Star,
    Settings,
    LogOut,
    Store,
    ShieldCheck,
  };

  toggleMobileMenu() { this.mobileMenuOpen.update(v => !v); }
  closeMobileMenu() { this.mobileMenuOpen.set(false); }

  handleLogout(): void {
    this.authService.logout();
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }
}
