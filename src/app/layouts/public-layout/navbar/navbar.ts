import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  readonly cartService = inject(CartService);
  readonly mobileMenuOpen = signal(false);

  readonly icons = { ShoppingCart, User, Menu, X, Coffee, BookOpen, Sprout, Star, Settings };

  toggleMobileMenu() { this.mobileMenuOpen.update(v => !v); }
  closeMobileMenu() { this.mobileMenuOpen.set(false); }
}