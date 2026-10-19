import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NbButton } from '@ng-brutalism/ui';
import { InputComponent } from '../../../shared/components/input/input.component';
import { PasswordInputComponent } from '../../../shared/components/password-input/password-input.component';
import { AuthService } from '../../../core/services/auth.service';
import { passwordMatchValidator, strongPasswordValidator } from '../../../core/validators/auth.validators';

@Component({
  selector: 'app-register-page',
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

      <!-- Main Register Container (Editorial Two-Column Composition) -->
      <main class="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div class="w-full max-w-5xl bg-white rounded-2xl border-3 border-koko-espresso shadow-[8px_8px_0px_#1A120B] overflow-hidden grid grid-cols-1 lg:grid-cols-12">

          <!-- Left Column: Editorial Imagery & Coffee Perks (Visible on lg) -->
          <div class="hidden lg:flex lg:col-span-5 bg-koko-roast text-koko-cream p-8 flex-col justify-between relative overflow-hidden border-r-3 border-koko-espresso">
            <!-- Background Image with Dark Roast Overlay -->
            <div class="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop"
                alt="Granos de café de especialidad recién tostados"
                class="w-full h-full object-cover opacity-35 filter contrast-125"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-koko-espresso via-koko-roast/80 to-transparent"></div>
            </div>

            <!-- Top Tagline -->
            <div class="relative z-10 space-y-2">
              <span class="inline-block px-2.5 py-1 rounded bg-koko-caramel text-white font-mono text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#1A120B]">
                Únete a KOKOFEE
              </span>
              <h2 class="font-display font-black text-2xl text-white leading-tight">
                Descubre cosechas exclusivas antes que nadie.
              </h2>
            </div>

            <!-- Perks Checklist -->
            <div class="relative z-10 space-y-3 pt-8">
              <div class="p-4 bg-koko-espresso/80 backdrop-blur-md rounded-xl border border-white/20 space-y-2.5">
                <div class="text-xs font-bold font-mono text-koko-gold uppercase tracking-wider">
                  Beneficios para Clientes Registrados:
                </div>
                <ul class="space-y-2 text-xs text-koko-cream/85">
                  <li class="flex items-center gap-2">
                    <span class="text-koko-caramel font-bold">✓</span>
                    <span>Acceso prioritario a microlotes limitados.</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-koko-caramel font-bold">✓</span>
                    <span>Historial y trazabilidad de tueste de cada pedido.</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-koko-caramel font-bold">✓</span>
                    <span>Guías y fichas técnicas de cata descargables.</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-koko-caramel font-bold">✓</span>
                    <span>Envíos preferenciales en compras desde $45.</span>
                  </li>
                </ul>
              </div>

              <div class="flex items-center gap-2 text-xs font-mono text-koko-cream/70">
                <span class="w-2 h-2 rounded-full bg-koko-sage"></span>
                <span>Tus datos están protegidos bajo cifrado de extremo a extremo.</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Registration Form or Success State -->
          <div class="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
            <div class="max-w-md w-full mx-auto space-y-6">

              <!-- ======================================================== -->
              <!-- STATE: REGISTRATION SUCCESS                              -->
              <!-- ======================================================== -->
              @if (isSuccess()) {
                <div class="text-center space-y-6 py-4 animate-in fade-in duration-300">
                  <div class="w-16 h-16 bg-koko-sage text-white rounded-2xl mx-auto flex items-center justify-center text-3xl border-3 border-koko-espresso shadow-[4px_4px_0px_#1A120B]">
                    ✓
                  </div>

                  <div class="space-y-2">
                    <h2 class="font-display font-black text-2xl sm:text-3xl text-koko-espresso">
                      ¡Bienvenido a KOKOFEE!
                    </h2>
                    <p class="text-xs sm:text-sm text-koko-coffee/80 leading-relaxed max-w-sm mx-auto">
                      Tu cuenta ha sido creada exitosamente. Ya puedes explorar el catálogo y disfrutar de café de especialidad recién tostado.
                    </p>
                  </div>

                  <div class="p-3 bg-koko-cream/70 rounded-xl border border-koko-border-subtle text-xs font-mono text-koko-espresso text-left space-y-1">
                    <span class="text-[10px] uppercase font-bold text-koko-muted block">Cuenta creada para:</span>
                    <span class="font-bold text-sm text-koko-roast block">{{ emailControl.value }}</span>
                  </div>

                  <div class="space-y-3 pt-2">
                    <a
                      routerLink="/"
                      nbButton
                      tone="primary"
                      size="lg"
                      class="w-full font-bold text-sm shadow-[4px_4px_0px_#1A120B]"
                    >
                      Ir a la Tienda de Granos →
                    </a>

                    <a
                      routerLink="/login"
                      class="block text-xs font-mono font-bold text-koko-muted hover:text-koko-espresso hover:underline"
                    >
                      Iniciar sesión con tus credenciales
                    </a>
                  </div>
                </div>
              } @else {
                <!-- ======================================================== -->
                <!-- STATE: REGISTRATION FORM                                 -->
                <!-- ======================================================== -->
                <!-- Form Header -->
                <div class="space-y-1.5">
                  <div class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-koko-caramel uppercase tracking-wider">
                    <span>🌱</span>
                    <span>Registro de nuevo cliente</span>
                  </div>
                  <h1 class="font-display font-black text-2xl sm:text-3xl text-koko-espresso tracking-tight">
                    Crea tu cuenta
                  </h1>
                  <p class="text-xs sm:text-sm text-koko-coffee/80 font-sans">
                    Completa tus datos para formar parte de la comunidad de café de especialidad.
                  </p>
                </div>

                <!-- General Error Alert -->
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

                <!-- Reactive Registration Form -->
                <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4" novalidate>

                  <!-- 1. Email Field -->
                  <div>
                    <app-input
                      label="Correo Electrónico"
                      type="email"
                      placeholder="tu@correo.com"
                      autocomplete="email"
                      [required]="true"
                      [formControl]="emailControl"
                      [isInvalid]="isFieldInvalid('email')"
                      [isTouched]="isFieldTouched('email')"
                      [errorMessage]="getEmailErrorMessage()"
                    />
                  </div>

                  <!-- 2. Password Field with Show/Hide -->
                  <div>
                    <app-password-input
                      label="Contraseña"
                      placeholder="Mínimo 12 caracteres seguros"
                      autocomplete="new-password"
                      [required]="true"
                      [formControl]="passwordControl"
                      [isInvalid]="isFieldInvalid('password')"
                      [isTouched]="isFieldTouched('password')"
                      [errorMessage]="getPasswordErrorMessage()"
                    />
                  </div>

                  <!-- Interactive Real-time Password Security Checklist -->
                  <div class="p-3.5 bg-koko-cream/60 border-2 border-koko-border-subtle rounded-xl space-y-2">
                    <div class="flex items-center justify-between text-xs font-mono">
                      <span class="font-bold text-koko-espresso uppercase tracking-wider text-[11px]">
                        Requisitos de Seguridad:
                      </span>
                      <span
                        class="text-[10px] font-bold px-1.5 py-0.5 rounded border"
                        [class.bg-green-100]="allRequirementsMet()"
                        [class.text-koko-sage]="allRequirementsMet()"
                        [class.border-koko-sage]="allRequirementsMet()"
                        [class.bg-white]="!allRequirementsMet()"
                        [class.text-koko-muted]="!allRequirementsMet()"
                        [class.border-koko-border-subtle]="!allRequirementsMet()"
                      >
                        {{ completedRequirementsCount() }}/4 cumplidos
                      </span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <!-- Min 12 chars -->
                      <div
                        class="flex items-center gap-2 transition-colors"
                        [class.text-koko-sage]="hasMinLength()"
                        [class.text-koko-muted]="!hasMinLength()"
                      >
                        <span
                          class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors shrink-0"
                          [class.bg-koko-sage]="hasMinLength()"
                          [class.text-white]="hasMinLength()"
                          [class.border-koko-sage]="hasMinLength()"
                          [class.border-koko-espresso/30]="!hasMinLength()"
                          [class.bg-white]="!hasMinLength()"
                        >
                          {{ hasMinLength() ? '✓' : '○' }}
                        </span>
                        <span [class.font-bold]="hasMinLength()" class="text-[11px]">
                          12 caracteres o más
                        </span>
                      </div>

                      <!-- Uppercase letter -->
                      <div
                        class="flex items-center gap-2 transition-colors"
                        [class.text-koko-sage]="hasUpperCase()"
                        [class.text-koko-muted]="!hasUpperCase()"
                      >
                        <span
                          class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors shrink-0"
                          [class.bg-koko-sage]="hasUpperCase()"
                          [class.text-white]="hasUpperCase()"
                          [class.border-koko-sage]="hasUpperCase()"
                          [class.border-koko-espresso/30]="!hasUpperCase()"
                          [class.bg-white]="!hasUpperCase()"
                        >
                          {{ hasUpperCase() ? '✓' : '○' }}
                        </span>
                        <span [class.font-bold]="hasUpperCase()" class="text-[11px]">
                          Una letra mayúscula (A-Z)
                        </span>
                      </div>

                      <!-- Lowercase letter -->
                      <div
                        class="flex items-center gap-2 transition-colors"
                        [class.text-koko-sage]="hasLowerCase()"
                        [class.text-koko-muted]="!hasLowerCase()"
                      >
                        <span
                          class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors shrink-0"
                          [class.bg-koko-sage]="hasLowerCase()"
                          [class.text-white]="hasLowerCase()"
                          [class.border-koko-sage]="hasLowerCase()"
                          [class.border-koko-espresso/30]="!hasLowerCase()"
                          [class.bg-white]="!hasLowerCase()"
                        >
                          {{ hasLowerCase() ? '✓' : '○' }}
                        </span>
                        <span [class.font-bold]="hasLowerCase()" class="text-[11px]">
                          Una letra minúscula (a-z)
                        </span>
                      </div>

                      <!-- Special symbol -->
                      <div
                        class="flex items-center gap-2 transition-colors"
                        [class.text-koko-sage]="hasSpecialChar()"
                        [class.text-koko-muted]="!hasSpecialChar()"
                      >
                        <span
                          class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors shrink-0"
                          [class.bg-koko-sage]="hasSpecialChar()"
                          [class.text-white]="hasSpecialChar()"
                          [class.border-koko-sage]="hasSpecialChar()"
                          [class.border-koko-espresso/30]="!hasSpecialChar()"
                          [class.bg-white]="!hasSpecialChar()"
                        >
                          {{ hasSpecialChar() ? '✓' : '○' }}
                        </span>
                        <span [class.font-bold]="hasSpecialChar()" class="text-[11px]">
                          Un símbolo especial (!@#$...)
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- 3. Confirm Password Field with Show/Hide -->
                  <div>
                    <app-password-input
                      label="Confirmar Contraseña"
                      placeholder="Repite tu contraseña exactamente"
                      autocomplete="new-password"
                      [required]="true"
                      [formControl]="confirmPasswordControl"
                      [isInvalid]="isFieldInvalid('confirmPassword')"
                      [isTouched]="isFieldTouched('confirmPassword')"
                      [errorMessage]="getConfirmPasswordErrorMessage()"
                    />
                  </div>

                  <!-- Submit CTA Button with Loading State -->
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
                        <span>Creando tu cuenta...</span>
                      } @else {
                        <span>Crear Mi Cuenta KOKOFEE</span>
                        <span class="text-base">→</span>
                      }
                    </button>
                  </div>
                </form>

                <!-- Link to Existing Login -->
                <div class="pt-4 border-t border-koko-espresso/10 text-center text-xs text-koko-coffee/80">
                  ¿Ya tienes una cuenta en KOKOFEE?
                  <a
                    routerLink="/login"
                    class="font-bold text-koko-caramel hover:text-koko-roast hover:underline ml-1"
                  >
                    Inicia sesión aquí
                  </a>
                </div>
              }
            </div>
          </div>
        </div>
      </main>

      <!-- Bottom Minimal Footer -->
      <footer class="py-4 px-4 text-center text-[11px] font-mono text-koko-muted border-t border-koko-espresso/10">
        © 2026 KOKOFEE Specialty Coffee Lab · Registro seguro cifrado
      </footer>
    </div>
  `,
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(false);
  protected readonly isSuccess = signal(false);
  protected readonly generalError = signal<string | null>(null);

  // Strongly-typed reactive form controls
  protected readonly emailControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  protected readonly passwordControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, strongPasswordValidator],
  });

  protected readonly confirmPasswordControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  // Reactive signals for real-time password requirement checklist
  protected readonly passwordValue = toSignal(this.passwordControl.valueChanges, {
    initialValue: '',
  });

  protected readonly hasMinLength = computed(() => this.passwordValue().length >= 12);
  protected readonly hasUpperCase = computed(() => /[A-Z]/.test(this.passwordValue()));
  protected readonly hasLowerCase = computed(() => /[a-z]/.test(this.passwordValue()));
  protected readonly hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\/\\~`]/.test(this.passwordValue()));

  protected readonly completedRequirementsCount = computed(() => {
    let count = 0;
    if (this.hasMinLength()) count++;
    if (this.hasUpperCase()) count++;
    if (this.hasLowerCase()) count++;
    if (this.hasSpecialChar()) count++;
    return count;
  });

  protected readonly allRequirementsMet = computed(() => this.completedRequirementsCount() === 4);

  // FormGroup with custom cross-field matching validator
  protected readonly registerForm = this.fb.group(
    {
      email: this.emailControl,
      password: this.passwordControl,
      confirmPassword: this.confirmPasswordControl,
    },
    {
      validators: [passwordMatchValidator],
    }
  );

  isFieldInvalid(fieldName: 'email' | 'password' | 'confirmPassword'): boolean {
    const control = this.getControl(fieldName);
    return control.invalid && (control.dirty || control.touched);
  }

  isFieldTouched(fieldName: 'email' | 'password' | 'confirmPassword'): boolean {
    const control = this.getControl(fieldName);
    return control.dirty || control.touched;
  }

  private getControl(fieldName: 'email' | 'password' | 'confirmPassword'): FormControl<string> {
    switch (fieldName) {
      case 'email':
        return this.emailControl;
      case 'password':
        return this.passwordControl;
      case 'confirmPassword':
        return this.confirmPasswordControl;
    }
  }

  getEmailErrorMessage(): string {
    if (!this.emailControl.dirty && !this.emailControl.touched) return '';
    if (this.emailControl.hasError('required')) {
      return 'El correo electrónico es obligatorio.';
    }
    if (this.emailControl.hasError('email')) {
      return 'Ingresa un formato de correo válido (ej: usuario@correo.com).';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    if (!this.passwordControl.dirty && !this.passwordControl.touched) return '';
    if (this.passwordControl.hasError('required')) {
      return 'La contraseña es obligatoria.';
    }
    if (this.passwordControl.hasError('strongPassword')) {
      return 'La contraseña no cumple con todos los requisitos de seguridad.';
    }
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    if (!this.confirmPasswordControl.dirty && !this.confirmPasswordControl.touched) return '';
    if (this.confirmPasswordControl.hasError('required')) {
      return 'La confirmación de contraseña es obligatoria.';
    }
    if (this.confirmPasswordControl.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden. Verifica que sean idénticas.';
    }
    return '';
  }

  async onSubmit(): Promise<void> {
    this.generalError.set(null);

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.emailControl.markAsTouched();
      this.passwordControl.markAsTouched();
      this.confirmPasswordControl.markAsTouched();

      if (!this.allRequirementsMet()) {
        this.generalError.set('La contraseña debe cumplir con todos los 4 requisitos de seguridad.');
      } else if (this.confirmPasswordControl.hasError('passwordMismatch')) {
        this.generalError.set('Las contraseñas no coinciden.');
      } else {
        this.generalError.set('Por favor completa todos los campos requeridos con formato válido.');
      }
      return;
    }

    const email = this.emailControl.value;
    const password = this.passwordControl.value;

    this.isLoading.set(true);

    try {
      const result = await this.authService.register(email, password);

      if (result.success && result.user) {
        this.isSuccess.set(true);
      } else {
        this.generalError.set(result.error || 'No se pudo crear la cuenta. Intenta nuevamente.');
      }
    } catch {
      this.generalError.set('Ocurrió un error inesperado al conectar con el servidor.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
