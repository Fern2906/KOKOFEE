import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NbInput, NbLabel } from '@ng-brutalism/ui';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NbInput, NbLabel],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-1.5 w-full">
      @if (label()) {
        <div class="flex items-center justify-between">
          <label
            nbLabel
            [attr.for]="id()"
            class="font-display text-xs font-bold uppercase tracking-wider text-koko-espresso"
          >
            {{ label() }}
            @if (required()) {
              <span class="text-koko-caramel text-xs">*</span>
            }
          </label>
        </div>
      }

      <div class="relative flex items-center">
        <input
          nbInput
          [id]="id()"
          [type]="showPassword() ? 'text' : 'password'"
          [placeholder]="placeholder()"
          [autocomplete]="autocomplete()"
          [disabled]="disabled()"
          [value]="value()"
          (input)="handleInput($event)"
          (blur)="handleBlur()"
          class="w-full text-sm font-medium transition-all pl-3.5 pr-11 py-2.5 rounded-lg border-2 bg-white disabled:bg-koko-cream/60 disabled:cursor-not-allowed"
          [class.border-koko-danger]="hasError()"
          [class.border-koko-espresso]="!hasError()"
          [class.shadow-[2px_2px_0px_#D90429]]="hasError()"
          [class.shadow-[2px_2px_0px_#1A120B]]="!hasError()"
          [class.focus:shadow-[3px_3px_0px_#C25E00]]="!hasError()"
          [attr.aria-invalid]="hasError()"
          [attr.aria-describedby]="hasError() ? id() + '-error' : null"
        />

        <!-- Show / Hide Password Toggle Action -->
        <button
          type="button"
          (click)="togglePasswordVisibility()"
          [disabled]="disabled()"
          class="absolute right-2.5 p-1 text-koko-muted hover:text-koko-espresso focus:outline-none focus:ring-1 focus:ring-koko-caramel rounded transition-colors text-base select-none"
          [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Ver contraseña'"
          [attr.aria-pressed]="showPassword()"
          tabindex="0"
        >
          @if (showPassword()) {
            <span title="Ocultar">👁️</span>
          } @else {
            <span title="Mostrar">👁️‍🗨️</span>
          }
        </button>
      </div>

      <!-- Error Message -->
      @if (hasError()) {
        <p [id]="id() + '-error'" class="text-xs font-bold text-koko-danger flex items-center gap-1 mt-0.5 animate-in fade-in duration-150" role="alert">
          <span>⚠</span>
          <span>{{ errorMessage() }}</span>
        </p>
      }
    </div>
  `,
})
export class PasswordInputComponent implements ControlValueAccessor {
  readonly label = input<string>('Contraseña');
  readonly placeholder = input<string>('••••••••');
  readonly id = input<string>('password-input-' + Math.random().toString(36).substring(2, 9));
  readonly autocomplete = input<string>('current-password');
  readonly errorMessage = input<string>('');
  readonly required = input<boolean>(false);
  readonly isInvalid = input<boolean>(false);
  readonly isTouched = input<boolean>(false);

  protected readonly showPassword = signal(false);
  protected readonly value = signal<string>('');
  protected readonly disabled = signal<boolean>(false);

  readonly hasError = computed(
    () => (this.isInvalid() && this.isTouched()) || (!!this.errorMessage() && this.isTouched())
  );

  protected onChange: (val: string) => void = () => {};
  protected onTouched: () => void = () => {};

  togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  writeValue(val: unknown): void {
    this.value.set(val != null ? String(val) : '');
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  handleBlur(): void {
    this.onTouched();
  }
}
