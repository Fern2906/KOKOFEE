import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUserSignal = signal<User | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');

  /**
   * Simulates authentication against registered users
   */
  async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    // Artificial latency for loading indicator feedback
    await new Promise((resolve) => setTimeout(resolve, 800));

    const trimmedEmail = email.trim().toLowerCase();

    // Demo admin user
    if (trimmedEmail === 'admin@kokofee.com') {
      if (password === 'kokofee2026' || password === 'admin123' || password.length >= 6) {
        const adminUser: User = {
          id: 'usr-admin',
          name: 'Fernando Alarcón',
          email: 'admin@kokofee.com',
          role: 'admin',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
          favoriteOrigin: 'Huila, Colombia',
        };
        this.currentUserSignal.set(adminUser);
        return { success: true, user: adminUser };
      }
      return { success: false, error: 'Contraseña incorrecta para la cuenta administrativa.' };
    }

    // Demo customer user
    if (trimmedEmail === 'cliente@kokofee.com' || trimmedEmail.includes('@')) {
      if (password.length >= 6) {
        const customerUser: User = {
          id: 'usr-client',
          name: 'Sofía Valenzuela',
          email: trimmedEmail,
          role: 'customer',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          favoriteOrigin: 'Yirgacheffe, Etiopía',
        };
        this.currentUserSignal.set(customerUser);
        return { success: true, user: customerUser };
      }
      return { success: false, error: 'Credenciales inválidas. Verifica tu correo y contraseña.' };
    }

    return { success: false, error: 'El correo electrónico no se encuentra registrado en KOKOFEE.' };
  }

  /**
   * Simulates new client registration
   */
  async register(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    // Artificial latency for loading feedback
    await new Promise((resolve) => setTimeout(resolve, 800));

    const trimmedEmail = email.trim().toLowerCase();

    // Prevent duplicate demo emails
    if (trimmedEmail === 'admin@kokofee.com' || trimmedEmail === 'cliente@kokofee.com') {
      return {
        success: false,
        error: 'Este correo electrónico ya se encuentra registrado. Intenta iniciar sesión con tu cuenta.',
      };
    }

    const newUser: User = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      name: trimmedEmail.split('@')[0],
      email: trimmedEmail,
      role: 'customer',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      favoriteOrigin: 'Selección de Bienvenida',
    };

    this.currentUserSignal.set(newUser);
    return { success: true, user: newUser };
  }

  logout(): void {
    this.currentUserSignal.set(null);
  }
}
