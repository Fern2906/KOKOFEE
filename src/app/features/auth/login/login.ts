import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NbButton } from '@ng-brutalism/ui';
import { InputComponent } from '../../../shared/components/input/input.component';
import { PasswordInputComponent } from '../../../shared/components/password-input/password-input.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NbButton,
    InputComponent,
    PasswordInputComponent,
  ],
  template: `
    <div class="min-h-screen bg-koko-cream flex flex-col justify-between selection:bg-koko-caramel selection:text-white">
      <!-- Top Minimal Header with Brand & Return Link -->
      <header class="py-4 px-4 sm:px-8 border-b-2 border-koko-espresso/15 bg-white/80 backdrop-blur-md">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <a routerLink="/" class="flex items-center gap-2.5 group">
            <div class="w-8 h-8 bg-koko-espresso rounded-md flex items-center justify-center text-koko-cream font-display font-black text-lg border-2 border-koko-espresso shadow-[2px_2px_0px_#C25E00]">
              K
            </div>
            <span class="font-display font-black text-xl tracking-tight text-koko-espresso">
              KOKOFEE
            </span>
          </a>

          <a
            routerLink="/"
            class="text-xs font-mono font-bold text-koko-muted hover:text-koko-espresso flex items-center gap-1.5 transition-colors"
          >
            <span>←</span>
            <span>Volver a la tienda</span>
          </a>
        </div>
      </header>

      <!-- Main Login Container (Two-column editorial on lg screens) -->
      <main class="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div class="w-full max-w-5xl bg-white rounded-2xl border-3 border-koko-espresso shadow-[8px_8px_0px_#1A120B] overflow-hidden grid grid-cols-1 lg:grid-cols-12">

          <!-- Left Column: Editorial Coffee Imagery & Brand Manifesto (Visible on lg) -->
          <div class="hidden lg:flex lg:col-span-5 bg-koko-roast text-koko-cream p-8 flex-col justify-between relative overflow-hidden border-r-3 border-koko-espresso">
            <!-- Background Image with Dark Roast Overlay -->
            <div class="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop"
                alt="Café de especialidad servido en taza artesanal"
                class="w-full h-full object-cover opacity-35 filter contrast-125"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-koko-espresso via-koko-roast/80 to-transparent"></div>
            </div>

            <!-- Top Tagline -->
            <div class="relative z-10 space-y-2">
              <span class="inline-block px-2.5 py-1 rounded bg-koko-caramel text-white font-mono text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#1A120B]">
                Comunidad Barista
              </span>
              <h2 class="font-display font-black text-2xl text-white leading-tight">
                El ritual del café de altura comienza aquí.
              </h2>
            </div>

            <!-- Bottom Testimonial / Perks Quote -->
            <div class="relative z-10 space-y-4 pt-12">
              <div class="p-4 bg-koko-espresso/80 backdrop-blur-md rounded-xl border border-white/20">
                <p class="text-xs italic text-koko-cream/90 leading-relaxed">
                  “Accede a tus suscripciones de granos frescos, guarda tus notas de cata y gestiona tus pedidos con trazabilidad de origen garantizada.”
                </p>
                <div class="mt-2 flex items-center justify-between text-[11px] font-mono text-koko-gold font-bold">
                  <span>★ Tostado Semanal</span>
                  <span>100% Arábica</span>
                </div>
              </div>

              <div class="flex items-center gap-2 text-xs font-mono text-koko-cream/70">
                <span class="w-2 h-2 rounded-full bg-koko-caramel"></span>
                <span>Plataforma segura de clientes KOKOFEE</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Authentication Form -->
          <div class="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
            <div class="max-w-md w-full mx-auto space-y-6">

              <!-- Form Header -->
              <div class="space-y-1.5">
                <div class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-koko-caramel uppercase tracking-wider">
                  <span>☕</span>
                  <span>Acceso a tu cuenta</span>
                </div>
                <h1 class="font-display font-black text-2xl sm:text-3xl text-koko-espresso tracking-tight">
                  Bienvenido de vuelta
                </h1>
                <p class="text-xs sm:text-sm text-koko-coffee/80 font-sans">
                  Ingresa tus credenciales para administrar tus órdenes o acceder al panel.
                </p>
              </div>

              <!-- General Error Alert Message -->
              @if (generalError()) {
                <div
                  class="p-3.5 rounded-lg border-2 border-koko-danger bg-red-50 text-koko-danger flex items-start gap-3 shadow-[2px_2px_0px_#D90429] animate-in fade-in slide-in-from-top-1 duration-200"
                  role="alert"
                >
                  <span class="text-base leading-none">⚠</span>
                  <div class="text-xs font-bold leading-relaxed">
                    {{ generalError() }}
                  </div>
                </div>
              }

              <!-- Reactive Login Form -->
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4" novalidate>
                <!-- Email Field -->
                <div>
                  <app-input
                    label="Correo Electrónico"
                    type="email"
                    placeholder="ejemplo@kokofee.com"
                    autocomplete="email"
                    [required]="true"
                    [formControl]="emailControl"
                    [isInvalid]="isFieldInvalid('email')"
                    [isTouched]="isFieldTouched('email')"
                    [errorMessage]="getEmailErrorMessage()"
                  />
                </div>

                <!-- Password Field -->
                <div>
                  <app-password-input
                    label="Contraseña"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    [required]="true"
                    [formControl]="passwordControl"
                    [isInvalid]="isFieldInvalid('password')"
                    [isTouched]="isFieldTouched('password')"
                    [errorMessage]="getPasswordErrorMessage()"
                  />
                </div>

                <!-- Secondary Actions: Remember Me & Forgot Password -->
                <div class="flex items-center justify-between text-xs pt-1">
                  <label class="flex items-center gap-2 cursor-pointer select-none text-koko-espresso font-medium">
                    <input
                      type="checkbox"
                      [formControl]="rememberMeControl"
                      class="w-4 h-4 rounded border-2 border-koko-espresso text-koko-caramel focus:ring-koko-caramel accent-koko-caramel"
                    />
                    <span>Recordar mi sesión</span>
                  </label>

                  <a
                    href="javascript:void(0)"
                    (click)="showForgotPasswordNotice()"
                    class="font-semibold text-koko-caramel hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <!-- Submit Button with Loading Indicator -->
                <div class="pt-2">
                  <button
                    nbButton
                    tone="primary"
                    size="lg"
                    type="submit"
                    [disabled]="isLoading()"
                    class="w-full font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[4px_4px_0px_#1A120B] active:shadow-[1px_1px_0px_#1A120B] disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    @if (isLoading()) {
                      <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Verificando credenciales...</span>
                    } @else {
                      <span>Iniciar Sesión</span>
                      <span class="text-base">→</span>
                    }
                  </button>
                </div>
              </form>

              <!-- Quick Demo Access Helper Box -->
              <div class="p-3 bg-koko-cream/60 rounded-xl border border-koko-border-subtle text-xs space-y-2 font-mono">
                <div class="text-[11px] font-bold text-koko-muted uppercase tracking-wider flex items-center justify-between">
                  <span>Acceso Rápido para Pruebas:</span>
                  <span class="text-[10px] text-koko-caramel">Click para autocompletar</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    (click)="fillDemoCredentials('admin')"
                    class="p-1.5 bg-white border border-koko-espresso rounded text-left hover:bg-koko-crema transition-colors text-[11px]"
                  >
                    <span class="font-bold block text-koko-espresso">⚙ Admin</span>
                    <span class="text-koko-muted text-[10px]">admin&#64;kokofee.com</span>
                  </button>
                  <button
                    type="button"
                    (click)="fillDemoCredentials('client')"
                    class="p-1.5 bg-white border border-koko-espresso rounded text-left hover:bg-koko-crema transition-colors text-[11px]"
                  >
                    <span class="font-bold block text-koko-espresso">👤 Cliente</span>
                    <span class="text-koko-muted text-[10px]">cliente&#64;kokofee.com</span>
                  </button>
                </div>
              </div>

              <!-- Sign Up Link -->
              <div class="pt-4 border-t border-koko-espresso/10 text-center text-xs text-koko-coffee/80">
                ¿Aún no tienes cuenta en KOKOFEE?
                <a
                  routerLink="/registro"
                  class="font-bold text-koko-caramel hover:text-koko-roast hover:underline ml-1"
                >
                  Crear una cuenta aquí
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Bottom Minimal Footer -->
      <footer class="py-4 px-4 text-center text-[11px] font-mono text-koko-muted border-t border-koko-espresso/10">
        © 2026 KOKOFEE Specialty Coffee Lab · Acceso seguro cifrado
      </footer>
    </div>
  `,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(false);
  protected readonly generalError = signal<string | null>(null);

  protected readonly emailControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  protected readonly passwordControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  });

  protected readonly rememberMeControl = new FormControl(false, {
    nonNullable: true,
  });

  protected readonly loginForm = this.fb.group({
    email: this.emailControl,
    password: this.passwordControl,
    rememberMe: this.rememberMeControl,
  });

  isFieldInvalid(fieldName: 'email' | 'password'): boolean {
    const control = fieldName === 'email' ? this.emailControl : this.passwordControl;
    return control.invalid && (control.dirty || control.touched);
  }

  isFieldTouched(fieldName: 'email' | 'password'): boolean {
    const control = fieldName === 'email' ? this.emailControl : this.passwordControl;
    return control.dirty || control.touched;
  }

  getEmailErrorMessage(): string {
    if (this.emailControl.hasError('required')) {
      return 'El correo electrónico es obligatorio.';
    }
    if (this.emailControl.hasError('email')) {
      return 'Ingresa un formato de correo válido (ej: usuario@correo.com).';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    if (this.passwordControl.hasError('required')) {
      return 'La contraseña es obligatoria.';
    }
    if (this.passwordControl.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    return '';
  }

  fillDemoCredentials(role: 'admin' | 'client'): void {
    if (role === 'admin') {
      this.emailControl.setValue('admin@kokofee.com');
      this.passwordControl.setValue('kokofee2026');
      this.rememberMeControl.setValue(true);
    } else {
      this.emailControl.setValue('cliente@kokofee.com');
      this.passwordControl.setValue('barista2026');
      this.rememberMeControl.setValue(false);
    }
    this.generalError.set(null);
  }

  showForgotPasswordNotice(): void {
    this.generalError.set(
      'Para restablecer tu contraseña, ingresa tu correo y contacta al administrador de KOKOFEE o soporte@kokofee.com.'
    );
  }

  async onSubmit(): Promise<void> {
    this.generalError.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.generalError.set('Por favor completa todos los campos requeridos con formato válido.');
      return;
    }

    const email = this.emailControl.value;
    const password = this.passwordControl.value;
    this.isLoading.set(true);

    try {
      const result = await this.authService.login(email, password);

      if (result.success && result.user) {
        // Redirect according to user role
        if (result.user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.generalError.set(result.error || 'Credenciales inválidas. Por favor intenta nuevamente.');
      }
    } catch {
      this.generalError.set('Ocurrió un error inesperado al conectar con el servidor.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
